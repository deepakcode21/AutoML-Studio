import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AutoML from './pages/AutoML';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/automl" element={<AutoML />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
