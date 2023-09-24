import React, { useEffect, useRef, useState } from "react";
import "../styles/ProfileBar.css";
// import defaultPic from "../assets/profile/undraw_Male_avatar.png";
import clairePic from "../assets/profile/unisex_profile_picture.png";
import NotifButton from "./NotifButton";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import ProfileDropdown from "./ProfileDropdown";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProfileBar() {
  const [openProfile, setOpenProfile] = useState(false);
  const [openChevron, setOpenChevron] = useState(false);
  const currentUser = localStorage.getItem("currentUser");

  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpenProfile(false);
        setOpenChevron(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  const handlePreprocess = () => {
    // Appeler la route "/run-prepro" sur le serveur
    axios
      .get("http://127.0.0.1:8000/setting/runprepro")
      .then((response) => {
        console.log(response.data.message);
        toast.success(response.data.message, {
          autoClose: 2000,
        });
      })
      .catch((error) => {
        console.error("Erreur lors du lancement de prepro.py : ", error);
        toast.error(`Erreur lors du lancement du preprocessing ${error}`, {
          autoClose: 2000,
        });
      });
  };

  return (
    <div className="profilebar-main">
      <div className="preprocess-section">
        <button onClick={handlePreprocess}>Mise à jour hebdo </button>
      </div>

      <div className="main-profile">
        <NotifButton className="notification-icon" notifValue={3} />

        <div
          className="profil-section"
          ref={menuRef}
          onClick={() =>
            setOpenProfile(!openProfile) & setOpenChevron(!openChevron)
          }
        >
          <img src={clairePic} className="profile-pic" alt="profile-pict"></img>

          <span className="user-profile-name">{currentUser}</span>

          <span className="dropdown-icon">
            {openChevron ? <FaChevronUp /> : <FaChevronDown />}
          </span>

          {openProfile && <ProfileDropdown />}
        </div>
      </div>
    </div>
  );
}

export default ProfileBar;
