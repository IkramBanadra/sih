import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  CloudIcon,
  CodeIcon,
  DatabaseIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import Navigation from "../components/Navigation";
import Swal from "sweetalert2";
import db from "../firebaseConfig"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGetStartedClick = () => {
    navigate('/accessReq'); 
  };

  useEffect(() => {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(prefersDarkMode.matches);

    const handleChange = (e) => setIsDarkMode(e.matches);
    prefersDarkMode.addEventListener("change", handleChange);

    return () => prefersDarkMode.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    ["home", "features", "about", "contact"].forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      Swal.fire({
        icon: "error",
        title: "Incomplete Form",
        text: "Please fill in all fields.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
      });
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const queriesRef = collection(db, "queries");
      await addDoc(queriesRef, {
        ...formData,
        timestamp: serverTimestamp(),
        status: "new",
      });

      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "We will get back to you soon.",
        confirmButtonColor: "#3085d6",
      });

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "There was a problem sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`
        ${
          isDarkMode
            ? "dark bg-gray-900 text-gray-100"
            : "bg-white text-gray-900"
        }
        transition-colors duration-300 ease-in-out min-h-screen
      `}
    >
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md z-40 shadow-sm"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
            ProductName
          </div>

          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden block text-gray-600 dark:text-gray-300"
            >
              {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>

            <Navigation
              mobileMenuOpen={mobileMenuOpen}
              activeSection={activeSection}
              scrollToSection={scrollToSection}
              setMobileMenuOpen={setMobileMenuOpen}
            />
          </div>
        </div>
      </motion.nav>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        id="home"
        className="min-h-screen pt-20 container mx-auto px-4 sm:px-6 lg:px-8 flex items-center"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            variants={itemVariants}
            className="space-y-4 sm:space-y-6 text-center md:text-left"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              Transform Your Digital Experience
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Innovative solutions that blend cutting-edge technology with
              seamless user experiences.
            </p>
            <motion.button
              onClick={handleGetStartedClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mx-auto md:mx-0 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg 
              flex items-center space-x-2 hover:bg-blue-700 transition"
            >
              <span>Get Started</span>
              <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="hidden md:flex justify-center relative"
          >
            <div className="absolute inset-0 bg-blue-200/30 rounded-full blur-2xl -z-10"></div>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-6">
              {[
                {
                  Icon: CloudIcon,
                  color: "text-blue-500",
                  title: "Cloud Services",
                  subtitle: "Scalable & Secure",
                },
                {
                  Icon: CodeIcon,
                  color: "text-green-500",
                  title: "Custom Development",
                  subtitle: "Tailored Solutions",
                },
                {
                  Icon: DatabaseIcon,
                  color: "text-purple-500",
                  title: "Data Management",
                  subtitle: "Intelligent Insights",
                },
              ].map(({ Icon, color, title, subtitle }, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-xl"
                >
                  <Icon className={`w-10 h-10 ${color}`} />
                  <div>
                    <h3 className="font-semibold dark:text-gray-200">
                      {title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {subtitle}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Our Features
            </h2>
            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300">
              Powerful solutions designed to elevate your business
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                Icon: CloudIcon,
                color: "text-blue-500",
                title: "Cloud Integration",
                description:
                  "Seamless cloud solutions that scale with your business needs.",
              },
              {
                Icon: CodeIcon,
                color: "text-green-500",
                title: "Custom Development",
                description:
                  "Tailored software solutions to match your unique requirements.",
              },
              {
                Icon: DatabaseIcon,
                color: "text-purple-500",
                title: "Data Analytics",
                description:
                  "Advanced data insights to drive strategic decision-making.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl text-center shadow-md"
              >
                <div
                  className={`mx-auto w-16 h-16 mb-4 flex items-center justify-center ${feature.color} bg-opacity-10 rounded-full`}
                >
                  <feature.Icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 dark:text-gray-200">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="about" className="py-20 bg-white dark:bg-gray-900">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              About Us
            </h2>
            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300">
              Our mission is to transform digital experiences
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">
                Innovative Technology, Personal Touch
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                We are a team of passionate technologists dedicated to creating
                solutions that not only solve problems but also inspire
                innovation.
              </p>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                With years of experience across multiple industries, we
                understand the unique challenges businesses face in the digital
                landscape.
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8"
            >
              {[
                {
                  Icon: CodeIcon,
                  color: "text-blue-500",
                  title: "Our Approach",
                  subtitle: "Client-centric, agile, and innovative",
                },
                {
                  Icon: DatabaseIcon,
                  color: "text-green-500",
                  title: "Our Vision",
                  subtitle: "Empowering businesses through technology",
                },
              ].map(({ Icon, color, title, subtitle }, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center mb-4 sm:mb-6"
                >
                  <div
                    className={`w-12 sm:w-16 h-12 sm:h-16 ${color} bg-opacity-10 rounded-full flex items-center justify-center mr-4`}
                  >
                    <Icon className="w-6 sm:w-8 h-6 sm:h-8" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base sm:text-xl dark:text-gray-200">
                      {title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {subtitle}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Contact Us
            </h2>
            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300">
              We would love to hear from you. Let us start a conversation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-700 p-6 sm:p-8 rounded-xl shadow-md"
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                Get in Touch
              </h3>
              <div className="space-y-4">
                {[
                  {
                    Icon: MailIcon,
                    title: "Email",
                    content: "hello@productname.com",
                  },
                  {
                    Icon: PhoneIcon,
                    title: "Phone",
                    content: "+1 (123) 456-7890",
                  },
                  {
                    Icon: MapPinIcon,
                    title: "Address",
                    content: "123 Tech Lane, Innovation City",
                  },
                ].map(({ Icon, title, content }, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 text-gray-600 dark:text-gray-300"
                  >
                    <Icon className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {title}
                      </p>
                      <p className="text-sm">{content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-700 p-6 sm:p-8 rounded-xl shadow-md"
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                Send us a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                    rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                    rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                    rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full px-4 py-2 rounded-lg transition flex items-center justify-center space-x-2 ${
                    isSubmitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                >
                  <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <footer className="bg-gray-100 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2024 ProductName. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            {["Privacy", "Terms", "Sitemap"].map((link, index) => (
              <a
                key={index}
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </motion.div>
  );
}

export default Home;
