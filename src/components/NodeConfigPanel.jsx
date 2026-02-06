import React from 'react';
import { formFieldTypes, nodeRegistry } from '../data/nodeRegistry.js';

const FieldEditor = ({ field, index, onChange, onRemove }) => {
  return (
    <div className="field-editor">
      <div className="field-row">
        <label>Type</label>
        <select
          value={field.type}
          onChange={(event) => onChange(index, { ...field, type: event.target.value })}
        >
          {formFieldTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field-row">
        <label>Name</label>
        <input
          type="text"
          value={field.name || ''}
          onChange={(event) => onChange(index, { ...field, name: event.target.value })}
          placeholder="field name"
        />
      </div>
      <div className="field-row">
        <label>Label</label>
        <input
          type="text"
          value={field.label || ''}
          onChange={(event) => onChange(index, { ...field, label: event.target.value })}
          placeholder="Field label"
        />
      </div>
      <div className="field-row">
        <label>HTML</label>
        <textarea
          rows={3}
          value={field.html || ''}
          onChange={(event) => onChange(index, { ...field, html: event.target.value })}
          placeholder="HTML content"
        />
      </div>
      <div className="field-row">
        <label>Placeholder</label>
        <input
          type="text"
          value={field.placeholder || ''}
          onChange={(event) => onChange(index, { ...field, placeholder: event.target.value })}
          placeholder="Placeholder"
        />
      </div>
      <div className="field-row checkbox">
        <label>Required</label>
        <input
          type="checkbox"
          checked={Boolean(field.required)}
          onChange={(event) => onChange(index, { ...field, required: event.target.checked })}
        />
      </div>
      <button className="link-button" type="button" onClick={() => onRemove(index)}>
        Remove field
      </button>
    </div>
  );
};

const NodeConfigPanel = ({ selectedNode, updateNode, workflow, updateWorkflow }) => {
  if (!selectedNode) {
    return (
      <aside className="panel panel-right">
        <h2>Workflow Settings</h2>
        <div className="config-section">
          <label>Name</label>
          <input
            type="text"
            value={workflow.name}
            onChange={(event) => updateWorkflow({ name: event.target.value })}
          />
        </div>
        <div className="config-section">
          <label>Version</label>
          <input
            type="text"
            value={workflow.version}
            onChange={(event) => updateWorkflow({ version: event.target.value })}
          />
        </div>
        <div className="config-section">
          <label>Type</label>
          <input
            type="text"
            value={workflow.type}
            onChange={(event) => updateWorkflow({ type: event.target.value })}
          />
        </div>
        <div className="config-section">
          <label>DVC ID</label>
          <input
            type="text"
            value={workflow.dvcId}
            onChange={(event) => updateWorkflow({ dvcId: event.target.value })}
          />
        </div>
        <div className="config-section checkbox">
          <label>poiOn</label>
          <input
            type="checkbox"
            checked={Boolean(workflow.poiOn)}
            onChange={(event) => updateWorkflow({ poiOn: event.target.checked })}
          />
        </div>
        <div className="config-section checkbox">
          <label>piiOn</label>
          <input
            type="checkbox"
            checked={Boolean(workflow.piiOn)}
            onChange={(event) => updateWorkflow({ piiOn: event.target.checked })}
          />
        </div>
      </aside>
    );
  }

  const registry = nodeRegistry[selectedNode.data.type];
  const config = selectedNode.data.config ?? {};
  const allowedKeys = new Set([...(registry?.requiredFields ?? []), ...(registry?.optionalFields ?? [])]);

  const updateConfig = (patch) => {
    updateNode({
      ...selectedNode,
      data: {
        ...selectedNode.data,
        config: { ...config, ...patch }
      }
    });
  };

  const updateField = (index, value) => {
    const nextFields = [...(config.fields ?? [])];
    nextFields[index] = value;
    updateConfig({ fields: nextFields });
  };

  const addField = () => {
    const nextFields = [...(config.fields ?? [])];
    nextFields.push({ type: 'text', name: '', label: '' });
    updateConfig({ fields: nextFields });
  };

  const removeField = (index) => {
    const nextFields = [...(config.fields ?? [])].filter((_, idx) => idx !== index);
    updateConfig({ fields: nextFields });
  };

  return (
    <aside className="panel panel-right">
      <h2>Node Configuration</h2>
      <div className="config-section">
        <label>Display Name</label>
        <input
          type="text"
          value={selectedNode.data.name || ''}
          onChange={(event) =>
            updateNode({
              ...selectedNode,
              data: { ...selectedNode.data, name: event.target.value }
            })
          }
        />
      </div>
      <div className="config-section">
        <label>Type</label>
        <input type="text" value={selectedNode.data.type} disabled />
      </div>

      {selectedNode.data.type === 'js' && (
        <div className="config-section">
          <label>JS Code</label>
          <textarea
            rows={8}
            value={config?.config?.js_code ?? config.js_code ?? ''}
            onChange={(event) => updateConfig({ config: { js_code: event.target.value } })}
            placeholder="Enter JavaScript code"
          />
        </div>
      )}

      {selectedNode.data.type !== 'js' && allowedKeys.has('fields') && (
        <div className="config-section">
          <div className="section-header">
            <h3>Fields</h3>
            <button className="secondary-button" type="button" onClick={addField}>
              Add Field
            </button>
          </div>
          {(config.fields ?? []).map((field, index) => (
            <FieldEditor
              key={`${field.type}-${index}`}
              field={field}
              index={index}
              onChange={updateField}
              onRemove={removeField}
            />
          ))}
        </div>
      )}

      {['render_style', 'authtype', 'purpose', 'scopes'].filter((key) => allowedKeys.has(key)).map((key) => (
        <div className="config-section" key={key}>
          <label>{key}</label>
          <input
            type="text"
            value={config[key] || ''}
            onChange={(event) => updateConfig({ [key]: event.target.value })}
          />
        </div>
      ))}

      {['check_resolution', 'is_terminal_node', 'return_summary'].filter((key) => allowedKeys.has(key)).map((key) => (
        <div className="config-section checkbox" key={key}>
          <label>{key}</label>
          <input
            type="checkbox"
            checked={Boolean(config[key])}
            onChange={(event) => updateConfig({ [key]: event.target.checked })}
          />
        </div>
      ))}

      {['min_resolution_height', 'min_resolution_width'].filter((key) => allowedKeys.has(key)).map((key) => (
        <div className="config-section" key={key}>
          <label>{key}</label>
          <input
            type="number"
            value={config[key] || ''}
            onChange={(event) => updateConfig({ [key]: Number(event.target.value) })}
          />
        </div>
      ))}

      {['on_next_button_label', 'on_back_button_label'].filter((key) => allowedKeys.has(key)).map((key) => (
        <div className="config-section" key={key}>
          <label>{key}</label>
          <input
            type="text"
            value={config[key] || ''}
            onChange={(event) => updateConfig({ [key]: event.target.value })}
          />
        </div>
      ))}
    </aside>
  );
};

export default NodeConfigPanel;
