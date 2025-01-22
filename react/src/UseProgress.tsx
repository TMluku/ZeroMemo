import React from "react";
import {ProgressContext} from "./TutorialContext.tsx";

export const useProgress = () => {
  const context = React.useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};