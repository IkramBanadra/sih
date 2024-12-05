import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const socialMediaData = [
    { date: 'May 5', Facebook: 120, Twitter: 150, Instagram: 200 },
    { date: 'May 10', Facebook: 180, Twitter: 130, Instagram: 220 },
    { date: 'May 15', Facebook: 160, Twitter: 170, Instagram: 210 },
    { date: 'May 20', Facebook: 200, Twitter: 190, Instagram: 230 },
    { date: 'May 25', Facebook: 220, Twitter: 210, Instagram: 240 },
    { date: 'May 30', Facebook: 240, Twitter: 230, Instagram: 250 },
    { date: 'June 5', Facebook: 260, Twitter: 250, Instagram: 270 },
];

const SocialMediaEngagementTrends = () => {
    return (
        <div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'>
            <h2 className='text-lg font-medium mb-4 text-gray-100'>Social Media Engagement Trends</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={socialMediaData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(31, 41, 55, 0.8)",
                            borderColor: "#4B5563",
                        }}
                        itemStyle={{ color: "#E5E7EB" }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Facebook" stroke="#3b5998" />
                    <Line type="monotone" dataKey="Twitter" stroke="#1DA1F2" />
                    <Line type="monotone" dataKey="Instagram" stroke="#E1306C" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SocialMediaEngagementTrends;