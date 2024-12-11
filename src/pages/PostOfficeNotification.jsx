import { useState, useEffect } from "react";
import {
  BarChart2,
  Menu,
  Home,
  Users,
  LayoutDashboard,
  AlertCircleIcon,
  CheckCircle2
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import db from "../firebaseConfig";

const SIDEBAR_ITEMS = [
  {
    name: "Swachata",
    icon: BarChart2,
    color: "#355F2E",
    href: "/postOfficeSwachataPage",
  },
  {
    name: "Image Upload",
    icon: Users,
    color: "#EC4899",
    href: "/postOfficeImgUpload",
  },
  
  {
    name: "Post Office Notification",
    icon: AlertCircleIcon,
    color: "#F3B90D",
    href: "/postOfficeNotification",
  },
  {
    name: "Post Office Details",
    icon: LayoutDashboard,
    color: "#AA88F8",
    href: "/postOfficeInfo",
  },
  {
    name: "Home",
    icon: Home,
    color: "#4CAF50",
    href: "/",
  },
];

const PostOfficeNotification = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [declinedData, setDeclinedData] = useState([]);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    // Retrieve authenticated user from localStorage
    const storedUser = localStorage.getItem('authenticatedUser');
    if (storedUser) {
      setAuthenticatedUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchDeclinedData = async () => {
      if (!authenticatedUser) return;

      try {
        const q = query(
          collection(db, "declined_data"),
          where("email", "==", authenticatedUser.email)
        );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setDeclinedData(data);
      } catch (error) {
        console.error("Error fetching declined data:", error);
      }
    };

    fetchDeclinedData();
  }, [authenticatedUser]);

  const handleMarkAsRead = async (documentId) => {
    try {
      await deleteDoc(doc(db, "declined_data", documentId));
      setDeclinedData(prevData => 
        prevData.filter(item => item.id !== documentId)
      );
    } catch (error) {
      console.error("Error deleting document:", error);
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
        <div className="bg-gray-800 p-4 shadow-md flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Admin Notification</h1>
        </div>

        <section className="flex flex-col justify-center antialiased bg-gray-900 text-gray-600 min-h-screen p-4">
          {declinedData.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
                <AlertCircleIcon size={64} className="mx-auto text-gray-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-300 mb-2">No Notifications</h2>
                <p className="text-gray-500">You are all caught up!</p>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl mx-auto">
              <div className="flex flex-col space-y-4">
                {declinedData.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-indigo-600 shadow-lg rounded-lg overflow-hidden"
                  >
                    <div className="px-6 py-5 flex items-center justify-between">
                      <div className="flex-grow">
                        <h2 className="text-xl font-bold text-white mb-2">
                          {item.field_name}
                        </h2>
                        <p className="text-indigo-100 mb-2">
                          Declined at: {new Date(item.declinedAt.toDate()).toLocaleString()}
                        </p>
                        <p className="text-indigo-200">{item.file_name}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMarkAsRead(item.id)}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-colors"
                      >
                        <CheckCircle2 size={20} />
                        <span>Mark as Read</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PostOfficeNotification;