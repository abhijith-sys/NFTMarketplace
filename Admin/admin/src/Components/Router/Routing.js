import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EmailForm from "../Email/EmailForm";
import Home from "../Home/Home";
import AdminLogin from "../Login/AdminLogin";
import Navbar from "../Navbar/Navbar";
import NotificationList from "../notifications/NotificationList";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import UserList from "../userlist/UserList";
const Routing = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<AdminLogin />} />
          {/* <Route element={<ProtectedRoute />}> */}
            <Route path="/home" element={<Home />} />
            <Route path="/notify" element={<NotificationList />} />
            <Route path="/create" element={<EmailForm />} />
            <Route path="/list" element={<UserList />} />
          {/* </Route> */}
        </Routes>
      </Router>
    </>
  );
};

export default Routing;
