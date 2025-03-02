// src/components/forms/RegistrationForm.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData))
      .unwrap()
      .then((data) => {
        Swal.fire("Success!", "Registration successful!", "success");
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        Swal.fire("Error!", error.error || "Registration failed.", "error");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Register</h2>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Full Name"
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
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button
        type="submit"
        className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition duration-300"
      >
        Register
      </button>
    </form>
  );
};

export default RegistrationForm;