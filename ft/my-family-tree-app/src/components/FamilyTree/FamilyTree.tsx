// src/components/FamilyTree/FamilyTree.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import PersonNode from '../PersonNode/PersonNode'; // PersonNode is now forwardRef-wrapped
import type { FamilyTreeData, TreeNode } from '../../types/familyTree'; // Use type import
import styles from './FamilyTree.module.scss';
// No direct 'uuid' import here, as it's used in the context provider

/**
 * Utility function to build a hierarchical tree structure from flat family data.
 *
 * NOTE: This is a simplified BFS algorithm. For a full-featured family tree application
 * with complex relationships (e.g., multiple marriages, step-relations, non-linear
 * structures), a more sophisticated graph traversal and layout algorithm
 * (like those found in libraries such as D3.js, GoJS, or React Flow) would be required.
 * This version primarily builds a "descendant" view from a starting person.
 * Spouses are added as a direct property to the TreeNode for simpler peer rendering.
 */
const buildTree = (data: FamilyTreeData, startPersonId: string | null): TreeNode[] => {
  if (!startPersonId || !data[startPersonId]) {
    // If no start person or ID is invalid, return an empty tree.
    return [];
  }

  const visited = new Set<string>(); // Keep track of visited persons to prevent infinite loops
  const queue: TreeNode[] = [];
  const rootPerson = data[startPersonId];

  // Initialize the root node
  const rootNode: TreeNode = { id: rootPerson.id, person: rootPerson, children: [] };
  queue.push(rootNode);
  visited.add(rootPerson.id);

  let head = 0;
  while (head < queue.length) {
    const currentNode = queue[head++];
    const currentPerson = currentNode.person;

    // Add children to the current node
    if (currentPerson.children) {
      currentPerson.children.forEach(childId => {
        // Ensure child exists in data and hasn't been visited yet
        if (data[childId] && !visited.has(childId)) {
          const childNode: TreeNode = { id: childId, person: data[childId], children: [] };
          currentNode.children.push(childNode);
          queue.push(childNode);
          visited.add(childId); // Mark child as visited
        }
      });
    }

    // Add spouses to the current node (as a peer concept for rendering)
    if (currentPerson.spouses) {
        currentNode.spouses = currentPerson.spouses
            .filter(spouseId => data[spouseId] && !visited.has(spouseId)) // Filter for existing and unvisited spouses
            .map(spouseId => {
                const spouseNode: TreeNode = { id: spouseId, person: data[spouseId], children: [] };
                // Optionally, mark spouse as visited. Be careful if spouses can also be parents/children in other branches,
                // as this simplified BFS might prevent them from being fully rendered elsewhere.
                // For a true graph, you'd process all nodes once and then lay them out.
                // visited.add(spouseId);
                return spouseNode;
            });
    }
  }

  // The function returns an array of root nodes. In this simplified BFS, it's typically just one.
  return [rootNode];
};


interface FamilyTreeProps {
  data: FamilyTreeData;
  startPersonId?: string; // ID of the person to focus the tree on
}

