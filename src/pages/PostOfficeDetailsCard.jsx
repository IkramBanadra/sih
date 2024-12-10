import React, { useState } from 'react';
import { motion } from "framer-motion";
import { MapPin, Building, Mail, Image as ImageIcon } from "lucide-react";

const PostOfficeDetailsCard = () => {
  // Mock data - in a real application, this would come from an API or database
  const [postOfficeDetails] = useState({
    name: "Central Post Office",
    location: "Main Street, Downtown",
    pincode: "560001",
    email: "central.po@postal.gov.in",
    imageUrl: "https://th.bing.com/th/id/R.9b902ce8e29f8c0cea66bce367fb6cb4?rik=NuNiEACVdOAPYQ&riu=http%3a%2f%2fegov.eletsonline.com%2fwp-content%2fuploads%2f2012%2f04%2findia-post-logo.jpg&ehk=%2bPBpWSELC%2bqQkYNFj%2blzwBqci0dYX7v5nyjZSJdz%2fTU%3d&risl=&pid=ImgRaw&r=0"
  });

  return (
    <motion.div 
      className="bg-gray-800 rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image Section */}
        <div className="flex-shrink-0 w-full md:w-1/3">
          <div className="bg-gray-700 rounded-lg overflow-hidden">
            <img 
              src={postOfficeDetails.imageUrl} 
              alt="Post Office" 
              className="w-full h-48 object-cover"
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-grow space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Post Office Details</h2>
          
          <div className="space-y-3">
            <DetailRow 
              icon={Building} 
              label="Name" 
              value={postOfficeDetails.name} 
              color="#6366F1"
            />
            <DetailRow 
              icon={MapPin} 
              label="Location" 
              value={postOfficeDetails.location} 
              color="#10B981"
            />
            <DetailRow 
              icon={Mail} 
              label="Pincode" 
              value={postOfficeDetails.pincode} 
              color="#EC4899"
            />
            <DetailRow 
              icon={Mail} 
              label="Email" 
              value={postOfficeDetails.email} 
              color="#8B5CF6"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Reusable component for detail rows
const DetailRow = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center space-x-4 bg-gray-700 p-3 rounded-lg">
    <Icon size={24} style={{ color }} />
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm text-white font-semibold">{value}</p>
    </div>
  </div>
);

export default PostOfficeDetailsCard;