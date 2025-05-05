import React from 'react';

const DataPreview = ({ columns, previewData }) => {
  if (!previewData || !Array.isArray(previewData) || !previewData.length) return null;

  return (
    <div>
      <h3>Data Preview (first 5 rows)</h3>
      <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>{columns.map(col => <th key={col}>{col}</th>)}</tr>
        </thead>
        <tbody>
          {previewData.map((row, idx) => (
            <tr key={idx}>
              {columns.map(col => <td key={col}>{row[col]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataPreview;
