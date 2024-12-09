import { motion } from "framer-motion";

const Navigation = ({
  mobileMenuOpen,
  activeSection,
  scrollToSection,
  setMobileMenuOpen,
}) => {
  return (
    <div
      className={`
      fixed md:static 
      top-16 left-0 right-0 
      w-[90%] mx-auto 
      ${mobileMenuOpen ? "w-[90%]" : "w-[100%]"} 
      ${mobileMenuOpen ? "block" : "hidden"} 
      md:block 
      bg-white/90 dark:bg-gray-800/90 md:bg-transparent
      shadow-lg md:shadow-none 
      p-4 md:p-0
      rounded-xl
    `}
    >
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
        {["home", "features", "about", "contact"].map((section) => (
          <motion.button
            key={section}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection(section)}
            className={`
              capitalize 
              text-gray-600 dark:text-gray-300 
              hover:text-gray-900 dark:hover:text-white 
              transition 
              w-full md:w-auto 
              text-center
              rounded-lg
              py-2 px-4
              hover:bg-gray-100 dark:hover:bg-gray-700
              ${
                activeSection === section
                  ? "font-bold text-blue-600 dark:text-blue-400"
                  : ""
              }
            `}
          >
            {section}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
