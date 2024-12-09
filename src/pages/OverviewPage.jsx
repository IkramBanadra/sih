import { motion } from "framer-motion";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import WasteOverviewChart from "../components/overview/WasteOverviewCharts";
import WasteDistributionChart from "../components/overview/WasteDistributionChart";

const OverviewPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Swachata" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Waste Recycling Efficiency"
            icon={Zap}
            value="25%"
            color="#6366F1"
          />
          <StatCard name="New Users" icon={Users} value="2" color="#8B5CF6" />
          <StatCard
            name="Total Garbage"
            icon={ShoppingBag}
            value="567"
            color="#EC4899"
          />
          <StatCard
            name="Cleanliness Rate"
            icon={BarChart2}
            value="12.5%"
            color="#10B981"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WasteDistributionChart />
          <WasteOverviewChart />
        </div>
      </main>
    </div>
  );
};
export default OverviewPage;
