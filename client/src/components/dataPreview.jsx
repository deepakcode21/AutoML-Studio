import React from 'react';

const DataPreview = ({ previewData, columns }) => {
  if (!previewData || previewData.length === 0) {
    return <div>No data to preview</div>;
  }

  return (
    <div>
      <h2>Data Preview</h2>
      <table border="1">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {previewData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataPreview;
