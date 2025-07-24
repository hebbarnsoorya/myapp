import React from 'react';
import FamilyTree from './components/FamilyTree/FamilyTree';
import { FamilyMember } from './types/family';

const familyData: FamilyMember = {
  name: 'Root Person',
  birth: 1940,
  children: [
    {
      name: 'Child One',
      birth: 1965,
      children: [
        { name: 'Grandchild One', birth: 1990 },
        { name: 'Grandchild Two', birth: 1992 },
      ],
    },
    {
      name: 'Child Two',
      birth: 1970,
    },
  ],
};

function App() {
  return (
    <div className="App">
      <h1>My Family Tree</h1>
      <FamilyTree data={familyData} />
    </div>
  );
}

export default App;
