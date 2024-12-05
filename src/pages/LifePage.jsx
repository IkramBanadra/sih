import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { Droplet, Leaf, Trash2 } from "lucide-react"; 
import LifeTable from "../components/Types/LifeTable";
import MonthlyAcitivity from "../components/overview/MonthlyAcitivity";
import MapVisualization from "../components/overview/MapVisualization";
import ImapctDistribution from "../components/overview/ImpactDistribution";
import SocialMediaEngagementTrends from "../components/overview/SociallyEngagement";

const LifePage = () => {
   
    const impactData = {
        energySaved: 500, // Example value in kWh
        waterSaved: 300,  // Example value in liters
        wasteReduced: 200 // Example value in kg
    };

    return (
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
    );
};

export default LifePage;