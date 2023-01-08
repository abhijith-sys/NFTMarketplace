import React from 'react'
import NStyle from "./Notification.module.css"

const Notification = () => {
  return (
    <div className={NStyle.Notificationbody}>
        
             <div className={NStyle.notificationContents}>
                <div className={NStyle.notifyCard}></div>
                <div className={NStyle.notifyCard}></div>
                <div className={NStyle.notifyCard}></div>
                <div className={NStyle.notifyCard}></div>
                <div className={NStyle.notifyCard}></div>
                <div className={NStyle.notifyCard}></div>
                <div className={NStyle.notifyCard}></div>
                <div className={NStyle.notifyCard}></div>
                <div className={NStyle.notifyCard}></div>
                <div className={NStyle.notifyCard}></div>
             </div>
    </div>
  )
}

export default Notification