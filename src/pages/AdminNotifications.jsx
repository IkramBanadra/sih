import {
  BarChart2,
  Menu,
  TrendingUp,
  Monitor,
  Home,
  Mail,
  User,
  AlertCircleIcon,
  Download,
  X,
  FileText,
  Video,
  CheckSquare,
  Square,
  MessageCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "../components/common/Header";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import db from "../firebaseConfig";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

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

  {
    name: "User Feedback",
    icon: MessageCircle,
    color: "#6EE7B7",
    href: "/adminFeedbackRequests",
  },
  { name: "Home", icon: Home, color: "#D9924C", href: "/" },
];

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

const AdminNotifications = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [imageRequests, setImageRequests] = useState([]);
  const [videoRequests, setVideoRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("image");
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [selectMode, setSelectMode] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchNameForEmail = async (email) => {
    try {
      const postQuery = query(
        collection(db, "post"),
        where("email", "==", email)
      );
      const postQuerySnapshot = await getDocs(postQuery);

      if (!postQuerySnapshot.empty) {
        const postDoc = postQuerySnapshot.docs[0];
        return postDoc.data().name || email;
      }
      return email;
    } catch (error) {
      console.error("Error fetching name for email: ", error);
      return email;
    }
  };

  const fetchRequests = async () => {
    try {
      const imageQuerySnapshot = await getDocs(
        collection(db, "image_process_requests")
      );
      const imageReqs = await Promise.all(
        imageQuerySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const processedImage = data.processed_image
            ? data.processed_image.startsWith("data:image")
              ? data.processed_image
              : `data:image/png;base64,${data.processed_image}`
            : null;

          const postOfficeName = await fetchNameForEmail(data.email);

          return {
            id: doc.id,
            ...data,
            processed_image: processedImage,
            postOfficeName: postOfficeName,
          };
        })
      );

      const videoQuerySnapshot = await getDocs(
        collection(db, "video_process_requests")
      );
      const videoReqs = await Promise.all(
        videoQuerySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const postOfficeName = await fetchNameForEmail(data.email);

          return {
            id: doc.id,
            ...data,
            postOfficeName: postOfficeName,
            garbage_percentage: data.garbage_percentage
              ? parseFloat(data.garbage_percentage)
              : null,
          };
        })
      );

      setImageRequests(imageReqs);
      setVideoRequests(videoReqs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching process requests: ", error);
      setLoading(false);
    }
  };

  const handleAccept = async (requests, type) => {
    try {
      const collectionName =
        type === "image" ? "image_process_data" : "video_process_data";

      const processPromises = requests.map(async (request) => {
        await addDoc(collection(db, collectionName), {
          ...request,
          processedAt: new Date(),
        });

        const sourceCollection =
          type === "image"
            ? "image_process_requests"
            : "video_process_requests";
        await deleteDoc(doc(db, sourceCollection, request.id));
      });

      await Promise.all(processPromises);

      fetchRequests();
      setSelectedRequests([]);
      setSelectMode(false);
    } catch (error) {
      console.error(`Error processing accept request for ${type}: `, error);
    }
  };

  const handleDecline = async (requests, type) => {
    try {
      const declinedPromises = requests.map(async (request) => {
        if (request.email && request.file_name) {
          const collectionName =
            type === "image" ? "declined_data" : "declined_video_data";
          await addDoc(collection(db, collectionName), {
            email: request.email,
            file_name: request.file_name,
            declinedAt: new Date(),
          });

          const sourceCollection =
            type === "image"
              ? "image_process_requests"
              : "video_process_requests";
          await deleteDoc(doc(db, sourceCollection, request.id));
        } else {
          console.error(`Missing email or file_name in the ${type} request`);
        }
      });

      await Promise.all(declinedPromises);

      fetchRequests();
      setSelectedRequests([]);
      setSelectMode(false);
    } catch (error) {
      console.error(`Error processing decline request for ${type}: `, error);
    }
  };

  const toggleRequestSelection = (request) => {
    setSelectedRequests((prev) =>
      prev.includes(request)
        ? prev.filter((r) => r.id !== request.id)
        : [...prev, request]
    );
  };

  const generatePDF = async (requests, type) => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const fontSize = 12;
      const margin = 50;
      let yPosition = height - margin;

      page.drawText(
        `${type === "image" ? "Image" : "Video"} Process Requests`,
        {
          x: margin,
          y: yPosition,
          size: 16,
          font,
          color: rgb(0, 0, 0),
        }
      );
      yPosition -= 30;

      const headers = ["Email", "Media Type", "Garbage %", "File Name"];
      const columnWidths = [200, 100, 80, 120];

      headers.forEach((header, index) => {
        page.drawText(header, {
          x: margin + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
          y: yPosition,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
      });
      yPosition -= 20;

      requests.forEach((request) => {
        const garbagePercentage =
          request.garbage_percentage !== null &&
          (typeof request.garbage_percentage === "number" ||
            typeof request.garbage_percentage === "string")
            ? `${parseFloat(request.garbage_percentage).toFixed(2)}%`
            : "N/A";

        const rowData = [
          request.email || "N/A",
          request.media_type || "N/A",
          garbagePercentage,
          request.file_name || "N/A",
        ];

        rowData.forEach((data, index) => {
          page.drawText(data, {
            x: margin + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
            y: yPosition,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          });
        });
        yPosition -= 20;
      });

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${type}_process_requests.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const renderRequestCards = (requests, type) => {
    return requests.length === 0 ? (
      <div className="flex justify-center items-center h-64 bg-gray-800 rounded-lg shadow-lg">
        <p className="text-white text-2xl font-bold text-center">
          No {type === "image" ? "Image" : "Video"} Requests Available
        </p>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-4">
        <div className="w-[90%] flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectMode(!selectMode)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg flex items-center space-x-2"
            >
              {selectMode ? <X size={20} /> : <CheckSquare size={20} />}
              <span>{selectMode ? "Cancel" : "Select"}</span>
            </button>

            {selectMode && selectedRequests.length > 0 && (
              <>
                <button
                  onClick={() => handleAccept(selectedRequests, type)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Accept ({selectedRequests.length})
                </button>
                <button
                  onClick={() => handleDecline(selectedRequests, type)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Decline ({selectedRequests.length})
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => generatePDF(requests, type)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Download PDF</span>
          </button>
        </div>

        {requests.map((request) => (
          <div key={request.id} className="w-[90%] md:w-[90%] lg:w-[90%]">
            <div className="bg-indigo-600 shadow-lg rounded-lg relative">
              {selectMode && (
                <button
                  onClick={() => toggleRequestSelection(request)}
                  className="absolute top-4 left-4 z-10"
                >
                  {selectedRequests.some((r) => r.id === request.id) ? (
                    <CheckSquare size={24} className="text-green-300" />
                  ) : (
                    <Square size={24} className="text-white" />
                  )}
                </button>
              )}

              <div
                className="px-6 py-5"
                style={{ paddingLeft: selectMode ? "4rem" : "1.5rem" }}
              >
                <div className="flex items-start">
                  <svg
                    className="fill-current flex-shrink-0 mr-5"
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                  >
                    <path
                      className="text-indigo-300"
                      d="m16 14.883 14-7L14.447.106a1 1 0 0 0-.895 0L0 6.883l16 8Z"
                    />
                    <path
                      className="text-indigo-200"
                      d="M16 14.619v15l13.447-6.724A.998.998 0 0 0 30 22V7.619l-14 7Z"
                    />
                    <path
                      className="text-indigo-500"
                      d="m16 14.619-16-8V21c0 .379.214.725.553.895L16 29.619v-15Z"
                    />
                  </svg>
                  <div className="flex-grow truncate">
                    <div className="w-full sm:flex justify-between items-center mb-3">
                      <h2 className="text-2xl leading-snug font-extrabold text-gray-50 truncate mb-1 sm:mb-0">
                        {request.postOfficeName}
                      </h2>
                    </div>
                    <div className="flex items-end justify-between whitespace-normal">
                      <div className="max-w-md text-indigo-100">
                        <p className="mb-2">
                          Garbage Percentage:{" "}
                          {request.garbage_percentage !== null &&
                          typeof request.garbage_percentage === "number"
                            ? `${request.garbage_percentage.toFixed(2)}%`
                            : "N/A"}
                        </p>
                        <p className="mb-2">
                          Media Type: {request.media_type || "N/A"}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {type === "image" && request.processed_image && (
                          <button
                            onClick={() => setSelectedImage(request)}
                            className="flex-shrink-0 flex items-center justify-center text-blue-600 w-20 h-10 rounded-full bg-gradient-to-b from-blue-50 to-blue-100 hover:from-white hover:to-blue-50 focus:outline-none focus-visible:from-white focus-visible:to-white transition duration-150"
                          >
                            <span className="block font-bold">View</span>
                          </button>
                        )}
                        {!selectMode && (
                          <>
                            <button
                              onClick={() => handleAccept([request], type)}
                              className="flex-shrink-0 flex items-center justify-center text-green-600 w-20 h-10 rounded-full bg-gradient-to-b from-green-50 to-green-100 hover:from-white hover:to-green-50 focus:outline-none focus-visible:from-white focus-visible:to-white transition duration-150"
                            >
                              <span className="block font-bold">Accept</span>
                            </button>
                            <button
                              onClick={() => handleDecline([request], type)}
                              className="flex-shrink-0 flex items-center justify-center text-red-600 w-20 h-10 rounded-full bg-gradient-to-b from-red-50 to-red-100 hover:from-white hover:to-red-50 focus:outline-none focus-visible:from-white focus-visible:to-white transition duration-150"
                            >
                              <span className="block font-bold">Decline</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

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
        <Header title="Admin Monitoring" />

        <section className="flex flex-col justify-center antialiased bg-gray-900 text-gray-600 min-h-screen p-4">
          <div className="w-full">
            <div className="flex mb-4 justify-center space-x-4">
              <button
                onClick={() => setActiveTab("image")}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  activeTab === "image"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <FileText size={20} />
                <span>Image Process Requests</span>
              </button>
              <button
                onClick={() => setActiveTab("video")}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  activeTab === "video"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <Video size={20} />
                <span>Video Process Requests</span>
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-white text-xl">Loading...</p>
              </div>
            ) : (
              <div>
                {activeTab === "image"
                  ? renderRequestCards(imageRequests, "image")
                  : renderRequestCards(videoRequests, "video")}
              </div>
            )}
          </div>
        </section>
      </div>

      <ImageDetailModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageData={selectedImage || {}}
      />
    </div>
  );
};

export default AdminNotifications;
