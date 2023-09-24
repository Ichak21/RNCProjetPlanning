import React, { useState } from "react";
import "../styles/Home.css";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import axios from "axios";
import pdf from "../assets/logo/pdf.png";

function Home() {
  const [shiftSelected, setShiftSelected] = useState(1);

  const weeks = [
    "2022-47",
    "2022-48",
    "2022-49",
    "2022-50",
    "2022-51",
    "2022-52",
    "2023-01",
    "2023-02",
    "2023-03",
    "2023-04",
    "2023-05",
    "2023-06",
    "2023-07",
    "2023-08",
    "2023-09",
    "2023-10",
    "2023-11",
    "2023-12",
    "2023-13",
    "2023-14",
    "2023-15",
    "2023-16",
    "2023-17",
    "2023-18",
    "2023-19",
    "2023-20",
    "2023-21",
    "2023-22",
    "2023-23",
    "2023-24",
    "2023-25",
    "2023-26",
    "2023-27",
    "2023-28",
    "2023-29",
    "2023-30",
    "2023-31",
    "2023-32",
    "2023-33",
    "2023-34",
    "2023-35",
    "2023-36",
    "2023-37",
    "2023-38",
    "2023-39",
    "2023-40",
    "2023-41",
    "2023-42",
    "2023-43",
    "2023-44",
    "2023-45",
    "2023-46",
    "2023-47",
    "2023-48",
    "2023-49",
    "2023-50",
    "2023-51",
    "2023-52",
  ]; // Liste des semaines

  const [switchState, setSwitchState] = useState(false);

  //trouver la semaine actuelle en fonction des semaines de weeks
  function getCurrentWeekIndex() {
    const now = new Date();
    const year = now.getFullYear();
    const weekNumber = getWeekNumber(now);

    // Construire la semaine actuelle au format "année-semaine"
    const currentWeek = `${year}-${weekNumber.toString().padStart(2, "0")}`;

    // Trouver l'index de la semaine actuelle dans le tableau des semaines
    const currentWeekIndex = weeks.indexOf(currentWeek);

    return currentWeekIndex !== -1 ? currentWeekIndex : 0; // Utilisez 0 si la semaine actuelle n'est pas trouvée
  }

  function getWeekNumber(date) {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }

  const currentWeekIndex = getCurrentWeekIndex();
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(currentWeekIndex); // Indice de la semaine actuellement sélectionnée

  // Planning en fonction des paramètres année-semaine et équipe Mat ou AM
  const [planningList, setPlanningList] = useState([]);
  const [planningPresenceChoice, setPlanningPresenceChoice] =
    useState("present");

  // Datas affichage présence total et absence total
  const [totalPresence, setTotalPresence] = useState(0);
  const [totalAbsence, setTotalAbsence] = useState(0);

  // Utilisez reduce pour diviser les éléments en deux tableaux distincts

  React.useEffect(() => {
    axios.get("http://localhost:8000/setting/planning").then((response) => {
      const filteredSoftSkills = Object.values(response.data).filter((item) => {
        const week = item.week;
        const id_shift = item.id_shift;
        //const id_station = item.id_station;
        return week === "2022-52" && id_shift === shiftSelected;
      });

      const absencePlanningList = [];
      const presencePlanningList = [];

      filteredSoftSkills.forEach((item) => {
        // Remplacez ces valeurs par celles que vous souhaitez vérifier
        const absenceStations = [67, 68, 69, 70, 71];
        if (absenceStations.includes(item.id_station)) {
          absencePlanningList.push(item);
        } else {
          presencePlanningList.push(item);
        }
      });

      // Calculate total presence and total absence
      const totalPresenceCount = presencePlanningList.length;
      const totalAbsenceCount = absencePlanningList.length;

      setTotalPresence(totalPresenceCount);
      setTotalAbsence(totalAbsenceCount);

      // Utilisez la variable planningPresenceChoice pour choisir entre presencePlanningList et absencePlanningList
      const updatedPlanningList =
        planningPresenceChoice === "present"
          ? presencePlanningList
          : absencePlanningList;

      // Mettez à jour planningList avec les résultats de l'appel API
      Promise.all(
        updatedPlanningList.map((planning) =>
          axios
            .get(`http://127.0.0.1:8000/idToCleanName/${planning.id_station}`)
            .then((response) => response.data.clean_name)
            .catch((error) => {
              console.error(
                `Erreur lors de l'appel API pour id_station ${planning.id_station}:`,
                error
              );
              return null; // ou une valeur par défaut appropriée si vous préférez
            })
        )
      )
        .then((cleanNames) => {
          // cleanNames contient les résultats de chaque appel API, dans le même ordre que updatedPlanningList

          // Mettez à jour les éléments de updatedPlanningList avec les clean_names correspondants
          updatedPlanningList.forEach((planning, index) => {
            planning.clean_name_station = cleanNames[index];
          });

          // Mettez à jour planningList
          setPlanningList(updatedPlanningList);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données :", error);
        });
    });
  }, [shiftSelected, planningPresenceChoice]);

  //Process pour récupérer les noms des opérateurs
  const [operatorInfos, setOperatorInfos] = useState([]);
  React.useEffect(() => {
    axios.get("http://127.0.0.1:8000/setting/operateur").then((response) => {
      setOperatorInfos(response.data);
    });
  }, []);
  const operatorInfosMap = {};
  operatorInfos.forEach((operatorInfo) => {
    operatorInfosMap[operatorInfo.id_operateur] = operatorInfo.name_operateur;
  });

  //Process pour récupérer les noms des stations
  const [stationInfos, setStationInfos] = useState([]);
  React.useEffect(() => {
    axios.get("http://127.0.0.1:8000/setting/station").then((response) => {
      setStationInfos(response.data);
    });
  }, []);
  const stationInfosMap = {};
  stationInfos.forEach((stationInfo) => {
    stationInfosMap[stationInfo.id_station] = stationInfo.name_station;
  });

  //Process pour récupérer les compétences pour SST et Leader 5S
  const [operatorSoftSkills, setOperatorSoftSkills] = useState([]);
  // Retrieve operator soft skills
  React.useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/setting/softcompetence")
      .then((response) => {
        const filteredOperatorSoftSkills = response.data.filter((item) => {
          const id_station = item.id_station;
          const id_operateur = item.id_operateur;

          // Vous pouvez utiliser la méthode find pour vérifier si id_station et id_operateur existent dans planningList
          return (
            planningList.find(
              (planningItem) => planningItem.id_operateur === id_operateur
            ) &&
            (id_station === 52 || id_station === 65)
          );
        });
        setOperatorSoftSkills(filteredOperatorSoftSkills);
      });
  }, [planningList]);

  // Process pour récupérer le niveau Tut pour la station assignée
  const [operatorSkills, setOperatorSkills] = useState([]);
  React.useEffect(() => {
    axios.get("http://127.0.0.1:8000/setting/competence").then((response) => {
      const filteredOperatorSkills = response.data.filter((item) => {
        const id_station = item.id_station;
        const id_operateur = item.id_operateur;

        // Vous pouvez utiliser la méthode find pour vérifier si id_station et id_operateur existent dans planningList
        return (
          planningList.find(
            (planningItem) => planningItem.id_station === id_station
          ) &&
          planningList.find(
            (planningItem) => planningItem.id_operateur === id_operateur
          )
        );
      });
      setOperatorSkills(filteredOperatorSkills);
    });
  }, [planningList]);

  // Créez un objet pour stocker les compétences uniques avec l'ID le plus élevé
  const uniqueSkills = {};

  // Parcourez la liste des compétences
  for (const skill of operatorSkills) {
    const key = `${skill.id_operateur}-${skill.id_station}`;

    // Vérifiez si cette combinaison de nom et de station existe déjà et si l'ID actuel est plus élevé
    if (!uniqueSkills[key] || skill.id > uniqueSkills[key].id) {
      uniqueSkills[key] = skill;
    }
  }

  // Convertissez l'objet en une liste d'éléments uniques
  const uniqueSkillList = Object.values(uniqueSkills);

  // Pour chaque opérateur, on ajoute la bonne compétence et son niveau
  for (const key in planningList) {
    if (planningList.hasOwnProperty(key)) {
      const planning = planningList[key];
      const id_operateur = planning.id_operateur;
      const id_station = planning.id_station;

      planning.name_operateur = operatorInfosMap[id_operateur];
      planning.name_station = stationInfosMap[id_station];

      planning.SST = operatorSoftSkills.find(
        (item) => item.id_station === 52 && item.id_operateur === id_operateur
      )?.level_competence;
      planning.SST = planning.SST ? planning.SST : 0;

      planning.Leader_5S = operatorSoftSkills.find(
        (item) => item.id_station === 65 && item.id_operateur === id_operateur
      )?.level_competence;
      planning.Leader_5S = planning.Leader_5S ? planning.Leader_5S : 0;

      planning.Niv = uniqueSkillList.find(
        (item) =>
          item.id_station === id_station && item.id_operateur === id_operateur
      )?.level_competence;
      planning.Niv = planning.Niv ? planning.Niv : 0;
    }
  }

  // console.log(planningList);

  // On trie par id_station de façon ascendante
  planningList.sort((a, b) => a.id_station - b.id_station);

  // Composant personnalisé pour la sélection en mode switch button
  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 40,
    height: 20,
    padding: 0,
    display: "flex",
    border: "3px solid #3dcd58",
    borderRadius: 8,
    ".css-5ryogn-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track":
      {
        backgroundColor: "#F3F4F8",
      },
    ".css-5ryogn-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked": {
      color: "#3dcd58",
    },

    "&:active": {
      "& .MuiSwitch-thumb": {
        width: 15,
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(9px)",
      },
    },
    "& .MuiSwitch-switchBase": {
      padding: 2,
      color: "#3dcd58",
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 12,
      height: 12,
      borderRadius: 5,
      transition: theme.transitions.create(["width"], {
        duration: 200,
      }),
    },
    "& .MuiSwitch-track": {
      borderRadius: 16 / 2,
      opacity: 0,
      boxSizing: "border-box",
    },
  }));

  // Gestion du switch Mat ou AM
  const handleSwitchClick = () => {
    setSwitchState(!switchState); // Inverse l'état du switch lorsqu'il est cliqué

    if (switchState) {
      setShiftSelected(1); // Si le switch est à Mat, définissez shiftSelected sur "2" (AM)
    } else {
      setShiftSelected(2); // Si le switch est à AM, définissez shiftSelected sur "1" (Mat)
    }
  };

  //Bouton Prev planning week
  const handlePrevWeekClick = () => {
    // Mettre à jour la semaine précédente
    setSelectedWeekIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  //Bouton Next planning week
  const handleNextWeekClick = () => {
    // Mettre à jour la semaine suivante
    setSelectedWeekIndex((prevIndex) =>
      prevIndex < weeks.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  // Fonction pour obtenir la date correspondante à une semaine donnée
  const getMonthYearFromDate = (week) => {
    const [year, weekNumber] = week.split("-");
    const date = new Date(year, 0, 1 + (weekNumber - 1) * 7);
    const options = { year: "numeric", month: "long" };
    return date.toLocaleDateString(undefined, options);
  };

  //===============================================================================================================
  //================================================ CODE DU DESSUS OK NORMALEMENT =================================
  //===============================================================================================================

  // Fonction pour regrouper les données par clean_name_station et name_operateur
  const groupData = () => {
    const groupedData = {};

    planningList.forEach((item) => {
      const equipeKey = `${item.clean_name_station}_${item.name_operateur}`;
      if (!groupedData[equipeKey]) {
        groupedData[equipeKey] = {
          id_station: item.id_station,
          clean_name_station: item.clean_name_station,
          name_operateur: item.name_operateur,
          Leader_5S: item.Leader_5S,
          SST: item.SST,
          Niv: item.Niv,
          jours: {
            lundi: [],
            mardi: [],
            mercredi: [],
            jeudi: [],
            vendredi: [],
          },
        };
      }
      const jourData = groupedData[equipeKey].jours[item.day];
      jourData.push({
        Leader_5S: groupedData[equipeKey].Leader_5S,
        SST: groupedData[equipeKey].SST,
        Niv: groupedData[equipeKey].Niv,
      });
    });

    return Object.values(groupedData);
  };

  const equipeData = groupData();

  const renderTableData = () => {
    return equipeData.map((equipe) => {
      return (
        <tr className={"home-station"} data-station={equipe.id_station}>
          <td>
            <p data-station={equipe.id_station}>{equipe.clean_name_station}</p>
          </td>
          {["lundi", "mardi", "mercredi", "jeudi", "vendredi"].map((jour) => (
            <React.Fragment key={jour}>
              {equipe.jours[jour].length > 0 ? (
                <>
                  <td className="home-operator-name">
                    {equipe.name_operateur}
                  </td>
                  <td>{equipe.Leader_5S ? "⚪" : ""}</td>
                  <td>{equipe.SST ? "🔵" : ""}</td>
                  <td>{equipe.Niv}</td>
                </>
              ) : (
                <>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </>
              )}
            </React.Fragment>
          ))}
        </tr>
      );
    });
  };

  return (
    <div className="main-home">
      {/* DATAS */}
      <div className="main-home-datas-section">
        <div className="home-dashboard-section">
          {/* PRESENCE TOTAL HEURE */}
          <div className="home-presence-dashboard">
            <p>Présence total</p>

            <span> {totalPresence * 7} hrs</span>
          </div>

          {/* PRESENCE TOTAL HEURE */}
          <div className="home-absence-dashboard">
            <p>Absence total</p>

            <span>{totalAbsence * 7} hrs</span>
          </div>
        </div>

        <div className="main-home-planning-section">
          {/* PLANNING ITEMS */}
          <div className="main-planning-items">
            {/* PRESENCE */}
            <div className="presence-selection">
              <input
                type="radio"
                name="presence"
                id="present-list"
                value="present"
                checked={planningPresenceChoice === "present"}
                onChange={(e) => setPlanningPresenceChoice(e.target.value)}
              />
              <label htmlFor="present-list">Présents</label>

              <input
                type="radio"
                name="presence"
                id="absent-list"
                value="absent"
                checked={planningPresenceChoice === "absent"}
                onChange={(e) => setPlanningPresenceChoice(e.target.value)}
              />
              <label htmlFor="absent-list">Absents</label>
            </div>

            {/* WEEK */}
            <div className="week-selection">
              <div>
                <button
                  className="button-prev-week"
                  onClick={handlePrevWeekClick}
                >
                  <BsArrowLeft />
                </button>
              </div>

              <div>
                <div className="month-year-text">
                  {getMonthYearFromDate(weeks[selectedWeekIndex])} /{" "}
                  <select
                    className="week-dropdown"
                    value={weeks[selectedWeekIndex]}
                    onChange={(e) => {
                      const selectedIndex = weeks.indexOf(e.target.value);
                      setSelectedWeekIndex(selectedIndex);
                    }}
                  >
                    {weeks.map((week) => (
                      <option key={week} value={week}>
                        {week}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <button
                  className="button-next-week"
                  onClick={handleNextWeekClick}
                >
                  <BsArrowRight />
                </button>
              </div>
            </div>

            <div className="pdf-and-shift">
              {/* SHIFT */}
              <div className="shift-selection" onClick={handleSwitchClick}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    value="1"
                    className={switchState ? "active" : "inactive"}
                  >
                    Mat
                  </Typography>
                  <AntSwitch
                    defaultChecked={switchState}
                    inputProps={{ "aria-label": "ant design" }}
                  />
                  <Typography
                    value="2"
                    className={switchState ? "inactive" : "active"}
                  >
                    A-M
                  </Typography>
                </Stack>
              </div>

              {/* PDF BUTTON */}
              <div className="home-pdf-section">
                <button className="pdf-button" onClick={window.print}>
                  <img className="pdf-button" src={pdf} alt="Logo_pdf" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===============  PLANNING TABLE  =================== */}
        <div className="main-planning-table">
          <table cellspacing="0">
            <thead>
              <tr>
                <th className="table-equipe" rowSpan="2">
                  Equipe
                </th>
                <th colSpan="4">Lundi</th>
                <th colSpan="4">Mardi</th>
                <th colSpan="4">Mercredi</th>
                <th colSpan="4">Jeudi</th>
                <th colSpan="4">Vendredi</th>
              </tr>
              <tr className="sub-col-compt">
                <th>Opérateur</th>
                <th>5S</th>
                <th>SST</th>
                <th>Niv</th>
                <th>Opérateur</th>
                <th>5S</th>
                <th>SST</th>
                <th>Niv</th>
                <th>Opérateur</th>
                <th>5S</th>
                <th>SST</th>
                <th>Niv</th>
                <th>Opérateur</th>
                <th>5S</th>
                <th>SST</th>
                <th>Niv</th>
                <th>Opérateur</th>
                <th>5S</th>
                <th>SST</th>
                <th>Niv</th>
              </tr>
            </thead>
            <tbody>{renderTableData()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;
