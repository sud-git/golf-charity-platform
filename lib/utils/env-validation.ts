/**
 * Environment Validation - runs at build time and startup
 * Ensures all required environment variables are configured
 */

interface EnvVars {
  required: string[];
  optional: string[];
}

const envConfig: EnvVars = {
  required: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'ADMIN_EMAIL',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'RESEND_API_KEY',
  ],
  optional: [
    'STRIPE_WEBHOOK_SECRET',
    'NEXT_PUBLIC_STORAGE_BUCKET',
    'SENTRY_DSN',
    'LOG_LEVEL',
  ],
};

export function validateEnvironment() {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  envConfig.required.forEach((varName) => {
    const value = process.env[varName];

    if (!value) {
      errors.push(`Missing required environment variable: ${varName}`);
    } else if (value === 'your-' && varName in process.env) {
      // Check for placeholder values
      errors.push(`${varName} contains placeholder value - please configure it`);
    }
  });

  // Check recommended variables
  envConfig.optional.forEach((varName) => {
    const value = process.env[varName];
    if (!value && process.env.NODE_ENV === 'production') {
      warnings.push(`Recommended environment variable not set: ${varName}`);
    }
  });

  // Production-specific checks
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.NEXTAUTH_SECRET?.length || process.env.NEXTAUTH_SECRET.length < 32) {
      errors.push('NEXTAUTH_SECRET must be at least 32 characters long in production');
    }

    if (process.env.NEXTAUTH_URL === 'http://localhost:3000') {
      errors.push('NEXTAUTH_URL cannot be localhost in production');
    }

    if (process.env.STRIPE_SECRET_KEY?.includes('test')) {
      warnings.push('⚠️ Using Stripe test key in production - switch to live key for real payments');
    }

    if (process.env.NODE_ENV === 'production' && !process.env.STRIPE_WEBHOOK_SECRET) {
      warnings.push('STRIPE_WEBHOOK_SECRET not configured - webhook verification will be skipped');
    }
  }

  return { errors, warnings };
}

export function reportEnvironmentStatus() {
  const { errors, warnings } = validateEnvironment();

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ Environment validation passed');
    return true;
  }

  if (warnings.length > 0) {
    console.warn('⚠️ Environment warnings:');
    warnings.forEach((w) => console.warn(`  - ${w}`));
  }

  if (errors.length > 0) {
    console.error('❌ Environment validation failed:');
    errors.forEach((e) => console.error(`  - ${e}`));
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Environment validation failed - cannot start in production');
    }
    return false;
  }

  return true;
}
