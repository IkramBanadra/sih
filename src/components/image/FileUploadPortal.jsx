import React, { useState } from 'react';

const FileUploadPortal = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
    };

    const handleUpload = () => {
        if (selectedFiles.length === 0) {
            alert("Please select files to upload.");
            return;
        }

    
        Array.from(selectedFiles).forEach(file => {
            console.log(`Uploading: ${file.name}`);
        });

   
        setSelectedFiles([]);
    };

    return (
       
        <div className="upload-portal bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'" style={{ height: '400px' }}>
            <h2 className="text-2xl font-bold mb-6 text-gray-100 text-center">Upload Images and Videos</h2>
            <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className="mb-6 w-full text-gray-700 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleUpload}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
            >
                Upload
            </button>
            {selectedFiles.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-medium text-gray-200">Selected Files:</h3>
                    <ul className="list-disc list-inside pl-5">
                        {Array.from(selectedFiles).map((file, index) => (
                            <li key={index} className="text-gray-100">{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}
      
        </div>
      
    );
};

export default FileUploadPortal;