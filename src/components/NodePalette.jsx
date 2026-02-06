import React from 'react';
import { nodeCategories } from '../data/nodeRegistry.js';

const NodePalette = ({ onAddNode }) => {
  return (
    <aside className="panel panel-left">
      <h2>Nodes</h2>
      {Object.entries(nodeCategories).map(([category, nodes]) => (
        <div key={category} className="palette-group">
          <h3>{category}</h3>
          <div className="palette-list">
            {nodes.map((node) => (
              <div
                key={node.type}
                className="palette-item"
                role="button"
                tabIndex={0}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData('application/node-type', node.type);
                  event.dataTransfer.effectAllowed = 'move';
                }}
                onClick={() => onAddNode(node.type)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') onAddNode(node.type);
                }}
              >
                <div className="palette-title">{node.label}</div>
                <div className="palette-type">{node.type}</div>
                <div className="palette-description">{node.description}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
};

export default NodePalette;
