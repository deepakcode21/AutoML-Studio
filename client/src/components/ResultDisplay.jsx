import React, { useEffect, useState } from 'react';

function Result({ csv, model, scaler, splitRatio, missing, encoding }) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  console.log('Props in response:', { csv, model, scaler, splitRatio, missing, encoding });

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
      formData.append('model', model);
      formData.append('splitRatio', splitRatio);

      try {
        const res = await fetch('http://localhost:8000/train', {
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

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!response) {
    return <p>Loading or waiting for file...</p>;
  }

  const { metrics, visualization, prediction_plot, columns, rows } = response;

  return (
    <div style={{
      padding: '1.5rem',
      border: '1px solid #ddd',
      borderRadius: '12px',
      backgroundColor: '#fafafa',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h3 style={{ marginBottom: '1rem' }}>📊 Model Performance</h3>
  
      {metrics ? (
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>RMSE:</strong> {metrics.rmse?.toFixed(4)}</li>
          <li><strong>R²:</strong> {metrics.r2?.toFixed(4)}</li>
          <li><strong>MAE:</strong> {metrics.mae?.toFixed(4)}</li>
        </ul>
      ) : (
        <p style={{ color: '#999' }}>No performance metrics found.</p>
      )}
  
  <div style={{
  display: 'flex',
  gap: '2rem',
  marginTop: '2rem',
  flexWrap: 'wrap',
  justifyContent: 'center'
}}>
  {/* Feature Importance */}
  {visualization && (
    <div style={{ flex: '1 1 400px', maxWidth: '600px' }}>
      <h4 style={{ marginBottom: '0.5rem' }}>🧠 Feature Importance</h4>
      <img
        src={`data:image/png;base64,${visualization}`}
        alt="Feature Importance"
        style={{ width: '100%', borderRadius: '6px', border: '1px solid #ddd' }}
      />
    </div>
  )}

  {/* Actual vs Predicted */}
  {prediction_plot && (
    <div style={{ flex: '1 1 400px', maxWidth: '600px' }}>
      <h4 style={{ marginBottom: '0.5rem' }}>📈 Actual vs Predicted</h4>
      <img
        src={`data:image/png;base64,${prediction_plot}`}
        alt="Actual vs Predicted"
        style={{ width: '100%', borderRadius: '6px', border: '1px solid #ddd' }}
      />
    </div>
  )}
</div>

  
      {/* Scaled Table */}
      {columns && rows ? (
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>🧪 Sample Scaled Data</h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              borderCollapse: 'collapse',
              width: '100%',
              textAlign: 'left'
            }}>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col} style={{
                      borderBottom: '2px solid #ccc',
                      padding: '8px',
                      background: '#f0f0f0'
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    {columns.map((col, j) => (
                      <td key={j} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                        {isNaN(Number(row[col])) ? '-' : Number(row[col]).toFixed(3)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p style={{ color: '#999' }}>No scaled data available.</p>
      )}
    </div>
  );
  
}

export default Result;
