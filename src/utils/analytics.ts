import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase/firebaseConfig';

export interface GameEventData {
  gameId?: string;
  genre: string;
  duration?: number;
}

export const trackEvent = {
  pageView: (pageName: string) => {
    logEvent(analytics, 'page_view', {
      page_name: pageName,
      timestamp: new Date().toISOString()
    });
  },

  gameStart: (genre: string) => {
    logEvent(analytics, 'game_start', {
      genre,
      timestamp: new Date().toISOString()
    });
  },

  gameEnd: (genre: string, duration: number) => {
    logEvent(analytics, 'game_end', {
      genre,
      duration,
      timestamp: new Date().toISOString()
    });
  }
};