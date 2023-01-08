import React, { useEffect } from 'react'
import { getapprovedbids } from '../../Service/userService'
import NStyle from "./Notification.module.css"

const Notification = () => {
useEffect(() => {
    getapprovedbidss()
}, []);
const getapprovedbidss =()=>{
    getapprovedbids().then(response=>{
        console.log(response);
    })
}

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