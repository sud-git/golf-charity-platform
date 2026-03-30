/**
 * Security Headers - Add important security headers to all responses
 * This should be used as a middleware wrapper in next.config.js
 */

export const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: https://vtzcpzgufcvosijjihirj.supabase.co",
      "connect-src 'self' https://vtzcpzgufcvosijjihirj.supabase.co https://api.stripe.com https://api.resend.com",
      "frame-src 'self' https://js.stripe.com",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
];

export default securityHeaders;
