import React from 'react';
import Papa from 'papaparse';

const FileUpload = ({ setCsvFile, setPreviewData, setColumns }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target.result;
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data;
            setColumns(results.meta.fields || []);
            setPreviewData(data.slice(0, 5));
          }
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <h2>Upload CSV File</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
    </div>
  );
};

export default FileUpload;
