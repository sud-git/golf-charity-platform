// app/dashboard/winnings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import { formatDate, formatCurrency } from '@/lib/utils/helpers';

interface Winner {
  id: string;
  draw_id: string;
  match_type: number;
  prize_amount_cents: number;
  verification_status: string;
  created_at: string;
}

export default function WinningsPage() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalWon, setTotalWon] = useState(0);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId');
        
        const response = await fetch('/api/winners', {
          headers: {
            'x-user-id': userId || '',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            const verifiedWinners = data.data.filter((w: Winner) => w.verification_status === 'verified');
            setWinners(data.data);
            const total = verifiedWinners.reduce((sum: number, w: Winner) => sum + w.prize_amount_cents, 0);
            setTotalWon(total);
          }
        }
      } catch (err) {
        console.error('Failed to fetch winners:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, []);

  const verified = winners.filter(w => w.verification_status === 'verified');
  const pending = winners.filter(w => w.verification_status === 'pending_review');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Your Winnings</h1>
        <p className="text-muted">Track your draw prizes and verification status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Won" value={formatCurrency(totalWon)} color="success" />
        <StatCard label="Verified Wins" value={verified.length.toString()} color="primary" />
        <StatCard label="Pending Review" value={pending.length.toString()} color="warning" />
      </div>

      {loading ? (
        <p className="text-muted">Loading winnings...</p>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="card p-6 border-2 border-warning">
              <h3 className="text-xl font-bold mb-4">Pending Verification</h3>
              <div className="space-y-2">
                {pending.map((winner) => (
                  <div key={winner.id} className="flex justify-between items-center p-3 bg-light rounded">
                    <div>
                      <div className="font-bold">${(winner.prize_amount_cents / 100).toFixed(2)}</div>
                      <div className="text-sm text-muted">{winner.match_type}-match • {formatDate(winner.created_at)}</div>
                    </div>
                    <span className="badge badge-warning">Pending</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xl font-bold mb-4">Verified Winnings</h3>
            {verified.length === 0 ? (
              <p className="text-muted">No verified wins yet</p>
            ) : (
              <div className="space-y-2">
                {verified.map((winner) => (
                  <div key={winner.id} className="card p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold">${(winner.prize_amount_cents / 100).toFixed(2)}</div>
                        <div className="text-sm text-muted">{winner.match_type}-match • {formatDate(winner.created_at)}</div>
                      </div>
                      <span className="badge badge-success">Verified ✓</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
