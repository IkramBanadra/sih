import { BarChart2, Menu, TrendingUp, Monitor, Home, Mail, User, X, Copy, AlertCircleIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  collection, 
  query, 
  getDocs, 
  addDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import Swal from "sweetalert2";
import db from "../firebaseConfig";
import Header from "../components/common/Header";

const SIDEBAR_ITEMS = [
  {
    name: "Swachata",
    icon: BarChart2,
    color: "#355F2E",
    href: "/adminSwachataDashboard",
  },
  {
    name: "Post Office Access",
    icon: TrendingUp,
    color: "#3B82F6",
    href: "/adminUsersDashboard",
  },
  {
    name: "Post Offices",
    icon: Mail,
    color: "#6479E6",
    href: "/adminPostOfficeCheck",
  },
  {
    name: "Live Monitoring",
    icon: Monitor,
    color: "#FFF058",
    href: "/adminMonitoring",
  },
  {
    name: "Admin Notification",
    icon: AlertCircleIcon,
    color: "#F3B90D",
    href: "/adminNotifications",
  },
  { name: "Admin Access", icon: User, color: "#6EE7B7", href: "/adminAccess" },
  { name: "Home", icon: Home, color: "#D9924C", href: "/" },
];

const generateRandomPassword = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const AdminAccess = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const fetchAdmins = async () => {
    try {
      const adminRef = collection(db, "admin");
      const q = query(adminRef);
      const querySnapshot = await getDocs(q);
      
      const adminList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setAdmins(adminList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to fetch admin data',
      });
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Information',
        text: 'Please fill in both name and email',
      });
      return;
    }

    try {
      const password = generateRandomPassword();
      setGeneratedPassword(password);

      const adminRef = collection(db, "admin");
      await addDoc(adminRef, { 
        name, 
        email, 
        pass: password 
      });

      await Swal.fire({
        icon: 'success',
        title: 'Admin Added',
        html: `
          <p>New admin has been successfully added.</p>
          <div class="mt-4 bg-gray-100 p-3 rounded">
            <strong>Generated Password:</strong> 
            <span id="generatedPassword">${password}</span>
            <button onclick="navigator.clipboard.writeText('${password}')" class="ml-2 text-blue-500">
              Copy
            </button>
          </div>
          <small class="text-red-500">Please securely share this password with the admin.</small>
        `,
        confirmButtonText: 'Close'
      });

      setName("");
      setEmail("");

      fetchAdmins();
    } catch (error) {
      console.error("Error adding admin:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to add admin',
      });
    }
  };

  const copyPasswordToClipboard = (password) => {
    navigator.clipboard.writeText(password);
    Swal.fire({
      icon: 'success',
      title: 'Copied!',
      text: 'Password copied to clipboard',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000
    });
  };

  const handleDeleteAdmin = async (adminId) => {
    try {
      const adminDocRef = doc(db, "admin", adminId);
      await deleteDoc(adminDocRef);

      fetchAdmins();

      Swal.fire({
        icon: 'success',
        title: 'Admin Removed',
        text: 'Admin has been successfully removed',
      });
    } catch (error) {
      console.error("Error deleting admin:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to remove admin',
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      <motion.div
        className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
      >
        <div className="h-full bg-gray-800 bg-opacity-900 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
          >
            <Menu size={24} />
          </motion.button>

          <nav className="mt-8 flex-grow">
            {SIDEBAR_ITEMS.map((item) => (
              <Link key={item.href} to={item.href}>
                <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
                  <item.icon
                    size={20}
                    style={{ color: item.color, minWidth: "20px" }}
                  />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            ))}
          </nav>
        </div>
      </motion.div>

      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Admin Access Management" />
        
        <div className="grid md:grid-cols-2 gap-8" style={{margin: '25px'}}>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
          >
            <h2 className="text-2xl font-bold mb-6 text-white">Create Admin Access</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Enter admin name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Enter admin email"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors"
              >
                Create Admin Access
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
          >
            <h2 className="text-2xl font-bold mb-6 text-white">Current Admins</h2>
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : admins.length === 0 ? (
              <p className="text-gray-400 text-center">No admins found</p>
            ) : (
              <div className="space-y-4">
                {admins.map((admin) => (
                  <motion.div
                    key={admin.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-700 rounded-lg p-4 flex justify-between items-center hover:bg-gray-600 transition-colors"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white">{admin.name}</h3>
                      <p className="text-sm text-gray-400">{admin.email}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500 mr-2">Password: ●●●●●●</span>
                        <button
                          onClick={() => copyPasswordToClipboard(admin.pass)}
                          className="text-blue-400 hover:text-blue-500 transition-colors"
                          title="Copy Password"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAdmin(admin.id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccess;