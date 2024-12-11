import { motion } from "framer-motion";
import { AlertCircleIcon, BarChart2, Home, Users} from "lucide-react";
import Header from "../components/common/Header";
import PostOfficeDetailsCard from "./PostOfficeDetailsCard";
import { Menu, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS = [
  {
    name: "Swachata",
    icon: BarChart2,
    color: "#355F2E",
    href: "/postOfficeSwachataPage",
  },
  {
    name: "Image Uplodation",
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

const PostOfficeInfo = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
        <Header title="Post Office Info" />

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <PostOfficeDetailsCard />
          </div>
        </main>
      </div>
    </div>
  );
};
export default PostOfficeInfo;