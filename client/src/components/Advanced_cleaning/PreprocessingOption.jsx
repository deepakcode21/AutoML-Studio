import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';

export default function PreprocessingOption({ columns = [], onChange }) {
  const [selectedOptions, setSelectedOptions] = useState({
    // Missing data handling
    impute_missing: false,
    imputation_method: 'knn',
    imputation_n_neighbors: 5,
    
    // Outlier handling
    remove_outliers: false,
    outlier_method: 'iqr',
    outlier_threshold: 1.5,
    
    // Feature scaling
    feature_scaling: false,
    scaling_method: 'standard',
    
    // Encoding
    encode_categorical: false,
    encoding_method: 'onehot',
    
    // Feature engineering
    feature_engineering: false,
    create_interactions: false,
    polynomial_features: false,
    polynomial_degree: 2,
    
    // Text processing
    text_processing: false,
    remove_stopwords: false,
    lemmatize: false,
    text_vectorization: 'tfidf',
    
    // Dimensionality reduction
    dimensionality_reduction: false,
    reduction_method: 'pca',
    n_components: 10,
    
    // Class imbalance
    handle_imbalance: false,
    imbalance_method: 'smote',
    
    // Column selections
    numeric_columns: [],
    categorical_columns: [],
    text_columns: [],
    target_column: '',
    datetime_columns: []
  });

  // Update parent when options change
  useEffect(() => {
    onChange(selectedOptions);
  }, [selectedOptions, onChange]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedOptions(prev => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setSelectedOptions(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleColumnSelection = (e) => {
    const { name, options } = e.target;
    const selected = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setSelectedOptions(prev => ({ ...prev, [name]: selected }));
  };

  // Toggle for better UX
  const toggleOption = (name) => {
    setSelectedOptions(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="space-y-6 mb-6 p-6 border rounded-lg bg-white shadow-sm">
      <h3 className="text-xl font-bold text-gray-900">Advanced Data Preprocessing</h3>
      <p className="text-sm text-gray-500">Select preprocessing options to apply to your dataset</p>
      
      <div className="space-y-8">
        {/* Missing Data Handling */}
        <div className="border-b pb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Missing Data Handling</h4>
            <Switch
              checked={selectedOptions.impute_missing}
              onChange={() => toggleOption('impute_missing')}
              className={`${selectedOptions.impute_missing ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable missing data imputation</span>
              <span
                className={`${selectedOptions.impute_missing ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
          
          {selectedOptions.impute_missing && (
            <div className="ml-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imputation Method</label>
                <select
                  name="imputation_method"
                  value={selectedOptions.imputation_method}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="knn">KNN Imputation</option>
                  <option value="iterative">Iterative Imputer</option>
                  <option value="mean">Mean</option>
                  <option value="median">Median</option>
                  <option value="most_frequent">Most Frequent</option>
                </select>
              </div>
              
              {selectedOptions.imputation_method === 'knn' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Neighbors</label>
                  <input
                    type="number"
                    name="imputation_n_neighbors"
                    min="1"
                    max="20"
                    value={selectedOptions.imputation_n_neighbors}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Outlier Handling */}
        <div className="border-b pb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Outlier Detection & Treatment</h4>
            <Switch
              checked={selectedOptions.remove_outliers}
              onChange={() => toggleOption('remove_outliers')}
              className={`${selectedOptions.remove_outliers ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable outlier handling</span>
              <span
                className={`${selectedOptions.remove_outliers ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
          
          {selectedOptions.remove_outliers && (
            <div className="ml-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detection Method</label>
                <select
                  name="outlier_method"
                  value={selectedOptions.outlier_method}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="iqr">IQR (1.5x)</option>
                  <option value="zscore">Z-Score (3σ)</option>
                  <option value="isolation">Isolation Forest</option>
                  <option value="dbscan">DBSCAN</option>
                </select>
              </div>
              
              {selectedOptions.outlier_method === 'iqr' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IQR Threshold</label>
                  <input
                    type="number"
                    name="outlier_threshold"
                    step="0.1"
                    min="1"
                    max="3"
                    value={selectedOptions.outlier_threshold}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Feature Scaling */}
        <div className="border-b pb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Feature Scaling</h4>
            <Switch
              checked={selectedOptions.feature_scaling}
              onChange={() => toggleOption('feature_scaling')}
              className={`${selectedOptions.feature_scaling ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable feature scaling</span>
              <span
                className={`${selectedOptions.feature_scaling ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
          
          {selectedOptions.feature_scaling && (
            <div className="ml-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scaling Method</label>
                <select
                  name="scaling_method"
                  value={selectedOptions.scaling_method}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="standard">Standard (Z-score)</option>
                  <option value="minmax">Min-Max (0-1)</option>
                  <option value="robust">Robust (with outliers)</option>
                  <option value="power">Power (Yeo-Johnson)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Categorical Encoding */}
        <div className="border-b pb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Categorical Encoding</h4>
            <Switch
              checked={selectedOptions.encode_categorical}
              onChange={() => toggleOption('encode_categorical')}
              className={`${selectedOptions.encode_categorical ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable categorical encoding</span>
              <span
                className={`${selectedOptions.encode_categorical ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
          
          {selectedOptions.encode_categorical && (
            <div className="ml-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Encoding Method</label>
                <select
                  name="encoding_method"
                  value={selectedOptions.encoding_method}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="onehot">One-Hot</option>
                  <option value="target">Target Encoding</option>
                  <option value="frequency">Frequency Encoding</option>
                  <option value="leaveoneout">Leave-One-Out</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Feature Engineering */}
        <div className="border-b pb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Feature Engineering</h4>
            <Switch
              checked={selectedOptions.feature_engineering}
              onChange={() => toggleOption('feature_engineering')}
              className={`${selectedOptions.feature_engineering ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable feature engineering</span>
              <span
                className={`${selectedOptions.feature_engineering ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
          
          {selectedOptions.feature_engineering && (
            <div className="ml-8 space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="create_interactions"
                    name="create_interactions"
                    type="checkbox"
                    checked={selectedOptions.create_interactions}
                    onChange={handleCheckboxChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="create_interactions" className="font-medium text-gray-700">
                    Create interaction features
                  </label>
                  <p className="text-gray-500">Multiply numeric features to capture interactions</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="polynomial_features"
                    name="polynomial_features"
                    type="checkbox"
                    checked={selectedOptions.polynomial_features}
                    onChange={handleCheckboxChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="polynomial_features" className="font-medium text-gray-700">
                    Add polynomial features
                  </label>
                  <p className="text-gray-500">Create polynomial combinations of numeric features</p>
                  {selectedOptions.polynomial_features && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Polynomial Degree</label>
                      <input
                        type="number"
                        name="polynomial_degree"
                        min="2"
                        max="5"
                        value={selectedOptions.polynomial_degree}
                        onChange={handleInputChange}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Text Processing */}
        <div className="border-b pb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Text Processing</h4>
            <Switch
              checked={selectedOptions.text_processing}
              onChange={() => toggleOption('text_processing')}
              className={`${selectedOptions.text_processing ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable text processing</span>
              <span
                className={`${selectedOptions.text_processing ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
          
          {selectedOptions.text_processing && (
            <div className="ml-8 space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remove_stopwords"
                    name="remove_stopwords"
                    type="checkbox"
                    checked={selectedOptions.remove_stopwords}
                    onChange={handleCheckboxChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="remove_stopwords" className="font-medium text-gray-700">
                    Remove stop words
                  </label>
                  <p className="text-gray-500">Remove common words (the, and, etc.)</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="lemmatize"
                    name="lemmatize"
                    type="checkbox"
                    checked={selectedOptions.lemmatize}
                    onChange={handleCheckboxChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="lemmatize" className="font-medium text-gray-700">
                    Lemmatize words
                  </label>
                  <p className="text-gray-500">Reduce words to their base/dictionary form</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text Vectorization</label>
                <select
                  name="text_vectorization"
                  value={selectedOptions.text_vectorization}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="tfidf">TF-IDF</option>
                  <option value="count">Count Vectorizer</option>
                  <option value="embedding">Word Embeddings</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Dimensionality Reduction */}
        <div className="border-b pb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Dimensionality Reduction</h4>
            <Switch
              checked={selectedOptions.dimensionality_reduction}
              onChange={() => toggleOption('dimensionality_reduction')}
              className={`${selectedOptions.dimensionality_reduction ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable dimensionality reduction</span>
              <span
                className={`${selectedOptions.dimensionality_reduction ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
          
          {selectedOptions.dimensionality_reduction && (
            <div className="ml-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reduction Method</label>
                <select
                  name="reduction_method"
                  value={selectedOptions.reduction_method}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="pca">PCA</option>
                  <option value="tsne">t-SNE</option>
                  <option value="umap">UMAP</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Components</label>
                <input
                  type="number"
                  name="n_components"
                  min="1"
                  max="50"
                  value={selectedOptions.n_components}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                />
              </div>
            </div>
          )}
        </div>

        {/* Class Imbalance */}
        <div className="border-b pb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Class Imbalance Handling</h4>
            <Switch
              checked={selectedOptions.handle_imbalance}
              onChange={() => toggleOption('handle_imbalance')}
              className={`${selectedOptions.handle_imbalance ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable class imbalance handling</span>
              <span
                className={`${selectedOptions.handle_imbalance ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
          
          {selectedOptions.handle_imbalance && (
            <div className="ml-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imbalance Method</label>
                <select
                  name="imbalance_method"
                  value={selectedOptions.imbalance_method}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="smote">SMOTE</option>
                  <option value="adasyn">ADASYN</option>
                  <option value="class_weight">Class Weights</option>
                  <option value="undersample">Undersampling</option>
                  <option value="oversample">Oversampling</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Column Selection */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Column Selection</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numeric Columns</label>
              <select
                multiple
                name="numeric_columns"
                onChange={handleColumnSelection}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md h-auto"
                size="5"
              >
                {columns.filter(col => col.type === 'number').map(col => (
                  <option key={col.name} value={col.name}>{col.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categorical Columns</label>
              <select
                multiple
                name="categorical_columns"
                onChange={handleColumnSelection}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md h-auto"
                size="5"
              >
                {columns.filter(col => col.type === 'string' && !col.isText).map(col => (
                  <option key={col.name} value={col.name}>{col.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text Columns</label>
              <select
                multiple
                name="text_columns"
                onChange={handleColumnSelection}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md h-auto"
                size="5"
              >
                {columns.filter(col => col.isText).map(col => (
                  <option key={col.name} value={col.name}>{col.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Datetime Columns</label>
              <select
                multiple
                name="datetime_columns"
                onChange={handleColumnSelection}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md h-auto"
                size="3"
              >
                {columns.filter(col => col.type === 'datetime').map(col => (
                  <option key={col.name} value={col.name}>{col.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Column</label>
              <select
                name="target_column"
                value={selectedOptions.target_column}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Select target column</option>
                {columns.map(col => (
                  <option key={col.name} value={col.name}>{col.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}