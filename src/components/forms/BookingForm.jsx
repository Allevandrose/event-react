import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking } from '../../redux/slices/bookingSlice';

const BookingForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();
    const event = state?.event;
    const { loading, error } = useSelector((state) => state.bookings);

    const [ticketType, setTicketType] = useState('regular');
    const [quantity, setQuantity] = useState(1);

    // Redirect to events page if no event is provided
    useEffect(() => {
        if (!event) navigate('/events');
    }, [event, navigate]);

    // Determine max tickets available based on ticket type
    const maxTickets = ticketType === 'VIP' ? event?.tickets_vip : event?.tickets_regular;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const bookingData = {
            event_id: event.id,
            ticket_type: ticketType,
            quantity: parseInt(quantity, 10),
        };

        dispatch(createBooking(bookingData))
            .unwrap()
            .then((booking) => navigate('/payment', { state: { booking } }))
            .catch((err) => console.error('Booking failed:', err));
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                Book Tickets for {event?.name}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Ticket Type Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Ticket Type</label>
                        <select
                            value={ticketType}
                            onChange={(e) => setTicketType(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="VIP">VIP (${event?.price_vip})</option>
                            <option value="regular">Regular (${event?.price_regular})</option>
                        </select>
                    </div>

                    {/* Quantity Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input
                            type="number"
                            min="1"
                            max={maxTickets}
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-sm text-gray-500">{maxTickets} tickets available</p>
                    </div>
                </div>

                {/* Error Handling - Strict Implementation */}
                {error && (
                    <p className="text-red-500 text-center">
                        {error.error || "Booking failed"}
                    </p>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                </button>
            </form>
        </div>
    );
};

export default BookingForm;
