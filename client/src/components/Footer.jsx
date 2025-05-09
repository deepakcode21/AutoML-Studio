import React from 'react'
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
import { useNavigate } from 'react-router-dom';

const Footer = () => {

  const navigate = useNavigate();

  return (
    <footer className="py-12 px-4 md:px-6 bg-slate-900 text-slate-300">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-yellow-600 to-gray-600 w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold">
                  A
                </div>
                <span onClick={() => navigate("/")} className="font-bold text-2xl bg-gradient-to-r from-yellow-600 to-gray-400 bg-clip-text text-transparent cursor-default">
                  AutoML Studio
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Empowering everyone to build machine learning solutions without
                code.
              </p>
            </div>

            {/* Links Group */}
            <div className="md:col-span-2 flex flex-col md:flex-row justify-between gap-8">
              {/* Product Links */}
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-5 text-lg">
                  Product
                </h3>
                <ul className="space-y-3">
                  {["Features", "Pricing", "Documentation", "API"].map(
                    (item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-slate-400 hover:text-white transition-colors text-sm"
                        >
                          {item}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Company Links */}
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-5 text-lg">
                  Company
                </h3>
                <ul className="space-y-3">
                  {["About", "Blog", "Careers", "Contact"].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-slate-400 hover:text-white transition-colors text-sm"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 text-center md:text-left order-2 md:order-1">
              © {new Date().getFullYear()} AutoML Studio. All rights reserved.
            </p>
            <div className="flex gap-6 order-1 md:order-2">
              {[Github, Linkedin, Mail].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

  )
}

export default Footer