import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import deepak from "../assets/deepak.jpg";
import pivink from "../assets/pivink.jpg";
import {
  Github,
  Linkedin,
  Mail,
  Upload,
  Settings,
  BarChart3,
  Network,
  ChevronRight,
  ArrowRight,
  Database,
  Code,
  LineChart,
  Cpu,
  Layers,
  LayoutDashboard,
  Users,
  Briefcase,
  Wrench,
  CheckCircle2,
  User,
  Zap,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("why");

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-100/40 via-transparent to-transparent"></div>
        <div className="absolute right-0 top-1/4 w-96 h-96 bg-indigo-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute left-1/4 bottom-0 w-64 h-64 bg-violet-100 rounded-full filter blur-3xl opacity-30"></div>

        <div className="container max-w-6xl mx-auto relative">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="inline-block mb-4 px-3 py-1 bg-orange-100 text-800 rounded-full text-sm font-medium">
              No-Code ML Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-800 via-gray-50 to-yellow-800 bg-clip-text text-transparent leading-tight">
              AutoML Studio
            </h1>
            <p className="text-xl md:text-2xl text-gray-50 mb-8 leading-relaxed px-4">
              Build powerful machine learning models without writing a single
              line of code. Upload, preprocess, model, and visualize with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <button
                onClick={() => navigate("/automl")}
                className="px-6 py-3 md:px-8 md:py-3 text-lg rounded-md bg-gradient-to-r from-yellow-600 to-gray-400 hover:from-orange-700 hover:to-gray-700 text-white flex items-center justify-center"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="px-6 py-3 md:px-8 md:py-3 text-lg rounded-md bg-gradient-to-r from-yellow-600 to-gray-400 hover:from-orange-700 hover:to-gray-700 text-white flex items-center justify-center">
                Watch Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 px-4 md:px-8 bg-gradient-to-b from-slate-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-700 via-gray-700 to-yellow-700 bg-clip-text text-transparent leading-tight"
            >
              Why Choose AutoML Studio?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed"
            >
              Transform your data into powerful predictions with our intuitive
              machine learning platform
            </motion.p>
          </div>

          <div className="max-w-5xl mx-auto">
            <motion.div
              className="flex flex-col md:flex-row gap-4 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {["why", "features", "users"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-yellow-600 text-white shadow-lg shadow-gray-200"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab === "why" && "Key Benefits"}
                  {tab === "features" && "Core Features"}
                  {tab === "users" && "Who It's For"}
                </button>
              ))}
            </motion.div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "why" && (
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: Settings,
                      title: "No Coding Required",
                      desc: "Build sophisticated ML models through an intuitive drag-and-drop interface.",
                      color: "from-yellow-600 to-gray-600",
                    },
                    {
                      icon: BarChart3,
                      title: "Instant Results",
                      desc: "Visualize model performance and get insights in seconds, not days.",
                      color: "from-yellow-600 to-gray-600",
                    },
                    {
                      icon: Network,
                      title: "Enterprise Ready",
                      desc: "Scale from personal projects to enterprise-level deployments seamlessly.",
                      color: "from-yellow-600 to-gray-600",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100"
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl`}
                      />
                      <div
                        className={`h-14 w-14 rounded-xl mb-6 bg-gradient-to-br ${feature.color} flex items-center justify-center`}
                      >
                        <feature.icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-slate-800">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "features" && (
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Advanced Data Perprocessing",
                      desc: " Automatically clean, transform, and prepare your data with AI-powered feature engineering.",
                      color: "from-yellow-600 to-gray-600",
                    },
                    {
                      title: "Model Selection",
                      desc: "Choose from dozens of pre-configured ML algorithms optimized for different use cases.",
                      color: "from-yellow-600 to-gray-600",
                    },
                    {
                      title: "Interactive Visualizations",
                      desc: "Explore your data and model results with beautiful, interactive 3D charts and dashboards.",
                      color: "from-yellow-600 to-gray-600",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100"
                    >
                      <div
                        className={`h-2 bg-gradient-to-r ${feature.color} rounded-full mb-6`}
                      />
                      <h3 className="text-2xl font-bold mb-4 text-slate-800">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "users" && (
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Data Analysts",
                      desc: "Enhance your analysis capabilities without needing to learn complex ML frameworks.",
                      color: "from-yellow-600 to-gray-600",
                    },
                    {
                      title: "Business Leaders",
                      desc: "Make data-driven decisions with powerful insights without technical dependencies.",
                      color: "from-yellow-600 to-gray-600",
                    },
                    {
                      title: "ML Engineers",
                      desc: "Prototype quickly and focus on complex tasks while automating the routine work.",
                      color: "from-yellow-600 to-gray-600",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 group"
                    >
                      <div
                        className={`h-14 w-14 rounded-xl mb-6 bg-gradient-to-br ${feature.color} opacity-90 group-hover:opacity-100 transition-opacity`}
                      />
                      <h3 className="text-2xl font-bold mb-4 text-slate-800">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 px-4 md:px-6 bg-gradient-to-b from-white to-indigo-50/30 relative overflow-hidden "
      >
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-100/40 to-transparent" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-violet-200/10 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />

        <div className="container max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-600 to-gray-600 bg-clip-text text-transparent"
            >
              Transform Data into Insights
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto"
            >
              Four seamless steps from raw data to actionable predictions.
              Experience machine learning made elegant.
            </motion.p>
          </div>

          <div className="relative">
            {/* Animated connection line */}
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent transform -translate-y-1/2 hidden md:block">
              <motion.div
                className="absolute h-full w-full bg-gradient-to-r from-yellow-500 to-gray-500"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                viewport={{ once: true }}
              />
            </div>

            <div className="grid md:grid-cols-4 gap-8 relative">
              {[
                {
                  icon: <Upload className="h-7 w-7" />,
                  title: "Data Ingestion",
                  description:
                    "Drag & drop CSV, Excel, or connect databases. Automatic schema detection & type inference.",
                  color: "from-yellow-500 to-gray-500",
                },
                {
                  icon: <Settings className="h-7 w-7" />,
                  title: "Smart Processing",
                  description:
                    "AI-powered cleaning, transformation, and feature engineering with visual guidance.",
                  color: "from-yellow-500 to-gray-500",
                },
                {
                  icon: <Network className="h-7 w-7" />,
                  title: "Model Crafting",
                  description:
                    "AutoML optimization or manual selection from 50+ state-of-the-art algorithms.",
                  color: "from-yellow-500 to-gray-500",
                },
                {
                  icon: <BarChart3 className="h-7 w-7" />,
                  title: "Insight Synthesis",
                  description:
                    "Interactive 3D visualizations, explainable AI, and one-click deployment.",
                  color: "from-yellow-500 to-gray-500",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="relative z-10 group"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-100/30 to-indigo-100/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200/60 h-full">
                    {/* Step number */}

                    {/* Icon container */}
                    <div
                      className={`mb-6 w-fit mx-auto p-4 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg`}
                    >
                      {step.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-center mb-4 text-slate-800">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 text-center leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          ></motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section
        id="team"
        className="py-20 px-4 md:px-6 bg-gradient-to-b from-indigo-50/30 to-violet-50/20 relative"
      >
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgOGgxNk0wIDBoMTZtMCAxNmgxNm0wLThoMTZtMCAwaDE2IiBzdHJva2U9IiNlZGVkZWQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')] opacity-5" />
        <div className="absolute -right-20 top-1/4 w-96 h-96 bg-violet-100/10 rounded-full blur-3xl" />
        <div className="absolute -left-20 bottom-0 w-96 h-96 bg-indigo-100/10 rounded-full blur-3xl" />
        <div className="absolute -left-20 top-1/2 w-96 h-106 bg-violet-100/10 rounded-full blur-3xl" />

        <div className="container max-w-7xl mx-auto relative">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-600 to-gray-50 bg-clip-text text-transparent">
              Meet The Developer
            </h2>
            <p className="text-lg md:text-xl text-gray-50 max-w-2xl mx-auto">
              Passionate innovators creating intuitive machine learning
              experiences
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                image: deepak, // Update path to your image
                name: "Deepak Code",
                role: "Backend Architect & Security Lead",
                bio: "Software Developer and experience in distributed systems and cryptographic solutions. Focused on building secure, scalable infrastructure with privacy-by-design principles.",
                color: "from-yellow-600 to-gray-600",
                links: [
                  { icon: Github, url: "https://github.com/deepakcode21" },
                  {
                    icon: Linkedin,
                    url: "https://www.linkedin.com/in/deepakcode21/",
                  },
                  { icon: Mail, url: "deepakcode21@gmail.com" },
                ],
              },
              {
                image: pivink, // Update path to your image
                name: "Pivink Kumar",
                role: "Data Science & Frontend Lead",
                bio: "Full-stack data scientist specializing in predictive analytics and AI-powered interfaces. Passionate about making complex ML accessible through elegant design.",
                color: "from-yellow-600 to-gray-600",
                links: [
                  { icon: Github, url: "https://github.com/Pivink" },
                  {
                    icon: Linkedin,
                    url: "https://www.linkedin.com/in/pivink-kumar-a791b32b3/",
                  },
                  {
                    icon: Mail,
                    url: "https://portfolio-seven-iota-51.vercel.app/",
                  },
                ],
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
                className="group relative"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100/30 to-indigo-100/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="h-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200/60 overflow-hidden">
                  {/* Profile header */}
                  <div className={`h-2 bg-gradient-to-r ${member.color}`} />
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-6">
                      {/* Updated Image Container */}
                      <div
                        className={`relative p-0.5 rounded-full bg-gradient-to-br ${member.color}`}
                      >
                        <div className="bg-white rounded-full p-1">
                          <img
                            src={member.image}
                            alt={`${member.name}'s profile`}
                            className="h-20 w-20 rounded-full object-cover border-2 border-white"
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">
                          {member.name}
                        </h3>
                        <p className="text-slate-600 mt-1">{member.role}</p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-slate-600 mt-6 leading-relaxed">
                      {member.bio}
                    </p>

                    {/* Social links */}
                    <div className="mt-6 pt-4 border-t border-slate-200/60 flex gap-4">
                      {member.links.map((link, linkIndex) => (
                        <motion.a
                          key={linkIndex}
                          href={link.url}
                          className="text-slate-600 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-slate-100/50"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <link.icon className="h-6 w-6" />
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section
        id="tech"
        className="py-10 px-4 md:px-6 bg-gradient-to-b from-indigo-50/20 to-violet-50/10 relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDIyQzYuNDc3IDIyIDIgMTcuNTIzIDIgMTJTNi40NzcgMiAxMiAycyAxMCA0LjQ3NyAxMCAxMC00LjQ3NyAxMC0xMCAxMHptMC0yYTggOCAwIDEgMCAwLTE2IDggOCAwIDAgMCAwIDE2eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZWVlZWVlIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] opacity-10" />
        <div className="absolute -right-20 top-1/3 w-96 h-96 bg-violet-100/20 rounded-full blur-3xl" />
        <div className="absolute -left-20 bottom-0 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl" />

        <div className="container max-w-7xl mx-auto relative">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-600 to-gray-650 bg-clip-text text-transparent">
              Modern Tech Stack
            </h2>
            <p className="text-lg md:text-xl text-gray-50 max-w-2xl mx-auto">
              Leveraging cutting-edge technologies for peak performance and
              reliability
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "React",
                icon: <Code className="h-8 w-8" />,
                gradient: "from-blue-500 to-cyan-500",
                bg: "bg-blue-50/50",
              },
              {
                name: "FastAPI",
                icon: <Zap className="h-8 w-8" />,
                gradient: "from-green-500 to-teal-500",
                bg: "bg-green-50/50",
              },
              {
                name: "Scikit-learn",
                icon: <Cpu className="h-8 w-8" />,
                gradient: "from-orange-500 to-amber-500",
                bg: "bg-orange-50/50",
              },
              {
                name: "Vercel",
                icon: <Layers className="h-8 w-8" />,
                gradient: "from-slate-600 to-slate-800",
                bg: "bg-slate-50/50",
              },
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                viewport={{ once: true, margin: "-100px" }}
                className="group relative"
              >
                <div
                  className={`h-full bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200/60 ${tech.bg}`}
                >
                  {/* Gradient circle */}
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${tech.gradient} mb-6 mx-auto flex items-center justify-center shadow-lg`}
                  >
                    <div className="text-white">{tech.icon}</div>
                  </div>

                  <h3 className="text-xl font-semibold text-center text-slate-800 mb-2">
                    {tech.name}
                  </h3>
                  <motion.div
                    className="h-[2px] bg-gradient-to-r via-transparent from-30% to-70% w-16 mx-auto my-4 opacity-50 group-hover:opacity-100 transition-opacity"
                    initial={{
                      background:
                        "linear-gradient(to right, transparent, #ddd, transparent)",
                    }}
                    whileHover={{
                      background:
                        "linear-gradient(to right, transparent, currentColor, transparent)",
                    }}
                  />

                  {/* Animated tech description */}
                  <motion.div
                    className="hidden md:block text-sm text-slate-600 text-center leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    {tech.name === "React" &&
                      "Frontend architecture with reactive components and modern hooks"}
                    {tech.name === "FastAPI" &&
                      "High-performance API backend with Python async capabilities"}
                    {tech.name === "Scikit-learn" &&
                      "Machine learning toolkit for predictive data analysis"}
                    {tech.name === "Vercel" &&
                      "Cloud platform for static sites and serverless functions"}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Animated decorative grid */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="h-full w-full pattern-dots pattern-slate-200 pattern-opacity-50 pattern-size-4" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
