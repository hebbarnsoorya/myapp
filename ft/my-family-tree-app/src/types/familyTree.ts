export interface Person {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  birthDate?: string;
  deathDate?: string;
  photoUrl?: string;
  parents?: string[]; // IDs of parents
  children?: string[]; // IDs of children
  spouses?: string[]; // IDs of spouses
  bio?: string;
}

export type FamilyTreeData = {
  [id: string]: Person;
};

// For rendering purposes, you might want a more structured view
export interface TreeNode {
  id: string;
  person: Person;
  children: TreeNode[];
  spouses?: TreeNode[];
  level?: number; // For layout algorithms
  position?: { x: number; y: number }; // For visual positioning
}