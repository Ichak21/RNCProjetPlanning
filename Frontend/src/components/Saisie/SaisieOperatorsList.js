import React, { useEffect, useState } from "react";
import "../../styles/SaisieOperatorsList.css";
import colors from "../../styles/colors";
import DataTable from "react-data-table-component";
import { FaSearch, FaUserCheck, FaUserTimes } from "react-icons/fa";
import axios from "axios";

function SaiseOperatorsList({ handleNewOperators, values }) {
  const baseURL = "http://127.0.0.1:8000/operateurs";
  const [operators, setOperators] = useState([]);
  const [operatorSearch, setOperatorSearch] = useState([]);
  const [selectedOperators, setSelectedOperators] = useState(new Set());

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(baseURL);
  //       const filteredActiveOperators = Object.values(response.data).filter((item) => {
  //         const active_status = item.active_status;
  //         return (
  //           active_status === "true"

  //         );
  //       });
  //       setOperators(response.data);
  //       setOperatorSearch(response.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      const filteredActiveOperators = Object.values(response.data).filter(
        (item) => {
          const active_status = item.active_status;
          return active_status === 1;
        }
      );
      // Reverse alphabetically
      const orderedActiveOperators = filteredActiveOperators.reverse();
      setOperators(orderedActiveOperators);
      setOperatorSearch(orderedActiveOperators);
    });
  }, []);

  const column = [
    {
      name: "Nom",
      selector: (row) => row.name_operateur,
      sortable: true,
      wrap: true,
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

  function handleShitSearch(event) {
    const newOperator = operators.filter((row) => {
      return row.id_shift
        .toString()
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });

    setOperatorSearch(newOperator);
  }

  function handleOperatorSearch(event) {
    const newOperator = operators.filter((row) => {
      return row.name_operateur
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });

    setOperatorSearch(newOperator);
  }

  function handleSearch(event) {
    if (parseInt(values.shift) === 1 || parseInt(values.shift) === 2) {
      // Utiliser la fonction de recherche basée sur id_shift
      const newOperator = operators.filter((row) =>
        row.id_shift.toString().toLowerCase().includes(parseInt(values.shift))
      );
      setOperatorSearch(newOperator);
    } else {
      // Utiliser la fonction de recherche basée sur le nom de l'opérateur
      const newOperator = operators.filter((row) =>
        row.name_operateur
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      );
      setOperatorSearch(newOperator);
    }
  }

  React.useEffect(() => {
    // Charger les opérateurs sélectionnés à partir du localStorage lors du chargement initial
    const storedOperators = localStorage.getItem("selectedOperators");
    if (storedOperators) {
      const operatorsArray = JSON.parse(storedOperators);
      setSelectedOperators(new Set(operatorsArray));
    }
  }, []);

  // Gérer les lignes sélectionnées
  function handleSelectedRowsChange(rows) {
    // Créer un nouvel ensemble pour stocker les opérateurs sélectionnés uniques
    const newSelectedOperators = new Set(selectedOperators);

    // Ajouter les opérateurs sélectionnés de la DataTable à l'ensemble
    rows.selectedRows.map((row) =>
      newSelectedOperators.add(row.name_operateur)
    );

    // Créer un nouvel ensemble pour stocker les opérateurs désélectionnés uniques
    const deselectedOperatorsSet = new Set();

    // Vérifier les opérateurs déjà présents dans l'ensemble selectedOperators mais absents de la DataTable (désélectionnés)
    selectedOperators.forEach((operator) => {
      if (!rows.selectedRows.find((row) => row.name_operateur === operator)) {
        deselectedOperatorsSet.add(operator);
      }
    });

    // Supprimer les opérateurs désélectionnés de l'ensemble des opérateurs sélectionnés
    deselectedOperatorsSet.forEach((operator) =>
      newSelectedOperators.delete(operator)
    );

    // Mettre à jour l'état des opérateurs sélectionnés
    setSelectedOperators(newSelectedOperators);

    // Convertir l'ensemble en tableau
    const newOperatorsArray = Array.from(newSelectedOperators);

    // Mettre à jour les opérateurs dans le localStorage
    localStorage.setItem(
      "selectedOperators",
      JSON.stringify(newOperatorsArray)
    );

    // Mettre à jour les nouveaux opérateurs dans le composant parent
    handleNewOperators(newOperatorsArray);
  }

  // const selctCriteria = (row) => {
  //   return selectedOperators.has(row.name_operateur);
  // };

  const selectedCriteria = (row) => {
    return !row.active_status;
  };

  return (
    <div className="main-operator-saisie">
      <div>
        <div className="operator-search-bar-saisie">
          <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input
              type="text"
              placeholder="Recherche..."
              onChange={handleOperatorSearch}
            />
          </div>
        </div>
        <hr className="operator-search-hr-saisie" />
        <div>
          <DataTable
            className="data-table-container"
            columns={column}
            data={operatorSearch}
            selectableRows={true}
            onSelectedRowsChange={handleSelectedRowsChange}
            selectableRowDisabled={selectedCriteria}
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
    </div>
  );
}

export default SaiseOperatorsList;
