// src/context/FamilyTreeProvider.tsx (Renamed from FamilyTreeContext.tsx)

import React, { useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react'; // type import for ReactNode
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

// Import the context object and its type from the new dedicated context file
import { FamilyTreeContext, type FamilyTreeContextType } from './FamilyTreeContext';
import type { Person, FamilyTreeData } from '../types/familyTree'; // type imports for core data types

interface FamilyTreeProviderProps {
  children: ReactNode;
  initialData?: FamilyTreeData;
}

export const FamilyTreeProvider: React.FC<FamilyTreeProviderProps> = ({ children, initialData = {} }) => {
  const [familyData, setFamilyData] = useState<FamilyTreeData>(initialData);

  const addPerson = useCallback((person: Omit<Person, 'id'>): Person => {
    const newPerson: Person = { ...person, id: uuidv4() };
    setFamilyData(prev => ({ ...prev, [newPerson.id]: newPerson }));
    return newPerson;
  }, []);

  const updatePerson = useCallback((person: Person) => {
    setFamilyData(prev => {
      if (!prev[person.id]) {
        console.warn(`Attempted to update non-existent person with ID: ${person.id}`);
        return prev;
      }
      return { ...prev, [person.id]: person };
    });
  }, []);

  const deletePerson = useCallback((id: string) => {
    setFamilyData(prev => {
      const newFamilyData = { ...prev };
      delete newFamilyData[id];

      Object.values(newFamilyData).forEach(person => {
        if (person.parents) person.parents = person.parents.filter(pId => pId !== id);
        if (person.children) person.children = person.children.filter(cId => cId !== id);
        if (person.spouses) person.spouses = person.spouses.filter(sId => sId !== id);
      });
      return newFamilyData;
    });
  }, []);

  const connectPeople = useCallback((personId1: string, personId2: string, relationshipType: 'parent' | 'child' | 'spouse') => {
    setFamilyData(prev => {
      const p1 = prev[personId1];
      const p2 = prev[personId2];

      if (!p1 || !p2) {
        console.warn('One or both persons not found for connection.');
        return prev;
      }

      const updatedData = { ...prev };

      const ensureArray = (arr: string[] | undefined): string[] => arr ? [...arr] : [];

      if (relationshipType === 'parent') {
        updatedData[personId1] = { ...p1, children: Array.from(new Set([...ensureArray(p1.children), personId2])) };
        updatedData[personId2] = { ...p2, parents: Array.from(new Set([...ensureArray(p2.parents), personId1])) };
      } else if (relationshipType === 'child') {
        updatedData[personId1] = { ...p1, parents: Array.from(new Set([...ensureArray(p1.parents), personId2])) };
        updatedData[personId2] = { ...p2, children: Array.from(new Set([...ensureArray(p2.children), personId1])) };
      } else if (relationshipType === 'spouse') {
        updatedData[personId1] = { ...p1, spouses: Array.from(new Set([...ensureArray(p1.spouses), personId2])) };
        updatedData[personId2] = { ...p2, spouses: Array.from(new Set([...ensureArray(p2.spouses), personId1])) };
      }

      return updatedData;
    });
  }, []);

  const disconnectPeople = useCallback((personId1: string, personId2: string, relationshipType: 'parent' | 'child' | 'spouse') => {
    setFamilyData(prev => {
      const p1 = prev[personId1];
      const p2 = prev[personId2];

      if (!p1 || !p2) {
        console.warn('One or both persons not found for disconnection.');
        return prev;
      }

      const updatedData = { ...prev };

      if (relationshipType === 'parent') {
        updatedData[personId1] = { ...p1, children: p1.children?.filter(id => id !== personId2) };
        updatedData[personId2] = { ...p2, parents: p2.parents?.filter(id => id !== personId1) };
      } else if (relationshipType === 'child') {
        updatedData[personId1] = { ...p1, parents: p1.parents?.filter(id => id !== personId2) };
        updatedData[personId2] = { ...p2, children: p2.children?.filter(id => id !== personId1) };
      } else if (relationshipType === 'spouse') {
        updatedData[personId1] = { ...p1, spouses: p1.spouses?.filter(id => id !== personId2) };
        updatedData[personId2] = { ...p2, spouses: p2.spouses?.filter(id => id !== personId1) };
      }
      return updatedData;
    });
  }, []);

  const memoizedValue = useMemo<FamilyTreeContextType>(() => ({ // Explicitly type memoizedValue
    familyData,
    addPerson,
    updatePerson,
    deletePerson,
    connectPeople,
    disconnectPeople,
  }), [familyData, addPerson, updatePerson, deletePerson, connectPeople, disconnectPeople]);

  return (
    <FamilyTreeContext.Provider value={memoizedValue}>
      {children}
    </FamilyTreeContext.Provider>
  );
};