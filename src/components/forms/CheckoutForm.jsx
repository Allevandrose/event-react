import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";
import { createPayment } from "../../redux/slices/paymentSlice";
import Swal from "sweetalert2";

const CheckoutForm = ({ event, ticketType }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      Swal.fire("Error!", error.message, "error");
      setLoading(false);
      return;
    }

    const paymentData = {
      eventId: event.id,
      ticketType,
      amount: ticketType === "vip" ? event.price_vip : event.price_regular,
      paymentMethodId: paymentMethod.id,
    };

    dispatch(createPayment(paymentData))
      .unwrap()
      .then(() => {
        Swal.fire("Success!", "Payment successful!", "success");
        setLoading(false);
      })
      .catch((err) => {
        Swal.fire("Error!", err.error || "Payment failed.", "error");
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <CardElement className="p-2 border rounded" />
      <button type="submit" disabled={!stripe || loading} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckoutForm;