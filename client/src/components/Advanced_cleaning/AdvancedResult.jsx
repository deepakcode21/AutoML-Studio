import React, { useState, useEffect } from 'react';

export default function AdvancedResult({ csv, preprocessing = null, columns = [] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cleanedCSV, setCleanedCSV] = useState('');
  const [previewData, setPreviewData] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!csv) return;

    const sendToBackend = async () => {
      setLoading(true);
      setError('');
      setCleanedCSV('');
      setStats(null);

      try {
        const formData = new FormData();
        formData.append('file', csv);
        
        // Send preprocessing options as JSON if they exist
        if (preprocessing) {
          formData.append('preprocessing', JSON.stringify({
            ...preprocessing,
            available_columns: columns // Send available columns for validation
          }));
        }
        for (let [key, value] of formData.entries()) {
  console.log(`${key}:`, value);
}


        const res = await fetch('https://automl-studio.onrender.com/api/clean', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Server responded with ${res.status}`);
        }

        // Expect JSON response with CSV and stats
        const data = await res.json();
        setCleanedCSV(data.csv);
        setStats(data.stats);
        
        // Create preview of cleaned data
        if (data.csv) {
          const lines = data.csv.split('\n').slice(0, 6);
          const headers = lines[0].split(',');
          const previewRows = lines.slice(1).map(line => {
            const cells = line.split(',');
            const obj = {};
            headers.forEach((header, idx) => {
              obj[header] = cells[idx] ?? '';
            });
            return obj;
          });
          setPreviewData(previewRows);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to clean CSV. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    sendToBackend();
  }, [csv, preprocessing, columns]);

  const handleDownload = () => {
    if (!cleanedCSV) return;
    const blob = new Blob([cleanedCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-sm">
      {loading && (
        <div className="flex items-center space-x-2">
          <svg
            className="w-5 h-5 text-indigo-500 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span className="text-indigo-700 font-semibold">Processing Data...</span>
        </div>
      )}

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          <span className="font-medium">Error!</span> {error}
        </div>
      )}

      {cleanedCSV && !loading && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-700 font-semibold">
                ✅ Cleaning Complete!
              </p>
              {stats && (
                <p className="text-sm text-gray-600">
                  {stats.rows_processed} rows processed • {stats.rows_removed} rows removed • {stats.columns_processed} columns processed
                </p>
              )}
            </div>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all"
            >
              Download Cleaned CSV
            </button>
          </div>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-900 mb-2">Missing Values</h4>
                <ul className="space-y-1">
                  {Object.entries(stats.missing_values_imputed || {}).map(([col, count]) => (
                    <li key={col} className="text-sm">
                      <span className="font-medium">{col}:</span> {count} imputed
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-900 mb-2">Transformations</h4>
                <ul className="space-y-1">
                  {stats.columns_normalized && stats.columns_normalized.length > 0 && (
                    <li className="text-sm">
                      <span className="font-medium">Normalized:</span> {stats.columns_normalized.join(', ')}
                    </li>
                  )}
                  {stats.columns_encoded && stats.columns_encoded.length > 0 && (
                    <li className="text-sm">
                      <span className="font-medium">Encoded:</span> {stats.columns_encoded.join(', ')}
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-900 mb-2">Quality Metrics</h4>
                <ul className="space-y-1">
                  <li className="text-sm">
                    <span className="font-medium">Duplicates removed:</span> {stats.duplicates_removed || 0}
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">Outliers removed:</span> {stats.outliers_removed || 0}
                  </li>
                </ul>
              </div>
            </div>
          )}

          {previewData.length > 0 && (
            <div className="mt-6 overflow-x-auto p-4 border rounded-lg bg-white">
              <h3 className="text-lg font-medium mb-2">Cleaned Data Preview</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(previewData[0] || {}).map((col) => (
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
                  {previewData.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {Object.values(row).map((val, i) => (
                        <td
                          key={i}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}