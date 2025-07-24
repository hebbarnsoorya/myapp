// src/context/FamilyTreeContext.ts

import { createContext } from 'react';
import type { Person, FamilyTreeData } from '../types/familyTree'; // Use type import for types

// Define the interface for your context's value
export interface FamilyTreeContextType {
  familyData: FamilyTreeData;
  addPerson: (person: Omit<Person, 'id'>) => Person;
  updatePerson: (person: Person) => void;
  deletePerson: (id: string) => void;
  connectPeople: (personId1: string, personId2: string, relationshipType: 'parent' | 'child' | 'spouse') => void;
  disconnectPeople: (personId1: string, personId2: string, relationshipType: 'parent' | 'child' | 'spouse') => void;
}

// Create and export the React Context object
export const FamilyTreeContext = createContext<FamilyTreeContextType | undefined>(undefined);