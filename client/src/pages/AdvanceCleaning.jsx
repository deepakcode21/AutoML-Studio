import React, { useState, useEffect } from 'react';
import AdvancedResult from '../components/Advanced_cleaning/AdvancedResult';
import PreprocessingOption from '../components/Advanced_cleaning/PreprocessingOption';
import DataSummary from '../components/Advanced_cleaning/DataSummary';
import Papa from 'papaparse';

export default function AutoMLStudio() {
    const [currentStep, setCurrentStep] = useState(1);
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [preprocessing, setPreprocessing] = useState(null);
    const [dataStats, setDataStats] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [parsingConfig, setParsingConfig] = useState({
        delimiter: ',',
        header: true,
        skipEmptyLines: true,
    });

    // Step navigation handlers
    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    const goToStep = (step) => setCurrentStep(step);

    // Parse CSV file using Papa Parse
    const parseCSV = (text, config) => {
        return new Promise((resolve, reject) => {
            Papa.parse(text, {
                ...config,
                complete: (results) => {
                    if (results.errors.length > 0) {
                        reject(results.errors);
                    } else {
                        resolve(results);
                    }
                },
                error: (error) => reject(error)
            });
        });
    };

    // Handle file upload and process to step 2
    const handleFileUpload = async (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        // File validation
        if (!selected.name.match(/\.(csv|txt|tsv|xlsx?)$/i)) {
            setFileError('Please upload a CSV, Excel, or text file');
            return;
        }

        if (selected.size > 10 * 1024 * 1024) {
            setFileError('File size exceeds 10MB limit');
            return;
        }

        setFileError(null);
        setFile(selected);
        setIsAnalyzing(true);

        try {
            const text = await readFileAsText(selected);
            const results = await parseCSV(text, parsingConfig);

            if (results.data.length === 0) {
                setPreviewData([]);
                setColumns([]);
                setDataStats(null);
                return;
            }

            const headers = results.meta.fields || Object.keys(results.data[0] || []);
            const stats = analyzeData(headers, results.data.slice(0, 100));

            setColumns(headers);
            setPreviewData(results.data.slice(0, 5));
            setDataStats(stats);
            nextStep(); // Move to preview step after successful upload
        } catch (error) {
            console.error('Error parsing file:', error);
            setFileError('Error parsing file. Please check the format.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Helper to read file as text
    const readFileAsText = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target.result);
            reader.onerror = () => reject(new Error('Error reading file'));
            reader.readAsText(file);
        });
    };

    // Analyze data structure and content
    const analyzeData = (headers, rows) => {
        if (rows.length === 0) return null;

        const stats = {
            totalRows: rows.length,
            columns: {},
            potentialIssues: [],
            dataTypes: {
                numeric: 0,
                text: 0,
                date: 0,
                boolean: 0,
                other: 0
            }
        };

        headers.forEach(header => {
            const colData = rows.map(row => row[header]);
            const nonEmpty = colData.filter(val => val !== '' && val !== null && val !== undefined);
            const emptyCount = colData.length - nonEmpty.length;

            let type = 'text';
            let numericValues = [];
            let booleanValues = [];

            if (nonEmpty.length > 0) {
                const isBoolean = nonEmpty.every(val =>
                    ['true', 'false', 'yes', 'no', '1', '0'].includes(val.toLowerCase())
                );

                if (isBoolean) {
                    type = 'boolean';
                    booleanValues = nonEmpty.map(val =>
                        ['true', 'yes', '1'].includes(val.toLowerCase())
                    );
                }
                else if (nonEmpty.every(val => !isNaN(val) && val.trim() !== '')) {
                    type = 'numeric';
                    numericValues = nonEmpty.map(Number);
                }
                else if (nonEmpty.some(val => isPotentialDate(val))) {
                    type = 'date';
                }
            }

            stats.columns[header] = {
                type,
                emptyCount,
                emptyPercentage: Math.round((emptyCount / colData.length) * 100),
                uniqueCount: new Set(nonEmpty).size,
                uniquePercentage: Math.round((new Set(nonEmpty).size / nonEmpty.length) * 100),
                sampleValues: Array.from(new Set(nonEmpty.slice(0, 5))),
            };

            stats.dataTypes[type]++;

            if (type === 'numeric') {
                stats.columns[header].stats = {
                    min: Math.min(...numericValues),
                    max: Math.max(...numericValues),
                    avg: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
                    stdDev: calculateStdDev(numericValues),
                    median: calculateMedian(numericValues)
                };
            } else if (type === 'boolean') {
                stats.columns[header].stats = {
                    trueCount: booleanValues.filter(Boolean).length,
                    falseCount: booleanValues.length - booleanValues.filter(Boolean).length
                };
            }

            if (emptyCount > 0) {
                stats.potentialIssues.push({
                    column: header,
                    issue: 'missing_values',
                    count: emptyCount,
                    severity: emptyCount / colData.length > 0.3 ? 'high' :
                        emptyCount / colData.length > 0.1 ? 'medium' : 'low'
                });
            }
        });

        return stats;
    };

    // Statistical helper functions
    const calculateStdDev = (values) => {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const squareDiffs = values.map(val => Math.pow(val - avg, 2));
        const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
        return Math.sqrt(avgSquareDiff);
    };

    const calculateMedian = (values) => {
        const sorted = [...values].sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0
            ? (sorted[middle - 1] + sorted[middle]) / 2
            : sorted[middle];
    };

    // Date detection helper
    const isPotentialDate = (value) => {
        if (typeof value !== 'string') return false;
        const date = new Date(value);
        return !isNaN(date.getTime());
    };

    // Handle configuration changes
    const handleConfigChange = (e) => {
        const { name, value, type, checked } = e.target;
        setParsingConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle preprocessing options
    const handlePreprocessingChange = (options) => {
        setPreprocessing(options);
    };

    // Reset the entire process
    const handleReset = () => {
        setFile(null);
        setPreviewData([]);
        setColumns([]);
        setPreprocessing(null);
        setDataStats(null);
        setFileError(null);
        setCurrentStep(1);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
            {/* Header with step indicators */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-indigo-700 mb-2 text-center">
                    Advanced Data Cleaning
                </h1>
                <p className="text-gray-600 text-center mb-6">
                    Effortless advanced data cleaning powered by AI — upload your dataset and let smart algorithms handle the mess!
                </p>

                {/* Step progress bar */}
                <div className="flex justify-between items-center mb-6 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
                    {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex flex-col items-center">
                            <button
                                onClick={() => currentStep > step && goToStep(step)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium 
                  ${currentStep >= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'} 
                  ${currentStep > step ? 'cursor-pointer hover:bg-indigo-700' : 'cursor-default'}`}
                            >
                                {step}
                            </button>
                            <span className={`mt-2 text-sm font-medium ${currentStep >= step ? 'text-indigo-600' : 'text-gray-500'}`}>
                                {step === 1 && 'Upload Data'}
                                {step === 2 && 'Preview'}
                                {step === 3 && 'Configure'}
                                {step === 4 && 'Results'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step 1: Upload Data */}
            {currentStep === 1 && (
                <div className="space-y-6">
                    <div className={`border-2 border-dashed ${fileError ? 'border-red-300' : 'border-gray-300 hover:border-indigo-400'} p-12 rounded-lg text-center transition-colors`}>
                        <div className="flex flex-col items-center justify-center">
                            <svg
                                className={`w-16 h-16 ${fileError ? 'text-red-500' : 'text-indigo-500'} mb-4`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                            <h2 className="text-xl font-semibold mb-2">Upload Your Dataset</h2>
                            <p className="text-gray-500 mb-4">Drag & drop your CSV file here or click to browse</p>

                            <input
                                type="file"
                                accept=".csv,.txt,.tsv,.xlsx,.xls"
                                id="upload"
                                className="hidden"
                                onChange={handleFileUpload}
                                disabled={isAnalyzing}
                            />
                            <label
                                htmlFor="upload"
                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${fileError ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'} cursor-pointer`}
                            >
                                {isAnalyzing ? 'Processing...' : 'Select File'}
                            </label>
                            <p className="text-xs text-gray-500 mt-3">
                                Supported formats: CSV, Excel. Max file size: 10MB
                            </p>
                        </div>

                        {fileError && (
                            <div className="mt-4 text-red-600 font-medium">
                                {fileError}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Step 2: Data Preview */}
            {currentStep === 2 && dataStats && (
                <div className="space-y-6">
                    {/* <div className="bg-indigo-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold text-indigo-800">Dataset Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                            <div className="bg-white p-3 rounded shadow-sm">
                                <p className="text-sm text-gray-500">Total Rows</p>
                                <p className="text-2xl font-bold">{dataStats.totalRows.toLocaleString()}</p>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <p className="text-sm text-gray-500">Columns</p>
                                <p className="text-2xl font-bold">{columns.length}</p>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <p className="text-sm text-gray-500">File Size</p>
                                <p className="text-2xl font-bold">{Math.round(file.size / 1024)} KB</p>
                            </div>
                        </div>
                    </div> */}
                    {dataStats && (
                        <DataSummary
                            stats={dataStats}
                            columns={columns}
                            className="mb-8"
                        />
                    )}

                    <div className="overflow-x-auto p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-lg font-medium mb-3">Data Preview</h3>
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    {columns.map((col) => (
                                        <th
                                            key={col}
                                            className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {previewData.map((row, idx) => (
                                    <tr key={idx}>
                                        {columns.map((col) => (
                                            <td
                                                key={`${idx}-${col}`}
                                                className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"
                                            >
                                                {row[col] || <span className="text-gray-400 italic">empty</span>}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Start Over
                        </button>
                        <button
                            onClick={nextStep}
                            className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Configure Data Cleaning
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Model Configuration */}
            {currentStep === 3 && (
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Cleaning Now</h2>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <PreprocessingOption
                            onChange={handlePreprocessingChange}
                            columns={columns}
                            dataStats={dataStats}
                        />
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={prevStep}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Back
                        </button>
                        <button
                            onClick={nextStep}
                            className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Clean Your Data
                        </button>
                    </div>
                </div>
            )}

            {/* Step 4: Results */}
            {currentStep === 4 && (
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">AutoML Results</h2>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <AdvancedResult
                            csv={file}
                            preprocessing={preprocessing}
                            columns={columns}
                            dataStats={dataStats}
                        />
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={prevStep}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Start New Project
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}