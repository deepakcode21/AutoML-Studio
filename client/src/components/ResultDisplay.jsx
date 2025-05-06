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
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Model Performance</h3>

      {metrics ? (
        <ul>
          <li><strong>RMSE:</strong> {metrics.rmse?.toFixed(4)}</li>
          <li><strong>R²:</strong> {metrics.r2?.toFixed(4)}</li>
          <li><strong>MAE:</strong> {metrics.mae?.toFixed(4)}</li>
        </ul>
      ) : (
        <p>No performance metrics found.</p>
      )}

      {/* Feature Importance */}
      {visualization && (
        <div>
          <h4>Feature Importance</h4>
          <img
            src={`data:image/png;base64,${visualization}`}
            alt="Feature Importance"
            style={{ maxWidth: '100%' }}
          />
        </div>
      )}

      {/* Actual vs Predicted */}
      {prediction_plot && (
        <div>
          <h4>Actual vs Predicted</h4>
          <img
            src={`data:image/png;base64,${prediction_plot}`}
            alt="Actual vs Predicted"
            style={{ maxWidth: '100%', marginTop: '1rem' }}
          />
        </div>
      )}

      {/* Scaled Table */}
      {columns && rows ? (
        <div>
          <h4>Sample Scaled Data</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {columns.map((col, j) => (
                    <td key={j}>
                      {isNaN(Number(row[col])) ? '-' : Number(row[col]).toFixed(3)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No scaled data available.</p>
      )}
    </div>
  );
}

export default Result;
