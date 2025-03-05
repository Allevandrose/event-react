import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await dispatch(registerUser(formData)).unwrap();

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "You can now log in.",
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error?.error || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">Register</h2>

      <input
        type="text"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        placeholder="First Name"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />

      <input
        type="text"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        placeholder="Last Name"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />

      <button
        type="submit"
        className={`w-full bg-green-600 text-white p-3 rounded-lg transition duration-300 ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
        }`}
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default RegistrationForm;
