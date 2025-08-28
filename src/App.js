import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { io } from "socket.io-client";
import BASE_URL from "./endpoints/endpoints";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Superagent from "./pages/SuperAgent";
import Normalagent from "./pages/NormalAgent";
import Premium from "./pages/Premium";
import OtherDashboard from "./pages/OtherDashboard";
import Analytics from "./components/AnalyticsPage";
import Settings from "./components/SettingsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";

function App() {
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (userId && isLoggedIn === 'true') {
      const socket = io(BASE_URL);

      socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        socket.emit('register', parseInt(userId));
      });

      socket.on('role-updated', (data) => {
        toast.info("Your user role has been updated. The page will now refresh.");
        localStorage.setItem('role', data.newRole);
        // Reload the page to reflect the new role and permissions
        setTimeout(() => {
          window.location.reload();
        }, 3000); // Wait 3 seconds for the user to read the toast
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });

      // Cleanup on component unmount
      return () => {
        socket.disconnect();
      };
    }
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user" 
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/premium" 
          element={
            <ProtectedRoute allowedRoles={['PREMIUM']}>
              <Premium />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/superagent" 
          element={
            <ProtectedRoute allowedRoles={['SUPER']}>
              <Superagent />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/normalagent" 
          element={
            <ProtectedRoute allowedRoles={['NORMAL']}>
              <Normalagent />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/other" 
          element={
            <ProtectedRoute allowedRoles={['Other']}>
              <OtherDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Dashboard sub-routes */}
        <Route 
          path="/dashboard/analytics" 
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
