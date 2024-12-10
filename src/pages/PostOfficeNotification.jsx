import {
  BarChart2,
  Menu,
  // Settings,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  Monitor,
  Home,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "../components/common/Header";

const SIDEBAR_ITEMS = [
  {
    name: "Swachata",
    icon: BarChart2,
    color: "#355F2E",
    href: "/adminSwachataDashboard",
  },
  {
    name: "Life",
    icon: ShieldCheck,
    color: "#8B5CF6",
    href: "/adminLifeDashboard",
  },
  {
    name: "Notification",
    icon: ShoppingCart,
    color: "#F59E0B",
    href: "/adminNotification",
  },
  {
    name: "Users",
    icon: TrendingUp,
    color: "#3B82F6",
    href: "/adminUsersDashboard",
  },
  {
    name: "Live Monitering",
    icon: Monitor,
    color: "#6EE7B7",
    href: "/adminMonitoring",
  },
  {
    name: "Home",
    icon: Home,
    color: "#4CAF50",
    href: "/",
  },
  // { name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings" },
];

const PostOfficeNotification = () => {
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
        <Header title="Admin Notification" />

        <section className="flex flex-col justify-center antialiased bg-gray-900 text-gray-600 min-h-screen p-4">
          <div className="w-full">
            <div className="flex flex-wrap justify-center gap-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="w-[90%] md:w-[90%] lg:w-[90%]">
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
                              Simple Design Tips {index}
                            </h2>
                          </div>
                          <div className="flex items-end justify-between whitespace-normal">
                            <div className="max-w-md text-indigo-100">
                              <p className="mb-2">
                                Lorem ipsum dolor sit amet, consecte adipiscing
                                elit sed do eiusmod tempor incididunt ut labore
                                et dolore.
                              </p>
                            </div>
                            <a
                              className="flex-shrink-0 flex items-center justify-center text-indigo-600 w-10 h-10 rounded-full bg-gradient-to-b from-indigo-50 to-indigo-100 hover:from-white hover:to-indigo-50 focus:outline-none focus-visible:from-white focus-visible:to-white transition duration-150 ml-2"
                              href="#0"
                            >
                              <span className="block font-bold">
                                <span className="sr-only">Read more</span> --
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostOfficeNotification;
