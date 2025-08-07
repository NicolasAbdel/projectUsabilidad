import { useCallback } from 'react';
import { soundGenerator } from '../utils/soundGenerator';

export const useSound = () => {
  const isSoundEnabled = () => {
    const saved = localStorage.getItem('quizzbe_sound_enabled');
    return saved ? JSON.parse(saved) : true;
  };

  const playSuccess = useCallback(() => {
    if (isSoundEnabled()) {
      soundGenerator.playSuccessSound();
    }
  }, []);

  const playError = useCallback(() => {
    if (isSoundEnabled()) {
      soundGenerator.playErrorSound();
    }
  }, []);

  const playVictory = useCallback(() => {
    if (isSoundEnabled()) {
      soundGenerator.playVictorySound();
    }
  }, []);

  const playGameOver = useCallback(() => {
    if (isSoundEnabled()) {
      soundGenerator.playGameOverSound();
    }
  }, []);

  return {
    playSuccess,
    playError,
    playVictory,
    playGameOver
  };
};
