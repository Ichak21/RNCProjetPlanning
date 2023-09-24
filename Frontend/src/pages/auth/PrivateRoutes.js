import { Outlet, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const PrivateRoutes = () => {
  // Verify if the user is already connected or not for redirecting
  let isLoggedIn = true;
  let isLoggedInData = localStorage.getItem("isLogged");
  let isCurrentUser = localStorage.getItem("currentUser");

  const apiUsers = "http://127.0.0.1:8000/setting/user";

  const [usersList, setUserList] = useState([]);

  //On récupère les users existant (API)
  //On récupère les users de l'API
  useEffect(() => {
    axios.get(apiUsers).then((response) => {
      setUserList(response.data);
    });
  }, []);

  // Fonction pour vérifier les informations d'identification
  const checkIsAlreadyLoggedIn = async (user) => {
    let verif = false;
    // Recherchez l'utilisateur dans la liste des utilisateurs
    const foundUser = await usersList.find(
      (userData) => userData.login === user
    );

    if (foundUser === undefined) {
      verif = false;
    } else {
      verif = true;
    }

    return verif;
  };

  if (isLoggedInData === "false") {
    isLoggedIn = false;
  } else {
    if (checkIsAlreadyLoggedIn(isCurrentUser)) {
      console.log(`CA MARCHE --> ${isCurrentUser} est déjà connecté`);
      isLoggedIn = true;
    } else {
      isLoggedIn = false;
      isCurrentUser = "";
      <Navigate to="/login" />;
      window.location.reload();
    }
  }

  return isLoggedIn === true ? (
    <Outlet replace={true} />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
