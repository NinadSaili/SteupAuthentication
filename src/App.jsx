import React, { useMemo, useState } from 'react';
import { useEdgesState, useNodesState } from 'reactflow';
import NodePalette from './components/NodePalette.jsx';
import NodeCanvas from './components/NodeCanvas.jsx';
import NodeConfigPanel from './components/NodeConfigPanel.jsx';
import JsonPreview from './components/JsonPreview.jsx';
import { defaultNodeData, nodeRegistry } from './data/nodeRegistry.js';
import { compileWorkflow } from './utils/compiler.js';

const initialWorkflow = {
  version: 'v1',
  name: 'New Workflow',
  type: '',
  dvcId: '',
  poiOn: false,
  piiOn: false,
  styleSheet: '',
  header: null,
  footer: null,
  canvasData: null,
  isPublished: null,
  tenantId: ''
};

const buildNode = (type, position) => {
  const id = crypto.randomUUID();
  const registry = nodeRegistry[type];
  return {
    id,
    type: 'workflowNode',
    position,
    data: {
      id,
      type,
      name: registry?.label ?? type,
      config: structuredClone(defaultNodeData[type] ?? {})
    }
  };
};

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [workflow, setWorkflow] = useState(initialWorkflow);

  const handleAddNode = (type, positionOverride) => {
    const position = positionOverride ?? {
      x: 100 + nodes.length * 40,
      y: 80 + nodes.length * 40
    };
    setNodes((prev) => [...prev, buildNode(type, position)]);
  };

  const updateNode = (nextNode) => {
    setNodes((prev) => prev.map((node) => (node.id === nextNode.id ? nextNode : node)));
    setSelectedNode(nextNode);
  };

  const updateWorkflow = (patch) => {
    setWorkflow((prev) => ({ ...prev, ...patch }));
  };

  const compiled = useMemo(
    () =>
      compileWorkflow({
        workflow,
        nodes,
        edges
      }),
    [workflow, nodes, edges]
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Workflow Builder</h1>
          <p>Build 1Kosmos workflow JSON visually.</p>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={() => navigator.clipboard.writeText(JSON.stringify(compiled, null, 2))}
        >
          Copy JSON
        </button>
      </header>

      <div className="app-body">
        <NodePalette onAddNode={handleAddNode} />
        <NodeCanvas
          nodes={nodes}
          edges={edges}
          setNodes={onNodesChange}
          setEdges={onEdgesChange}
          onSelectNode={setSelectedNode}
          onDropNode={handleAddNode}
        />
        <NodeConfigPanel
          selectedNode={selectedNode}
          updateNode={updateNode}
          workflow={workflow}
          updateWorkflow={updateWorkflow}
        />
      </div>

      <JsonPreview compiled={compiled} />
    </div>
  );
};

export default App;
