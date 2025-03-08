import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserPayments } from "../../redux/slices/paymentSlice";

const Tickets = () => {
  const dispatch = useDispatch();
  const { payments, loading, error } = useSelector((state) => state.payments);

  useEffect(() => {
    dispatch(fetchUserPayments());
  }, [dispatch]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading your tickets...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Your Tickets</h1>

      {payments.length === 0 ? (
        <p className="text-center text-gray-600">You haven’t purchased any tickets yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {payments.map((payment, index) => {
            const ticketUrl = `/uploads/tickets/ticket-${payment.transaction_code}.pdf`;
            // Use transaction_code as the key if available, otherwise fall back to index
            const key = payment.transaction_code || `payment-${index}`;

            return (
              <div
                key={key} // Unique key with fallback
                className="bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105"
              >
                <div className="bg-blue-100 p-4 rounded-t-lg">
                  <h3 className="text-xl font-semibold text-blue-800">
                    Event ID: {payment.event_id}
                  </h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-700">
                    <strong>Amount:</strong> ${payment.amount}
                  </p>
                  <p className="text-gray-700">
                    <strong>Transaction:</strong> {payment.transaction_code || "N/A"}
                  </p>
                  {payment.transaction_code ? (
                    <a
                      href={ticketUrl}
                      download={`ticket-${payment.transaction_code}.pdf`}
                      className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      Download Ticket
                    </a>
                  ) : (
                    <p className="text-red-500 mt-4">Ticket not available</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tickets;