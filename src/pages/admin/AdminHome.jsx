import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../redux/slices/eventSlice";
import { fetchAllUsers } from "../../redux/slices/userSlice";
import EventCard from "../../components/common/EventCard";

const AdminHome = () => {
  const dispatch = useDispatch();

  // Extract events and users state
  const { events, loading: eventsLoading, error: eventsError } = useSelector((state) => state.events);
  const { users, loading: usersLoading, error: usersError } = useSelector((state) => state.users);

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchEvents());
        await dispatch(fetchAllUsers());
      } catch (error) {
        console.error("Loading error:", error);
      }
    };
    loadData();
  }, [dispatch]);

  // ✅ Separate loading states
  if (eventsLoading || usersLoading) {
    return <p className="text-center text-gray-500 text-xl font-semibold">Loading dashboard data...</p>;
  }

  // ✅ Error handling with retry button
  if (eventsError || usersError) {
    console.error("Events Error:", eventsError);
    console.error("Users Error:", usersError);
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error loading dashboard data:</p>
        {eventsError && <p>⚠️ Events: {eventsError}</p>}
        {usersError && <p>⚠️ Users: {usersError}</p>}
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  console.log("Events:", events, "Users:", users);

  // ✅ Improved date filtering for upcoming events
  const futureEvents = events?.filter((event) => {
    const eventDate = new Date(event.date);
    const today = new Date();
    return eventDate >= today.setHours(0, 0, 0, 0);
  }) || [];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard</h1>
      
      {/* ✅ Dashboard Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Events" value={events?.length || 0} color="blue" />
        <StatCard title="Total Users" value={users?.length || 0} color="yellow" />
        <StatCard title="Upcoming Events" value={futureEvents?.length || 0} color="green" />
      </div>

      {/* ✅ Upcoming Events Section */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upcoming Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {futureEvents.length > 0 ? (
          futureEvents.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <p className="text-gray-500">No upcoming events available.</p>
        )}
      </div>
    </div>
  );
};

// ✅ Reusable StatCard Component
const StatCard = ({ title, value, color }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-800 border-blue-300",
    green: "bg-green-100 text-green-800 border-green-300",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
  };

  return (
    <div className={`p-6 rounded-lg shadow-md border ${colors[color]} text-center`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

export default AdminHome;
