import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteEvent, API_BASE_URL } from "../../utils/api";

const EventCard = ({ event, onBook }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleUpdate = () => {
    Swal.fire({
      title: "Update Event",
      text: "Are you sure you want to update this event?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/admin/update-event/${event.id}`);
      }
    });
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Delete Event",
      text: "Are you sure you want to delete this event?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEvent(event.id)
          .then(() => {
            Swal.fire("Deleted!", "The event has been deleted.", "success");
            window.location.reload();
          })
          .catch((error) => {
            Swal.fire("Error!", "Failed to delete event.", "error");
            console.error(error);
          });
      }
    });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
      {event.image && (
        <img
          src={`${API_BASE_URL}${event.image}`}
          alt={event.name}
          className="w-full h-48 object-cover rounded-t-lg mb-4"
        />
      )}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.name}</h3>
      <p className="text-gray-600 mb-2">{event.description}</p>
      <p className="text-gray-700"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p className="text-gray-700"><strong>Time:</strong> {event.time}</p>
      <p className="text-gray-700"><strong>Location:</strong> {event.location}</p>
      <p className="text-gray-700"><strong>VIP Price:</strong> ${event.price_vip}</p>
      <p className="text-gray-700"><strong>Regular Price:</strong> ${event.price_regular}</p>
      <p className="text-gray-700"><strong>VIP Tickets:</strong> {event.tickets_vip}</p>
      <p className="text-gray-700"><strong>Regular Tickets:</strong> {event.tickets_regular}</p>
      {user?.role === "user" && (
        <button
          onClick={() => onBook(event)}
          className={`mt-4 w-full px-4 py-2 rounded-lg text-white ${
            event.tickets_vip === 0 && event.tickets_regular === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition duration-300`}
          disabled={event.tickets_vip === 0 && event.tickets_regular === 0}
        >
          {event.tickets_vip === 0 && event.tickets_regular === 0 ? "Sold Out" : "Book Now"}
        </button>
      )}
      {user?.role === "admin" && (
        <div className="mt-4 flex space-x-4">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default EventCard;