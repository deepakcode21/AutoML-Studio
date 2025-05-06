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
          header: true, // ✅ Uses first row as headers
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data;
            setColumns(results.meta.fields || []);
            console.log("data ", data);
            setPreviewData(data[0]); // ✅ First 5 rows
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
