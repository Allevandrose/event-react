import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import Custom404 from "./components/common/Custom404";
import PrivateRoute from "./components/common/PrivateRoute";
import Home from "./pages/user/Home";
import Events from "./pages/user/Events";
import Bookings from "./pages/user/Bookings";
import Tickets from "./pages/user/Tickets";
import Profile from "./pages/user/Profile";
import AdminHome from "./pages/admin/AdminHome";
import CreateEvent from "./pages/admin/CreateEvent";
import AdminEvents from "./pages/admin/AdminEvents";
import UpdateEvent from "./pages/admin/UpdateEvent";
import UserManagement from "./pages/admin/UserManagement";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      {user?.role === "admin" ? <Sidebar /> : <Navbar />}
      <div className={user?.role === "admin" ? "ml-64 p-4" : "p-4"}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* User Routes */}
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
          <Route path="/bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
          <Route path="/tickets" element={<PrivateRoute><Tickets /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<PrivateRoute role="admin"><AdminHome /></PrivateRoute>} />
          <Route path="/admin/create-event" element={<PrivateRoute role="admin"><CreateEvent /></PrivateRoute>} />
          <Route path="/admin/events" element={<PrivateRoute role="admin"><AdminEvents /></PrivateRoute>} />
          <Route path="/admin/update-event/:id" element={<PrivateRoute role="admin"><UpdateEvent /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute role="admin"><UserManagement /></PrivateRoute>} />

          {/* 404 Page */}
          <Route path="*" element={<Custom404 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
