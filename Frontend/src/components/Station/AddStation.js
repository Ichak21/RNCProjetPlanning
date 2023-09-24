import React, { useState } from "react";
import "../../styles/AddStation.css";
import CloseWindow from "../CloseWindow";
import { Grid, TextField } from "@mui/material";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@material-ui/core";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddStation({ setOpenModal }) {
  const navigate = useNavigate();
  const [selectedSecteurItem, setSelectedSecteurItem] = useState("");
  const handleSecteurChange = (event) => {
    setSelectedSecteurItem(event.target.value);
  };

  const [secteurs, setSecteurs] = useState([]);

  React.useEffect(() => {
    axios.get(`http://127.0.0.1:8000/setting/secteur`).then((response) => {
      setSecteurs(response.data);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const formData = {
      name_station: event.target.stationName.value,
      capa_max: event.target.capaMax.value,
      id_secteur: selectedSecteurItem,
    };

    axios
      .post("http://127.0.0.1:8000/setting/station", formData)
      .then((response) => {
        // Réponse réussie, vous pouvez afficher un message ou effectuer d'autres actions
        console.log("Réponse du serveur :", response.data);
        navigate("/station");
        toast.success("Station ajoutée ! 🚀", {
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
          <h3>Ajouter une station</h3>
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <CloseWindow />
          </button>
        </div>
        <hr className="add-station-search-hr" />

        <form onSubmit={handleSubmit}>
          <Grid container className="station-grid-container">
            <Grid item xs={6}>
              <TextField
                required
                style={{ marginTop: "8px", marginBottom: "16px" }}
                variant="outlined"
                name="stationName"
                label="Nom"
              />
              <TextField
                required
                style={{ marginTop: "8px", marginBottom: "16px" }}
                variant="outlined"
                name="capaMax"
                label="Capacité Max"
              />
              <div className="add-station-div-dropdown">
                <FormControl variant="outlined">
                  <InputLabel>Secteur</InputLabel>
                  <MuiSelect
                    value={selectedSecteurItem}
                    onChange={handleSecteurChange}
                    label="Station"
                    style={{ marginTop: "8px", marginBottom: "16px" }}
                  >
                    <MenuItem value="">Sélectionner un élément</MenuItem>
                    {secteurs.map((item) => (
                      <MenuItem key={item.name_secteur} value={item.id_secteur}>
                        {item.name_secteur}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
            </Grid>
            <Grid item xs={6}></Grid>
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

export default AddStation;
