import { useState, useEffect } from 'react';
import FamilyTree from './components/FamilyTree/FamilyTree';
import { useFamilyTree } from './hooks/useFamilyTree';
import type { Person } from './types/familyTree';
import './App.scss';

function App() {
  // Initialize FamilyTreeProvider with mock data directly in main.tsx
  // The useFamilyTree hook will now provide access to this data.
  const { familyData, addPerson, connectPeople } = useFamilyTree();

  // State to control which person the tree starts rendering from
  const [startPerson, setStartPerson] = useState<string>('grandpa-arthur'); // Default to a root member

  // Use an effect to set the initial start person if familyData changes
  // This handles cases where initialData might be loaded asynchronously
  useEffect(() => {
    if (!startPerson && Object.keys(familyData).length > 0) {
      setStartPerson(Object.keys(familyData)[0]); // Set first person as default if none selected
    }
  }, [familyData, startPerson]);


  // --- Handler to Add a New Random Person ---
  const handleAddExamplePerson = () => {
    const newPerson: Omit<Person, 'id'> = {
      name: `New Member ${Math.floor(Math.random() * 100)}`,
      gender: Math.random() > 0.5 ? 'male' : 'female',
      birthDate: '2020-01-01',
      photoUrl: `https://via.placeholder.com/80/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=NM`,
    };

    const addedPerson = addPerson(newPerson);
    console.log('Added new person:', addedPerson);

    // Example: Connect the newly added person as a child of 'Child Alice' (p5 in your old data)
    // Now, let's connect it to 'child-frank' from the new mock data
    const parentPersonId = 'child-frank';
    const parentPerson: Person | undefined = familyData[parentPersonId];

    if (parentPerson) {
      connectPeople(parentPersonId, addedPerson.id, 'parent');
      console.log(`Connected ${addedPerson.name} as child of ${parentPerson.name}`);
    } else {
      console.warn(`Parent person with ID ${parentPersonId} not found to connect new member.`);
    }
  };

  return (
    <div className="app">
      {/* --- Application Header --- */}
      <header className="app-header">
        <h1>My Family Tree</h1>
        <button onClick={handleAddExamplePerson}>Add Random Person</button>
        {/* Dropdown to select the starting point of the tree */}
        <div className="start-person-selector">
          <label htmlFor="startPerson">Display tree from:</label>
          <select
            id="startPerson"
            value={startPerson}
            onChange={(e) => setStartPerson(e.target.value)}
          >
            {/* Map through all people in familyData to create dropdown options */}
            {Object.values(familyData).map(person => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* --- Main Content Area: Family Tree Display --- */}
      <main className="app-main">
        <FamilyTree data={familyData} startPersonId={startPerson} />
      </main>

      {/* --- Application Footer --- */}
      <footer className="app-footer">
        <p>&copy; 2025 Family Tree App</p>
      </footer>
    </div>
  );
}

export default App;