import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings } from "../../redux/slices/bookingSlice";

const Bookings = () => {
    const dispatch = useDispatch();
    const { bookings, loading, error } = useSelector((state) => state.bookings);

    useEffect(() => {
        dispatch(fetchUserBookings());
    }, [dispatch]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Your Bookings</h1>
            {bookings.length > 0 ? (
                <ul className="space-y-2">
                    {bookings.map((booking) => (
                        <li key={booking.id} className="border p-2 rounded">
                            <strong>Event:</strong> {booking.event_name} | 
                            <strong> Ticket-type:</strong> {booking.ticket_type} | 
                            <strong> Ticket-Quantity:</strong> {booking.quantity} | 
                            <strong> Amt-Total:</strong> ${booking.total_price}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No bookings found.</p>
            )}
        </div>
    );
};

export default Bookings;
