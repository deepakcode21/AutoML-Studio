// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";



const Navbar = () => {

    const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
    <div className="container max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-6">
      <div className="flex items-center gap-2">
        <div className="bg-gradient-to-r from-yellow-600 to-gray-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">
          A
        </div>
        <span onClick={() => navigate("/")} className="font-bold text-xl bg-gradient-to-r from-yellow-600 to-gray-600 bg-clip-text text-transparent cursor-default">
          AutoML Studio
        </span>
      </div>
      <div className="hidden md:flex items-center gap-6">
        <Link
          to="#features"
          className="text-sm font-medium text-yellow-600 hover:text-orange-600"
        >
          Features
        </Link>
        <Link
          to="#how-it-works"
          className="text-sm font-medium text-yellow-600 hover:text-orange-600"
        >
          How It Works
        </Link>
        <Link
          to="#team"
          className="text-sm font-medium text-yellow-600 hover:text-orange-600"
        >
          Team
        </Link>
        <Link
          to="#tech"
          className="text-sm font-medium text-yellow-600 hover:text-orange-600"
        >
          Technology
        </Link>
      </div>
      <div>
        <button
          onClick={() => navigate("/automl")}
          className="px-4 py-2 rounded-md bg-gradient-to-r from-yellow-600 to-gray-600 hover:from-orange-600 hover:to-gray-600 text-white transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  </nav>
  );
};

export default Navbar;
