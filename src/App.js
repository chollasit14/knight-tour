import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Game from './components/Game';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="ad-container top-ad">โฆษณา (ซ่อน)</div>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </div>
        <div className="ad-container side-ad">โฆษณา (ซ่อน)</div>
      </div>
    </Router>
  );
}

export default App;