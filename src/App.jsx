import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

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
import Payment from "./pages/user/Payment";
import BookingForm from "./components/forms/BookingForm";

// ✅ Load Stripe public key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// ✅ Payment Completion Page
const PaymentComplete = () => {
    const { state } = useLocation();
    const paymentIntent = state?.paymentIntent;

    return (
        <div className="p-6 text-center">
            {paymentIntent?.status === 'succeeded' ? (
                <div className="text-green-500 text-xl font-semibold">
                    ✅ Payment successful! Redirecting...
                </div>
            ) : (
                <div className="text-red-500 text-xl font-semibold">
                    ❌ Payment failed. Please try again.
                </div>
            )}
        </div>
    );
};

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Elements stripe={stripePromise}>
      <Router>
        {user?.role === "admin" ? <Sidebar /> : <Navbar />}
        <div className={user?.role === "admin" ? "ml-64 p-4" : "p-4"}>
          <Routes>
            {/* 🔓 Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* 👤 User Routes (Protected) */}
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
            <Route path="/bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
            <Route path="/tickets" element={<PrivateRoute><Tickets /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/booking" element={<PrivateRoute><BookingForm /></PrivateRoute>} />
            <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
            <Route path="/payment/complete" element={<PrivateRoute><PaymentComplete /></PrivateRoute>} />

            {/* 🔐 Admin Routes (Protected) */}
            <Route path="/admin" element={<PrivateRoute role="admin"><AdminHome /></PrivateRoute>} />
            <Route path="/admin/create-event" element={<PrivateRoute role="admin"><CreateEvent /></PrivateRoute>} />
            <Route path="/admin/events" element={<PrivateRoute role="admin"><AdminEvents /></PrivateRoute>} />
            <Route path="/admin/update-event/:id" element={<PrivateRoute role="admin"><UpdateEvent /></PrivateRoute>} />
            <Route path="/admin/users" element={<PrivateRoute role="admin"><UserManagement /></PrivateRoute>} />

            {/* ❌ 404 Page */}
            <Route path="*" element={<Custom404 />} />
          </Routes>
        </div>
      </Router>
    </Elements>
  );
}

export default App;
