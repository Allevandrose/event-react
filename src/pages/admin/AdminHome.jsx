import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../redux/slices/eventSlice";
import { fetchAllUsers } from "../../redux/slices/userSlice";
import EventCard from "../../components/common/EventCard";

const AdminHome = () => {
  const dispatch = useDispatch();
  const { events, loading: eventsLoading, error: eventsError } = useSelector((state) => state.events);
  const { users, loading: usersLoading, error: usersError } = useSelector((state) => state.users);

  useEffect(() => {
    console.log("Fetching events and users...");
    dispatch(fetchEvents());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  if (eventsLoading || usersLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (eventsError || usersError) {
    console.error("Error:", eventsError || usersError);
    return <p className="text-center text-red-500">{eventsError || usersError}</p>;
  }
  console.log("Events:", events, "Users:", users);

  const futureEvents = events.filter((event) => new Date(event.date) >= new Date());

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Events" value={futureEvents.length} color="blue" />
        <StatCard title="Total Users" value={users.length} color="yellow" />
        <StatCard title="Upcoming Events" value={futureEvents.length} color="green" />
      </div>
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