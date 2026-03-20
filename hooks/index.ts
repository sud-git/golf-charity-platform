// hooks/useAuth.ts - Authentication hook
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');

    if (!accessToken || !userId) {
      setLoading(false);
      return;
    }

    // TODO: Fetch user data from /api/users/{userId}
    // This is a placeholder - implement actual user fetch
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    router.push('/');
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    logout,
  };
};

// hooks/useScores.ts - Score management hook
export const useScores = (userId?: string) => {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/scores');
      if (!response.ok) throw new Error('Failed to fetch scores');
      const data = await response.json();
      setScores(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching scores');
    } finally {
      setLoading(false);
    }
  };

  const addScore = async (score: number, date: string, courseName?: string) => {
    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, date, courseName }),
      });
      if (!response.ok) throw new Error('Failed to add score');
      const data = await response.json();
      setScores(data.data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding score');
      throw err;
    }
  };

  const deleteScore = async (scoreId: string) => {
    try {
      const response = await fetch(`/api/scores/${scoreId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete score');
      setScores(scores.filter((s) => s.id !== scoreId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting score');
      throw err;
    }
  };

  return {
    scores,
    loading,
    error,
    fetchScores,
    addScore,
    deleteScore,
  };
};

// hooks/useDraws.ts - Draw information hook
export const useDraws = () => {
  const [draws, setDraws] = useState<any[]>([]);
  const [currentDraw, setCurrentDraw] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchDraws = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/draws');
      if (!response.ok) throw new Error('Failed to fetch draws');
      const data = await response.json();
      setDraws(data.data);
      // Set current draw as the most recent pending one
      const currentDraw = data.data.find((d: any) => d.status === 'pending');
      setCurrentDraw(currentDraw);
    } finally {
      setLoading(false);
    }
  };

  return {
    draws,
    currentDraw,
    loading,
    fetchDraws,
  };
};
