import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  Handle,
  Position
} from 'reactflow';
import { nodeRegistry, navigationLabels } from '../data/nodeRegistry.js';

const NodeCard = ({ data }) => {
  const registry = nodeRegistry[data.type];
  return (
    <div className="node-card">
      <Handle className="node-target" type="target" position={Position.Left} />
      <div className="node-header">
        <div className="node-name">{data.name || registry?.label}</div>
        <div className="node-type">{data.type}</div>
      </div>
      <div className="node-handles">
        {registry?.outputs?.map((output) => (
          <div key={output} className="node-handle-row">
            <span className="node-handle-label">{navigationLabels[output] ?? output}</span>
            <Handle
              className="node-handle"
              type="source"
              id={output}
              position={Position.Right}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const nodeTypes = {
  workflowNode: NodeCard
};

const NodeCanvas = ({ nodes, edges, setNodes, setEdges, onSelectNode, onDropNode }) => {
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const onConnect = useCallback(
    (params) => {
      if (!params.sourceHandle) return;
      setEdges((eds) => addEdge({ ...params, type: 'smoothstep' }, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_, node) => {
      onSelectNode(node);
    },
    [onSelectNode]
  );

  const onPaneClick = useCallback(() => {
    onSelectNode(null);
  }, [onSelectNode]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/node-type');
      if (!type || !reactFlowInstance) return;
      const position = reactFlowInstance.project({
        x: event.clientX,
        y: event.clientY
      });
      onDropNode(type, position);
    },
    [onDropNode, reactFlowInstance]
  );

  return (
    <main className="panel panel-center">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={setNodes}
        onEdgesChange={setEdges}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      >
        <Background gap={24} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </main>
  );
};

export default NodeCanvas;
