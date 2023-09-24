import React, { useState } from "react";
import "../../styles/EditSecteur.css";
import CloseWindow from "../CloseWindow";
import { Grid, TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditSecteur({ setOpenModal, EditSecteur }) {
  const navigate = useNavigate();
  const id_secteur = EditSecteur.id_secteur;

  const [selectedNameSecteur, setSelectedNameSecteur] = useState(
    EditSecteur.name_secteur
  );
  const handleNameChange = (event) => {
    setSelectedNameSecteur(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const formData = {
      id_secteur: id_secteur,
      name_secteur: event.target.secteurName.value,
    };

    axios
      .put(`http://127.0.0.1:8000/setting/secteur/${id_secteur}?name_secteur=${formData.name_secteur}`)
      .then((response) => {
        // Réponse réussie, vous pouvez afficher un message ou effectuer d'autres actions
        console.log("Réponse du serveur :", response.data);
        navigate("/secteur");
        toast.success("Secteur modifié ! 🚀", {
          autoClose: 1000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        // En cas d'erreur, affichez un message d'erreur ou gérez l'erreur de votre choix
        console.error("Erreur lors de la requête POST :", error);
        toast.error("Erreur lors de la modification !", {
          autoClose: 2000,
        });
      });
  };

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <h3>Modifier un secteur</h3>
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <CloseWindow />
          </button>
        </div>
        <hr className="edit-secteur-search-hr" />

        <form onSubmit={handleSubmit}>
          <Grid container className="secteur-grid-container">
            <Grid item xs={6}>
              <TextField
                required
                variant="outlined"
                name="secteurName"
                label="Nom"
                value={selectedNameSecteur || ""}
                style={{ marginTop: "8px", marginBottom: "16px" }}
                onChange={handleNameChange}
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

export default EditSecteur;
