import React, { useState } from "react";
import axios from "axios";
import "../../styles/Competences.css";
import colors from "../../styles/colors";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";
import ShowSoftCompetence from "../ShowSoftCompetence";

function Competence() {
  const [operatorSearch, setOperatorSearch] = useState([]);
  const [softSkills, setSoftSkills] = useState([]);
  const [operators, setOperators] = useState([]);
  const [stations, setStations] = useState([]);

  const softSkillsURL = "http://127.0.0.1:8000/setting/softcompetence";
  const operateurURL = "http://127.0.0.1:8000/setting/operateur";
  const stationURL = "http://127.0.0.1:8000/setting/station";

  React.useEffect(() => {
    axios.get(softSkillsURL).then((response) => {
      const filteredSoftSkills = Object.values(response.data).filter((item) => {
        const id_station = item.id_station;
        const level_competence = item.level_competence;
        return (
          level_competence === 1 &&
          (id_station === 52 ||
            id_station === 63 ||
            id_station === 65 ||
            id_station === 66)
        );
      });
      setSoftSkills(filteredSoftSkills);
      setOperatorSearch(filteredSoftSkills);
    });
  }, []);

  React.useEffect(() => {
    axios.get(operateurURL).then((response) => {
      setOperators(response.data);
    });
  }, []);

  React.useEffect(() => {
    axios.get(stationURL).then((response) => {
      setStations(response.data);
    });
  }, []);

  // Créez un objet pour stocker les correspondances entre les compétences et les opérateurs
  const softSkillOperatoMap = {};
  const softSkillStationMap = {};

  // Parcourez le tableau des opérateurs et créez une correspondance avec les compétences
  operators.forEach((operator) => {
    softSkillOperatoMap[operator.id_operateur] = operator.name_operateur;
  });
  // Parcourez le tableau des stations et créez une correspondance avec les compétences
  stations.forEach((station) => {
    softSkillStationMap[station.id_station] = station.name_station;
  });

  // Maintenant, ajoutez le nom de la station correspondante à chaque opérateur
  for (const key in softSkills) {
    if (softSkills.hasOwnProperty(key)) {
      const softSkill = softSkills[key];
      const id_station = softSkill.id_station;
      const id_operateur = softSkill.id_operateur;
      softSkill.name_station = softSkillStationMap[id_station];
      softSkill.name_operateur = softSkillOperatoMap[id_operateur];
    }
  }

  function handleOperatorSearch(event) {
    const newOperator = softSkills.filter((row) => {
      return row.name_operateur
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });

    setOperatorSearch(newOperator);
  }

  const column = [
    {
      name: "Nom",
      selector: (row) => row.name_operateur,
      sortable: true,
      wrap: true,
    },
    {
      name: "Compétences",
      cell: (row) => {
        if (row.id_station === 52) {
          return (
            <div className="skill-container">
              <div className="operator-red-skill-container">
                {row.name_station}
              </div>
              <div className="assessment-container">{row.last_assesement}</div>
            </div>
          );
        } else if (row.id_station === 63) {
          return (
            <div className="skill-container">
              <div className="operator-green-skill-container">
                {row.name_station}
              </div>
              <div className="assessment-container">{row.last_assesement}</div>
            </div>
          );
        } else if (row.id_station === 65) {
          return (
            <div className="skill-container">
              <div className="operator-purple-skill-container">
                {row.name_station}
              </div>
              <div className="assessment-container">{row.last_assesement}</div>
            </div>
          );
        } else {
          return (
            <div className="skill-container">
              <div className="operator-orange-skill-container">
                {row.name_station}
              </div>
              <div className="assessment-container">{row.last_assesement}</div>
            </div>
          );
        }
      },
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

  return (
    <div className="main-skill">
      <div>
        <div className="operator-search-bar">
          <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input
              type="text"
              placeholder="Recherche..."
              onChange={handleOperatorSearch}
            />
          </div>
        </div>
        <hr className="operator-search-hr" />
        <div>
          <DataTable
            className="data-table-container"
            columns={column}
            data={operatorSearch}
            responsive={true}
            responsiveSm={true}
            responsiveMd={true}
            responsiveLg={true}
            responsiveXl={true}
            paginationPerPage={20}
            pagination
            fixedHeader
            fixedHeaderScrollHeight="440px"
            highlightOnHover
            pointerOnHover
            customStyles={customStyles}
            noDataComponent="Aucune information trouvée"
          ></DataTable>
        </div>
      </div>
    </div>
  );
}

export default Competence;
