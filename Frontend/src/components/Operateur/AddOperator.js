import React, { useState } from "react";
import "../../styles/AddOperator.css";
import CloseWindow from "../CloseWindow";
import { Grid, TextField } from "@mui/material";
import Controls from "../controls/Controls";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const typeList = ["0", "1", "2", "3"];
const statusItems = [
  { id: "false", title: "Hors-ligne" },
  { id: "true", title: "Actif" },
];

function AddOperator({ setOpenModal }) {
  const navigate = useNavigate();
  const [selectedStationItem, setSelectedStationItem] = useState("");
  const handleStationChange = (event) => {
    setSelectedStationItem(event.target.value);
  };

  const [selectedType, setselectedType] = useState("");
  const [selectedShiftItem, setSelectedShiftItem] = useState("");
  const [stations, setStations] = useState([]);
  const [selectedDateEntree, setSelectedDateEntree] = useState(null);
  const handleDateEntreeChange = (date) => {
    const formattedDate = date ? format(new Date(date), "yyyy-MM-dd") : null;
    setSelectedDateEntree(formattedDate);
  };
  const [selectedDateFin, setSelectedDateFin] = useState(null);
  const handleDateFinChange = (date) => {
    const formattedDate = date ? format(new Date(date), "yyyy-MM-dd") : null;
    setSelectedDateFin(formattedDate);
  };
  const handleShiftChange = (event) => {
    setSelectedShiftItem(event.target.value);
  };
  const handleTypeChange = (event) => {
    setselectedType(event.target.value);
  };

  const [shiftList, setShiftList] = useState([]);

  React.useEffect(() => {
    axios.get(`http://127.0.0.1:8000/setting/shift`).then((response) => {
      const shiftIds = response.data.map((item) => item.id_shift);
      setShiftList(shiftIds);
    });
  }, []);

  React.useEffect(() => {
    axios.get(`http://127.0.0.1:8000/setting/station`).then((response) => {
      setStations(response.data);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const formData = {
      id_operateur: event.target.id_operateur.value,
      name_operateur: event.target.fullName.value,
      id_shift: selectedShiftItem,
      home_station: selectedStationItem,
      start_date: selectedDateEntree,
      end_date: selectedDateFin,
      isTemp: selectedType,
      active_status: event.target.status.value === "true" ? 1 : 0,
    };

    axios
      .post("http://127.0.0.1:8000/setting/operateur", formData)
      .then((response) => {
        // Réponse réussie, vous pouvez afficher un message ou effectuer d'autres actions
        console.log("Réponse du serveur :", response.data);
        navigate("/operateur");
        toast.success("Opérateur ajouté ! 🚀", {
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
          <h3>Ajouter un opérateur</h3>
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <CloseWindow />
          </button>
        </div>
        <hr className="add-operator-search-hr" />

        <form onSubmit={handleSubmit}>
          <Grid container className="operator-grid-container">
            <Grid item xs={6}>
              <TextField
                required
                style={{ marginTop: "8px", marginBottom: "16px" }}
                variant="outlined"
                name="id_operateur"
                label="ID"
              />
              <TextField
                required
                style={{ marginTop: "8px", marginBottom: "16px" }}
                variant="outlined"
                name="fullName"
                label="Nom"
              />
              <div className="add-operator-div-dropdown">
                <FormControl variant="outlined">
                  <InputLabel>Station</InputLabel>
                  <MuiSelect
                    value={selectedStationItem}
                    onChange={handleStationChange}
                    label="Station"
                    style={{ marginTop: "8px", marginBottom: "16px" }}
                  >
                    <MenuItem value="">Sélectionner un élément</MenuItem>
                    {stations.map((item) => (
                      <MenuItem key={item.name_station} value={item.id_station}>
                        {item.name_station}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
                <FormControl variant="outlined">
                  <InputLabel>Shift</InputLabel>
                  <MuiSelect
                    value={selectedShiftItem}
                    onChange={handleShiftChange}
                    label="Shift"
                    style={{ marginTop: "8px", marginBottom: "16px" }}
                  >
                    <MenuItem value="">Sélectionner un élément</MenuItem>
                    {shiftList.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
            </Grid>
            <Grid item xs={6}>
              <FormControl variant="outlined">
                <InputLabel>Type</InputLabel>
                <MuiSelect
                  value={selectedType}
                  onChange={handleTypeChange}
                  label="Type"
                  style={{ marginTop: "8px", marginBottom: "16px" }}
                >
                  <MenuItem value="">Sélectionner un élément</MenuItem>
                  {typeList.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  inputVariant="outlined"
                  format="yyyy-MM-dd"
                  margin="normal"
                  id="date-entree-picker"
                  label="Saisir la date d'entrée"
                  value={selectedDateEntree}
                  onChange={handleDateEntreeChange}
                  KeyboardButtonProps={{
                    "aria-label": "Changer la date",
                  }}
                />
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  inputVariant="outlined"
                  format="yyyy-MM-dd"
                  margin="normal"
                  id="date-fin-picker"
                  label="Saisir la date de fin"
                  value={selectedDateFin}
                  onChange={handleDateFinChange}
                  KeyboardButtonProps={{
                    "aria-label": "Changer la date",
                  }}
                />
              </MuiPickersUtilsProvider>
              <Controls.RadioGroup
                name="status"
                label="Statut"
                items={statusItems}
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

export default AddOperator;
