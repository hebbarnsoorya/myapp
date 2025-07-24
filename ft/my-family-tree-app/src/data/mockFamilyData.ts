import type { FamilyTreeData } from '../types/familyTree';

export const mockFamilyData: FamilyTreeData = {
  // Generation 1 (Grandparents)
  'grandpa-arthur': {
    id: 'grandpa-arthur',
    name: 'Arthur Sterling',
    gender: 'male',
    birthDate: '1930-04-10',
    deathDate: '2010-09-25',
    photoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // Male avatar
    spouses: ['grandma-beatrice'],
    children: ['dad-charles', 'aunt-diana'],
  },
  'grandma-beatrice': {
    id: 'grandma-beatrice',
    name: 'Beatrice Sterling',
    gender: 'female',
    birthDate: '1932-07-22',
    deathDate: '2015-03-01',
    photoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135713.png', // Female avatar
    spouses: ['grandpa-arthur'],
    children: ['dad-charles', 'aunt-diana'],
  },

  // Generation 2 (Parents & Aunts/Uncles)
  'dad-charles': {
    id: 'dad-charles',
    name: 'Charles Sterling',
    gender: 'male',
    birthDate: '1955-02-18',
    photoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    parents: ['grandpa-arthur', 'grandma-beatrice'],
    spouses: ['mom-elizabeth'],
    children: ['child-frank', 'child-grace'],
  },
  'mom-elizabeth': {
    id: 'mom-elizabeth',
    name: 'Elizabeth Sterling',
    gender: 'female',
    birthDate: '1958-11-05',
    photoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135713.png',
    spouses: ['dad-charles'],
    children: ['child-frank', 'child-grace'],
  },
  'aunt-diana': {
    id: 'aunt-diana',
    name: 'Diana Sterling',
    gender: 'female',
    birthDate: '1960-09-12',
    photoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135713.png',
    parents: ['grandpa-arthur', 'grandma-beatrice'],
    spouses: ['uncle-henry'],
    children: ['cousin-isabel'],
  },
  'uncle-henry': {
    id: 'uncle-henry',
    name: 'Henry Green',
    gender: 'male',
    birthDate: '1959-01-30',
    photoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    spouses: ['aunt-diana'],
    children: ['cousin-isabel'],
  },

  // Generation 3 (Children & Cousins)
  'child-frank': {
    id: 'child-frank',
    name: 'Frank Sterling',
    gender: 'male',
    birthDate: '1985-06-20',
    photoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    parents: ['dad-charles', 'mom-elizabeth'],
    spouses: ['spouse-laura'],
    children: ['grandchild-olivia'], // Frank and Laura's child
  },
  'child-grace': {
    id: 'child-grace',
    name: 'Grace Sterling',
    gender: 'female',
    birthDate: '1988-03-15',
    photoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135713.png',
    parents: ['dad-charles', 'mom-elizabeth'],
    // No spouse or children yet
  },
  'cousin-isabel': {
    id: 'cousin-isabel',
    name: 'Isabel Green',
    gender: 'female',
    birthDate: '1989-10-01',
    photoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135713.png',
    parents: ['aunt-diana', 'uncle-henry'],
    spouses: ['spouse-john'],
  },
  'spouse-laura': {
    id: 'spouse-laura',
    name: 'Laura Miller',
    gender: 'female',
    birthDate: '1987-01-25',
    photoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135713.png',
    spouses: ['child-frank'],
    children: ['grandchild-olivia'],
  },
  'spouse-john': {
    id: 'spouse-john',
    name: 'John Davis',
    gender: 'male',
    birthDate: '1986-04-03',
    photoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    spouses: ['cousin-isabel'],
  },

  // Generation 4 (Grandchildren)
  'grandchild-olivia': {
    id: 'grandchild-olivia',
    name: 'Olivia Sterling',
    gender: 'female',
    birthDate: '2015-08-11',
    photoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135713.png',
    parents: ['child-frank', 'spouse-laura'],
  },
};