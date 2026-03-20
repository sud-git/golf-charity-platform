// components/dashboard/ScoreForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { scoreSchema } from '@/lib/utils/validators';

type ScoreInput = {
  score_value: number;
  score_date: string;
  course_name?: string;
};

interface ScoreFormProps {
  onSuccess?: () => void;
}

export default function ScoreForm({ onSuccess }: ScoreFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ScoreInput>({
    resolver: zodResolver(scoreSchema),
  });

  const onSubmit = async (data: ScoreInput) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': localStorage.getItem('userId') || '',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to add score');
      }

      reset();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding score');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-6 max-w-md">
      <h3 className="text-xl font-bold mb-4">Add Score</h3>

      {error && <div className="error-banner mb-4">{error}</div>}

      <div className="form-group">
        <label htmlFor="score">Score (1-45)</label>
        <input
          {...register('score_value', { valueAsNumber: true })}
          type="number"
          min="1"
          max="45"
          className="input"
          placeholder="Enter score"
        />
        {errors.score_value && <p className="text-error text-sm mt-1">{errors.score_value.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          {...register('score_date')}
          type="date"
          className="input"
        />
        {errors.score_date && <p className="text-error text-sm mt-1">{errors.score_date.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="course">Course Name (Optional)</label>
        <input
          {...register('course_name')}
          type="text"
          className="input"
          placeholder="e.g. Pebble Beach"
        />
      </div>

      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Adding...' : 'Add Score'}
      </button>
    </form>
  );
}
