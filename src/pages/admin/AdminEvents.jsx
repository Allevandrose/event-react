import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents } from "../../redux/slices/eventSlice";
import EventCard from "../../components/common/EventCard";

const AdminEvents = () => {
  const dispatch = useDispatch();
  const { allEvents, loading, error } = useSelector((state) => state.events);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("Fetching all events...");
    dispatch(fetchAllEvents());
  }, [dispatch]);

  const filteredEvents = allEvents.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) {
    console.error("Error fetching events:", error);
    return <p className="text-center text-red-500">{error}</p>;
  }
  console.log("All Events:", allEvents);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Events</h1>
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md mx-auto p-2 mb-6 border rounded"
      />
      {!loading && !error && filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        !loading && !error && <p className="text-center text-gray-600">No events found.</p>
      )}
    </div>
  );
};

export default AdminEvents;