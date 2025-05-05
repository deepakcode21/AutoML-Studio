import React from 'react';

const PreprocessingOptions = ({
  missingStrategy, setMissingStrategy,
  encodingStrategy, setEncodingStrategy,
  scaler, setScaler,
  splitRatio, setSplitRatio
}) => (
  <div>
    <h3>Preprocessing Options</h3>
    <div>
      <label>Missing Values:
        <select value={missingStrategy} onChange={e => setMissingStrategy(e.target.value)}>
          <option value="drop">Drop Rows</option>
          <option value="mean">Fill with Mean</option>
        </select>
      </label>
    </div>
    <div>
      <label>Encoding:
        <select value={encodingStrategy} onChange={e => setEncodingStrategy(e.target.value)}>
          <option value="label">Label</option>
          <option value="onehot">One-Hot</option>
        </select>
      </label>
    </div>
    <div>
      <label>Scaler:
        <select value={scaler} onChange={e => setScaler(e.target.value)}>
          <option value="standard">StandardScaler</option>
          <option value="minmax">MinMaxScaler</option>
        </select>
      </label>
    </div>
    <div>
      <label>Split Ratio:
        <select value={splitRatio} onChange={e => setSplitRatio(e.target.value)}>
          <option value="0.8">80/20</option>
          <option value="0.7">70/30</option>
        </select>
      </label>
    </div>
  </div>
);

export default PreprocessingOptions;
