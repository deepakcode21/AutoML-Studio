import React from 'react';
import { FiCpu } from 'react-icons/fi';

const ModelSelection = ({ model, setModel }) => (
  <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
    <div className="flex items-center mb-4">
      <div className="bg-blue-100 p-2 rounded-lg mr-3">
        <FiCpu className="text-blue-600" size={20} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800">Model Selection</h3>
    </div>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Machine Learning Model</label>
        <select 
          value={model} 
          onChange={e => setModel(e.target.value)} 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        >
          <option value="LinearRegression">Linear Regression</option>
          <option value="DecisionTree">Decision Tree</option>
          <option value="RandomForest">Random Forest</option>
        </select>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Model Information</h4>
        <p className="text-xs text-blue-700">
          {model === 'LinearRegression' && "Best for linear relationships between features and target variable."}
          {model === 'DecisionTree' && "Non-linear model that splits data based on feature thresholds."}
          {model === 'RandomForest' && "Ensemble of decision trees, robust against overfitting."}
        </p>
      </div>
    </div>
  </section>
);

export default ModelSelection;