import { nodeRegistry } from '../data/nodeRegistry.js';

const allowedNavigationKeys = new Set([
  'on_next',
  'on_back',
  'on_success',
  'on_fail',
  'on_error',
  'on_check_resolution_fail'
]);

const extractNavigation = (node, edges) => {
  const nav = {};
  edges
    .filter((edge) => edge.source === node.id)
    .forEach((edge) => {
      const key = edge.sourceHandle;
      if (allowedNavigationKeys.has(key)) {
        nav[key] = edge.target;
      }
    });
  return nav;
};

export const compileWorkflow = ({ workflow, nodes, edges }) => {
  const compiledNodes = nodes.map((node) => {
    const registry = nodeRegistry[node.data.type];
    const base = {
      type: node.data.type,
      id: node.data.id
    };

    const nodeData = node.data.config ?? {};
    const navigation = extractNavigation(node, edges);
    const combined = {
      ...base,
      ...nodeData,
      ...navigation
    };

    if (registry?.optionalFields?.includes('name') && node.data.name) {
      combined.name = node.data.name;
    }

    return combined;
  });

  const data = {
    version: workflow.version,
    name: workflow.name,
    nodes: compiledNodes
  };

  if (workflow.type) data.type = workflow.type;
  if (workflow.dvcId) data.dvcId = workflow.dvcId;
  if (workflow.poiOn !== null) data.poiOn = workflow.poiOn;
  if (workflow.piiOn !== null) data.piiOn = workflow.piiOn;
  if (workflow.styleSheet) data.styleSheet = workflow.styleSheet;
  if (workflow.header) data.header = workflow.header;
  if (workflow.footer) data.footer = workflow.footer;
  if (workflow.canvasData) data.canvasData = workflow.canvasData;
  if (workflow.isPublished !== null) data.isPublished = workflow.isPublished;
  if (workflow.tenantId) data.tenantId = workflow.tenantId;

  return { data };
};
