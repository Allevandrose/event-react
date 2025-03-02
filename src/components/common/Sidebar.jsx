import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";


const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/admin/events?search=${searchTerm}`);
      setSearchTerm("");
    }
  };

  return (
    <aside className={`fixed inset-y-0 left-0 bg-gray-900 text-white p-6 shadow-lg transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
      <div className="flex items-center justify-between mb-6">
        {!isCollapsed && (
          <div className="flex items-center">
            <img src="https://picsum.photos/200" alt="Hi-Events Logo" className="h-10 mr-3" />
            <h2 className="text-lg font-semibold">Hi-Events Admin</h2>
          </div>
        )}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-xl">
          <i className={isCollapsed ? "ri-arrow-right-s-line" : "ri-arrow-left-s-line"}></i>
        </button>
      </div>
      {user && !isCollapsed && <p className="text-sm mb-4">Welcome, {user.first_name || user.name}</p>}
      {!isCollapsed && (
        <form onSubmit={handleSearch} className="mb-6">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded text-black"
          />
          <button type="submit" className="mt-2 w-full bg-blue-500 p-2 rounded hover:bg-blue-600">
            <i className="ri-search-line"></i>
          </button>
        </form>
      )}
      <nav className="space-y-3">
        <Link to="/admin" className="block bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition flex items-center">
          <i className="ri-dashboard-line mr-2"></i> {!isCollapsed && "Dashboard"}
        </Link>
        <Link to="/admin/create-event" className="block bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition flex items-center">
          <i className="ri-calendar-event-line mr-2"></i> {!isCollapsed && "Create Event"}
        </Link>
        <Link to="/admin/events" className="block bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition flex items-center">
          <i className="ri-list-check mr-2"></i> {!isCollapsed && "Manage Events"}
        </Link>
        <Link to="/admin/users" className="block bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition flex items-center">
          <i className="ri-user-settings-line mr-2"></i> {!isCollapsed && "Manage Users"}
        </Link>
      </nav>
      {!isCollapsed && (
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-600 p-3 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
