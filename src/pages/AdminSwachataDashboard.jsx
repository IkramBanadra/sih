import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart2,
  Home,
  ShoppingBag,
  Users,
  Mail,
  FileText,
  TrendingUp,
  Monitor,
  Menu,
  User,
  AlertCircleIcon,
  Download,
  X,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import db from "../firebaseConfig";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import WasteDistributionChart from "../components/overview/WasteDistributionChart";
import PostOfficeChart from "../components/overview/PostOfficeChart";
import MonthlyAcitivity from "../components/overview/MonthlyAcitivity";

const SIDEBAR_ITEMS = [
  {
    name: "Swachata",
    icon: BarChart2,
    color: "#355F2E",
    href: "/adminSwachataDashboard",
  },
  {
    name: "Post Office Access",
    icon: TrendingUp,
    color: "#3B82F6",
    href: "/adminUsersDashboard",
  },
  {
    name: "Post Offices",
    icon: Mail,
    color: "#6479E6",
    href: "/adminPostOfficeCheck",
  },
  {
    name: "Live Monitoring",
    icon: Monitor,
    color: "#FFF058",
    href: "/adminMonitoring",
  },
  {
    name: "Admin Notification",
    icon: AlertCircleIcon,
    color: "#F3B90D",
    href: "/adminNotifications",
  },
  { name: "Admin Access", icon: User, color: "#6EE7B7", href: "/adminAccess" },
  
  { name: "User Feedback", icon: MessageCircle, color: "#6EE7B7", href: "/adminFeedbackRequests" },
  { name: "Home", icon: Home, color: "#D9924C", href: "/" },
];

