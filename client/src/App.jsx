import React, { useState } from 'react';
import Papa from 'papaparse';
import Result from './components/ResultDisplay';
import Model from './components/ModelSection';
import Preprocess from './components/preprocessingOption';
import './App.css'; // 💡 Custom CSS

function App() {
  const [submit, OnchandleSub] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [columns, setColumns] = useState([]);

  const [missingStrategy, setMissingStrategy] = useState('drop');
  const [encodingStrategy, setEncodingStrategy] = useState('label');
  const [scaler, setScaler] = useState('standard');
  const [splitRatio, setSplitRatio] = useState('0.8');
  const [model, setModel] = useState('LinearRegression');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (evt) => {
        Papa.parse(evt.target.result, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data;
            setColumns(results.meta.fields || []);
            setPreviewData(data.slice(0, 5));
          }
        });
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = () => {
    OnchandleSub(true);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className='just'>
      <header className="app-header">
        <h1>AutoML Studio</h1>
        <p className="subtitle">Upload data, preprocess, and run ML models with one click!</p>
      </header>

      {/* File Upload Section */}
      <section className="upload-section">
        <h2>Upload CSV File</h2>
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </section>

      {/* Preview Table */}
      {previewData.length > 0 && (
        <section className="preview-section">
          <h3>Data Preview (first 5 rows)</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col}>{row[col]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Preprocessing Options */}
      <Preprocess
        missingStrategy={missingStrategy}
        setMissingStrategy={setMissingStrategy}
        encodingStrategy={encodingStrategy}
        setEncodingStrategy={setEncodingStrategy}
        scaler={scaler}
        setScaler={setScaler}
        splitRatio={splitRatio}
        setSplitRatio={setSplitRatio}
      />

      {/* Model Selection */}
      <Model model={model} setModel={setModel} />

      {/* Submit Button */}
      <div className="submit-section">
        <button onClick={handleSubmit} disabled={!csvFile || loading}>
          {loading ? 'Processing...' : 'Run AutoML'}
        </button>
      </div>
      </div>
      {/* Error Message */}
      {error && <div className="error-message"><strong>Error:</strong> {error}</div>}

      {/* Results */}
      {submit && (
        <Result
          csv={csvFile}
          model={model}
          scaler={scaler}
          splitRatio={splitRatio}
          missing={missingStrategy}
          encoding={encodingStrategy}
        />
      )}
    </div>
  );
}

export default App;
