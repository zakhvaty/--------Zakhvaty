import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResultPage from './pages/ResultPage';
import RedirectPage from './pages/RedirectPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/s/:shortId" element={<RedirectPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
