import React, { useEffect, useState } from "react";
import { getapprovedbids } from "../../Service/userService";
import NStyle from "./Notification.module.css";

const Notification = () => {
  const [notifications, setnotifications] = useState([]);
  useEffect(() => {
    getapprovedbidss();
  }, []);
  const getapprovedbidss = () => {
    getapprovedbids().then((response) => {
      setnotifications(response);
    });
  };
  useEffect(() => {
    console.log("====================================");
    console.log(notifications);
    console.log("====================================");
  }, [notifications]);

  return (
    <div className={NStyle.Notificationbody}>
      <div className={NStyle.notificationContents}>
        {notifications?.map((data) => (
          <div key={data._id} className={NStyle.notifyCard}>
            <div className={NStyle.notifyCardImage}>
              <img src={data.image} className={NStyle.notifyCardImg} alt="" />
            </div>
            <div className={NStyle.describtion}>
                <h3>Bid Approved for : {data.price} ETH</h3>
                <h3>{data.nftName}</h3>
                <h4>{data.description}</h4>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
