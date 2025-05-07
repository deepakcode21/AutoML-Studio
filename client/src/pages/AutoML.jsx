import React, { useState } from 'react';
import Papa from 'papaparse';
import Result from '../components/ResultDisplay';
import Model from '../components/ModelSelection'
import Preprocess from '../components/PreprocessingOptions';


function AutoML() {
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
    <div className="app-container px-6 py-8 max-w-6xl mx-auto">
      <header className="app-header text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">AutoML Studio</h1>
        <p className="text-gray-600">Upload data, preprocess, and run ML models with one click!</p>
      </header>

      {/* File Upload */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Upload CSV File</h2>
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </section>

      {/* Preview Table */}
      {previewData.length > 0 && (
        <section className="preview-section mb-6">
          <h3 className="text-md font-semibold mb-2">Data Preview (first 5 rows)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="border px-3 py-1">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col} className="border px-3 py-1">{row[col]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Preprocessing + Model */}
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
      <Model model={model} setModel={setModel} />

      {/* Submit */}
      <div className="submit-section text-center mt-6">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
          onClick={handleSubmit}
          disabled={!csvFile || loading}
        >
          {loading ? 'Processing...' : 'Run AutoML'}
        </button>
      </div>

      {/* Error */}
      {error && <div className="text-red-500 mt-4"><strong>Error:</strong> {error}</div>}

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

export default AutoML;
