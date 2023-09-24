import React from "react";
import "../../styles/AddSecteur.css";
import CloseWindow from "../CloseWindow";
import { Grid, TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddSecteur({ setOpenModal }) {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const formData = {
      name_secteur: event.target.secteurName.value,
    };

    axios
      .post("http://127.0.0.1:8000/setting/secteur", formData)
      .then((response) => {
        // Réponse réussie, vous pouvez afficher un message ou effectuer d'autres actions
        console.log("Réponse du serveur :", response.data);
        navigate("/secteur");
        toast.success("Secteur ajouté ! 🚀", {
          autoClose: 1000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        // En cas d'erreur, affichez un message d'erreur ou gérez l'erreur de votre choix
        console.error("Erreur lors de la requête POST :", error);
        toast.error("Erreur lors de l'ajout !", {
          autoClose: 2000,
        });
      });
  };

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <h3>Ajouter un secteur</h3>
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <CloseWindow />
          </button>
        </div>
        <hr className="add-secteur-search-hr" />

        <form onSubmit={handleSubmit}>
          <Grid container className="secteur-grid-container">
            <Grid item xs={6}>
              <TextField
                required
                style={{ marginTop: "8px", marginBottom: "16px" }}
                variant="outlined"
                name="secteurName"
                label="Nom"
              />
            </Grid>
          </Grid>
          <div className="footer">
            <button
              onClick={() => {
                setOpenModal(false);
              }}
              id="cancelBtn"
            >
              Annuler
            </button>
            <button type="submit">Valider</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSecteur;
