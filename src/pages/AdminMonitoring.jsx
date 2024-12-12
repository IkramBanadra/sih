import { useState, useEffect, useRef } from "react";
import {
  BarChart2,
  Menu,
  TrendingUp,
  Monitor,
  Home,
  Mail,
  User,
  AlertCircleIcon,
  MessageCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

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

const AdminMonitoring = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const [imageSource, setImageSource] = useState("");
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws");

    ws.onopen = () => {
      console.log("WebSocket connected");
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.processed_image) {
        setImageSource(`data:image/jpeg;base64,${data.processed_image}`);
      }

      if (chartInstanceRef.current) {
        const currentTime = new Date().toLocaleTimeString();
        const chart = chartInstanceRef.current;

        chart.data.labels.push(currentTime);
        chart.data.datasets[0].data.push(data.intensity.garbage_percentage);
        chart.data.datasets[1].data.push(data.type.object_percentages[0] || 0);
        chart.data.datasets[2].data.push(
          data.litter.object_percentages[0] || 0
        );

        if (chart.data.labels.length > 20) {
          chart.data.labels.shift();
          chart.data.datasets.forEach((dataset) => dataset.data.shift());
        }

        chart.update();
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setWsConnected(false);
    };

    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Garbage Percentage",
              data: [],
              borderColor: "red",
              borderWidth: 2,
              fill: false,
            },
            {
              label: "Object Percentages (Type)",
              data: [],
              borderColor: "blue",
              borderWidth: 2,
              fill: false,
            },
            {
              label: "Object Percentages (Litter)",
              data: [],
              borderColor: "green",
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: "Time",
              },
            },
            y: {
              title: {
                display: true,
                text: "Percentage",
              },
              min: 0,
              max: 100,
            },
          },
        },
      });
    }

    return () => {
      ws.close();
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br opacity-80" />
        <div className="absolute inset-0" />
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

      <div className="flex-grow p-6 space-y-6 overflow-y-auto">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-white">
            Live Monitoring Dashboard
          </h1>

          <div className="mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                wsConnected
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {wsConnected ? "WebSocket Connected" : "WebSocket Disconnected"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-center flex-col">
              <h2 className="text-xl font-semibold mb-4 text-left w-full">
                CCTV Feed
              </h2>
              {wsConnected ? (
                <img
                  src={imageSource || "/api/placeholder/640/480"}
                  alt="CCTV Feed"
                  className="w-full rounded-lg shadow-lg border-2 border-gray-700"
                />
              ) : (
                <div className="w-[300px] h-[280px] flex flex-col items-center justify-center bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-red-500 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <h3 className="text-xl font-bold text-red-700 mb-2">
                    WebSocket Disconnected
                  </h3>
                  <p className="text-red-600 max-w-md">
                    Unable to retrieve camera feed. Please check your network
                    connection.
                  </p>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Live Analytics</h2>
              <canvas
                ref={chartRef}
                className="w-full h-96 bg-gray-700 rounded-lg p-4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMonitoring;
