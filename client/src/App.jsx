import React, { useState } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import Result from './components/ResultDisplay';
import Model from './components/ModelSection';
import Preprocess from './components/preprocessingOption';
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
  const [submit, OnchandleSub] = useState(false);
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
  const handleSubmit = () => {
    OnchandleSub(true);
  }

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
      {
        submit && (
          <Result
            csv={csvFile}
            model={model}
            scaler={scaler}
            splitRatio={splitRatio}
            missing={missingStrategy}
            encoding={encodingStrategy}
          />
        )
      }
    </div>
  );
}

export default App;