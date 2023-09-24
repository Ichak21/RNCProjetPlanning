import { Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import colors from "../../styles/colors";
import axios from "axios";
import { BiPlus } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import AddPlanningFields from "./AddPlanningFields";
import "../../styles/FormSaisiePlanning.css";
import { format, addDays, getISOWeek, startOfWeek } from "date-fns";
import { async } from "q";

const FormSaisiePlanning = ({ nextStep, prevStep, values, handlePlanning }) => {
  const [fullfillDatas, setFullFillDatas] = useState({});
  const [addPlanningFields, setAddPlanningFields] = useState(false);
  const [operators, setOperators] = useState([]);
  const [planningList, setPlanningList] = useState([]);
  const [stations, setStations] = useState([]);
  const [operatorInfos, setOperatorInfos] = useState([]);
  const [operatorSkills, setOperatorSkills] = useState([]);

  const operatorURL = "http://127.0.0.1:8000/setting/operateur";
  //const [operatorSearch, setOperatorSearch] = useState([]);
  const stationURL = "http://127.0.0.1:8000/setting/station";
  const competenceURL = "http://127.0.0.1:8000/setting/competence";
  const fullfillURL = "http://127.0.0.1:8000/setting/fullfll/";

  useEffect(() => {
    setOperators(values.operators);
  }, [values.operators]);

  useEffect(() => {
    const planningListFromStorage = localStorage.getItem("planningList");
    const parsedPlanningList = planningListFromStorage
      ? JSON.parse(planningListFromStorage)
      : [];

    setPlanningList(parsedPlanningList);
  }, []);

  React.useEffect(() => {
    axios.get(operatorURL).then((response) => {
      setOperatorInfos(response.data);
    });
  }, []);

  React.useEffect(() => {
    axios.get(stationURL).then((response) => {
      setStations(response.data);
    });
  }, []);

  React.useEffect(() => {
    axios.get(competenceURL).then((response) => {
      const filteredOperatorSkills = response.data.filter((item) => {
        const id_station = item.id_station;
        const id_operateur = item.id_operateur;

        // Vous pouvez utiliser la méthode find pour vérifier si id_station et id_operateur existent dans planningList
        return (
          planningList.find(
            (planningItem) => planningItem.station === id_station
          ) &&
          planningList.find(
            (planningItem) => planningItem.personne === id_operateur
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

  // Créez un objet pour stocker les correspondances entre les stations et les opérateurs
  const operatorStationMap = {};
  const operatorInfosMap = {};
  const operatorSkillsMap = {};

  // Parcourez le tableau des stations et créez une correspondance avec les opérateurs
  stations.forEach((station) => {
    operatorStationMap[station.id_station] = station.name_station;
  });

  operatorInfos.forEach((operatorInfo) => {
    operatorInfosMap[operatorInfo.id_operateur] = operatorInfo.name_operateur;
  });

  uniqueSkillList.forEach((uniqueSkill) => {
    operatorSkillsMap[uniqueSkill.id_operateur] = uniqueSkill.level_competence;
  });

  // Maintenant, ajoutez le nom de la station correspondante à chaque opérateur
  for (const key in planningList) {
    if (planningList.hasOwnProperty(key)) {
      const planning = planningList[key];

      const id_station = planning.station;
      const id_operateur = planning.personne;
      planning.name_station = operatorStationMap[id_station];
      planning.name_operateur = operatorInfosMap[id_operateur];
      planning.tut = operatorSkillsMap[id_operateur];
    }
  }

  // Column of datatable entries
  const column = [
    {
      name: "5S",
      selector: (row) => (row.leader5S ? "🟢" : ""),
      sortable: true,
      wrap: true,
    },
    {
      name: "SST",
      selector: (row) => (row.SST ? "🟢" : ""),
      sortable: true,
      wrap: true,
    },
    {
      name: "Niv",
      selector: (row) => row.tut,
      sortable: true,
      wrap: true,
    },
    {
      name: "Equipe",
      selector: (row) => {
        if (row.shift === "1") {
          return <p>Equipe 1</p>;
        } else {
          return <p>Equipe 2</p>;
        }
      },
      sortable: true,
    },
    {
      name: "TL",
      selector: (row) => row.tl,
      sortable: true,
      wrap: true,
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
      wrap: true,
    },
    {
      name: "Semaine",
      selector: (row) => row.semaine,
      sortable: true,
      wrap: true,
    },
    {
      name: "Jour",
      selector: (row) => row.jour,
      sortable: true,
      wrap: true,
    },
    {
      name: "Station",
      selector: (row) => row.name_station,
      sortable: true,
      wrap: true,
    },
    {
      name: "Operateurs",
      selector: (row) => row.name_operateur,
      sortable: true,
      wrap: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            className="btn-delete-operator"
            onClick={() => handleDeleteEntry(row)}
          >
            <RxCross2 />
          </button>
        </div>
      ),
    },
  ];

  const customStyles = {
    table: {
      style: {
        borderRadius: "15px 15px 0 0",
        zIndex: 0,
      },
    },
    headRow: {
      style: {
        backgroundColor: "#3dcd58",
        textTransform: "uppercase",
        borderRadius: "15px 15px 0 0",
        fontWeight: "bold",
        color: colors.white,
      },
    },
    headCells: {
      style: {
        justifyContent: "center",
      },
    },
    cells: {
      style: {
        justifyContent: "center",
      },
    },
    pagination: {
      style: {
        borderRadius: "0 0 15px 15px",
      },
    },
  };

  const handleBack = (e) => {
    e.preventDefault();
    prevStep();
  };

  /*const handleValidate = (e) => {
    e.preventDefault();
    // On vide le tableau
    setPlanningList([]);
    localStorage.removeItem("planningList");
  };*/

  const handleValidate = (e) => {
    e.preventDefault();

    // Créez un objet pour stocker les jours et vérifiez s'il y a au moins une entrée SST = 1 pour chaque jour
    const daysWithSST = {};
    const invalidDays = [];
    const missingTut3 = [];

    planningList.forEach((entry) => {
      const { date, SST, name_station, tut } = entry;

      // Vérifiez si le jour existe dans l'objet, sinon initialisez-le avec false
      if (!daysWithSST[date]) {
        daysWithSST[date] = false;
      }

      // Si SST = 1, définissez le jour correspondant sur true
      if (SST === 1) {
        daysWithSST[date] = true;
      }

      // Vérifiez si tut = 1, s'il y a un tut = 3 pour la même date et la même station
      if (tut === 1) {
        const hasTut3 = planningList.some(
          (item) =>
            item.date === date &&
            item.name_station === name_station &&
            item.tut >= 3
        );
        if (!hasTut3) {
          missingTut3.push({ date, name_station });
        }
      }
    });

    // Vérifiez s'il y a au moins une entrée avec SST = 1 pour chaque jour
    Object.keys(daysWithSST).forEach((date) => {
      if (!daysWithSST[date]) {
        invalidDays.push(date);
      }
    });

    if (invalidDays.length === 0) {
      if (missingTut3.length === 0) {
        // Tous les jours ont au moins une entrée SST = 1, et la vérification Tut1 et Tut3 est également réussie.
        // Vous pouvez procéder à la suppression du tableau ou effectuer d'autres actions nécessaires ici
        setPlanningList([]);
        localStorage.removeItem("planningList");
      } else {
        // Affichez un message d'erreur pour les dates et les stations manquantes de Tut3
        const errorMessage = `Il doit y avoir au moins un Tuteur de niveau 3 pour les dates et les stations suivantes : ${missingTut3
          .map(
            (item) => `\nDate : ${item.date} | Station : ${item.name_station}`
          )
          .join(", ")}`;
        alert(errorMessage);
      }
    } else {
      // Affichez un message d'erreur avec les jours concernés pour SST = 1
      const errorMessage = `Il doit y avoir au moins un SST pour chaque jour. Non présent le ${invalidDays.join(
        ", "
      )}`;
      alert(errorMessage);
    }
  };

  const handlePlanningList = (newPL) => {
    setPlanningList((prevList) => [...prevList, ...newPL]);
    // Sauvegarder les données dans le localStorage
    const planningListFromStorage = localStorage.getItem("planningList");
    const parsedPlanningList = planningListFromStorage
      ? JSON.parse(planningListFromStorage)
      : [];
    const storedPlanningList = parsedPlanningList;
    const updatedPlanningList = [...storedPlanningList, ...newPL];
    localStorage.setItem("planningList", JSON.stringify(updatedPlanningList));
  };

  const handleDeleteEntry = (entryToDelete) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette entrée ?"
    );

    if (confirmed) {
      // Supprimez l'entrée du tableau
      const updatedPlanningList = planningList.filter(
        (entry) => entry !== entryToDelete
      );

      // Mettez à jour le state avec le nouveau tableau
      setPlanningList(updatedPlanningList);

      // Mettez à jour le localStorage
      localStorage.setItem("planningList", JSON.stringify(updatedPlanningList));
    }
  };

  const currenTL = localStorage.getItem("currentUser");
  const [operatorsName, setOperatorsName] = useState([]);

  React.useEffect(() => {
    axios.get("http://127.0.0.1:8000/setting/operateur").then((response) => {
      setOperatorsName(response.data);
    });
  }, []);

  // Créez un objet pour stocker les correspondances entre les stations et les opérateurs
  const operatorsNameMap = {};

  // Parcourez le tableau des stations et créez une correspondance avec les opérateurs
  operatorsName.forEach((opName) => {
    operatorsNameMap[opName.name_operateur] = opName.id_operateur;
  });

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

  const handleValidationNextWeek = (op, st, sst, lead5s, niv, jr) => {
    const newPlanningList = jr.map((jour) => {
      // Récupérer l'index du jour sélectionné dans la liste 'jours'
      const selectedDayIndex = jours.indexOf(jour);

      // Ajouter 7 jours pour obtenir la date de la semaine prochaine
      const nextWeekDate = addDays(weekStartDate, selectedDayIndex + 7);
      // console.log("st :>> ", st);
      return {
        personne: op,
        shift: values.shift,
        tl: currenTL,
        station: st,
        jour: jour,
        date: format(nextWeekDate, "yyyy-MM-dd"),
        semaine: `${nextWeekYear}-${nextWeek}`,
        SST: sst,
        leader5S: lead5s,
        tut: niv,
      };
    });

    // Mettez à jour le state avec le nouveau tableau
    handlePlanningList(newPlanningList);
  };

  const handleFullFill = () => {
    localStorage.setItem("planningList", []);
    setPlanningList([]);
    axios
      .get("http://127.0.0.1:8000/setting/fullfll/90")
      .then((response) => {
        setFullFillDatas(response.data);

        //transforme les données du model en tableau de list d'objet
        const updatedPL = [];

        for (const stationKey in fullfillDatas.Planning) {
          const [operateur, [niv, SST, leader5S]] =
            fullfillDatas.Planning[stationKey];

          const stationInfo = {
            station: stationKey.slice(0, -2),
            operateur: operateur,
            niv: niv,
            leader5S: leader5S,
            SST: SST,
          };

          updatedPL.push(stationInfo);
        }

        // Mettez à jour planningList avec les résultats de l'appel API
        Promise.all(
          updatedPL.map((planning) =>
            axios
              .get(`http://127.0.0.1:8000/cleanNameToId/${planning.station}`)
              .then((response) => response.data.id_station)
              .catch((error) => {
                console.error(
                  `Erreur lors de l'appel API pour id_station ${planning.station}:`,
                  error
                );
                return null; // ou une valeur par défaut appropriée si vous préférez
              })
          )
        ).then((cleanNames) => {
          console.log("operatorsNameMap :>> ", operatorsNameMap);
          // cleanNames contient les résultats de chaque appel API, dans le même ordre que updatedPlanningList

          // Mettez à jour les éléments de updatedPlanningList avec les clean_names correspondants

          function cleanName(name) {
            // Supprimez les titres "M.", "Mme.", "Mlle." avec ou sans espaces
            const cleanedName = name.replace(/^(M\.|Mme?\.|Mlle\.|\s)+/i, "");

            // Convertissez la chaîne résultante en majuscules
            const upperCaseName = cleanedName.toUpperCase();

            return upperCaseName;
          }

          updatedPL.forEach((planning, index) => {
            const normalizedOperateur = planning.operateur;

            for (const name in operatorsNameMap) {
              const normalizedName = cleanName(name);
              console.log("Name :>> ", name);
              console.log("CleanName :>> ", cleanName(name));

              if (normalizedOperateur.includes(normalizedName)) {
                planning.id_op = operatorsNameMap[name];
                break;
              }
            }

            planning.id_st = cleanNames[index];
          });

          updatedPL.forEach((entry) => {
            let op = entry.id_op;
            let st = entry.id_st;

            let sst = entry.SST;
            let lead5s = entry.leader5S;
            let niv = entry.niv;
            console.log("st :>> ", st);

            handleValidationNextWeek(op, st, sst, lead5s, niv, jours);
          });
        });

        console.log("TEST :>> ", updatedPL);

        // Vider le localStorage du planningList
        // localStorage.setItem("planningList", []);

        // Mettez à jour le localStorage
        // localStorage.setItem("planningList", JSON.stringify(planningList));
        // console.log("updatedPL :>> ", updatedPL[0].station);
      })
      .catch((error) => {
        console.error("Erreur lors du lancement de prepro.py : ", error);
      });
  };

  return (
    <div className="main-planningForm">
      <div>
        <div className="saisie-fullfill-add">
          <button onClick={handleFullFill} className="fullfill-saisie-button">
            FullFill
          </button>

          <div className="fullfill-metrics">
            <div>
              <p>Chances d'atteindre :</p>
            </div>
            <p>
              la quantité :{" "}
              <span className="metrics-span">
                {" "}
                {parseFloat(fullfillDatas.QTY).toFixed(2) * 100} %
              </span>
            </p>

            <p>
              le KE :{" "}
              <span className="metrics-span">
                {" "}
                {parseFloat(fullfillDatas.KTE).toFixed(2) * 100} %
              </span>
            </p>
          </div>

          <div className="add-pl-section">
            <button
              className="button-add-planning"
              onClick={() => {
                setAddPlanningFields(true);
              }}
            >
              <BiPlus />
            </button>
          </div>
        </div>

        <div>
          <DataTable
            className="data-table-container-pl"
            columns={column}
            data={planningList}
            responsive={true}
            responsiveSm={true}
            responsiveMd={true}
            responsiveLg={true}
            responsiveXl={true}
            pagination
            fixedHeader
            fixedHeaderScrollHeight="440px"
            highlightOnHover
            pointerOnHover
            customStyles={customStyles}
            noDataComponent="Aucune information trouvée"
          ></DataTable>
        </div>

        <div className="btn-pl-main">
          <Button color="secondary" variant="contained" onClick={handleBack}>
            Retour
          </Button>

          <Button color="primary" variant="contained" onClick={handleValidate}>
            Valider
          </Button>
        </div>
      </div>
      <div className="add-planning-modal">
        {addPlanningFields && (
          <AddPlanningFields
            setOpenModal={setAddPlanningFields}
            operatorsList={operators}
            values={values}
            handlePlanningList={handlePlanningList}
          />
        )}
      </div>
    </div>
  );
};

export default FormSaisiePlanning;
