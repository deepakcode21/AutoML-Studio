import React, { useEffect, useState } from 'react';
import { FiBarChart2, FiTrendingUp, FiCheck, FiAlertTriangle, FiDownload, FiRefreshCw } from 'react-icons/fi';

function Result({ 
  csv, 
  model, 
  scaler, 
  splitRatio, 
  missing, 
  encoding,
  onReset 
}) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
        const res = await fetch('https://automl-studio-production-0873.up.railway.app/train', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setResponse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    sendRequest();
  }, [csv, model, scaler, splitRatio, missing, encoding]);

  const handleTryAnother = () => {
    if (onReset) {
      onReset(); // Call the reset function from parent
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">Training your model</h3>
        <p className="text-gray-500 mt-2">This may take a few moments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiAlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-red-800">Error Processing Request</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="text-sm font-medium text-red-700 hover:text-red-600"
              >
                Try again <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!response) return null;

  const { metrics, visualization, prediction_plot, columns, rows } = response;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{marginTop:'10px'}}>
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-gray-600 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center">
          <FiCheck className="mr-2" /> Model Training Complete
        </h2>
        <p className="opacity-90 mt-1">Here are your results for the {model} model</p>
      </div>

      {/* Metrics */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiBarChart2 className="mr-2 text-blue-500" /> Performance Metrics
        </h3>
        
        {metrics ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="text-sm font-medium text-blue-800 mb-1">Root Mean Squared Error</h4>
              <p className="text-2xl font-bold text-blue-600">
                {metrics.rmse?.toFixed(4) || 'N/A'}
              </p>
              <p className="text-xs text-blue-700 mt-1">Lower is better</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h4 className="text-sm font-medium text-green-800 mb-1">R² Score</h4>
              <p className="text-2xl font-bold text-green-600">
                {metrics.r2?.toFixed(4) || 'N/A'}
              </p>
              <p className="text-xs text-green-700 mt-1">Closer to 1 is better</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h4 className="text-sm font-medium text-purple-800 mb-1">Mean Absolute Error</h4>
              <p className="text-2xl font-bold text-purple-600">
                {metrics.mae?.toFixed(4) || 'N/A'}
              </p>
              <p className="text-xs text-purple-700 mt-1">Lower is better</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No performance metrics available.</p>
        )}
      </div>

      {/* Visualizations */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiTrendingUp className="mr-2 text-purple-500" /> Model Insights
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {visualization && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-700 mb-3">Feature Importance</h4>
              <img
                src={`data:image/png;base64,${visualization}`}
                alt="Feature Importance"
                className="w-full h-auto rounded"
              />
            </div>
          )}

          {prediction_plot && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-700 mb-3">Actual vs Predicted Values</h4>
              <img
                src={`data:image/png;base64,${prediction_plot}`}
                alt="Actual vs Predicted"
                className="w-full h-auto rounded"
              />
            </div>
          )}
        </div>
      </div>

      {/* Processed Data */}
      {columns && rows && (
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Processed Data Sample</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.slice(0, 5).map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {columns.map((col, j) => (
                      <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {isNaN(Number(row[col])) ? '-' : Number(row[col]).toFixed(3)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-2">Showing first 5 rows of processed data</p>
        </div>
      )}

      {/* Actions */}
      <div className="bg-gray-50 px-6 py-4 flex justify-between">
        <button className="text-gray-600 hover:text-gray-800 font-medium flex items-center">
          <FiDownload className="mr-2" />
          Download Results
        </button>
        <button 
          onClick={handleTryAnother}
          className="bg-yellow-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center"
        >
          <FiRefreshCw className="mr-2" />
          Try Another Model
        </button>
      </div>
    </div>
  );
}

export default Result;