import { useState } from 'react';
import axios from 'axios';

const ResultSection = ({ title, data }) => {
  const hasContent = data && (typeof data === 'object' ? Object.keys(data).length > 0 : data);

  if (!hasContent) return null;

  return (
    <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-2">{title}</h4>
      {typeof data === 'object' ? (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-600">{key}</span>
              <span className="font-medium text-blue-700">{value.toLocaleString()}%</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">{data}</p>
      )}
    </div>
  );
};

const ImageProcess = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
      
      if (!allowedTypes.includes(file.type)) {
        setError('Only image files (JPEG, PNG, GIF, WebP, BMP) are allowed');
        setSelectedFile(null);
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('File is too large. Maximum file size is 5MB');
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
      await axios.post('http://127.0.0.1:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      const resultResponse = await axios.get('http://127.0.0.1:8000/getRes');
      
      setUploadResult(resultResponse.data);
    } catch (err) {
      if (err.response) {
        setError(`Server Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        setError('No response received from the server. Please check your network connection.');
      } else {
        setError('Error setting up the request: ' + err.message);
      }
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
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
        <div className="mt-6 space-y-4">
          <ResultSection 
            title="Uploaded File" 
            data={uploadResult.uploaded_file} 
          />

          <ResultSection 
            title="Type Results" 
            data={uploadResult.type_results} 
          />

          <ResultSection 
            title="Frequency" 
            data={uploadResult.frequency} 
          />

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-2">Garbage Percentage</h4>
            <p className="text-blue-700 font-medium">{uploadResult.garbage_percentage}%</p>
          </div>

          {uploadResult.processed_video_URL && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">Processed Image</h4>
              <a 
                href={uploadResult.processed_video_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Processed Image
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageProcess;