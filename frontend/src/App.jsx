import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUser } from './features/auth/authSlice';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import LandingPage from './pages/Landing/LandingPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import MarketplacePage from './pages/Marketplace/MarketplacePage';
import MessagesPage from './pages/Messages/MessagesPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SettingsPage from './pages/Settings/SettingsPage';


function App() {
  const dispatch = useDispatch();

  // অ্যাপ রিলোড হলে ইউজার ডেটা লোড করা (Persist Login)
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* 🌍 Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* 🔒 Protected Dashboard Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* ✅ আসল ড্যাশবোর্ড পেজ কানেক্ট করা হলো */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;