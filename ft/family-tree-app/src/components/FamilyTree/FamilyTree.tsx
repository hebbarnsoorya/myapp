// FamilyTree.tsx
import React from 'react';
import './FamilyTree.scss';
import { JSX } from 'react/jsx-runtime';

export interface FamilyMember {
  name: string;
  birth?: number;
  death?: number;
  children?: FamilyMember[];
}

interface FamilyTreeProps {
  data: FamilyMember;
}

const FamilyTree: React.FC<FamilyTreeProps> = ({ data }) => {
  const renderMember = (member: FamilyMember): JSX.Element => {
    return (
      <div className="member">
        <div className="card">
          <div className="name">{member.name}</div>
          <div className="dates">
            {member.birth ?? '----'} - {member.death ?? ''}
          </div>
        </div>
        {member.children && (
          <div className="children">
            {member.children.map((child, idx) => (
              <div className="connector" key={idx}>
                {renderMember(child)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return <div className="family-tree">{renderMember(data)}</div>;
};

export default FamilyTree;
