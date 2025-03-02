import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, deleteUser } from "../../redux/slices/userSlice";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../utils/api";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("Fetching users...");
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete User",
      text: "Are you sure you want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteUser(id))
          .unwrap()
          .then(() => {
            Swal.fire("Deleted!", "The user has been deleted.", "success");
          })
          .catch((err) => {
            Swal.fire("Error!", err.error || "Failed to delete user.", "error");
          });
      }
    });
  };

  const filteredUsers = users.filter((user) =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) {
    console.error("Error fetching users:", error);
    return <p className="text-center text-red-500">{error}</p>;
  }
  console.log("Users:", users);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Users</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md mx-auto p-2 mb-6 border rounded"
      />
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white p-6 rounded-lg shadow-lg">
              <img
                src={user.profile_image ? `${API_BASE_URL}${user.profile_image}` : "/default-profile.png"}
                alt={user.first_name}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <button
                onClick={() => handleDelete(user.id)}
                className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No users found.</p>
      )}
    </div>
  );
};

export default UserManagement;