const FamilyTree: React.FC<FamilyTreeProps> = ({ data, startPersonId }) => {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the main tree container
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]); // State for the processed tree structure
  
  // A ref to store references to each PersonNode's underlying DOM element
  // This is crucial for calculating positions for connectors.
  const nodeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Effect to rebuild the tree structure whenever data or the starting person changes
  useEffect(() => {
    // Default to the first person in the data if no startPersonId is provided
    setTreeNodes(buildTree(data, startPersonId || Object.keys(data)[0]));
  }, [data, startPersonId]);

  // Callback for when a person node is clicked
  const handlePersonClick = useCallback((personId: string) => {
    // Toggle selection: if already selected, deselect; otherwise, select
    setSelectedPersonId(personId === selectedPersonId ? null : personId);
  }, [selectedPersonId]);

  // --- Connector Drawing Logic (Conceptual Placeholder) ---
  // IMPORTANT: For a production-ready application, drawing connectors between nodes
  // dynamically based on their positions requires a robust SVG drawing solution.
  // Libraries like 'react-flow-renderer', 'GoJS', or a custom D3.js implementation
  // are highly recommended for accurate, performant, and interactive connections.
  // The code below is a conceptual outline and does not actually draw SVG lines.
  const drawConnectors = useCallback(() => {
    if (!containerRef.current) return;

    // In a real implementation:
    // 1. Clear any previously drawn SVG connectors
    //    e.g., containerRef.current.querySelectorAll('svg.connector').forEach(svg => svg.remove());
    // 2. Iterate through relationships in your `data`
    // 3. For each relationship (parent-child, spouse-spouse):
    //    a. Get the DOM elements (from nodeRefs.current) of the connected persons.
    //    b. Get their `getBoundingClientRect()` to find their positions.
    //    c. Calculate start and end coordinates for your SVG line/path.
    //    d. Create an SVG element and append SVG <line> or <path> elements to it.
    //    e. Append the SVG to the containerRef.current.

    // Example conceptual connection points:
    // Parent to Child: Parent's bottom center to Child's top center
    // Spouse to Spouse: Center of their adjacent sides

    // console.log("Drawing connectors (conceptual)...");
    // Example:
    // const parentEl = nodeRefs.current['p3']; // Dad Robert
    // const childEl = nodeRefs.current['p5'];  // Child Alice
    // if (parentEl && childEl) {
    //   const parentRect = parentEl.getBoundingClientRect();
    //   const childRect = childEl.getBoundingClientRect();
    //   const containerRect = containerRef.current.getBoundingClientRect();
    //
    //   const startX = parentRect.left + parentRect.width / 2 - containerRect.left;
    //   const startY = parentRect.bottom - containerRect.top;
    //   const endX = childRect.left + childRect.width / 2 - containerRect.left;
    //   const endY = childRect.top - containerRect.top;
    //
    //   // console.log(`Connecting (${startX}, ${startY}) to (${endX}, ${endY})`);
    //   // This is where you would programmatically create and append SVG line elements.
    // }

  }, []); // Depend on data, so connectors update if relationships change

  // Effect to re-draw connectors when the layout changes (e.g., window resize, node positions shift)
  useEffect(() => {
    // Use a ResizeObserver to detect when the container or individual nodes change size/position
    const observer = new ResizeObserver(() => {
      drawConnectors(); // Re-draw connectors on resize
    });

    if (containerRef.current) {
      observer.observe(containerRef.current); // Observe the main container
    }

    // Observe all individual person nodes
    // This is important because the layout might shift even if the container doesn't resize.
    // We observe all nodes currently in the `nodeRefs.current`
    Object.values(nodeRefs.current).forEach(node => {
      if (node) {
        observer.observe(node);
      }
    });

    // Clean up the observer when the component unmounts
    return () => observer.disconnect();
    // Re-run this effect if drawConnectors changes or if treeNodes updates (meaning new nodes might have appeared)
  }, [drawConnectors, treeNodes]);

  /**
   * Recursively renders a single level of the family tree.
   * Uses CSS Flexbox/Grid for a simplified layout.
   *
   * @param nodes - An array of TreeNode objects to render at the current level.
   * @param level - The current depth level in the tree (for styling/debugging).
   */
  const renderTreeLevel = (nodes: TreeNode[], level: number) => (
    <div className={styles.treeLevel} data-level={level}>
      {nodes.map(node => (
        <div key={node.id} className={styles.nodeWrapper}>
          {/* Render the main person node */}
          <PersonNode
            person={node.person}
            onClick={handlePersonClick}
            isSelected={selectedPersonId === node.id}
            // FIX: Ensure callback ref returns void
            ref={el => { nodeRefs.current[node.id] = el; }}
          />
          {/* Render spouses, if any, horizontally next to the main person */}
          {node.spouses && node.spouses.length > 0 && (
              <div className={styles.spousesContainer}>
                  {node.spouses.map(spouseNode => (
                      <PersonNode
                          key={spouseNode.id}
                          person={spouseNode.person}
                          onClick={handlePersonClick}
                          isSelected={selectedPersonId === spouseNode.id}
                          // FIX: Ensure callback ref returns void
                          ref={el => { nodeRefs.current[spouseNode.id] = el; }}
                      />
                  ))}
              </div>
          )}
          {/* Recursively render children if there are any */}
          {node.children.length > 0 && (
            <div className={styles.childrenContainer}>
              {renderTreeLevel(node.children, level + 1)}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.familyTreeContainer} ref={containerRef}>
      {/*
        In a real scenario, this is where you would overlay an SVG element
        to draw dynamic lines/paths between the PersonNode elements.
        The `drawConnectors` function would populate this SVG.
      */}
      {treeNodes.length > 0 ? (
        renderTreeLevel(treeNodes, 0) // Start rendering from the root level (level 0)
      ) : (
        <p className={styles.noDataMessage}>
          No family tree data to display or invalid start person ID.
          Please check the provided data or select a valid starting person.
        </p>
      )}
    </div>
  );
};

export default FamilyTree;