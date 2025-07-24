// src/components/PersonNode/PersonNode.tsx

import { forwardRef } from 'react'; // Import forwardRef and Ref
import type { Person } from '../../types/familyTree'; // Use type import
import styles from './PersonNode.module.scss';

interface PersonNodeProps {
  person: Person;
  onClick?: (personId: string) => void;
  isSelected?: boolean;
}

// 1. Wrap the component with forwardRef
// 2. The second argument to the inner function is the ref
// 3. Define the types for the ref (HTMLDivElement) and the props (PersonNodeProps)
const PersonNode = forwardRef<HTMLDivElement, PersonNodeProps>(({ person, onClick, isSelected }, ref) => {
  const handleClick = () => {
    if (onClick) {
      onClick(person.id);
    }
  };

  return (
    <div
      // 4. Attach the forwarded ref to the root DOM element you want to measure/expose
      ref={ref}
      className={`${styles.personNode} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${person.name}`}
    >
      {person.photoUrl && (
        <div className={styles.photoContainer}>
          <img src={person.photoUrl} alt={person.name} className={styles.photo} />
        </div>
      )}
      <div className={styles.info}>
        <h3 className={styles.name}>{person.name}</h3>
        {person.birthDate && <p className={styles.dates}>{person.birthDate}</p>}
        {person.deathDate && <p className={styles.dates}> - {person.deathDate}</p>}
      </div>
    </div>
  );
});

export default PersonNode;