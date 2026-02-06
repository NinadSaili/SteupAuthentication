import React from 'react';

const JsonPreview = ({ compiled }) => {
  return (
    <section className="panel panel-bottom">
      <div className="panel-bottom-header">
        <h2>JSON Preview</h2>
        <button
          className="secondary-button"
          type="button"
          onClick={() => navigator.clipboard.writeText(JSON.stringify(compiled, null, 2))}
        >
          Copy to Clipboard
        </button>
      </div>
      <pre className="json-preview">{JSON.stringify(compiled, null, 2)}</pre>
    </section>
  );
};

export default JsonPreview;
