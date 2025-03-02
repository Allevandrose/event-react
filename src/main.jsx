import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import store from "./redux/store";
import App from "./App";
import "./index.css";

const stripePromise = loadStripe("pk_test_51QwoNgH1KtcVXqjcNgjddIWDiYV8i0Jy6JoApyzGs9yv121RMftLOe86lf6rLNJ7UgDLzUZZ3IXrNOYYpVTAGaTq00HhgTahhx");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </Provider>
  </React.StrictMode>
);