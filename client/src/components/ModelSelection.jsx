import React from 'react';

const ModelSelection = ({ model, setModel }) => (
  <section className="bg-white p-6 rounded-lg shadow mb-6">
    <h3 className="text-xl font-semibold mb-4 text-blue-700">Model Selection</h3>
    <div>
      <label className="block text-sm font-medium mb-1">Choose Model</label>
      <select value={model} onChange={e => setModel(e.target.value)} className="w-full border rounded px-2 py-1">
        <option value="LinearRegression">Linear Regression</option>
        <option value="DecisionTree">Decision Tree</option>
        <option value="RandomForest">Random Forest</option>
      </select>
    </div>
  </section>
);

export default ModelSelection;
