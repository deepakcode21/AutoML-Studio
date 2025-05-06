import React from 'react';
import { Bar } from 'react-chartjs-2';

const ResultsDisplay = ({ results }) => {
  if (!results) return null;

  return (
    <div>
      <h3>Model Performance</h3>
      {results.accuracy && <p>Accuracy: {results.accuracy}</p>}
      {results.r2 && <p>R²: {results.r2}</p>}
      {results.rmse && <p>RMSE: {results.rmse}</p>}

      {results.confusion_matrix && (
        <>
          <h4>Confusion Matrix</h4>
          <table border="1" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              {results.confusion_matrix.map((row, i) => (
                <tr key={i}>
                  {row.map((val, j) => <td key={j}>{val}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </>    
      )}

      {results.feature_importances && (
        <>
          <h4>Feature Importance</h4>
          <Bar
            data={{
              labels: Object.keys(results.feature_importances),
              datasets: [{
                label: 'Importance',
                data: Object.values(results.feature_importances),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
              }]
            }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </>
      )}
    </div>
  );
};

export default ResultsDisplay;
