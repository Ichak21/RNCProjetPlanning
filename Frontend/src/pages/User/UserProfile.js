//import React, { useContext } from "react";
//import AuthContext from "../auth/auth";

function UserProfile() {
  //const { auth } = useContext(AuthContext);
  const isCurrentUser = localStorage.getItem("currentUser");

  console.log(isCurrentUser);

  return (
    <>
      <h1>Mon Compte </h1>
      <hr></hr>
      <h3>Bienvenue {isCurrentUser}</h3>
    </>
  );
}

export default UserProfile;
