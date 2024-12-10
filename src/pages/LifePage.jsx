import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { Droplet, Leaf, Trash2 } from "lucide-react"; 
import LifeTable from "../components/Types/LifeTable";
import MonthlyAcitivity from "../components/overview/MonthlyAcitivity";
import MapVisualization from "../components/overview/MapVisualization";
import ImapctDistribution from "../components/overview/ImpactDistribution";
import { BarChart2, Users } from "lucide-react";
import { Menu, ShieldCheck, LayoutDashboard } from "lucide-react";
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
  { name: "Life", icon: ShieldCheck, color: "#8B5CF6", href: "/postOfficeLifePage" },
  { name: "Image Uplodation", icon: Users, color: "#EC4899", href: "/postOfficeImgUpload" },
  {
    name: "Post Office Details",
    icon: LayoutDashboard,
    color: "#EC4899",
    href: "/postOfficeInfo",
  },
];
import SocialMediaEngagementTrends from "../components/overview/SociallyEngagement";

const LifePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const impactData = {
        energySaved: 500, // Example value in kWh
        waterSaved: 300,  // Example value in liters
        wasteReduced: 200 // Example value in kg
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
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Life' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* STATS */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard
                        name='Energy Saved'
                        icon={Leaf}
                        value={`${impactData.energySaved} kWh`}
                        color='#FF5733'
                    />
                    <StatCard
                        name='Water Saved'
                        icon={Droplet}
                        value={`${impactData.waterSaved} liters`}
                        color='#1E90FF'
                    />
                    <StatCard
                        name='Waste Reduced'
                        icon={Trash2}
                        value={`${impactData.wasteReduced} kg`}
                        color='#3357FF'
                    />
                </motion.div>

                <LifeTable />

                {/* CHARTS */}
                <div className='grid grid-col-1 lg:grid-cols-2 gap-8'>
                    <SocialMediaEngagementTrends />
                    <ImapctDistribution />
                    <MonthlyAcitivity />
                    <MapVisualization />
                </div>
            </main>
        </div>
        </div>
    );
};

export default LifePage;