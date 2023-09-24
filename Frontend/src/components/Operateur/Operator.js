import React, { useState } from "react";
import "../../styles/Operator.css";
import colors from "../../styles/colors";
import DataTable from "react-data-table-component";
import { FaSearch, FaUserCheck, FaUserTimes } from "react-icons/fa";
import { BiPlus } from "react-icons/bi";
import { MdModeEdit } from "react-icons/md";
import AddOperator from "./AddOperator";
import axios from "axios";
import EditOperator from "./EditOperator";

function Operator() {
  const [addOperator, setAddOperator] = useState(false);
  const [editOperator, setEditOperator] = useState(null);

  const baseURL = "http://127.0.0.1:8000/setting/operateur";
  const stationURL = "http://127.0.0.1:8000/setting/station";
  const [operators, setOperators] = useState([]);
  const [stations, setStations] = useState([]);
  const [operatorSearch, setOperatorSearch] = useState([]);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setOperators(response.data);
      setOperatorSearch(response.data);
    });
  }, []);

  React.useEffect(() => {
    axios.get(stationURL).then((response) => {
      setStations(response.data);
    });
  }, []);

  // Créez un objet pour stocker les correspondances entre les stations et les opérateurs
  const operatorStationMap = {};

  // Parcourez le tableau des stations et créez une correspondance avec les opérateurs
  stations.forEach((station) => {
    operatorStationMap[station.id_station] = station.name_station;
  });

  // Maintenant, ajoutez le nom de la station correspondante à chaque opérateur
  for (const key in operators) {
    if (operators.hasOwnProperty(key)) {
      const operator = operators[key];
      const home_station = operator.home_station;
      operator.name_station = operatorStationMap[home_station];
    }
  }

  const column = [
    {
      name: "Nom",
      selector: (row) => row.name_operateur,
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
      name: "Type",
      selector: (row) => row.isTemp,
      sortable: true,
    },
    {
      name: "Shift",
      selector: (row) => row.id_shift,
      sortable: true,
    },
    {
      name: "Date entrée",
      selector: (row) => row.start_date,
    },
    {
      name: "Date fin",
      selector: (row) => row.end_date,
    },
    {
      name: "Statut",
      selector: (row) =>
        row.active_status ? (
          <FaUserCheck className="status-icon-active" />
        ) : (
          <FaUserTimes className="status-icon-inactive" />
        ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            className="btn-edit-operator"
            onClick={() => handleEditOperator(row)}
          >
            <MdModeEdit />
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

  function handleOperatorSearch(event) {
    const newOperator = operators.filter((row) => {
      return row.name_operateur
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });

    setOperatorSearch(newOperator);
  }

  const handleEditOperator = (operators) => {
    setEditOperator(operators);
  };

  return (
    <div className="main-operator">
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
          <button
            className="button-add-operator"
            onClick={() => {
              setAddOperator(true);
            }}
          >
            <BiPlus />
          </button>
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
      <div className="add-operator-modal">
        {addOperator && <AddOperator setOpenModal={setAddOperator} />}
        {editOperator && (
          <EditOperator
            setOpenModal={setEditOperator}
            EditOperator={editOperator}
          />
        )}
      </div>
    </div>
  );
}

export default Operator;
