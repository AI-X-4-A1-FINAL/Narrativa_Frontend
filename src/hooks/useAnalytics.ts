import { useCallback } from 'react';
import { trackEvent } from '../utils/analytics';

export const useAnalytics = (genre: string) => {
  const handleGameStart = useCallback(() => {
    trackEvent.gameStart(genre);
  }, [genre]);

  const handleGameEnd = useCallback((duration: number) => {
    trackEvent.gameEnd(genre, duration);
  }, [genre]);

  return {
    trackGameStart: handleGameStart,
    trackGameEnd: handleGameEnd
  };
};