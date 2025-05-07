import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AutoML from './pages/AutoML';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/automl" element={<AutoML />} />
      </Routes>
    </Router>
  );
}

export default App;
