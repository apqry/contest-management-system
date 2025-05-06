import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Contestants from './pages/Contestants';
import Supervisors from './pages/Supervisors';
import Competitions from './pages/Competitions';
import Scores from './pages/Scores';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <Navbar />
        <main className="p-4 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contestants" element={<Contestants />} />
            <Route path="/supervisors" element={<Supervisors />} />
            <Route path="/competitions" element={<Competitions />} />
            <Route path="/scores" element={<Scores />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
