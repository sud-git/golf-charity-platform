// app/(admin)/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/dashboard/StatCard';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const isAdmin = localStorage.getItem('is-admin') === 'true';
    if (!isAdmin) {
      router.push('/dashboard');
    }
    setLoading(false);
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted">Manage platform, users, and draws</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Users" value="0" color="primary" />
        <StatCard label="Active Subscriptions" value="0" color="success" />
        <StatCard label="Pending Verifications" value="0" color="warning" />
        <StatCard label="Total Raised" value="$0" color="success" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <h3 className="font-bold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="btn btn-primary w-full" disabled>Create Draw</button>
            <button className="btn btn-outline w-full" disabled>View Users</button>
            <button className="btn btn-outline w-full" disabled>Verify Winners</button>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-bold mb-4">Recent Activity</h3>
        <p className="text-muted">No recent activity</p>
      </div>
    </div>
  );
}
