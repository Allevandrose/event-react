import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../../redux/slices/eventSlice";
import EventCard from "../../components/common/EventCard";

const Events = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Fetch events state from Redux store
    const { events, loading, error } = useSelector((state) => state.events);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch]);

    // Filter events based on search term
    const filteredEvents = events.filter((event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Navigate to BookingForm with selected event details
    const handleBook = (event) => {
        navigate('/booking', { state: { event } });
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">All Events</h1>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md mx-auto p-2 mb-6 border rounded"
            />

            {/* Loading and Error Messages */}
            {loading && <p className="text-center">Loading events...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <EventCard key={event.id} event={event} onBook={handleBook} />
                    ))
                ) : (
                    <p className="text-center text-gray-600">No events found.</p>
                )}
            </div>
        </div>
    );
};

export default Events;
