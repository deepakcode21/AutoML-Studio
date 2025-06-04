import React from 'react';
import { FiAlertTriangle, FiCheckCircle, FiDatabase, FiList, FiBarChart2, FiType } from 'react-icons/fi';

export default function DataSummary({ stats, columns, className = '' }) {
  if (!stats) return null;

  // Count data types for visualization
  const typeCounts = columns.reduce((acc, col) => {
    const type = stats.columns[col.name]?.type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Dataset Summary</h3>
        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
          <FiDatabase className="text-blue-500" />
          <span className="text-sm font-medium text-blue-600">
            {stats.totalRows.toLocaleString()} rows × {columns.length} columns
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Overview Card */}
        <div className="border border-gray-100 rounded-xl p-5 bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-lg bg-blue-100 mr-3">
              <FiBarChart2 className="text-blue-600" />
            </div>
            <h4 className="text-base font-semibold text-gray-700">Dataset Overview</h4>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 flex items-center">
                <FiDatabase className="mr-2 text-gray-400" /> Total Rows
              </span>
              <span className="font-medium text-gray-800">{stats.totalRows.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 flex items-center">
                <FiList className="mr-2 text-gray-400" /> Columns
              </span>
              <span className="font-medium text-gray-800">{columns.length}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 flex items-center">
                <FiType className="mr-2 text-gray-400" /> Missing Values
              </span>
              <span className="font-medium text-gray-800">
                {Object.values(stats.columns).reduce((sum, col) => sum + (col.emptyCount || 0), 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Data Types Card */}
        <div className="border border-gray-100 rounded-xl p-5 bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-lg bg-purple-100 mr-3">
              <FiType className="text-purple-600" />
            </div>
            <h4 className="text-base font-semibold text-gray-700">Data Types</h4>
          </div>
          
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {Object.entries(typeCounts).map(([type, count]) => (
                <span 
                  key={type} 
                  className="px-2 py-1 text-xs font-medium rounded-full capitalize"
                  style={{
                    backgroundColor: typeColors[type]?.bg || '#e5e7eb',
                    color: typeColors[type]?.text || '#4b5563'
                  }}
                >
                  {type}: {count}
                </span>
              ))}
            </div>
          </div>
          
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {columns.slice(0, 5).map((col) => {
              const colInfo = stats.columns[col.name] || {};
              return (
                <div key={col.name} className="flex justify-between items-center py-1">
                  <span className="text-gray-600 truncate text-sm" title={col.name}>
                    {col.name}
                  </span>
                  <div className="flex items-center">
                    <span className="text-xs font-medium px-2 py-0.5 rounded capitalize mr-2"
                      style={{
                        backgroundColor: typeColors[colInfo.type]?.bg || '#e5e7eb',
                        color: typeColors[colInfo.type]?.text || '#4b5563'
                      }}
                    >
                      {colInfo.type}
                    </span>
                    {colInfo.emptyCount > 0 && (
                      <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                        {colInfo.emptyCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {columns.length > 5 && (
              <div className="text-sm text-gray-500 pt-1">
                + {columns.length - 5} more columns
              </div>
            )}
          </div>
        </div>

        {/* Issues Card */}
        <div className="border border-gray-100 rounded-xl p-5 bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-lg bg-red-100 mr-3">
              <FiAlertTriangle className="text-red-600" />
            </div>
            <h4 className="text-base font-semibold text-gray-700">Data Quality</h4>
          </div>
          
          {stats.potentialIssues.length > 0 ? (
            <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
              {stats.potentialIssues.slice(0, 5).map((issue, idx) => (
                <div key={idx} className="flex items-start py-1">
                  <span className="text-red-500 mr-2 mt-0.5 flex-shrink-0">•</span>
                  <div>
                    <span className="text-sm font-medium text-gray-800 block">
                      {issue.column}
                    </span>
                    <span className="text-xs text-gray-600 block">
                      {formatIssue(issue.issue)} ({issue.count})
                    </span>
                  </div>
                </div>
              ))}
              {stats.potentialIssues.length > 5 && (
                <div className="text-sm text-gray-500 pt-1">
                  + {stats.potentialIssues.length - 5} more issues
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center py-2 px-3 bg-green-50 rounded-lg">
              <FiCheckCircle className="text-green-500 mr-2" />
              <span className="text-sm font-medium text-green-700">
                No major quality issues detected
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions and styles
const typeColors = {
  number: { bg: '#e0f2fe', text: '#0369a1' },
  string: { bg: '#f0fdf4', text: '#15803d' },
  boolean: { bg: '#fef9c3', text: '#854d0e' },
  date: { bg: '#f3e8ff', text: '#7e22ce' },
  datetime: { bg: '#ede9fe', text: '#6d28d9' },
  object: { bg: '#fee2e2', text: '#b91c1c' }
};

function formatIssue(issue) {
  return issue
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}