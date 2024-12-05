import React, { createContext, useContext, useEffect, useState } from 'react';
import { Engine, tsParticles } from '@tsparticles/engine';

interface ParticleContextType {
    engine: Engine | null;
    engineInitialized: boolean;
}

const ParticleContext = createContext<ParticleContextType | undefined>(undefined);

const ParticleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [engine, setEngine] = useState<Engine | null>(null);
  const [engineInitialized, setEngineInitialized] = useState(false);

  useEffect(() => {
    const initEngine = async () => {
      const engineInstance = tsParticles;
      setEngine(engineInstance);
      setEngineInitialized(true);
    };

    initEngine();
  }, []);

  return (
    <ParticleContext.Provider value={{ engine, engineInitialized }}>
      {children}
    </ParticleContext.Provider>
  );
};

export const useParticleEngine = () => {
  const context = useContext(ParticleContext);
  if (!context) {
    throw new Error('useParticleEngine must be used within a ParticleProvider');
  }
  return context;
};

export default ParticleProvider;