import { useState } from "react";
import axios from "axios";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import Swal from "sweetalert2";

const firebaseConfig = {
  apiKey: "AIzaSyB8Rlo1r_1bMadGAs6WOcLRNj4iuW4kCR8",
  authDomain: "sih2024-a16f8.firebaseapp.com",
  projectId: "sih2024-a16f8",
  storageBucket: "sih2024-a16f8.firebasestorage.app",
  messagingSenderId: "52485487058",
  appId: "1:52485487058:web:c2faa18225f507d44db00b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ResultValue = ({ value }) => {
  if (value === null || value === undefined) {
    return <span className="text-gray-500">N/A</span>;
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return <span>{value.join(", ")}</span>;
    }
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

  return (
    <span>
      {typeof value === "number"
        ? value.toLocaleString() +
          (String(value).includes(".")
            ? String(value).includes("%")
              ? "%"
              : ""
            : "")
        : String(value)}
    </span>
  );
};

const ResultsTable = ({ results }) => {
  if (!results || Object.keys(results).length === 0) return null;

  return (
    <div className="mt-6 hidden bg-gray-50 p-4 rounded-lg border border-gray-200">
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
                {key.replace(/_/g, " ")}
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

const FileUploadPortal = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadResult, setUploadResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processId, setProcessId] = useState(null);
  const [mediaType, setMediaType] = useState("image");

  const BASE_URL = "https://079f-115-247-189-246.ngrok-free.app";

  const handleFileChange = (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const imageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
      ];
      const videoTypes = [
        "video/mp4",
        "video/mpeg",
        "video/quicktime",
        "video/x-msvideo",
        "video/x-ms-wmv",
      ];
      const allowedTypes = [...imageTypes, ...videoTypes];

      const validFiles = Array.from(files).filter((file) => {
        if (!allowedTypes.includes(file.type)) {
          setError("Only image and video files are allowed");
          return false;
        }

        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
          setError("File is too large. Maximum file size is 50MB");
          return false;
        }

        return true;
      });

      if (validFiles.length > 0) {
        const firstFile = validFiles[0];
        const imageTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/bmp",
        ];
        setMediaType(imageTypes.includes(firstFile.type) ? "image" : "video");

        setSelectedFiles(validFiles);
        setError(null);
      } else {
        setSelectedFiles([]);
      }
    }
  };

  const saveToFirestore = async (data, originalFile) => {
    try {
      const authenticatedUserStr = localStorage.getItem("authenticatedUser");
      let userEmail = null;

      try {
        if (authenticatedUserStr) {
          const authenticatedUser = JSON.parse(authenticatedUserStr);
          userEmail = authenticatedUser.email;
        }
      } catch (parseError) {
        console.error(
          "Error parsing authenticatedUser from localStorage:",
          parseError
        );
      }

      const firestoreData = {
        ...data,

        timestamp: serverTimestamp(),
        media_type: mediaType,

        file_name: originalFile ? originalFile.name : null,
        file_size: originalFile ? originalFile.size : null,
        file_type: originalFile ? originalFile.type : null,

        email: userEmail,
      };

      Object.keys(firestoreData).forEach(
        (key) => firestoreData[key] === undefined && delete firestoreData[key]
      );

      const collectionName = 
        mediaType === "image" ? "image_process_requests" : "video_process_requests";

      const docRef = await addDoc(
        collection(db, collectionName),
        firestoreData
      );
      console.log(`Document written with ID in ${collectionName}: `, docRef.id);
      Swal.fire({
        title: "Upload Successful!",
        text: "Your data has been uploaded successfully.",
        icon: "success",
        confirmButtonText: "Cool",
        confirmButtonColor: "#3085d6",
        customClass: {
          popup: "custom-swal-popup",
          title: "custom-swal-title",
          content: "custom-swal-content",
        },
      });
    } catch (error) {
      console.error("Error saving to Firestore: ", error);
      setError("Failed to save analysis results");
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFiles[0]);

    setIsLoading(true);
    setError(null);

    try {
      const endpoint =
        mediaType === "image" ? "/process-image" : "/process-video";

      const response = await axios.post(`${BASE_URL}${endpoint}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const processIdFromResponse =
        response.data.process_id || response.data.processId || response.data.id;

      if (!processIdFromResponse) {
        setUploadResult(response.data);

        if (response.data) {
          await saveToFirestore(response.data, selectedFiles[0]);
        }

        setIsLoading(false);
        return;
      }

      setProcessId(processIdFromResponse);

      setTimeout(fetchResults, Math.floor(Math.random() * 5000) + 5000);
    } catch (err) {
      handleError(err);
    }
  };

  const fetchResults = async () => {
    if (!processId) {
      handleUpload();
      return;
    }

    try {
      const endpoint =
        mediaType === "image" ? "/process-image" : "/video-process";

      const response = await axios.get(
        `${BASE_URL}${endpoint}?process_id=${processId}`
      );

      if (!response.data || Object.keys(response.data).length === 0) {
        setError("No results found. Please try uploading again.");
        setIsLoading(false);
        return;
      }

      setUploadResult(response.data);

      await saveToFirestore(response.data, selectedFiles[0]);

      setIsLoading(false);
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err) => {
    if (err.response) {
      setError(
        `Server Error: ${err.response.status} - ${JSON.stringify(
          err.response.data
        )}`
      );
    } else if (err.request) {
      setError(
        "No response received from the server. Please check your network connection."
      );
    } else {
      setError("Error processing the request: " + err.message);
    }
    console.error("Error:", err);
    setIsLoading(false);
  };

  return (
    <div
      className="upload-portal bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'"
      style={{ height: "400px" }}
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-100 text-center">
        {mediaType === "image" ? "Image" : "Video"} Upload and Analysis
      </h2>

      <input
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/bmp,video/mp4,video/mpeg,video/quicktime,video/x-msvideo,video/x-ms-wmv"
        onChange={handleFileChange}
        className="mb-6 w-full text-gray-700 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleUpload}
        disabled={selectedFiles.length === 0 || isLoading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : `Upload and Analyze ${mediaType}`}
      </button>

      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium text-gray-200">Selected Files:</h3>
          <ul className="list-disc list-inside pl-5">
            {selectedFiles.map((file, index) => (
              <li key={index} className="text-gray-100">
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="text-red-500 mt-4 bg-red-50 p-3 rounded border border-red-200">
          {error}
        </div>
      )}

      {uploadResult && <ResultsTable results={uploadResult} />}
    </div>
  );
};

export default FileUploadPortal;