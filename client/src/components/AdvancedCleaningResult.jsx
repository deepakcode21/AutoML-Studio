import React, { useState, useEffect } from 'react';

export default function AdvancedCleaningResult({ csvFile }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cleanedCSV, setCleanedCSV] = useState('');

  /**
   * When `csvFile` changes, automatically POST to backend.
   * Replace '/clean' with your exact route if different.
   */
  useEffect(() => {
    if (!csvFile) return;

    const sendFileToBackend = async () => {
      setLoading(true);
      setError('');
      setCleanedCSV('');

      const formData = new FormData();
      formData.append('file', csvFile);

      try {
        const response = await fetch('http://localhost:8000/clean', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        // Expecting raw CSV text in response
        const text = await response.text();
        setCleanedCSV(text);
      } catch (err) {
        console.error(err);
        setError('Failed to clean CSV. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    sendFileToBackend();
  }, [csvFile]);

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
          <span className="text-indigo-700 font-semibold">Cleaning Data...</span>
        </div>
      )}

      {error && (
        <p className="text-red-600 font-medium mt-2">
          ❌ {error}
        </p>
      )}

      {cleanedCSV && !loading && (
        <div className="mt-4">
          <p className="text-green-700 font-semibold mb-2">
            ✅ Cleaning Complete! Download below.
          </p>
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all"
          >
            Download Cleaned CSV
          </button>
        </div>
      )}
    </div>
  );
}
