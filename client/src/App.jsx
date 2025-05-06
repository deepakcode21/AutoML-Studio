import React, { useState } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components (required for Chart.js v4 compatibility)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  // State for file and preview data
  const [csvFile, setCsvFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);  // Array of row objects
  const [columns, setColumns] = useState([]);         // Column headers

  // Preprocessing and model state
  const [missingStrategy, setMissingStrategy] = useState('drop');
  const [encodingStrategy, setEncodingStrategy] = useState('label');
  const [scaler, setScaler] = useState('standard');
  const [splitRatio, setSplitRatio] = useState('0.8');
  const [model, setModel] = useState('LinearRegression');

  // Submission state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  // Handle file selection and parse CSV
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target.result;
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data;
            setColumns(results.meta.fields || []);
            // Take first 5 rows for preview
            setPreviewData(data.slice(0, 5));
          }
        });
      };
      reader.readAsText(file);
    }
  };

  // Handle form submission: send file and options to backend
  const handleSubmit = async () => {
    if (!csvFile) return;
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('missing', missingStrategy);
    formData.append('encoding', encodingStrategy);
    formData.append('scaler', scaler);
    formData.append('split', splitRatio);
    formData.append('model', model);
    try {
      // Send to FastAPI backend (assumed endpoint /train)
      const res = await fetch('http://localhost:8000/train', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`);
      }
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Upload CSV File</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />

      {/* Preview Table */}
      {previewData.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Data Preview (first 5 rows)</h3>
          <table style={{ borderCollapse: 'collapse', width: '100%' }} border="1">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col} style={{ padding: '8px' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td key={col} style={{ padding: '8px' }}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Preprocessing Options */}
      <div style={{ marginTop: '20px' }}>
        <h3>Preprocessing Options</h3>
        <div>
          <label>
            Missing Values:&nbsp;
            <select value={missingStrategy} onChange={(e) => setMissingStrategy(e.target.value)}>
              <option value="drop">Drop Rows</option>
              <option value="mean">Fill with Mean</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Categorical Encoding:&nbsp;
            <select value={encodingStrategy} onChange={(e) => setEncodingStrategy(e.target.value)}>
              <option value="label">Label Encoding</option>
              <option value="onehot">One-Hot Encoding</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Numeric Scaling:&nbsp;
            <select value={scaler} onChange={(e) => setScaler(e.target.value)}>
              <option value="standard">StandardScaler</option>
              <option value="minmax">MinMaxScaler</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Train/Test Split:&nbsp;
            <select value={splitRatio} onChange={(e) => setSplitRatio(e.target.value)}>
              <option value="0.8">80 / 20</option>
              <option value="0.7">70 / 30</option>
            </select>
          </label>
        </div>
      </div>

      {/* Model Selection */}
      <div style={{ marginTop: '20px' }}>
        <h3>Select Model</h3>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="LinearRegression">Linear Regression</option>
          <option value="DecisionTree">Decision Tree</option>
          <option value="RandomForest">Random Forest</option>
        </select>
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSubmit} disabled={!csvFile || loading}>
          {loading ? 'Processing...' : 'Run AutoML'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ marginTop: '10px', color: 'red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results Section */}
      {results && (
        <div style={{ marginTop: '30px' }}>
          <h3>Model Performance</h3>
          {/* Display metrics if they exist */}
          {results.accuracy !== undefined && <p>Accuracy: {results.accuracy}</p>}
          {results.r2 !== undefined && <p>R²: {results.r2}</p>}
          {results.rmse !== undefined && <p>RMSE: {results.rmse}</p>}

          {/* Confusion Matrix */}
          {results.confusion_matrix && (
            <div style={{ marginTop: '20px' }}>
              <h3>Confusion Matrix</h3>
              <table style={{ borderCollapse: 'collapse' }} border="1">
                <tbody>
                  {results.confusion_matrix.map((row, i) => (
                    <tr key={i}>
                      {row.map((val, j) => (
                        <td key={j} style={{ padding: '8px' }}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Feature Importance Chart */}
          {results.feature_importances && (
            <div style={{ marginTop: '20px' }}>
              <h3>Feature Importance</h3>
              <Bar
                data={{
                  labels: Object.keys(results.feature_importances),
                  datasets: [{
                    label: 'Importance',
                    data: Object.values(results.feature_importances),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  }]
                }}
                options={{ responsive: true, plugins: { legend: { display: false } } }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
