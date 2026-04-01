// app/dashboard/subscription/page.tsx
'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import { formatDate } from '@/lib/utils/helpers';

interface Subscription {
  id: string;
  plan: string;
  amount_cents: number;
  status: string;
  renewal_date: string;
  created_at: string;
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId');

        const response = await fetch('/api/subscriptions/current', {
          headers: {
            'x-user-id': userId || '',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setSubscription(data.data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch subscription:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Subscription</h1>
        <p className="text-muted">Manage your account subscription and billing</p>
      </div>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : subscription ? (
        <>
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Current Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard label="Plan" value={subscription.plan} color="primary" />
              <StatCard label="Status" value={subscription.status} color="success" />
            </div>

            <div className="mt-6 p-4 bg-light rounded">
              <div className="text-sm text-muted mb-1">Monthly Cost</div>
              <div className="text-2xl font-bold">${(subscription.amount_cents / 100).toFixed(2)}</div>
            </div>

            <div className="mt-4 p-4 bg-light rounded">
              <div className="text-sm text-muted mb-1">Auto-renews</div>
              <div>{formatDate(subscription.renewal_date)}</div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Plan Options</h3>
            <div className="space-y-3">
              <button className="btn btn-outline w-full" disabled>
                Change Plan
              </button>
              <button className="btn btn-outline w-full" disabled>
                Update Payment Method
              </button>
              <button className="btn btn-outline btn-danger w-full">
                Cancel Subscription
              </button>
            </div>
            <p className="text-xs text-muted mt-4">
              Feature coming soon. Contact support for changes.
            </p>
          </div>
        </>
      ) : (
        <div className="card p-6">
          <p className="text-muted">No active subscription found</p>
          <button className="btn btn-primary mt-4">Upgrade Now</button>
        </div>
      )}
    </div>
  );
}
