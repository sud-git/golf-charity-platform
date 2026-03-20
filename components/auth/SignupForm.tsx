'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signupSchema } from '@/lib/utils/validators';

interface Charity {
  id: string;
  name: string;
  logo_url: string | null;
}

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    charityId: '',
    charityContributionPercent: 10,
    plan: 'monthly' as 'monthly' | 'yearly',
  });
  const [charities, setCharities] = useState<Charity[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [charitiesLoading, setCharitiesLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Personal, Step 2: Charity, Step 3: Payment

  // Fetch charities
  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await fetch('/api/charities');
        if (response.ok) {
          const data = await response.json();
          setCharities(data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch charities:', err);
      } finally {
        setCharitiesLoading(false);
      }
    };
    fetchCharities();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'charityContributionPercent' ? parseInt(value) : value,
    });
  };

  const validateStep1 = (): boolean => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!formData.charityId) {
      setError('Please select a charity');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError('');
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const validated = signupSchema.parse(formData);

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error?.message || 'Signup failed. Please try again.');
        return;
      }

      const data = await response.json();

      // Store tokens and user info
      if (data.success && data.data) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('userId', data.data.userId);
        localStorage.setItem('is-admin', data.data.isAdmin ? 'true' : 'false');

        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(data.error?.message || 'Signup failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-light px-4 py-8">
      <div className="w-full max-w-md">
        <div className="card-lg">
          <h1 className="text-3xl font-bold text-center mb-2 text-dark">
            Join Golf Charity
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Step {step} of 3: {step === 1 ? 'Create Account' : step === 2 ? 'Choose Charity' : 'Select Plan'}
          </p>

          {/* Progress indicator */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all ${
                  s <= step ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <>
                <div className="form-group">
                  <label htmlFor="email" className="label">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="input"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="firstName" className="label">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    className="input"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="label">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    className="input"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="label">Password</label>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="input"
                    placeholder="Min 8 characters with uppercase & number"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must contain uppercase letter, number, and special character
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="label">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className="input"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span>Show passwords</span>
                </label>
              </>
            )}

            {/* Step 2: Charity Selection */}
            {step === 2 && (
              <>
                <div className="form-group">
                  <label htmlFor="charityId" className="label">
                    Select Your Charity
                  </label>
                  {charitiesLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading charities...</div>
                  ) : (
                    <select
                      id="charityId"
                      name="charityId"
                      className="input"
                      value={formData.charityId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Choose a charity...</option>
                      {charities.map((charity) => (
                        <option key={charity.id} value={charity.id}>
                          {charity.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="charityContributionPercent" className="label">
                    Monthly Contribution: {formData.charityContributionPercent}%
                  </label>
                  <input
                    id="charityContributionPercent"
                    type="range"
                    name="charityContributionPercent"
                    className="w-full"
                    min="10"
                    max="100"
                    step="5"
                    value={formData.charityContributionPercent}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Monthly: ${((formData.charityContributionPercent / 100) * 9.99).toFixed(2)} (monthly plan)
                  </p>
                </div>
              </>
            )}

            {/* Step 3: Plan Selection */}
            {step === 3 && (
              <div className="form-group space-y-3">
                <label className="label">Choose Your Plan</label>
                
                <label className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                  formData.plan === 'monthly' 
                    ? 'border-primary bg-primary-light' 
                    : 'border-gray-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="plan"
                      value="monthly"
                      checked={formData.plan === 'monthly'}
                      onChange={handleInputChange}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-semibold">Monthly</p>
                      <p className="text-sm text-gray-600">$9.99/month</p>
                    </div>
                  </div>
                </label>

                <label className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                  formData.plan === 'yearly' 
                    ? 'border-primary bg-primary-light' 
                    : 'border-gray-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="plan"
                      value="yearly"
                      checked={formData.plan === 'yearly'}
                      onChange={handleInputChange}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-semibold">Yearly (Save 17%)</p>
                      <p className="text-sm text-gray-600">$99.99/year</p>
                    </div>
                  </div>
                </label>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="btn-secondary flex-1"
                  disabled={loading}
                >
                  Back
                </button>
              )}
              
              {step < 3 && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn-primary flex-1"
                  disabled={loading}
                >
                  Next
                </button>
              )}

              {step === 3 && (
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 border-t border-gray-200 pt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
