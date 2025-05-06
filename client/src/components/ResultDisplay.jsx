import React, { useEffect, useState } from 'react';

function Result({ csv, model, scaler, splitRatio, missing, encoding }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
  if (csv) {
    const formData = new FormData();
    formData.append('file', csv);
    formData.append('model', model);
    formData.append('scaler', scaler);
    formData.append('splitRatio', splitRatio);
    formData.append('missing', missing);
    formData.append('encoding', encoding);

    fetch("http://localhost:8000/process/", {
      method: "POST",
      body: formData,
    })
      .then(res => res.json())
      .then(data => setResult(data))
      .catch(err => console.error("Error:", err));
      console.log('result: ',result)
  }
}, [csv, model, scaler, splitRatio, missing, encoding]);


  return (
    <div>
      <h3>Result Component</h3>
      {result ? (
        <div>
          <p>Model Used: {result.model_used}</p>
          <p>RMSE: {result.rmse}</p>
          <p>R² Score: {result.r2_score}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Result;
