import React from "react";
import RegistrationForm from "../../components/forms/RegistrationForm";

const Register = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="bg-white p-6 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <RegistrationForm />
    </div>
  </div>
);

export default Register;