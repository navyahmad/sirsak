import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage';
import SirsakDashboard from './pages/SirsakDashboard';
import WarkopDashboard from './pages/WarkopDashboard';

const App = () => {
  const [userRole, setUserRole] = useState(() => {
    // Cek localStorage saat pertama kali
    return localStorage.getItem('sirsak_role');
  });

  const handleLogin = (role) => {
    setUserRole(role);
    localStorage.setItem('sirsak_role', role);
  };

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('sirsak_role');
  };

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Login Page */}
          <Route 
            path="/login" 
            element={
              !userRole ? (
                <LoginPage onLogin={handleLogin} />
              ) : (
                <Navigate to={userRole === "Admin Warkop" ? "/warkop" : "/sirsak"} />
              )
            } 
          />
          
          {/* Sirsak Dashboard */}
          <Route 
            path="/sirsak" 
            element={
              userRole === "Admin Sirsak" ? (
                <SirsakDashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          {/* Warkop Dashboard */}
          <Route 
            path="/warkop" 
            element={
              userRole === "Admin Warkop" ? (
                <WarkopDashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
};

export default App;