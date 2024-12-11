import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { collection, getDocs } from "firebase/firestore";
import db from "../../firebaseConfig"; // Adjust the import path as needed

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const PostOfficeChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchTypePercentagesData = async () => {
      try {
        const imageProcessRef = collection(db, "image_process_data");

        const querySnapshot = await getDocs(imageProcessRef);

        if (querySnapshot.empty) {
          console.warn("No documents found in image_process_data");
          return;
        }

        const typeCounts = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const { type_percentages } = data;

          if (type_percentages && typeof type_percentages === "object") {
            Object.keys(type_percentages).forEach((type) => {
              if (!typeCounts[type]) {
                typeCounts[type] = 1;
              } else {
                typeCounts[type] += 1;
              }
            });
          }
        });

        const processedData = Object.entries(typeCounts).map(([type, count]) => ({
          name: type,
          value: count,
        }));

        setChartData(processedData);
      } catch (error) {
        console.error("Error fetching type percentages data:", error);
      }
    };

    fetchTypePercentagesData();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">
        Different Types of Garbages
      </h2>

      <div className="h-80">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Bar dataKey="value" fill="#18212F">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default PostOfficeChart;