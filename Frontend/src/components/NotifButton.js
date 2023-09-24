import React from "react";
import "../styles/NotifButton.css";
// import { MdNotificationsNone } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";

function NotifButton({ notifValue }) {
  return (
    <button className="notif-button">
      <span className="notif-icon">
        <IoIosNotificationsOutline />
      </span>
      <span className="notif-out-value">{notifValue}</span>
    </button>
  );
}

export default NotifButton;
