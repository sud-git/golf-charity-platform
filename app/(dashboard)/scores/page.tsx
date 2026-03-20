// app/(dashboard)/scores/page.tsx
'use client';

import { useEffect, useState } from 'react';
import ScoreForm from '@/components/dashboard/ScoreForm';
import ScoresList from '@/components/dashboard/ScoresList';
import StatCard from '@/components/dashboard/StatCard';

interface Score {
  id: string;
  score_value: number;
  score_date: string;
  course_name?: string;
}

export default function ScoresPage() {
  const [scores, setScores] = useState<Score[]>([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');
      
      const response = await fetch('/api/scores', {
        headers: {
          'x-user-id': userId || '',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setScores(data.data.scores || []);
          setAverage(data.data.average || 0);
        }
      }
    } catch (err) {
      console.error('Failed to fetch scores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleDelete = async (scoreId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');
      
      const response = await fetch(`/api/scores/${scoreId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': userId || '',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setScores(scores.filter(s => s.id !== scoreId));
      }
    } catch (err) {
      console.error('Failed to delete score:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Score Management</h1>
        <p className="text-muted">Track your last 5 golf scores in Stableford format</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Average Score" value={average.toFixed(1)} color="primary" />
        <StatCard label="Total Scores" value={scores.length.toString()} color="success" />
        <StatCard label="Latest Score" value={scores.length > 0 ? scores[0].score_value.toString() : '-'} color="primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScoreForm onSuccess={fetchScores} />
        <ScoresList scores={scores} onDelete={handleDelete} loading={loading} />
      </div>
    </div>
  );
}
