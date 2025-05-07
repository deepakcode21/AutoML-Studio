import React from 'react';

const ModelSelection = ({ model, setModel }) => (
  <section className="model-selection">
    <h3 className="model-title">Model Selection</h3>
    <div className="form-group">
      <label htmlFor="model">Choose Model</label>
      <select id="model" value={model} onChange={e => setModel(e.target.value)}>
        <option value="LinearRegression">Linear Regression</option>
        <option value="DecisionTree">Decision Tree</option>
        <option value="RandomForest">Random Forest</option>
      </select>
    </div>
  </section>
);

export default ModelSelection;
