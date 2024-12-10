import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navigation = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null); 
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const authenticatedUser = JSON.parse(localStorage.getItem("authenticatedUser"));
    if (authenticatedUser) {
      setUserRole(authenticatedUser.role); 
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("authenticatedUser");
    setUserRole(null);
    navigate("/");
  };

  const scrollToSection = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  const handleDashboardNavigation = () => {
    if (userRole === 'admin') {
      navigate("/adminSwachataDashboard");
    } else if (userRole === 'postOffice') {
      navigate("/postOfficeSwachataPage");
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800">
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="absolute top-4 right-4 z-50 p-2 focus:outline-none"
      >
        {mobileMenuOpen ? (
          <span className="text-2xl">✕</span>
        ) : (
          <div>
            <div className="w-6 h-1 bg-gray-600 dark:bg-gray-300 mb-1"></div>
            <div className="w-6 h-1 bg-gray-600 dark:bg-gray-300 mb-1"></div>
            <div className="w-6 h-1 bg-gray-600 dark:bg-gray-300"></div>
          </div>
        )}
      </button>

      <div
        className={`fixed top-16 left-0 right-0 mx-auto 
          w-[90%] bg-white/90 dark:bg-gray-800/90 
          shadow-lg p-4 rounded-xl 
          transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? "block" : "hidden"}`}
      >
        <div className="flex flex-col space-y-4">
          {["home", "features", "about", "contact"].map((section) => (
            <motion.button
              key={section}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection(section)}
              className={`capitalize 
                text-gray-600 dark:text-gray-300 
                hover:text-gray-900 dark:hover:text-white 
                transition w-full text-center 
                rounded-lg py-2 px-4 
                hover:bg-gray-100 dark:hover:bg-gray-700 
                ${
                  activeSection === section
                    ? "font-bold text-blue-600 dark:text-blue-400"
                    : ""
                }`}
            >
              {section}
            </motion.button>
          ))}

          {userRole ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDashboardNavigation}
                className="capitalize text-gray-600 dark:text-gray-300 
                  hover:text-gray-900 dark:hover:text-white 
                  transition w-full text-center 
                  rounded-lg py-2 px-4 
                  hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Dashboard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="capitalize text-gray-600 dark:text-gray-300 
                  hover:text-gray-900 dark:hover:text-white 
                  transition w-full text-center 
                  rounded-lg py-2 px-4 
                  hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Sign Out
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  navigate("/accessReq");
                  setMobileMenuOpen(false);
                }}
                className="capitalize text-gray-600 dark:text-gray-300 
                  hover:text-gray-900 dark:hover:text-white 
                  transition w-full text-center 
                  rounded-lg py-2 px-4 
                  hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Request Access
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  navigate("/postOfficeLogin");
                  setMobileMenuOpen(false);
                }}
                className="capitalize text-gray-600 dark:text-gray-300 
                  hover:text-gray-900 dark:hover:text-white 
                  transition w-full text-center 
                  rounded-lg py-2 px-4 
                  hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Post Office Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  navigate("/adminLogin");
                  setMobileMenuOpen(false);
                }}
                className="capitalize text-gray-600 dark:text-gray-300 
                  hover:text-gray-900 dark:hover:text-white 
                  transition w-full text-center 
                  rounded-lg py-2 px-4 
                  hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Admin Login
              </motion.button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;