const base64ToImage = (base64String, filename = "downloaded-image.png") => {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/png" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ImageDetailModal = ({ isOpen, onClose, imageData }) => {
  if (!isOpen) return null;

  const downloadImage = () => {
    base64ToImage(
      imageData.processed_image,
      `processed_image_${imageData.id}.png`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 rounded-2xl p-6 w-full max-w-3xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <img
              src={imageData.processed_image}
              alt="Processed Image"
              className="w-full h-auto rounded-lg shadow-lg mb-4 object-cover"
            />
            <button
              onClick={downloadImage}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Download size={20} />
              <span>Download Image</span>
            </button>
          </div>

          <div className="space-y-4 text-gray-200">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="text-blue-400" size={20} />
                <span className="font-semibold text-gray-300">Email:</span>
                <span>{imageData.email || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="text-green-400" size={20} />
                <span className="font-semibold text-gray-300">Media Type:</span>
                <span>{imageData.media_type || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <BarChart2 className="text-red-400" size={20} />
                <span className="font-semibold text-gray-300">
                  Garbage Percentage:
                </span>
                <span>
                  {imageData.garbage_percentage
                    ? `${imageData.garbage_percentage.toFixed(2)}%`
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-2 overflow-hidden">
                <span style={{ color: "#68369C" }}>&#8226;</span>
                <span className="font-semibold text-gray-300">
                  Image Description:
                </span>
                <div className="max-h-64 overflow-y-auto overflow-x-hidden flex-1">
                  {imageData.Image_Description || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

ImageDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  imageData: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    media_type: PropTypes.string,
    garbage_percentage: PropTypes.number,
    processed_image: PropTypes.string,
    Image_Description: PropTypes.string,
  }).isRequired,
};

const VideoDetailModal = ({ isOpen, onClose, videoData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 rounded-2xl p-6 w-full max-w-3xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <video
              src={videoData.processed_video}
              controls
              className="w-full h-auto rounded-lg shadow-lg mb-4"
            />
          </div>

          <div className="space-y-4 text-gray-200">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="text-blue-400" size={20} />
                <span className="font-semibold text-gray-300">Email:</span>
                <span>{videoData.email || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="text-green-400" size={20} />
                <span className="font-semibold text-gray-300">Media Type:</span>
                <span>{videoData.media_type || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <BarChart2 className="text-red-400" size={20} />
                <span className="font-semibold text-gray-300">
                  Garbage Percentage:
                </span>
                <span>
                  {videoData.garbage_percentage
                    ? `${videoData.garbage_percentage.toFixed(2)}%`
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

VideoDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  videoData: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    media_type: PropTypes.string,
    garbage_percentage: PropTypes.number,
    processed_video: PropTypes.string,
  }).isRequired,
};

const AdminSwachataDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [newUsersCount, setNewUsersCount] = useState(0);
  const [totalGarbageCount, setTotalGarbageCount] = useState(0);
  const [cleanlinessRate, setCleanlinessRate] = useState(0);

  const [imageProcessData, setImageProcessData] = useState([]);
  const [videoProcessData, setVideoProcessData] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [postOffices, setPostOffices] = useState([]);
  const [selectedPostOffice, setSelectedPostOffice] = useState("");

  const ChatBot = () => {
    const handleChatBotClick = () => {
      window.open("https://323e-182-74-154-218.ngrok-free.app/ ");
    };

    return (
      <button
        onClick={handleChatBotClick}
        className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
      >
        Chat with Us
      </button>
    );
  };

  useEffect(() => {
    const fetchFirestoreData = async () => {
      try {
        const postQuery = query(collection(db, "post"));
        const postSnapshot = await getDocs(postQuery);
        setNewUsersCount(postSnapshot.size);

        const statesSet = new Set();
        postSnapshot.docs.forEach((doc) => {
          const state = doc.data().state;
          if (state) statesSet.add(state);
        });
        setStates(Array.from(statesSet));

        const imageProcessQuery = query(collection(db, "image_process_data"));
        const imageProcessSnapshot = await getDocs(imageProcessQuery);

        const processedImageData = imageProcessSnapshot.docs.map((doc) => {
          const data = doc.data();
          const processedImage = data.processed_image.startsWith("data:image")
            ? data.processed_image
            : `data:image/png;base64,${data.processed_image}`;

          return {
            id: doc.id,
            ...data,
            processed_image: processedImage,
            garbage_percentage: Number(data.garbage_percentage) || 0,
          };
        });
        setImageProcessData(processedImageData);

        const videoProcessQuery = query(collection(db, "video_process_data"));
        const videoProcessSnapshot = await getDocs(videoProcessQuery);

        const processedVideoData = videoProcessSnapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            ...data,
            garbage_percentage: Number(data.garbage_percentage) || 0,
          };
        });
        setVideoProcessData(processedVideoData);

        const allProcessedData = [...processedImageData, ...processedVideoData];
        setTotalGarbageCount(allProcessedData.length);

        const garbagePercentages = allProcessedData
          .map((item) => item.garbage_percentage)
          .filter((percentage) => percentage !== undefined);

        const averageCleanlinessRate =
          garbagePercentages.length > 0
            ? garbagePercentages.reduce((a, b) => a + b, 0) /
              garbagePercentages.length
            : 0;

        setCleanlinessRate(averageCleanlinessRate);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };

    fetchFirestoreData();
  }, []);

  useEffect(() => {
    const fetchPostOffices = async () => {
      if (!selectedState) return;

      try {
        const postOfficeQuery = query(
          collection(db, "post"),
          where("state", "==", selectedState)
        );
        const postOfficeSnapshot = await getDocs(postOfficeQuery);

        const postOfficesData = postOfficeSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setPostOffices(postOfficesData);
      } catch (error) {
        console.error("Error fetching post offices:", error);
      }
    };

    fetchPostOffices();
  }, [selectedState]);

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedPostOffice("");
  };

  const handlePostOfficeChange = (e) => {
    setSelectedPostOffice(e.target.value);
  };

  const filteredImageData = imageProcessData.filter(
    (img) => img.email === selectedPostOffice
  );

  const filteredVideoData = videoProcessData.filter(
    (video) => video.email === selectedPostOffice
  );

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      <motion.div
        className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
      >
        <div className="h-full bg-gray-800 bg-opacity-900 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
          >
            <Menu size={24} />
          </motion.button>

          <nav className="mt-8 flex-grow">
            {SIDEBAR_ITEMS.map((item) => (
              <Link key={item.href} to={item.href}>
                <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
                  <item.icon
                    size={20}
                    style={{ color: item.color, minWidth: "20px" }}
                  />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            ))}
          </nav>
        </div>
      </motion.div>
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Swachata" />

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <StatCard
              name="New Users"
              icon={Users}
              value={newUsersCount.toString()}
              color="#8B5CF6"
            />
            <StatCard
              name="Total Garbage"
              icon={ShoppingBag}
              value={totalGarbageCount.toString()}
              color="#EC4899"
            />
            <StatCard
              name="Cleanliness Rate"
              icon={BarChart2}
              value={`${cleanlinessRate.toFixed(2)}%`}
              color="#10B981"
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <MonthlyAcitivity />
            <WasteDistributionChart />
            <PostOfficeChart />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select State
              </label>
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="w-full bg-gray-800 border border-gray-700 text-gray-300 p-2 rounded-lg"
              >
                <option value="">Select a State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {selectedState && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Post Office
                </label>
                <select
                  value={selectedPostOffice}
                  onChange={handlePostOfficeChange}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-300 p-2 rounded-lg"
                  disabled={!selectedState}
                >
                  <option value="">Select a Post Office</option>
                  {postOffices.map((office) => (
                    <option key={office.id} value={office.email}>
                      {office.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {selectedPostOffice && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-gray-200">
                Image Processed Data
              </h2>
              <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {filteredImageData.map((item) => (
                  <motion.div
                    key={item.id}
                    className="w-full bg-gray-800 rounded-lg p-4 flex flex-col space-y-2 cursor-pointer hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedImage(item)}
                  >
                    <div className="flex items-center space-x-2">
                      <Mail className="text-blue-500" size={20} />
                      <span className="font-semibold">Email:</span>
                      <span>{item.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="text-green-500" size={20} />
                      <span className="font-semibold">Media Type:</span>
                      <span>{item.media_type || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BarChart2 className="text-red-500" size={20} />
                      <span className="font-semibold">Garbage Percentage:</span>
                      <span>
                        {item.garbage_percentage
                          ? `${item.garbage_percentage.toFixed(2)}%`
                          : "N/A"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <h2 className="text-2xl font-bold mb-4 text-gray-200">
                Video Processed Data
              </h2>
              <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredVideoData.map((item) => (
                  <motion.div
                    key={item.id}
                    className="w-full bg-gray-800 rounded-lg p-4 flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <Mail className="text-blue-500" size={20} />
                      <span className="font-semibold">Email:</span>
                      <span>{item.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="text-green-500" size={20} />
                      <span className="font-semibold">Media Type:</span>
                      <span>{item.media_type || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BarChart2 className="text-red-500" size={20} />
                      <span className="font-semibold">Garbage Percentage:</span>
                      <span>
                        {item.garbage_percentage
                          ? `${item.garbage_percentage.toFixed(2)}%`
                          : "N/A"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      <ImageDetailModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageData={selectedImage || {}}
      />
      <VideoDetailModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoData={selectedVideo || {}}
      />

      <div className="fixed z-10 bottom-2 right-4">
        <ChatBot />
      </div>
    </div>
  );
};

export default AdminSwachataDashboard;
