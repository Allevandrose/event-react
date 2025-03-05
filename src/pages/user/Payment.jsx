import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPayment } from '../../redux/slices/paymentSlice';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const Payment = () => {
    const dispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const location = useLocation();
    const { booking } = location.state || {};
    const [paymentError, setPaymentError] = useState(null);
    const { loading, error } = useSelector((state) => state.payments);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || !booking) return;

        const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        });

        if (stripeError) {
            setPaymentError(stripeError.message);
            return;
        }

        const paymentData = {
            event_id: booking.event_id,
            amount: booking.total_price,
            stripeToken: paymentMethod.id,
        };

        dispatch(createPayment(paymentData))
            .unwrap()
            .then(() => {
                alert('Payment successful! Your ticket is now available.');
                navigate('/tickets');
            })
            .catch((err) => {
                setPaymentError(err.error || 'Payment failed');
            });
    };

    if (!booking) {
        return <p className="text-red-500">No booking found. Please start the booking process again.</p>;
    }

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
            <p className="mb-4">Total Amount: ${booking.total_price}</p>
            <form onSubmit={handleSubmit}>
                <CardElement className="mb-4 p-2 border rounded" />
                {paymentError && <p className="text-red-500 mb-4">{paymentError}</p>}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button
                    type="submit"
                    disabled={loading || !stripe}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>
            </form>
        </div>
    );
};

export default Payment;