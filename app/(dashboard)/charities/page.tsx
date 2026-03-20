// app/(dashboard)/charities/page.tsx
'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/dashboard/StatCard';

interface Charity {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  description: string;
  category: string;
  total_raised_cents: number;
  user_count: number;
}

interface UserData {
  selected_charity_id: string;
  charity_contribution_percent: number;
}

export default function CharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPercent, setSelectedPercent] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId');

        // Fetch charities
        const charResponse = await fetch('/api/charities', {
          headers: {
            'x-user-id': userId || '',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (charResponse.ok) {
          const charData = await charResponse.json();
          if (charData.success && Array.isArray(charData.data)) {
            setCharities(charData.data);
          }
        }

        // Fetch user data
        const userResponse = await fetch(`/api/users/${userId}`, {
          headers: {
            'x-user-id': userId || '',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.success && userData.data) {
            setUserData(userData.data);
            setSelectedPercent(userData.data.charity_contribution_percent || 10);
          }
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const monthlyContribution = (9.99 * selectedPercent) / 100; // Assuming monthly plan

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Charity Partnerships</h1>
        <p className="text-muted">Choose how much of your subscription supports charities</p>
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-bold mb-4">Your Contribution</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="percent" className="block mb-2">Contribution: {selectedPercent}%</label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={selectedPercent}
              onChange={(e) => setSelectedPercent(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-muted mt-2">
              ${monthlyContribution.toFixed(2)} per month
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Loading charities...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {charities.map((charity) => (
            <div
              key={charity.id}
              className={`card p-6 cursor-pointer transition ${
                userData?.selected_charity_id === charity.id
                  ? 'border-2 border-primary bg-primary/5'
                  : 'border border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-lg">{charity.name}</h4>
                  <p className="text-sm text-muted">{charity.category}</p>
                </div>
                {userData?.selected_charity_id === charity.id && (
                  <span className="badge badge-primary">Selected</span>
                )}
              </div>
              <p className="text-sm mb-4">{charity.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-light rounded">
                  <div className="text-muted">Raised</div>
                  <div className="font-bold">${(charity.total_raised_cents / 100).toFixed(0)}</div>
                </div>
                <div className="p-2 bg-light rounded">
                  <div className="text-muted">Supporters</div>
                  <div className="font-bold">{charity.user_count}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
