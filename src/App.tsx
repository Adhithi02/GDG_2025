import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import NewComplaint from './pages/citizen/NewComplaint';
import ComplaintDetail from './pages/citizen/ComplaintDetail';
import GovernmentDashboard from './pages/government/GovernmentDashboard';
import ComplaintManagement from './pages/government/ComplaintManagement';

function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Citizen Routes */}
              <Route 
                path="/citizen/dashboard" 
                element={
                  <ProtectedRoute requiredRole="citizen">
                    <CitizenDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/citizen/new-complaint" 
                element={
                  <ProtectedRoute requiredRole="citizen">
                    <NewComplaint />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/citizen/complaint/:id" 
                element={
                  <ProtectedRoute requiredRole="citizen">
                    <ComplaintDetail />
                  </ProtectedRoute>
                } 
              />
              
              {/* Government Routes */}
              <Route 
                path="/government/dashboard" 
                element={
                  <ProtectedRoute requiredRole="government">
                    <GovernmentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/government/complaint/:id" 
                element={
                  <ProtectedRoute requiredRole="government">
                    <ComplaintManagement />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </ComplaintProvider>
    </AuthProvider>
  );
}

export default App;