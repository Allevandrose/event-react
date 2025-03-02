import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/events?search=${searchTerm}`);
      setSearchTerm("");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold flex items-center">
          Hi-Events
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 rounded-l-md text-black"
            />
            <button type="submit" className="bg-blue-500 p-2 rounded-r-md hover:bg-blue-600">
              <i className="ri-search-line"></i>
            </button>
          </form>
          {user ? (
            <>
              <span className="text-sm">Welcome, {user.first_name || user.name}</span>
              <Link to="/" className="hover:text-gray-200 transition">Home</Link>
              <Link to="/events" className="hover:text-gray-200 transition">Events</Link>
              <Link to="/bookings" className="hover:text-gray-200 transition">Bookings</Link>
              <Link to="/tickets" className="hover:text-gray-200 transition">Tickets</Link>
              <Link to="/profile" className="hover:text-gray-200 transition">Profile</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="hover:text-gray-200 transition">Register</Link>
              <Link to="/login" className="hover:text-gray-200 transition">Login</Link>
            </>
          )}
        </div>
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className="ri-menu-line"></i>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-blue-700 p-4 mt-2 space-y-2 rounded-lg">
          <form onSubmit={handleSearch} className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 rounded-l-md text-black w-full"
            />
            <button type="submit" className="bg-blue-500 p-2 rounded-r-md hover:bg-blue-600">
              <i className="ri-search-line"></i>
            </button>
          </form>
          {user ? (
            <>
              <Link to="/" className="block hover:text-gray-300">Home</Link>
              <Link to="/events" className="block hover:text-gray-300">Events</Link>
              <Link to="/bookings" className="block hover:text-gray-300">Bookings</Link>
              <Link to="/tickets" className="block hover:text-gray-300">Tickets</Link>
              <Link to="/profile" className="block hover:text-gray-300">Profile</Link>
              <button
                onClick={handleLogout}
                className="w-full text-left bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="block hover:text-gray-300">Register</Link>
              <Link to="/login" className="block hover:text-gray-300">Login</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;