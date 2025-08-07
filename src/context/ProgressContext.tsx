import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { soundGenerator } from '../utils/soundGenerator';

type ProgressType = {
  points: number;
  lives: number;
  unlockedUnits: number[];
  completedUnits: number[];
  completedLessons: string[];
  completedExercises: string[];
  unitProgress: Record<number, number>;
  lastUnlockedUnit: number | null;
};

type ProgressContextType = {
  progress: ProgressType;
  updateProgress: (points: number) => void;
  updateUnitProgress: (unitId: number, progress: number) => void;
  completeExercise: (exerciseId: string) => void;
  completeLessons: (lessonId: string) => void;
  loseLife: () => void;
  resetProgress: () => void;
};

const defaultProgress: ProgressType = {
  points: 0,
  lives: 5,
  unlockedUnits: [1],
  completedUnits: [],
  completedLessons: [],
  completedExercises: [],
  unitProgress: { 1: 0 },
  lastUnlockedUnit: 1
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<ProgressType>(() => {
    const savedProgress = localStorage.getItem('quizzbe_progress');
    return savedProgress ? JSON.parse(savedProgress) : defaultProgress;
  });

  useEffect(() => {
    localStorage.setItem('quizzbe_progress', JSON.stringify(progress));
  }, [progress]);

  const updateProgress = (points: number) => {
    setProgress(prev => ({
      ...prev,
      points: prev.points + points
    }));
  };

  const updateUnitProgress = (unitId: number, newProgress: number) => {
    setProgress(prev => {
      const currentProgress = prev.unitProgress[unitId] || 0;
      const updatedProgress = Math.max(currentProgress, newProgress);
      
      // If unit is completed (progress >= 1), add to completed units
      const completedUnits = [...prev.completedUnits];
      if (updatedProgress >= 1 && !completedUnits.includes(unitId)) {
        completedUnits.push(unitId);
        
        // Unlock next unit if it exists
        const unlockedUnits = [...prev.unlockedUnits];
        if (!unlockedUnits.includes(unitId + 1)) {
          unlockedUnits.push(unitId + 1);
        }
        
        return {
          ...prev,
          unitProgress: {
            ...prev.unitProgress,
            [unitId]: updatedProgress
          },
          completedUnits,
          unlockedUnits,
          lastUnlockedUnit: unitId + 1
        };
      }
      
      return {
        ...prev,
        unitProgress: {
          ...prev.unitProgress,
          [unitId]: updatedProgress
        }
      };
    });
  };

  const completeExercise = (exerciseId: string) => {
    if (progress.completedExercises.includes(exerciseId)) {
      return;
    }
    
    setProgress(prev => {
      // Extract unit number from exerciseId (format: '1-exercise-1')
      const unitId = parseInt(exerciseId.split('-')[0]);
      
      // Calculate new unit progress
      const currentUnitProgress = prev.unitProgress[unitId] || 0;
      const newUnitProgress = Math.min(currentUnitProgress + 0.1, 1);
      
      // If unit is completed (progress >= 1), add to completed units and unlock next unit
      const completedUnits = [...prev.completedUnits];
      const unlockedUnits = [...prev.unlockedUnits];
      
      if (newUnitProgress >= 1 && !completedUnits.includes(unitId)) {
        completedUnits.push(unitId);
        
        // Unlock next unit if it exists
        if (!unlockedUnits.includes(unitId + 1)) {
          unlockedUnits.push(unitId + 1);
        }
        
        // Reproducir sonido de victoria cuando se completa una unidad
        soundGenerator.playVictorySound();
      }
      
      return {
        ...prev,
        completedExercises: [...prev.completedExercises, exerciseId],
        unitProgress: {
          ...prev.unitProgress,
          [unitId]: newUnitProgress
        },
        completedUnits,
        unlockedUnits,
        lastUnlockedUnit: unlockedUnits.length > 0 ? Math.max(...unlockedUnits) : prev.lastUnlockedUnit
      };
    });
  };

  const completeLessons = (lessonId: string) => {
    if (progress.completedLessons.includes(lessonId)) {
      return;
    }
    
    setProgress(prev => {
      // Extract unit number from lessonId (format: '1-lesson-1')
      const unitId = parseInt(lessonId.split('-')[0]);
      
      // Calculate new unit progress
      const currentUnitProgress = prev.unitProgress[unitId] || 0;
      const newUnitProgress = Math.min(currentUnitProgress + 0.2, 1);
      
      // If unit is completed (progress >= 1), add to completed units and unlock next unit
      const completedUnits = [...prev.completedUnits];
      const unlockedUnits = [...prev.unlockedUnits];
      
      if (newUnitProgress >= 1 && !completedUnits.includes(unitId)) {
        completedUnits.push(unitId);
        
        // Unlock next unit if it exists
        if (!unlockedUnits.includes(unitId + 1)) {
          unlockedUnits.push(unitId + 1);
        }
      }
      
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        unitProgress: {
          ...prev.unitProgress,
          [unitId]: newUnitProgress
        },
        completedUnits,
        unlockedUnits,
        lastUnlockedUnit: unlockedUnits.length > 0 ? Math.max(...unlockedUnits) : prev.lastUnlockedUnit
      };
    });
  };

  const loseLife = () => {
    setProgress(prev => {
      const newLives = Math.max(prev.lives - 1, 0);
      
      // Reproducir sonido de error cuando se pierde una vida
      if (newLives < prev.lives) {
        soundGenerator.playErrorSound();
      }
      
      // Reproducir sonido de game over si se pierden todas las vidas
      if (newLives === 0) {
        soundGenerator.playGameOverSound();
      }
      
      return {
        ...prev,
        lives: newLives
      };
    });
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
    localStorage.removeItem('quizzbe_progress');
  };

  return (
    <ProgressContext.Provider 
      value={{ 
        progress, 
        updateProgress, 
        updateUnitProgress, 
        completeExercise, 
        completeLessons, 
        loseLife,
        resetProgress
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};