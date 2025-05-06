import React, { useEffect, useState } from 'react';

function Result({ csv, model, scaler, splitRatio, missing, encoding }) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // Debug props
  console.log('Props in Result:', { csv, model, scaler, splitRatio, missing, encoding });

  useEffect(() => {
    const sendRequest = async () => {
      if (!csv) {
        console.warn("No CSV file provided.");
        return;
      }

      const formData = new FormData();
      formData.append('file', csv);
      formData.append('missing', missing);
      formData.append('encoding', encoding);
      formData.append('scaler', scaler);

      try {
        const res = await fetch('http://localhost:8000/preprocess', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        console.log('Backend response:', data);
        setResponse(data);
      } catch (err) {
        console.error('API request failed:', err);
        setError(err.message);
      }
    };

    sendRequest();
  }, [csv, model, scaler, splitRatio, missing, encoding]);

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Result Component</h3>

      <p><strong>Model:</strong> {model}</p>
      <p><strong>Scaler:</strong> {scaler}</p>
      <p><strong>Split Ratio:</strong> {splitRatio}</p>
      <p><strong>Missing Strategy:</strong> {missing}</p>
      <p><strong>Encoding:</strong> {encoding}</p>
      <p><strong>CSV File:</strong> {csv ? csv.name : 'No file selected'}</p>

      <hr />

      {response && (
        <div>
          <h4>Response from Backend:</h4>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div style={{ color: 'red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

export default Result;
