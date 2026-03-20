// components/dashboard/ScoresList.tsx
'use client';

import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils/helpers';

interface ScoreItem {
  id: string;
  score_value: number;
  score_date: string;
  course_name?: string;
}

interface ScoresListProps {
  scores: ScoreItem[];
  onDelete?: (id: string) => void;
  loading?: boolean;
}

export default function ScoresList({ scores, onDelete, loading }: ScoresListProps) {
  const average = scores.length > 0 
    ? (scores.reduce((sum, s) => sum + s.score_value, 0) / scores.length).toFixed(1)
    : '0';

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Your Scores</h3>
        {average && <div className="text-2xl font-bold text-primary">{average}</div>}
      </div>

      {scores.length === 0 ? (
        <p className="text-muted">No scores yet. Add your first score!</p>
      ) : (
        <div className="space-y-2">
          {scores.map((score) => (
            <div key={score.id} className="flex items-center justify-between p-3 bg-light rounded">
              <div>
                <div className="font-bold text-lg">{score.score_value}</div>
                <div className="text-sm text-muted">
                  {formatDate(score.score_date)} {score.course_name ? `• ${score.course_name}` : ''}
                </div>
              </div>
              <button
                onClick={() => onDelete?.(score.id)}
                disabled={loading}
                className="btn btn-sm btn-outline text-error"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
