import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import db from "../../firebaseConfig";

const MonthlyActivity = () => {
    const [activityData, setActivityData] = useState([]);

    useEffect(() => {
        const fetchParticipantData = async () => {
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

                const aggregatedData = imageProcessSnapshot.docs.reduce((acc, doc) => {
                    const data = doc.data();
                    const email = data.email || "Unknown";
                    const garbagePercentage = data.garbage_percentage || 0;

                    const existingEntry = acc.find(item => item.email === email);

                    if (existingEntry) {
                        existingEntry.garbagePercentages.push(garbagePercentage);
                    } else {
                        acc.push({
                            email,
                            garbagePercentages: [garbagePercentage]
                        });
                    }

                    return acc;
                }, []);

                const processedData = aggregatedData.map(item => {
                    const postOfficeName = postOfficeMap.get(item.email) || item.email;
                    const avgGarbagePercentage = Math.floor(
                        item.garbagePercentages.reduce((sum, val) => sum + val, 0) / 
                        item.garbagePercentages.length
                    );

                    return {
                        name: postOfficeName,
                        Average: avgGarbagePercentage
                    };
                });

                setActivityData(processedData);
            } catch (error) {
                console.error("Error fetching participant data:", error);
            }
        };

        fetchParticipantData();
    }, []);

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className='text-lg font-medium mb-4 text-gray-100'>Average Garbage Percentage by Post Office</h2>
            <div className='h-80'>
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <BarChart data={activityData}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
                        <XAxis dataKey="name" stroke='#9ca3af' />
                        <YAxis
                            stroke='#9ca3af'
                            label={{ value: 'Garbage %', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(31, 41, 55, 0.8)",
                                borderColor: "#4B5563",
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                            formatter={(value) => `${value}%`}
                        />
                        <Bar
                            dataKey='Average'
                            fill='#6366F1'
                            barSize={30}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default MonthlyActivity;