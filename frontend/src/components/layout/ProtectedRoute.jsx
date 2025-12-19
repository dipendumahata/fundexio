import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1. লগইন না থাকলে ল্যান্ডিং পেজে ফেরত পাঠানো
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 2. রোল পারমিশন চেক (যদি স্পেসিফিক রোলের পেজ হয়)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <div className="p-10 text-center text-red-500">Access Denied: You do not have permission to view this page.</div>;
  }

  return children;
};

export default ProtectedRoute;