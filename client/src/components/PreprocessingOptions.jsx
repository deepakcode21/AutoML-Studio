import React from 'react';
import { FiSettings, FiHelpCircle } from 'react-icons/fi';

const PreprocessingOptions = ({
  missingStrategy = 'drop', 
  setMissingStrategy,
  encodingStrategy = 'label', 
  setEncodingStrategy,
  scaler = 'standard', 
  setScaler,
  splitRatio = '0.8', 
  setSplitRatio
}) => (
  <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
    <div className="flex items-center mb-4">
      <div className="bg-purple-100 p-2 rounded-lg mr-3">
        <FiSettings className="text-purple-600" size={20} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800">Data Preprocessing</h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Missing Values */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          Missing Values
          <span className="ml-1 text-gray-400" title="How to handle missing data">
            <FiHelpCircle size={16} />
          </span>
        </label>
        <select 
          value={missingStrategy} 
          onChange={e => setMissingStrategy(e.target.value)} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="drop">Drop Rows</option>
          <option value="mean">Fill with Mean</option>
          {/* Removed 'median' and 'mode' to match original backend */}
        </select>
      </div>

      {/* Categorical Encoding */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          Categorical Encoding
          <span className="ml-1 text-gray-400" title="How to encode categorical variables">
            <FiHelpCircle size={16} />
          </span>
        </label>
        <select 
          value={encodingStrategy} 
          onChange={e => setEncodingStrategy(e.target.value)} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="label">Label Encoding</option>
          <option value="onehot">One-Hot Encoding</option>
          {/* Removed 'ordinal' to match original backend */}
        </select>
      </div>

      {/* Feature Scaling */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          Feature Scaling
          <span className="ml-1 text-gray-400" title="How to scale numerical features">
            <FiHelpCircle size={16} />
          </span>
        </label>
        <select 
          value={scaler} 
          onChange={e => setScaler(e.target.value)} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="standard">Standard Scaler</option>
          <option value="minmax">MinMax Scaler</option>
          {/* Removed 'robust' to match original backend */}
        </select>
      </div>

      {/* Train/Test Split */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          Train/Test Split
          <span className="ml-1 text-gray-400" title="Ratio for splitting data into training and test sets">
            <FiHelpCircle size={16} />
          </span>
        </label>
        <select 
          value={splitRatio} 
          onChange={e => setSplitRatio(e.target.value)} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="0.8">80% Train / 20% Test</option>
          <option value="0.7">70% Train / 30% Test</option>
          {/* Removed '0.75' to match original backend */}
        </select>
      </div>
    </div>
  </section>
);

export default PreprocessingOptions;