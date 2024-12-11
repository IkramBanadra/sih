import {
  BarChart2,
  Menu,
  TrendingUp,
  Monitor,
  Home,
  Mail,
  User,
  AlertCircleIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/common/Header";
import {
  collection,
  query,
  getDocs,
  deleteDoc,
  addDoc,
  doc,
} from "firebase/firestore";
import db from "../firebaseConfig";

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
  { name: "Home", icon: Home, color: "#D9924C", href: "/" },
];

const generatePassword = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const AdminUsersDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(collection(db, "post_office_requests"));
        const querySnapshot = await getDocs(q);
        const requestsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(requestsData);
      } catch (error) {
        console.error("Error fetching requests: ", error);
        Swal.fire("Error", "Failed to fetch requests", "error");
      }
    };

    fetchRequests();
  }, []);

  const handleAgree = async (request) => {
    try {
      const generatedPassword = generatePassword();

      const postRequestWithPassword = {
        ...request,
        pass: generatedPassword
      };

      await addDoc(collection(db, "post"), postRequestWithPassword);
      
      await deleteDoc(doc(db, "post_office_requests", request.id));
      
      setRequests(requests.filter((req) => req.id !== request.id));
      
      Swal.fire({
        title: "Success",
        html: `Request approved and moved to post collection.<br>Generated Password: <strong>${generatedPassword}</strong>`,
        icon: "success"
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      Swal.fire("Error", "Failed to process request", "error");
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await deleteDoc(doc(db, "post_office_requests", requestId));
      setRequests(requests.filter((req) => req.id !== requestId));
      Swal.fire("Success", "Request declined and deleted", "success");
    } catch (error) {
      console.error("Error declining request: ", error);
      Swal.fire("Error", "Failed to decline request", "error");
    }
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
        <Header title="User Access" />

        <section className="flex flex-col justify-center antialiased bg-gray-900 text-gray-600 min-h-screen p-4">
          <div className="w-full">
            {requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96">
                <p className="text-2xl text-gray-300">No Post Office is requesting access</p>
                <svg
                  className="mt-4 w-24 h-24 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12H5l4-8v6h4l-4 8V12z" />
                </svg>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-4">
                {requests.map((request) => (
                  <div key={request.id} className="w-[90%] md:w-[90%] lg:w-[90%]">
                    <div className="bg-indigo-600 shadow-lg rounded-lg">
                      <div className="px-6 py-5">
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
                                {request.name}
                              </h2>
                            </div>
                            <div className="flex items-end justify-between whitespace-normal">
                              <div className="max-w-md text-indigo-100">
                                <p className="mb-2">
                                  Email: {request.email}
                                  <br />
                                  Pincode: {request.pincode}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleAgree(request)}
                                  className="bg-white text-indigo-600 px-4 py-2 rounded-full hover:bg-gray-100 transition duration-150"
                                >
                                  Agree
                                </button>
                                <button
                                  onClick={() => handleDecline(request.id)}
                                  className="bg-white text-red-600 px-4 py-2 rounded-full hover:bg-gray-100 transition duration-150"
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminUsersDashboard;