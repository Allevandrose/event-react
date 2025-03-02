import React from "react";
import LoginForm from "../../components/forms/LoginForm";

const Login = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="bg-white p-6 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <LoginForm />
    </div>
  </div>
);

export default Login;