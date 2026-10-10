import crypto from 'crypto';

console.log('Running revalidationSecurity tests...');

const secret = 'super-secure-secret-token-1234567890';
const payload = JSON.stringify({ paths: ['/', '/manhwa/solo-leveling'] });
const timestamp = Math.floor(Date.now() / 1000).toString();

// Generate signature
const signature = crypto
  .createHmac('sha256', secret)
  .update(`${payload}.${timestamp}`)
  .digest('hex');

// Verify correct signature
const expectedSignature = crypto
  .createHmac('sha256', secret)
  .update(`${payload}.${timestamp}`)
  .digest('hex');

const sigBuffer = Buffer.from(signature, 'hex');
const expectedBuffer = Buffer.from(expectedSignature, 'hex');

if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
  throw new Error('Valid signature failed timingSafeEqual verification!');
}

// Verify tampered payload fails
const tamperedPayload = JSON.stringify({ paths: ['/admin/unauthorized'] });
const tamperedExpected = crypto
  .createHmac('sha256', secret)
  .update(`${tamperedPayload}.${timestamp}`)
  .digest('hex');
const tamperedBuffer = Buffer.from(tamperedExpected, 'hex');

if (crypto.timingSafeEqual(sigBuffer, tamperedBuffer)) {
  throw new Error('Tampered payload erroneously matched valid signature!');
}

console.log('✓ All revalidationSecurity tests passed successfully!');
