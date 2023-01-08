import React from "react";
import sidebar from "./Sidebar.module.css";
const Sidebar = () => {
  return (
    <div class={sidebar.sidebarbody}>
      <div className={sidebar.left}></div>
      <div className={sidebar.right}>
        <div className={sidebar.rightbtns}>
          <div className={sidebar.btns}>profile</div>
          <div className={sidebar.btns}>Logout</div>
        </div>
        <div className={sidebar.rightNofication}>
          <div className={sidebar.rightNoficationCard}></div>
          <div className={sidebar.rightNoficationCard}></div>
          <div className={sidebar.rightNoficationCard}></div>
          <div className={sidebar.rightNoficationCard}></div>
          <div className={sidebar.rightNoficationCard}></div>
          <div className={sidebar.rightNoficationCard}></div>
          <div className={sidebar.rightNoficationCard}></div>
          <div className={sidebar.rightNoficationCard}></div>
        </div>
        <div className={sidebar.rightbtmbtns}></div>
      </div>
    </div>
  );
};

export default Sidebar;
