import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import DiscoveryFeed from './pages/DiscoveryFeed';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import SiteAnalytics from './pages/SiteAnalytics';
import Pricing from './pages/Pricing';
import About from './pages/About';
import { Privacy, Terms } from './pages/Legal';
import { dbService } from './services/dbService';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }: { children?: React.ReactNode, allowedRoles?: string[] }) => {
  const user = dbService.getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          
          {/* Public Pages */}
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          
          {/* Website Owner Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/analytics/:id" element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <SiteAnalytics />
            </ProtectedRoute>
          } />

          {/* Traffic Generator Routes */}
          <Route path="/feed" element={
            <ProtectedRoute allowedRoles={['GENERATOR']}>
              <DiscoveryFeed />
            </ProtectedRoute>
          } />
          
          <Route path="/leaderboard" element={
            <ProtectedRoute allowedRoles={['GENERATOR']}>
              <Leaderboard />
            </ProtectedRoute>
          } />

          {/* Shared Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;