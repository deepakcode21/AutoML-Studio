import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AutoML from './pages/AutoML';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdvancedCleaning from './pages/AdvanceCleaning';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/automl" element={<AutoML />} />
        <Route path="/clean" element={<AdvancedCleaning />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
