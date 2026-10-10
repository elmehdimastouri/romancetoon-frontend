import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATION_SECRET_TOKEN;
  if (!secret) {
    return NextResponse.json({ error: 'Revalidation secret not configured on server' }, { status: 500 });
  }

  const signatureHeader = req.headers.get('x-romancetoon-signature');
  const timestampHeader = req.headers.get('x-romancetoon-timestamp');

  if (!signatureHeader || !timestampHeader) {
    return NextResponse.json({ error: 'Missing security headers' }, { status: 401 });
  }

  // 1. Timestamp drift protection (5 minutes window)
  const timestamp = parseInt(timestampHeader, 10);
  const now = Math.floor(Date.now() / 1000);
  if (isNaN(timestamp) || Math.abs(now - timestamp) > 300) {
    return NextResponse.json({ error: 'Request timestamp expired or out of bounds' }, { status: 401 });
  }

  let bodyText = '';
  try {
    bodyText = await req.text();
  } catch {
    return NextResponse.json({ error: 'Failed to read request body' }, { status: 400 });
  }

  // 2. Validate HMAC SHA-256 signature with constant-time equality check
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${bodyText}.${timestampHeader}`)
    .digest('hex');

  const sigBuffer = Buffer.from(signatureHeader, 'hex');
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');

  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 401 });
  }

  let payload;
  try {
    payload = JSON.parse(bodyText);
  } catch {
    return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
  }

  const paths: string[] = Array.isArray(payload?.paths) ? payload.paths : [];
  if (paths.length === 0) {
    return NextResponse.json({ error: 'No paths provided for revalidation' }, { status: 400 });
  }

  // 3. Trigger targeted on-demand ISR revalidation
  const revalidated: string[] = [];
  for (const path of paths) {
    // Only allow valid internal path patterns
    if (typeof path === 'string' && path.startsWith('/')) {
      try {
        revalidatePath(path);
        revalidated.push(path);
      } catch (e) {
        console.error(`Failed to revalidate path: ${path}`, e);
      }
    }
  }

  return NextResponse.json({
    revalidated: true,
    count: revalidated.length,
    paths: revalidated,
    timestamp: now,
  });
}
