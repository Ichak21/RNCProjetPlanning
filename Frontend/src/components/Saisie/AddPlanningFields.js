import React, { useState } from "react";
import "../../styles/AddPlanningFields.css";
import CloseWindow from "../CloseWindow";
import { Checkbox, FormControlLabel, Grid } from "@mui/material";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@material-ui/core";
import axios from "axios";
import { format, addDays, getISOWeek, startOfWeek } from "date-fns";

//==== Gestion de date , semaine et jours ======

//Calcule à partir de la date actuelle de la semaine actuelle et de la semaine prochaine
const currentDate = new Date();
const currentWeekNumber = getISOWeek(currentDate);
const nextWeekNumber = currentWeekNumber + 1;
const currentYear = format(currentDate, "yyyy");
const nextWeekYear = currentWeekNumber === 52 ? currentYear + 1 : currentYear;

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const currentWeek = currentWeekNumber.toString().padStart(2, "0");
const nextWeek = nextWeekNumber.toString().padStart(2, "0");
const weekStartDate = startOfWeek(currentDate, { weekStartsOn: 1 });

const choixSemaine = ["Semaine Actuelle", "Semaine Pro"];

function AddPlanningFields({
  setOpenModal,
  operatorsList,
  handlePlanningList,
  values,
}) {
  // const [stationList, setStationList] = useState([]);
  // React.useEffect(() => {
  //   axios.get(`http://127.0.0.1:8000/setting/station`).then((response) => {
  //     const stationIds = response.data.map((item) => item.id_station);
  //     setStationList(stationIds);
  //   });
  // }, []);

  const [selectedOperateur, setSelectedOperateur] = useState("");
  const [operators, setOperators] = useState([]);
  const [selectedStationItem, setSelectedStationItem] = useState("");
  const [stations, setStations] = useState([]);
  const [operatorStations, setOperatorStations] = useState([]);
  const [selectedSemaineItem, setSelectedSemaineItem] = useState("");
  const [selectedJours, setSelectedJours] = useState([]);
  const [operatorSoftSkills, setOperatorSoftSkills] = useState([]);

  const handleOperateurChange = (event) => {
    setSelectedOperateur(event.target.value);
  };

  const handleStationChange = (event) => {
    setSelectedStationItem(event.target.value);
  };

  const handleSemaineChange = (event) => {
    setSelectedSemaineItem(event.target.value);
  };

  // Transform operators ID into names
  React.useEffect(() => {
    axios.get(`http://127.0.0.1:8000/setting/operateur`).then((response) => {
      const filteredOperators = Object.values(response.data).filter((item) => {
        const name_operateur = item.name_operateur;
        return operatorsList.includes(name_operateur);
      });
      setOperators(filteredOperators);
    });
  }, [operatorsList]);

  // Retrieve selected operator stations
  React.useEffect(() => {
    axios.get(`http://127.0.0.1:8000/setting/competence`).then((response) => {
      const filteredOperatorStations = Object.values(response.data).filter(
        (item) => {
          const id_operateur = item.id_operateur;
          return id_operateur === selectedOperateur;
        }
      );
      setOperatorStations(filteredOperatorStations);
    });
  }, [selectedOperateur]);

  // Créez un ensemble (Set) pour stocker les id_station uniques
  const uniqueStations = new Set();

  // Filtrer les objets en fonction de l'id_station et ajouter les id_station uniques à l'ensemble
  const filteredUniqueStations = operatorStations.filter((item) => {
    const isUnique = !uniqueStations.has(item.id_station);
    if (isUnique) {
      uniqueStations.add(item.id_station);
    }
    return isUnique;
  });

  React.useEffect(() => {
    axios.get(`http://127.0.0.1:8000/setting/station`).then((response) => {
      setStations(response.data);
    });
  }, []);

  // Retrieve selected operator soft skills
  React.useEffect(() => {
    axios.get("http://127.0.0.1:8000/setting/softcompetence").then((response) => {
      const filteredOperatorSoftSkills = response.data.filter((item) => {
        const id_station = item.id_station;
        const id_operateur = item.id_operateur;

        // Vous pouvez utiliser la méthode find pour vérifier si id_station et id_operateur existent dans planningList
        return (
          id_operateur === selectedOperateur &&
          (id_station === 52 ||
            id_station === 65)
        );
      });
      setOperatorSoftSkills(filteredOperatorSoftSkills);
    });
  }, [selectedOperateur]);

  // Créez un objet pour stocker les correspondances entre les stations
  const operatorStationMap = {};

  // Parcourez le tableau des stations et créez une correspondance avec leur nom
  stations.forEach((station) => {
    operatorStationMap[station.id_station] = station.name_station;
  });

  // Maintenant, ajoutez le nom de la station correspondante à chaque station
  for (const key in filteredUniqueStations) {
    if (filteredUniqueStations.hasOwnProperty(key)) {
      const station = filteredUniqueStations[key];
      const id_station = station.id_station;
      station.name_station = operatorStationMap[id_station];
    }
  }

  //Getsion Selection jours checkbox
  const handleCheckboxChange = (jour) => (event) => {
    if (event.target.checked) {
      setSelectedJours([...selectedJours, jour]);
    } else {
      setSelectedJours(
        selectedJours.filter((selectedJour) => selectedJour !== jour)
      );
    }
  };

  const currenTL = localStorage.getItem("currentUser");
  /*
   Fonction qui prends les entrées du formulaire pour le rajouter au planning
   op -> operateur
   st  -> la station
   jr -> tableau de**contenant les jours où va travailler l'opérateur
   */
  const handleValidation = (op, st, jr) => {
    // Assign each soft skill to the selected operator
    const SST = operatorSoftSkills.find(item => item.id_station === 52)?.level_competence;
    const Leader_5S = operatorSoftSkills.find(item => item.id_station === 65)?.level_competence;

    const newPlanningList = jr.map((jour) => ({
      personne: op,
      shift: values.shift,
      tl: currenTL,
      station: st,
      jour: jour,
      date: format(addDays(weekStartDate, jours.indexOf(jour)), "dd-MM-yyyy"),
      semaine: `${currentYear}-${currentWeek}`,
      SST: SST ? SST : 0,
      leader5S: Leader_5S ? Leader_5S : 0,
      tut: 0,
    }));

    // on récupère la liste du planning en mémoire
    const storedPlanningList =
      JSON.parse(localStorage.getItem("planningList")) || [];

    // Vérifier si une entrée similaire existe déjà
    const duplicateEntry = newPlanningList.some((newEntry) => {
      return storedPlanningList.some((storedEntry) => {
        return (
          newEntry.personne === storedEntry.personne &&
          newEntry.jour === storedEntry.jour &&
          newEntry.date === storedEntry.date
        );
      });
    });

    if (duplicateEntry) {
      const duplicateEntryInfo = newPlanningList.find((newEntry) => {
        return storedPlanningList.some((storedEntry) => {
          return (
            newEntry.personne === storedEntry.personne &&
            newEntry.jour === storedEntry.jour &&
            newEntry.date === storedEntry.date
          );
        });
      });

      alert(
        `L'opérateur ${duplicateEntryInfo.personne} est déjà dans un poste le ${duplicateEntryInfo.jour} [${duplicateEntryInfo.date}]. Doublon non autorisé.`
      );
      return false; // Arrêter l'exécution si une entrée similaire est trouvée
    }

    // Si aucune entrée similaire n'est trouvée, ajouter les nouvelles valeurs dans newPlanningList
    handlePlanningList(newPlanningList);
    return true;

    // Vous pouvez faire ce que vous voulez avec le tableau `newPlanningList`
  };

  const handleValidationNextWeek = (op, st, jr) => {
    const newPlanningList = jr.map((jour) => {
      // Récupérer l'index du jour sélectionné dans la liste 'jours'
      const selectedDayIndex = jours.indexOf(jour);

      // Ajouter 7 jours pour obtenir la date de la semaine prochaine
      const nextWeekDate = addDays(weekStartDate, selectedDayIndex + 7);

      return {
        personne: op,
        shift: values.shift,
        tl: currenTL,
        station: st,
        jour: jour,
        date: format(nextWeekDate, "yyyy-MM-dd"),
        semaine: `${nextWeekYear}-${nextWeek}`,
        SST: 0,
        leader5S: 0,
        tut: 0,
      };
    });

    // on récupère la liste du planning en mémoire
    const storedPlanningList =
      JSON.parse(localStorage.getItem("planningList")) || [];

    // Vérifier si une entrée similaire existe déjà
    const duplicateEntry = newPlanningList.some((newEntry) => {
      return storedPlanningList.some((storedEntry) => {
        return (
          newEntry.personne === storedEntry.personne &&
          newEntry.jour === storedEntry.jour &&
          newEntry.date === storedEntry.date
        );
      });
    });

    if (duplicateEntry) {
      const duplicateEntryInfo = newPlanningList.find((newEntry) => {
        return storedPlanningList.some((storedEntry) => {
          return (
            newEntry.personne === storedEntry.personne &&
            newEntry.jour === storedEntry.jour &&
            newEntry.date === storedEntry.date
          );
        });
      });

      alert(
        `L'opérateur ${duplicateEntryInfo.personne} est déjà dans un poste le ${duplicateEntryInfo.jour} [${duplicateEntryInfo.date}]. Doublon non autorisé.`
      );

      return false; // Arrêter l'exécution si une entrée similaire est trouvée
    }

    // Si aucune entrée similaire n'est trouvée, ajouter les nouvelles valeurs dans newPlanningList
    handlePlanningList(newPlanningList);
    return true;
  };

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <h3>Ajouter un opérateur au planning</h3>
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <CloseWindow />
          </button>
        </div>
        <hr className="add-operator-search-hr" />

        <form>
          <Grid containe className="operator-grid-container">
            <Grid item xs={6}>
              <div className="add-operator-div-dropdown">
                {/* FORMULAIRE CHOIX DE L'OPERATEUR */}
                <FormControl variant="outlined">
                  <InputLabel>Opérateur*</InputLabel>
                  <MuiSelect
                    value={selectedOperateur}
                    onChange={handleOperateurChange}
                    label="Station"
                    style={{ marginTop: "8px", marginBottom: "16px" }}
                    required
                  >
                    <MenuItem value="">Sélectionner un élément</MenuItem>
                    {operators.map((item) => (
                      <MenuItem
                        key={item.name_operateur}
                        value={item.id_operateur}
                      >
                        {item.name_operateur}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                {/* FORMULAIRE CHOIX STATION */}
                <FormControl variant="outlined">
                  <InputLabel>Station*</InputLabel>
                  <MuiSelect
                    value={selectedStationItem}
                    onChange={handleStationChange}
                    label="Station"
                    style={{ marginTop: "8px", marginBottom: "16px" }}
                    required
                  >
                    <MenuItem value="">Sélectionner la station</MenuItem>
                    {filteredUniqueStations.map((item) => (
                      <MenuItem key={item.name_station} value={item.id_station}>
                        {item.name_station}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                {/* FORMULAIRE CHOIX SEMAINE */}
                <FormControl variant="outlined">
                  <InputLabel>Semaine*</InputLabel>
                  <MuiSelect
                    value={selectedSemaineItem}
                    onChange={handleSemaineChange}
                    label="Station"
                    style={{ marginTop: "8px", marginBottom: "16px" }}
                    required
                  >
                    <MenuItem value="">
                      Sélectionner la semaine du planning
                    </MenuItem>
                    {choixSemaine.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                <div style={{ display: "flex", justifyContent: "center" }}>
                  {jours.map((jour) => (
                    <FormControl variant="outlined" key={jour}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedJours.includes(jour)}
                            onChange={handleCheckboxChange(jour)}
                          />
                        }
                        label={jour}
                        style={{ marginTop: "8px", marginBottom: "16px" }}
                      />
                    </FormControl>
                  ))}
                </div>
              </div>
            </Grid>
          </Grid>
        </form>

        <div className="footer">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            Annuler
          </button>
          <button
            onClick={async () => {
              let success = false;

              if (
                !selectedOperateur ||
                !selectedStationItem ||
                !selectedSemaineItem
              ) {
                alert("Veuillez remplir tous les champs obligatoires.");
              } else {
                if (selectedSemaineItem === "Semaine Actuelle") {
                  success = handleValidation(
                    selectedOperateur,
                    selectedStationItem,
                    selectedJours
                  );
                } else if (selectedSemaineItem === "Semaine Pro") {
                  success = handleValidationNextWeek(
                    selectedOperateur,
                    selectedStationItem,
                    selectedJours
                  );
                }
              }

              if (success) {
                setOpenModal(false); // Fermer la modal si le traitement a réussi
              }
            }}
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPlanningFields;
