// app/(dashboard)/draws/page.tsx
'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import { formatDate } from '@/lib/utils/helpers';

interface Draw {
  id: string;
  draw_month: string;
  mode: string;
  status: string;
  total_pool_amount_cents: number;
  created_at: string;
}

export default function DrawsPage() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [currentDraw, setCurrentDraw] = useState<Draw | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId');
        
        const response = await fetch('/api/draws', {
          headers: {
            'x-user-id': userId || '',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            setDraws(data.data);
            const pending = data.data.find((d: Draw) => d.status === 'pending');
            setCurrentDraw(pending || data.data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch draws:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDraws();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Monthly Draws</h1>
        <p className="text-muted">Participate in monthly prize draws and track your results</p>
      </div>

      {currentDraw && (
        <div className="card p-6 border-2 border-primary">
          <h2 className="text-2xl font-bold mb-4">Current Draw</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label="Draw Month" value={currentDraw.draw_month} color="primary" />
            <StatCard label="Mode" value={currentDraw.mode} color="success" />
            <StatCard label="Status" value={currentDraw.status} color="warning" />
          </div>
          <p className="text-muted mt-4 text-sm">
            Pool Amount: ${(currentDraw.total_pool_amount_cents / 100).toFixed(2)}
          </p>
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold mb-4">Past Draws</h3>
        {loading ? (
          <p className="text-muted">Loading draws...</p>
        ) : draws.length === 0 ? (
          <p className="text-muted">No draws found</p>
        ) : (
          <div className="space-y-2">
            {draws.slice(1).map((draw) => (
              <div key={draw.id} className="card p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">{draw.draw_month}</div>
                    <div className="text-sm text-muted">
                      {draw.mode} mode • {formatDate(draw.created_at)}
                    </div>
                  </div>
                  <div className="badge badge-primary">{draw.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
