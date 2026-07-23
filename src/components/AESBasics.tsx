import React from 'react';
import { NavigationTab } from '../types';
import { LearningCenterView } from './LearningCenterView';

interface AESBasicsProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const AESBasics: React.FC<AESBasicsProps> = ({ setActiveTab }) => {
  return <LearningCenterView setActiveTab={setActiveTab} />;
};

