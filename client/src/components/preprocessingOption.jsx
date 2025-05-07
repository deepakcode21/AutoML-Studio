import React from 'react';

const PreprocessingOptions = ({
  missingStrategy, setMissingStrategy,
  encodingStrategy, setEncodingStrategy,
  scaler, setScaler,
  splitRatio, setSplitRatio
}) => (
  <section className="preprocess-container">
    <h3 className="preprocess-title">Preprocessing Options</h3>

    <div className="preprocess-grid">
      <div className="form-group">
        <label htmlFor="missing">Missing Values</label>
        <select id="missing" value={missingStrategy} onChange={e => setMissingStrategy(e.target.value)}>
          <option value="drop">Drop Rows</option>
          <option value="mean">Fill with Mean</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="encoding">Encoding</label>
        <select id="encoding" value={encodingStrategy} onChange={e => setEncodingStrategy(e.target.value)}>
          <option value="label">Label Encoding</option>
          <option value="onehot">One-Hot Encoding</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="scaler">Scaler</label>
        <select id="scaler" value={scaler} onChange={e => setScaler(e.target.value)}>
          <option value="standard">StandardScaler</option>
          <option value="minmax">MinMaxScaler</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="split">Train/Test Split</label>
        <select id="split" value={splitRatio} onChange={e => setSplitRatio(e.target.value)}>
          <option value="0.8">80 / 20</option>
          <option value="0.7">70 / 30</option>
        </select>
      </div>
    </div>
  </section>
);

export default PreprocessingOptions;
