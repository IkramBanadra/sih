import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";


const participantData = [
    { week: "May 5–11", participants: 150 },
    { week: "May 12–18", participants: 200 },
    { week: "May 12–18", participants: 200 },
    { week: "May 12–18", participants: 200 },
    { week: "May 12–18", participants: 200 },
    { week: "May 12–18", participants: 200 },
    { week: "May 12–18", participants: 200 },
   
];

const MonthlyAcitivity = () => {
    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className='text-lg font-medium mb-4 text-gray-100'>Participants Over Time (Weekly)</h2>

            <div className='h-80'>
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <BarChart data={participantData}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
                        <XAxis dataKey="week" stroke='#9ca3af' />
                        <YAxis 
                            stroke='#9ca3af' 
                            label={{ value: 'Participants', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(31, 41, 55, 0.8)",
                                borderColor: "#4B5563",
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                            formatter={(value) => `${value} participants`}
                        />
                        <Bar
                            dataKey='participants'
                            fill='#6366F1'
                            barSize={30}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default MonthlyAcitivity;