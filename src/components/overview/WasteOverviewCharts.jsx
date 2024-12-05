import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const salesData = [
	{ name: "Jul", value: 45 },
	{ name: "Aug", value: 25 },
	{ name: "Sep", value: 20 },
	{ name: "Oct", value: 21 },
	{ name: "Nov", value: 15 },
	{ name: "Dec", value: 22 },
	{ name: "Jan", value: 33 },
	{ name: "Feb", value: 42 },
	{ name: "Mar", value: 21 },
	{ name: "Apr", value: 30 },
	{ name: "May", value: 22 },
	{ name: "Jun", value: 35 },
];

const WasteOverviewChart = () => {
    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className='text-lg font-medium mb-4 text-gray-100'>CLEANLINESS SCORE OVERTIME(Monthly Period)</h2>

            <div className='h-80'>
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
                        <XAxis dataKey={"name"} stroke='#9ca3af' />
                        <YAxis 
                            stroke='#9ca3af' 
                            tickFormatter={(value) => `${value}%`} 
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(31, 41, 55, 0.8)",
                                borderColor: "#4B5563",
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                            formatter={(value) => `${value}%`}
                        />
                        <Line
                            type='monotone'
                            dataKey='value'  // Changed from 'sales' to 'value'
                            stroke='#6366F1'
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