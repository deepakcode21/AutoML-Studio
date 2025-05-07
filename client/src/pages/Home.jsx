import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-50 to-blue-100 font-sans text-gray-800">
      {/* Hero Section */}
      <header className="text-center py-20 px-4">
        <h1 className="text-5xl font-bold text-blue-800 mb-4">AutoML Studio 🚀</h1>
        <p className="text-xl max-w-2xl mx-auto mb-6">
          A No-Code Automated Machine Learning Platform to upload data, preprocess, select ML models, and visualize results—all with zero coding!
        </p>
        <Link
          to="/automl"
          className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-200"
        >
          Get Started
        </Link>
      </header>

      {/* Meet the Developers */}
      <section className="bg-white py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Meet the Developers 👨‍💻</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
          {/* Arrowmax */}
          <div className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-800">Arrowmax</h3>
            <p className="text-sm mt-2 text-gray-600">Fullstack Developer & Project Lead</p>
          </div>

          {/* Deepak */}
          <div className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-800">Deepak</h3>
            <p className="text-sm mt-2 text-gray-600">Backend Developer (FastAPI)</p>
          </div>

          {/* Pivink */}
          <div className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-800">Pivink</h3>
            <p className="text-sm mt-2 text-gray-600">Data Analytics & Frontend Developer</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-600 bg-blue-100 mt-10">
        © 2025 AutoML Studio. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
