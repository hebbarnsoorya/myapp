// src/hooks/useFamilyTree.ts

import { useContext } from 'react';
// Import both the context object and its type from the new dedicated file
import { FamilyTreeContext, type FamilyTreeContextType } from '../context/FamilyTreeContext';

export const useFamilyTree = (): FamilyTreeContextType => {
  const context = useContext(FamilyTreeContext);
  if (context === undefined) {
    throw new Error('useFamilyTree must be used within a FamilyTreeProvider');
  }
  return context;
};