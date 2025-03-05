import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { fetchEvents } from "../../redux/slices/eventSlice";
import { createBooking } from "../../redux/slices/bookingSlice";
import EventCard from "../../components/common/EventCard";

const Events = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize navigate function
    const { events, loading, error } = useSelector((state) => state.events);
    const { loading: bookingLoading, error: bookingError } = useSelector((state) => state.bookings);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch]);

    const filteredEvents = events.filter((event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleBook = (event) => {
        const ticket_type = 'regular';
        const quantity = 1;
        const bookingData = { event_id: event.id, ticket_type, quantity };
        
        dispatch(createBooking(bookingData))
            .unwrap()
            .then((booking) => {
                alert('Booking successful! Proceeding to payment...');
                navigate('/payment', { state: { booking } }); // Navigate with booking data
            })
            .catch((err) => {
                alert(`Booking failed: ${err.error || 'Unknown error'}`);
            });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">All Events</h1>
            <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md mx-auto p-2 mb-6 border rounded"
            />
            {bookingLoading && <p>Processing booking...</p>}
            {bookingError && <p className="text-red-500">{bookingError}</p>}
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
