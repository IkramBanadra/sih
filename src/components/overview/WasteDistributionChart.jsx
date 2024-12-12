import { useState, useEffect } from 'react'; 
import { motion } from "framer-motion"; 
import { collection, getDocs, query } from 'firebase/firestore'; 
import db from '../../firebaseConfig'; 
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';  

const WasteDistributionChart = () => {   
  const [categoryData, setCategoryData] = useState([]);    

  useEffect(() => {     
    const fetchUploadData = async () => {       
      try {
        const imageProcessRef = collection(db, 'image_process_data');
        const querySnapshot = await getDocs(imageProcessRef);

        const postOfficesQuery = query(collection(db, "post"));
        const postOfficesSnapshot = await getDocs(postOfficesQuery);
        
        const postOfficeMap = new Map(
          postOfficesSnapshot.docs.map((doc) => {
            const data = doc.data();
            return [data.email, data.name];
          })
        );

        if (querySnapshot.empty) {           
          console.warn("No documents found in image_process_data");           
          return;         
        }          

        const emailCounts = {};
        querySnapshot.forEach((doc) => {           
          const data = doc.data();
          const { email } = data;
            
          if (!email) return;
            
          if (!emailCounts[email]) {             
            emailCounts[email] = 1;           
          } else {             
            emailCounts[email] += 1;           
          }         
        });          

        const processedData = Object.entries(emailCounts).map(([email, count]) => ({           
          name: postOfficeMap.get(email) || email,
          value: count,
        }));          

        setCategoryData(processedData);       
      } catch (error) {         
        console.error("Error fetching upload data:", error);       
      }     
    };      

    fetchUploadData();   
  }, []);    

  const COLORS = categoryData.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`);    

  return (     
    <motion.div       
      className='bg-gray-1000 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'       
      initial={{ opacity: 0, y: 20 }}       
      animate={{ opacity: 1, y: 0 }}       
      transition={{ delay: 0.3 }} 	  
      style={{paddingBottom: '50px'}}     
    >       
      <h2 className='text-lg font-medium mb-4 text-gray-100'>UPLOAD DISTRIBUTION BY POST OFFICE</h2>       
      <div className='h-80 flex justify-center items-center'>         
        {categoryData.length > 0 ? (           
          <PieChart width={400} height={400}>             
            <Pie               
              data={categoryData}               
              cx={200}               
              cy={200}               
              labelLine={false}               
              label={({ name, value }) => `${name}: ${value}`}               
              outerRadius={120}               
              fill="#8884d8"               
              dataKey="value"             
            >               
              {categoryData.map((entry, index) => (                 
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />               
              ))}             
            </Pie>             
            <Tooltip />             
            <Legend />           
          </PieChart>         
        ) : (           
          <p className='text-gray-300'>Loading chart data...</p>         
        )}       
      </div>     
    </motion.div>   
  ); 
};  

export default WasteDistributionChart;