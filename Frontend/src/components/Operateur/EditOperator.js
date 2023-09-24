import React, { useState } from "react";
import "../../styles/EditOperator.css";
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

function EditOperator({ setOpenModal, EditOperator }) {
  const navigate = useNavigate();
  const id_operateur = EditOperator.id_operateur;
  const [operator, setOperator] = useState(null);
  const [shiftList, setShiftList] = useState([]);
  const [selectedFullName, setSelectedFullName] = useState(
    EditOperator.name_operateur
  );
  const handleNameChange = (event) => {
    setSelectedFullName(event.target.value);
  };
  const [stations, setStations] = useState([]);
  const [selectedStationItem, setSelectedStationItem] = useState(
    EditOperator.home_station
  );

  const [selectedShiftItem, setSelectedShiftItem] = useState(
    EditOperator.id_shift
  );

  const [selectedDateEntree, setSelectedDateEntree] = useState(
    EditOperator.start_date
  );
  const handleDateEntreeChange = (date) => {
    const formattedDate = date ? format(new Date(date), "yyyy-MM-dd") : null;
    setSelectedDateEntree(formattedDate);
  };

  const [selectedDateFin, setSelectedDateFin] = useState(EditOperator.end_date);
  const handleDateFinChange = (date) => {
    const formattedDate = date ? format(new Date(date), "yyyy-MM-dd") : null;
    setSelectedDateFin(formattedDate);
  };
  const handleShiftChange = (event) => {
    setSelectedShiftItem(event.target.value);
  };
  const handleStationChange = (event) => {
    setSelectedStationItem(event.target.value);
  };
  const [selectedType, setSelectedType] = useState(
    EditOperator.isTemp.toString()
  );
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };
  const [selectedStatus, setSelectedStatus] = useState(
    EditOperator.active_status === 1 ? "true" : "false"
  );
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  React.useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/setting/operateur/${id_operateur}`)
      .then((response) => {
        setOperator(response.data);
      });
  }, [id_operateur]);

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
      id_operateur: id_operateur,
      name_operateur: event.target.fullName.value,
      id_shift: selectedShiftItem,
      home_station: selectedStationItem,
      start_date: selectedDateEntree,
      end_date: selectedDateFin,
      isTemp: selectedType,
      active_status: event.target.status.value === "true" ? 1 : 0,
    };

    axios
      .put(
        `http://127.0.0.1:8000/setting/operateur/${id_operateur}?name_operateur=${formData.name_operateur}&id_shift=${formData.id_shift}&home_station=${formData.home_station}&start_date=${formData.start_date}&end_date=${formData.end_date}&isTemp=${formData.isTemp}&active_status=${formData.active_status}`
      )
      .then((response) => {
        // Réponse réussie, vous pouvez afficher un message ou effectuer d'autres actions
        console.log("Réponse du serveur :", response.data);
        navigate("/operateur");
        toast.success("Opérateur modifié ! 🚀", {
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
          <h3>Modifier un opérateur</h3>
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <CloseWindow />
          </button>
        </div>
        <hr className="edit-operator-search-hr" />

        <form onSubmit={handleSubmit}>
          <Grid container className="operator-grid-container">
            <Grid item xs={6}>
              <TextField
                required
                variant="outlined"
                name="fullName"
                label="Nom"
                value={selectedFullName || ""}
                style={{ marginTop: "8px", marginBottom: "16px" }}
                onChange={handleNameChange}
              />
              <div className="edit-operator-div-dropdown">
                <FormControl variant="outlined">
                  <InputLabel>Station</InputLabel>
                  <MuiSelect
                    value={selectedStationItem}
                    onChange={handleStationChange}
                    label="Station"
                    style={{ marginTop: "8px", marginBottom: "16px" }}
                  >
                    <MenuItem value={operator?.home_station}>
                      Sélectionner une station
                    </MenuItem>
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
                    <MenuItem value={operator?.id_shift}>
                      Sélectionner un shift
                    </MenuItem>
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
                value={selectedStatus}
                onChange={handleStatusChange}
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

export default EditOperator;
