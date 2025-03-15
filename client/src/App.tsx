import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Home from './pages/Home';
import Success from './pages/Success';
import Feedback from './pages/Feedback';
import Results from './pages/Results';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import './styles/index.css';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        {/* Floating background shape */}
        <div className="floating-shape-1"></div>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/success" element={<Success />} />
          <Route path="/feedback/:uniqueId" element={<Feedback />} />
          <Route path="/results/:uniqueId" element={<Results />} />
          <Route path="/auth/:uniqueId" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
