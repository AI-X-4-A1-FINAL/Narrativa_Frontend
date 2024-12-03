import { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';

interface WorldViewReturn {
  worldView: string;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useWorldView = (
  genre: string,
  tags: string[],
  initialStory: string,
  isLoading: boolean
): WorldViewReturn => {
  const [worldView, setWorldView] = useState<string>(initialStory || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorldView = async () => {
    if (!initialStory || isLoading) {
      setLoading(true);
      try {
        const response = await axios.post('/generate-story/start', {
          genre,
          tags,
        });
        setWorldView(response.data.story);
        setError(null);
      } catch (error) {
        console.error('Error fetching world view:', error);
        setError('세계관을 불러오는데 실패했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    } else {
      setWorldView(initialStory);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (genre) {
      fetchWorldView();
    }
  }, [genre, initialStory, isLoading]);

  return {
    worldView,
    loading,
    error,
    refetch: fetchWorldView
  };
};