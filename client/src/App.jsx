import React, { useState } from 'react';
import Papa from 'papaparse';
import FileUpload from './components/fileUpload';
import DataPreview from './components/dataPreview';
import PreprocessingOptions from './components/preprocessingOption';
import ModelSelector from './components/ModelSection';
import ResultsDisplay from './components/ResultDisplay';
import './App.css';

function App() {
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
            setColumns(results.meta.fields || []);
            setPreviewData(results.data.slice(0, 5));
          },
        });
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async () => {
    if (!csvFile) return;
    setLoading(true);
    setError('');
    setResults(null);

    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('missing', missingStrategy);
    formData.append('encoding', encodingStrategy);
    formData.append('scaler', scaler);
    formData.append('split', splitRatio);
    formData.append('model', model);

    try {
      const res = await fetch('http://localhost:8000/train', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`Server error: ${res.statusText}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container' style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>AutoML Interface</h2>

      <FileUpload
        setCsvFile={setCsvFile}
        setPreviewData={setPreviewData}
        setColumns={setColumns}
      />
      <DataPreview data={previewData} columns={columns} />

      {previewData.length > 0 && (
        <PreprocessingOptions
          missingStrategy={missingStrategy}
          setMissingStrategy={setMissingStrategy}
          encodingStrategy={encodingStrategy}
          setEncodingStrategy={setEncodingStrategy}
          scaler={scaler}
          setScaler={setScaler}
          splitRatio={splitRatio}
          setSplitRatio={setSplitRatio}
        />
      )}


      <ModelSelector model={model} setModel={setModel} />

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSubmit} disabled={!csvFile || loading}>
          {loading ? 'Processing...' : 'Run AutoML'}
        </button>
      </div>

      {error && <div style={{ marginTop: '10px', color: 'red' }}><strong>Error:</strong> {error}</div>}
      <ResultsDisplay results={results} />
    </div>
  );
}

export default App;
