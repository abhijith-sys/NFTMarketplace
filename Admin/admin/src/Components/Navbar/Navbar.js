import React from "react";
import { useNavigate } from "react-router-dom";
import navstyle from "./Navbar.module.css";
const Navbar = () => {
  const navigate = useNavigate();
  const tohome =()=>{
    navigate("/home");
  }
  const touserlist =()=>{
    navigate("/list");
  }
  const tonotificsation =()=>{
    navigate("/notify");
  }

  const logout =()=>{
    localStorage.clear()
  }
  return (
    <div className={navstyle.navbody}>
      <h3 className={navstyle.heading} onClick={tohome}>Admin</h3>
      <div className={navstyle.right}>
        <h3 className={navstyle.users} onClick={touserlist}>Users</h3>
        <h3 className={navstyle.users} onClick={tonotificsation}>Notification</h3>
        <h3 className={navstyle.users} onClick={logout}>logout</h3>
      </div>
    </div>
  );
};

export default Navbar;
