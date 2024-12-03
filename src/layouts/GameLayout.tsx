import React from 'react';
import { AudioProvider } from '../Contexts/AudioContext';

const GameLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AudioProvider>
      {children}
    </AudioProvider>
  );
};

export default GameLayout;
