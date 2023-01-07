import React, { useEffect, useState } from "react";
import notify from "./Notification.module.css";
import { useNavigate } from "react-router-dom";
import {
  getNotificationWithId,
  listnotification,
} from "../../Service/adminservice";
const NotificationList = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState();
  useEffect(() => {
    listnotification().then((response) => {
      setNotification(response);
    });
  }, []);

  const tocreate = () => {
    navigate("/create");
  };
  const toeditform = () => {
    navigate("/create");
  };

  const getselectedNotificstion = () => {
    getNotificationWithId();
  };
  return (
    <div className={notify.listbody}>
      <div className={notify.list}>
        <div className={notify.filters}>
          <button onClick={tocreate} className={notify.editbtn}>
            {" "}
            Create
          </button>
        </div>


        {notification?.map((data) =>(
           <div className={notify.card}>
           <div className={notify.date }>
             <h3> {data.time}</h3>
             <div lassName={notify.btns}>
               <button className={notify.editbtn} onClick={toeditform}>
                 Edit
               </button>
               <button className={notify.deletebtn}>Delete</button>
             </div>
           </div>
           <div className={notify.content}>
           {data.text}
           </div>
         </div>
       ))

        }
        
      </div>
    </div>
  );
};

export default NotificationList;
