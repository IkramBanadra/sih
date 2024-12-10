import { useState, useEffect } from 'react';
import axios from 'axios';

const ResultValue = ({ value }) => {
  // Handle different types of values
  if (value === null || value === undefined) {
    return <span className="text-gray-500">N/A</span>;
  }

  if (typeof value === 'object') {
    // If it's an object, convert it to a string representation
    if (Array.isArray(value)) {
      // For arrays, join elements
      return <span>{value.join(', ')}</span>;
    }
    
    // For nested objects, stringify or render key-value pairs
    return (
      <div className="bg-gray-50 p-2 rounded">
        {Object.entries(value).map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-gray-600">{k}:</span>
            <ResultValue value={v} />
          </div>
        ))}
      </div>
    );
  }

  // For primitive values
  return (
    <span>
      {typeof value === 'number' 
        ? value.toLocaleString() + 
          (String(value).includes('.') 
            ? (String(value).includes('%') ? '%' : '') 
            : '')
        : String(value)}
    </span>
  );
};

const ResultsTable = ({ results }) => {
  if (!results || Object.keys(results).length === 0) return null;

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-4">Analysis Results</h4>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-gray-700">Key</th>
            <th className="border p-2 text-gray-700">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(results).map(([key, value]) => (
            <tr key={key} className="hover:bg-gray-100">
              <td className="border p-2 text-gray-600 capitalize">
                {key.replace(/_/g, ' ')}
              </td>
              <td className="border p-2 font-medium text-blue-700">
                <ResultValue value={value} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ImageProcess = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processId, setProcessId] = useState(null);

  const BASE_URL = 'https://4368-2401-4900-2354-138d-7de5-826-3aac-8717.ngrok-free.app';

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
      
      if (!allowedTypes.includes(file.type)) {
        setError('Only image files (JPEG, PNG, GIF, WebP, BMP) are allowed');
        setSelectedFile(null);
        return;
      }

      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('File is too large. Maximum file size is 50MB');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${BASE_URL}/process-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Check for process_id in multiple potential locations
      const processIdFromResponse = 
        response.data.process_id || 
        response.data.processId || 
        response.data.id;

      if (!processIdFromResponse) {
        // If no process ID found, try to fetch results immediately
        setUploadResult(response.data);
        setIsLoading(false);
        return;
      }

      // Store the process ID to fetch results later
      setProcessId(processIdFromResponse);

      // Set a timeout to fetch results after 5-10 seconds
      setTimeout(fetchResults, Math.floor(Math.random() * 5000) + 5000);
    } catch (err) {
      handleError(err);
    }
  };

  const fetchResults = async () => {
    if (!processId) {
      // If no process ID, attempt to process without it
      handleUpload();
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/process-image?process_id=${processId}`);
      
      // If no data in the response, try to fall back to original upload
      if (!response.data || Object.keys(response.data).length === 0) {
        setError('No results found. Please try uploading again.');
        setIsLoading(false);
        return;
      }

      setUploadResult(response.data);
      setIsLoading(false);
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err) => {
    if (err.response) {
      setError(`Server Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
    } else if (err.request) {
      setError('No response received from the server. Please check your network connection.');
    } else {
      setError('Error processing the request: ' + err.message);
    }
    console.error('Error:', err);
    setIsLoading(false);
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Litter Analysis</h2>
      
      <input 
        type="file" 
        accept="image/jpeg,image/png,image/gif,image/webp,image/bmp"
        onChange={handleFileSelect} 
        className="mb-4 w-full border-2 border-dashed border-gray-300 p-2 rounded"
      />
      
      <button 
        onClick={handleUpload} 
        disabled={!selectedFile || isLoading}
        className="w-full bg-blue-500 text-white p-3 rounded-lg 
                   hover:bg-blue-600 transition-colors duration-300
                   disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Upload and Analyze'}
      </button>

      {error && (
        <div className="text-red-500 mt-4 bg-red-50 p-3 rounded border border-red-200">
          {error}
        </div>
      )}

      {uploadResult && (
        <ResultsTable results={uploadResult} />
      )}
    </div>
  );
};

export default ImageProcess;