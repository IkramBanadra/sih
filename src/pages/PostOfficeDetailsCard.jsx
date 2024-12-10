import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Building,
  Mail,
  Image as ImageIcon,
  Globe,
} from "lucide-react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig"; 
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PostOfficeDetailsCard = () => {
  const [postOfficeDetails, setPostOfficeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostOfficeDetails = async () => {
      try {
        const authenticatedUser = JSON.parse(
          localStorage.getItem("authenticatedUser")
        );

        if (!authenticatedUser) {
          setError("No authenticated user found.");
          setLoading(false);
          return;
        }

        const email = authenticatedUser.email;
        const q = query(
          collection(db, "post"), 
          where("email", "==", email)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setPostOfficeDetails(data);
        } else {
          setError("No post office details found for this email.");
        }
      } catch (err) {
        setError("Failed to fetch post office details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostOfficeDetails();
  }, []);

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <motion.div
      className="bg-gray-800 rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row gap-6">

        <div className="flex-shrink-0 flex w-full md:w-1/3 justify-center items-center">
          <div className="bg-gray-700 rounded-lg overflow-hidden">
            <img
              src="https://th.bing.com/th/id/R.9b902ce8e29f8c0cea66bce367fb6cb4?rik=NuNiEACVdOAPYQ&riu=http%3a%2f%2fegov.eletsonline.com%2fwp-content%2fuploads%2f2012%2f04%2findia-post-logo.jpg&ehk=%2bPBpWSELC%2bqQkYNFj%2blzwBqci0dYX7v5nyjZSJdz%2fTU%3d&risl=&pid=ImgRaw&r=0"
              alt="Post Office"
              className="w-full h-48 object-cover"
            />
          </div>
        </div>

        <div className="flex-grow space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            Post Office Details
          </h2>

          <div className="space-y-3">
            <DetailRow
              icon={Building}
              label="Name"
              value={postOfficeDetails?.name}
              color="#6366F1"
            />
            <DetailRow
              icon={MapPin}
              label="Location"
              value={postOfficeDetails?.city}
              color="#10B981"
            />
            <DetailRow
              icon={Mail}
              label="Pincode"
              value={postOfficeDetails?.pincode}
              color="#EC4899"
            />
            <DetailRow
              icon={Globe}
              label="State"
              value={postOfficeDetails?.state}
              color="#8B5CF6"
            />
            <DetailRow
              icon={Mail}
              label="Email"
              value={postOfficeDetails?.email}
              color="#F97316"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

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
