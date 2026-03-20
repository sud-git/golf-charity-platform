import Link from 'next/link';

export const metadata = {
  title: 'Reset Password - Golf Charity',
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-light px-4">
      <div className="w-full max-w-md">
        <div className="card-lg">
          <h1 className="text-3xl font-bold text-center mb-2 text-dark">
            Reset Password
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Enter your email to receive a password reset link
          </p>

          <form className="space-y-4">
            <div className="form-group">
              <label htmlFor="email" className="label">Email Address</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Send Reset Link
            </button>
          </form>

          <div className="mt-6 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
