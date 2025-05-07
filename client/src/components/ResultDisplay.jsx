import React, { useEffect, useState } from 'react';

function Result({ csv, model, scaler, splitRatio, missing, encoding }) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sendRequest = async () => {
      if (!csv) return;

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
        setResponse(data);
      } catch (err) {
        setError(err.message);
      }
    };

    sendRequest();
  }, [csv, model, scaler, splitRatio, missing, encoding]);

  if (error) return <p className="text-red-500 mt-4">Error: {error}</p>;
  if (!response) return <p className="text-gray-500 mt-4">Loading or waiting for file...</p>;

  const { metrics, visualization, prediction_plot, columns, rows } = response;

  return (
    <div className="mt-10 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-blue-700 mb-4">📊 Model Performance</h3>

      {metrics ? (
        <ul className="text-gray-800 space-y-2 mb-6">
          <li><strong>RMSE:</strong> {metrics.rmse?.toFixed(4)}</li>
          <li><strong>R²:</strong> {metrics.r2?.toFixed(4)}</li>
          <li><strong>MAE:</strong> {metrics.mae?.toFixed(4)}</li>
        </ul>
      ) : (
        <p className="text-gray-500">No performance metrics found.</p>
      )}

      <div className="flex flex-wrap justify-center gap-8 my-8">
        {visualization && (
          <div className="max-w-xl">
            <h4 className="font-semibold mb-2">🧠 Feature Importance</h4>
            <img
              src={`data:image/png;base64,${visualization}`}
              alt="Feature Importance"
              className="w-full rounded border"
            />
          </div>
        )}

        {prediction_plot && (
          <div className="max-w-xl">
            <h4 className="font-semibold mb-2">📈 Actual vs Predicted</h4>
            <img
              src={`data:image/png;base64,${prediction_plot}`}
              alt="Actual vs Predicted"
              className="w-full rounded border"
            />
          </div>
        )}
      </div>

      {columns && rows ? (
        <div className="overflow-x-auto">
          <h4 className="text-lg font-semibold mb-2">🧪 Sample Scaled Data</h4>
          <table className="min-w-full table-auto border border-collapse text-sm">
            <thead className="bg-blue-100">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="border px-3 py-1 text-left">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="odd:bg-white even:bg-blue-50">
                  {columns.map((col, j) => (
                    <td key={j} className="border px-3 py-1">
                      {isNaN(Number(row[col])) ? '-' : Number(row[col]).toFixed(3)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No scaled data available.</p>
      )}
    </div>
  );
}

export default Result;
