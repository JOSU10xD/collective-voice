import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';

// Lazy load pages for better performance
import Home from './pages/Home';
import CreatePetition from './pages/CreatePetition';
import PetitionDetail from './pages/PetitionDetail';
import Notifications from './pages/Notifications';
import Policies from './pages/Policies';
import Profile from './pages/Profile';

import AuthParams from './pages/AuthParams'; // Handles both Login/Register
import NotFound from './pages/NotFound';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home filter="global" />} />
            <Route path="viswajyothi" element={<Home filter="viswajyothi" />} />
            <Route path="my-petitions" element={<ProtectedRoute><Home filter="mine" /></ProtectedRoute>} />

            <Route path="petition/:id" element={<PetitionDetail />} />

            <Route path="create" element={
              <ProtectedRoute>
                <CreatePetition />
              </ProtectedRoute>
            } />

            <Route path="notifications" element={<Notifications />} />
            <Route path="policies" element={<Policies />} />

            <Route path="profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="/login" element={<AuthParams type="login" />} />
          <Route path="/register" element={<AuthParams type="register" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
