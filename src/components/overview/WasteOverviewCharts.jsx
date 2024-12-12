import {   
  LineChart,   
  Line,   
  XAxis,   
  YAxis,   
  CartesianGrid,   
  Tooltip,   
  ResponsiveContainer 
} from "recharts"; 
import { motion } from "framer-motion"; 
import { useState, useEffect } from "react"; 
import { collection, getDocs, query } from "firebase/firestore"; 
import db from "../../firebaseConfig";   

const WasteOverviewChart = () => {   
  const [chartData, setChartData] = useState([]);    

  useEffect(() => {     
    const fetchImageProcessData = async () => {       
      try {
        const imageProcessQuery = query(collection(db, "image_process_data"));
        const imageProcessSnapshot = await getDocs(imageProcessQuery);
        
        const postOfficesQuery = query(collection(db, "post"));
        const postOfficesSnapshot = await getDocs(postOfficesQuery);
        
        const postOfficeMap = new Map(
          postOfficesSnapshot.docs.map((doc) => {
            const data = doc.data();
            return [data.email, data.name];
          })
        );

        const processedData = imageProcessSnapshot.docs.map((doc) => {           
          const data = doc.data();
          const email = data.email || "Unknown";
          const postOfficeName = postOfficeMap.get(email) || email;
          
          return {             
            Name: postOfficeName,
            GarbagePercent: Math.floor(data.garbage_percentage || 0),           
          };         
        });          

        setChartData(processedData);       
      } catch (error) {         
        console.error("Error fetching image process data:", error);       
      }     
    };      

    fetchImageProcessData();   
  }, []);    

  return (     
    <motion.div       
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"       
      initial={{ opacity: 0, y: 20 }}       
      animate={{ opacity: 1, y: 0 }}       
      transition={{ delay: 0.2 }}     
    >       
      <h2 className="text-lg font-medium mb-4 text-gray-100">         
        CLEANLINESS SCORE BY VARIOUS POST OFFICES       
      </h2>        
      <div className="h-80">         
        <ResponsiveContainer width={"100%"} height={"100%"}>           
          <LineChart data={chartData}>             
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />             
            <XAxis dataKey={"Name"} stroke="#9ca3af" />             
            <YAxis stroke="#9ca3af" tickFormatter={(value) => `${value}%`} />             
            <Tooltip               
              contentStyle={{                 
                backgroundColor: "rgba(31, 41, 55, 0.8)",                 
                borderColor: "#4B5563",               
              }}               
              itemStyle={{ color: "#E5E7EB" }}               
              formatter={(value) => `${value}%`}             
            />             
            <Line               
              type="monotone"               
              dataKey="GarbagePercent"               
              stroke="#6366F1"               
              strokeWidth={3}               
              dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}               
              activeDot={{ r: 8, strokeWidth: 2 }}             
            />           
          </LineChart>         
        </ResponsiveContainer>       
      </div>     
    </motion.div>   
  ); 
};  

export default WasteOverviewChart;