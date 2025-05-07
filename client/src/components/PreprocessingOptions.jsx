import React from 'react';

const PreprocessingOptions = ({
  missingStrategy, setMissingStrategy,
  encodingStrategy, setEncodingStrategy,
  scaler, setScaler,
  splitRatio, setSplitRatio
}) => (
  <section className="bg-white p-6 rounded-lg shadow mb-6">
    <h3 className="text-xl font-semibold mb-4 text-blue-700">Preprocessing Options</h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Missing Values</label>
        <select value={missingStrategy} onChange={e => setMissingStrategy(e.target.value)} className="w-full border rounded px-2 py-1">
          <option value="drop">Drop Rows</option>
          <option value="mean">Fill with Mean</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Encoding</label>
        <select value={encodingStrategy} onChange={e => setEncodingStrategy(e.target.value)} className="w-full border rounded px-2 py-1">
          <option value="label">Label Encoding</option>
          <option value="onehot">One-Hot Encoding</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Scaler</label>
        <select value={scaler} onChange={e => setScaler(e.target.value)} className="w-full border rounded px-2 py-1">
          <option value="standard">StandardScaler</option>
          <option value="minmax">MinMaxScaler</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Train/Test Split</label>
        <select value={splitRatio} onChange={e => setSplitRatio(e.target.value)} className="w-full border rounded px-2 py-1">
          <option value="0.8">80 / 20</option>
          <option value="0.7">70 / 30</option>
        </select>
      </div>
    </div>
  </section>
);

export default PreprocessingOptions;
