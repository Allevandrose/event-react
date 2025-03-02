import { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../redux/slices/authSlice";
import Swal from "sweetalert2";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email))
      .unwrap()
      .then(() => {
        Swal.fire("Success!", "Password reset link sent!", "success");
      })
      .catch((error) => {
        Swal.fire("Error!", error.error || "Failed to send reset link.", "error");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Send Reset Link
      </button>
    </form>
  );
};

export default ForgotPasswordForm;