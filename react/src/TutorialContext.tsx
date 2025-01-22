import React, {createContext, useState} from "react";

type OnboardingProgressContext = {
  progress: number;
  setProgress: (progress: number) => void;
  progressVisibility: (threshold: number) => { visibility: 'visible' | 'hidden' };
};

export const ProgressContext =
  createContext<OnboardingProgressContext | undefined>(undefined);

type OnboardingProgressProviderProps = {
  children: React.ReactNode;
}

export const OnboardingProgressProvider = ({children}: OnboardingProgressProviderProps) => {
  const [progress, setProgress] = useState(parseInt(localStorage.getItem('onboardingProgress') || '0'));
  const setProgressWithLocalStorage = (progress: number) => {
    localStorage.setItem('onboardingProgress', progress.toString());
    setProgress(progress);
  }
  const progressVisibility: (threshold: number) => { visibility: 'visible' | 'hidden' }
    = (threshold: number) => {
    return {visibility: progress >= threshold ? 'visible' : 'hidden'};
  }

  return (
    <ProgressContext.Provider value={{
      progress,
      setProgress: setProgressWithLocalStorage,
      progressVisibility,
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

