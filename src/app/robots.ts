import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://romancetoon.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
        // NOTE: /search is intentionally allowed to crawl so that
        // search engines read the <meta name="robots" content="noindex, follow" />
        // directive and prevent URL-only indexing artifacts.
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
