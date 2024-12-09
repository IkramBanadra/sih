import { useState, useEffect } from "react";
// import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  CloudIcon,
  CodeIcon,
  DatabaseIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  SunIcon,
  MoonIcon,
} from "lucide-react";

function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Dark mode and section tracking setup
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

  // Intersection Observer for active section
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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We will get back to you soon.");
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  return (
    <div
      className={`
      ${isDarkMode ? "dark bg-gray-900 text-gray-100" : "bg-white"}
      transition-colors duration-300 ease-in-out
    `}
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed top-4 right-6 z-50 bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-lg"
      >
        {isDarkMode ? (
          <SunIcon className="text-yellow-500" />
        ) : (
          <MoonIcon className="text-gray-800" />
        )}
      </button>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md z-40 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            ProductName
          </div>
          <div className="space-x-6">
            {["home", "features", "about", "contact"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`
                  capitalize text-gray-600 dark:text-gray-300 
                  hover:text-gray-900 dark:hover:text-white 
                  transition
                  ${
                    activeSection === section
                      ? "font-bold text-blue-600 dark:text-blue-400"
                      : ""
                  }
                `}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Home Section */}
      <section
        id="home"
        className="min-h-screen pt-20 container mx-auto px-6 flex items-center"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              Transform Your Digital Experience
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Innovative solutions that blend cutting-edge technology with
              seamless user experiences.
            </p>
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg 
              flex items-center space-x-2 hover:bg-blue-700 transition"
            >
              <span>Get Started</span>
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="hidden md:flex justify-center relative">
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
                <div
                  key={index}
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Our Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Powerful solutions designed to elevate your business
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
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
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl text-center shadow-md"
              >
                <div
                  className={`mx-auto w-20 h-20 mb-4 flex items-center justify-center ${feature.color} bg-opacity-10 rounded-full`}
                >
                  <feature.Icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-gray-200">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              About Us
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Our mission is to transform digital experiences
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                Innovative Technology, Personal Touch
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We are a team of passionate technologists dedicated to creating
                solutions that not only solve problems but also inspire
                innovation.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                With years of experience across multiple industries, we
                understand the unique challenges businesses face in the digital
                landscape.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg p-8">
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
                <div key={index} className="flex items-center mb-6">
                  <div
                    className={`w-16 h-16 ${color} bg-opacity-10 rounded-full flex items-center justify-center mr-4`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xl dark:text-gray-200">
                      {title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Contact Us
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              We would love to hear from you
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your Message"
                rows="5"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-8">
              {[
                {
                  Icon: PhoneIcon,
                  color: "text-blue-500",
                  title: "Phone",
                  content: "(123) 456-7890",
                },
                {
                  Icon: MailIcon,
                  color: "text-green-500",
                  title: "Email",
                  content: "contact@productname.com",
                },
                {
                  Icon: MapPinIcon,
                  color: "text-red-500",
                  title: "Address",
                  content: "123 Tech Lane, Innovation City",
                },
              ].map(({ Icon, color, title, content }, index) => (
                <div key={index} className="flex items-center mb-6">
                  <Icon className={`w-8 h-8 mr-4 ${color}`} />
                  <div>
                    <h4 className="font-semibold dark:text-gray-200">
                      {title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">ProductName</h4>
            <p className="text-gray-400">
              Transforming digital experiences through innovative technology
              solutions.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Features", "About", "Contact"].map((link) => (
                <li key={link}>
                  <button
                    onClick={() => scrollToSection(link.toLowerCase())}
                    className="text-gray-400 hover:text-white transition"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              {[
                { name: "Twitter", url: "#" },
                { name: "LinkedIn", url: "#" },
                { name: "GitHub", url: "#" },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="text-gray-400 hover:text-white transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-500">
            © 2024 ProductName. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
