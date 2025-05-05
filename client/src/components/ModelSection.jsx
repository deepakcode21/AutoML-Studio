import React from 'react';

const ModelSelection = ({ model, setModel }) => (
  <div>
    <h3>Select Model</h3>
    <select value={model} onChange={e => setModel(e.target.value)}>
      <option value="LinearRegression">Linear Regression</option>
      <option value="DecisionTree">Decision Tree</option>
      <option value="RandomForest">Random Forest</option>
    </select>
  </div>
);

export default ModelSelection;
