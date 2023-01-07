import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import axios from "axios";
import { getAccessToken } from "./Service/userService";
import { toast } from "react-toastify";

const requestQueue = {
  
  requests: [],
  add(request) {
    this.requests.push(request);
  },
  clear() {
    this.requests = [];
  },
  retryAll() {
    this.requests.forEach((request) => axios(request));
    this.clear();
  },
};

axios.interceptors.request.use((request) => {
  const token = localStorage.getItem("accessToken");
  request.headers.Authorization = `NFT ${token}`;
  return request;
});

axios.interceptors.response.use(
 
  (res) => {
    console.log("response");
    return res;
  },
  async (err) => {
    console.log("ERRORRRRRRRRRRRRRRRRRRR");
    console.log(err);
    let errorMessage;
    if (err.response.status === 700) {
      console.log(err.response.data);
      errorMessage = err.response.data[0].msg
        ? err.response.data[0].msg
        : "something went wrong";
    } else if (err.response.status === 401) {
      errorMessage = "Unauthorized: Invalid or expired token";
    } else if (err.response.status === 404) {
      errorMessage = "Not found: The requested resource was not found";
    } else if (err.response.status === 500) {
      errorMessage = "Internal server error: An error occurred on the server";
    } else {
      errorMessage = "An unknown error occurred";
    }
    toast(errorMessage);
    if (err)
      if (err.response?.data.name === "TokenExpiredError") {
        toast( "something went wrong")
        requestQueue.add(err.config);
        getAccessToken().then((response) => {
          localStorage.setItem("accessToken", response?.accessToken);
          localStorage.setItem("refreshToken", response?.refreshToken);
          requestQueue.retryAll();
        });
      } 
      else 
      if (err.response?.data.name === "JsonWebTokenError") {
        toast( "something went wrong")
      
      }
    if (err?.response?.data?.refreshTokenError?.name === "TokenExpiredError") {
      toast( "something went wrong")
      localStorage.clear();
    }
    return err;
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
