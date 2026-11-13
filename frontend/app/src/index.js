
import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./bootstrap.min.css";
import { Provider } from "react-redux";
import store from "./store";

axios.defaults.baseURL = "https://alok-shop-backend.onrender.com";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

reportWebVitals();
