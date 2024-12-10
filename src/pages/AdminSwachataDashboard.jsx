import { motion } from "framer-motion";
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
} from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { collection, getDocs, query } from "firebase/firestore";
import db from "../firebaseConfig";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import WasteOverviewCharts from "../components/overview/WasteOverviewCharts";

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
    name: "Admin Access",
    icon: User,
    color: "#6EE7B7",
    href: "/adminAccess",
  },
  {
    name: "Home",
    icon: Home,
    color: "#D9924C",
    href: "/",
  },
];

const AdminSwachataDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [newUsersCount, setNewUsersCount] = useState(0);
  const [totalGarbageCount, setTotalGarbageCount] = useState(0);
  const [cleanlinessRate, setCleanlinessRate] = useState(0);
  const [imageProcessData, setImageProcessData] = useState([]);

  useEffect(() => {
    const fetchFirestoreData = async () => {
      try {
        const postQuery = query(collection(db, "post"));
        const postSnapshot = await getDocs(postQuery);
        setNewUsersCount(postSnapshot.size);

        const imageProcessQuery = query(collection(db, "image_process_data"));
        const imageProcessSnapshot = await getDocs(imageProcessQuery);

        setTotalGarbageCount(imageProcessSnapshot.size);

        const garbagePercentages = imageProcessSnapshot.docs
          .map((doc) => doc.data().garbage_percentage)
          .filter((percentage) => percentage !== undefined);

        const averageCleanlinessRate =
          garbagePercentages.length > 0
            ? garbagePercentages.reduce((a, b) => a + b, 0) /
              garbagePercentages.length
            : 0;

        setCleanlinessRate(averageCleanlinessRate);

        const processedData = imageProcessSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setImageProcessData(processedData);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };

    fetchFirestoreData();
  }, []);
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
          {/* STATS */}
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
            <WasteOverviewCharts />
          </div>
          <div className="grid grid-cols-1 gap-4 mt-6">
            {imageProcessData.map((item) => (
              <div 
                key={item.id} 
                className="w-full bg-gray-800 rounded-lg p-4 flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <Mail className="text-blue-500" size={20} />
                  <span className="font-semibold">Email:</span>
                  <span>{item.email || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="text-green-500" size={20} />
                  <span className="font-semibold">Media Type:</span>
                  <span>{item.media_type || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart2 className="text-red-500" size={20} />
                  <span className="font-semibold">Garbage Percentage:</span>
                  <span>{item.garbage_percentage ? `${item.garbage_percentage.toFixed(2)}%` : 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSwachataDashboard;