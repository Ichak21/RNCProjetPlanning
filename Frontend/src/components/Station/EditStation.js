import React, { useState } from "react";
import "../../styles/EditStation.css";
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

function EditStation({ setOpenModal, EditStation }) {
  const navigate = useNavigate();
  const id_station = EditStation.id_station;
  const [station, setStation] = useState(null);
  const [secteurs, setSecteurs] = useState([]);

  const [selectedStationName, setSelectedStationName] = useState(
    EditStation.name_station
  );
  const handleStationNameChange = (event) => {
    setSelectedStationName(event.target.value);
  };

  const [selectedCapacity, setSelectedCapacity] = useState(
    EditStation.capa_max
  );
  const handleCapacityChange = (event) => {
    setSelectedCapacity(event.target.value);
  };

  const [selectedSecteur, setSelectedSecteur] = useState(
    EditStation.id_secteur
  );

  const handleSecteurChange = (event) => {
    setSelectedSecteur(event.target.value);
  };

  React.useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/setting/station/${id_station}`)
      .then((response) => {
        setStation(response.data);
      });
  }, [id_station]);

  React.useEffect(() => {
    axios.get(`http://127.0.0.1:8000/setting/secteur`).then((response) => {
      setSecteurs(response.data);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const formData = {
      id_station: id_station,
      name_station: event.target.nameStation.value,
      capa_max: event.target.capacityMax.value,
      id_secteur: selectedSecteur,
    };

    axios
      .put(
        `http://localhost:8000/setting/station/${id_station}?name_station=${formData.name_station}&capa_max=${formData.capa_max}&id_secteur=${formData.id_secteur}`
      )
      .then((response) => {
        // Réponse réussie, vous pouvez afficher un message ou effectuer d'autres actions
        console.log("Réponse du serveur :", response.data);
        navigate("/station");
        toast.success("Station modifiée ! 🚀", {
          autoClose: 1000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        // En cas d'erreur, affichez un message d'erreur ou gérez l'erreur de votre choix
        console.error("Erreur lors de la requête POST :", error);
        navigate("/station");
        toast.success("Station modifiée ! 🚀", {
          autoClose: 1000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
  };

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <h3>Modifier une station</h3>
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <CloseWindow />
          </button>
        </div>
        <hr className="edit-station-search-hr" />

        <form onSubmit={handleSubmit}>
          <Grid container className="station-grid-container">
            <Grid item xs={6}>
              <TextField
                required
                variant="outlined"
                name="nameStation"
                label="Nom"
                value={selectedStationName || ""}
                style={{ marginTop: "8px", marginBottom: "16px" }}
                onChange={handleStationNameChange}
              />
              <TextField
                required
                variant="outlined"
                name="capacityMax"
                label="Capacité max"
                value={selectedCapacity || ""}
                style={{ marginTop: "8px", marginBottom: "16px" }}
                onChange={handleCapacityChange}
              />
              <div className="edit-station-div-dropdown">
                <FormControl variant="outlined">
                  <InputLabel>Secteur</InputLabel>
                  <MuiSelect
                    value={selectedSecteur}
                    onChange={handleSecteurChange}
                    label="Secteur"
                    style={{ marginTop: "8px", marginBottom: "16px" }}
                  >
                    <MenuItem value={station?.id_secteur}>
                      Sélectionner un secteur
                    </MenuItem>
                    {secteurs.map((item) => (
                      <MenuItem key={item.name_secteur} value={item.id_secteur}>
                        {item.name_secteur}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
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

export default EditStation;
