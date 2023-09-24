import React, { useState } from "react";
import "../../styles/Station.css";
import colors from "../../styles/colors";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";
import { BiPlus } from "react-icons/bi";
import { MdModeEdit } from "react-icons/md";
import axios from "axios";
import AddStation from "./AddStation";
import EditStation from "./EditStation";

function Station() {
  const [addStation, setAddStation] = useState(false);
  const [editStation, setEditStation] = useState(null);

  const baseURL = "http://127.0.0.1:8000/setting/station";
  const secteurURL = "http://127.0.0.1:8000/setting/secteur";
  const [stations, setStations] = useState([]);
  const [secteurs, setSSecteurs] = useState([]);
  const [stationSearch, setStationSearch] = useState([]);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setStations(response.data);
      setStationSearch(response.data);
    });
  }, []);

  React.useEffect(() => {
    axios.get(secteurURL).then((response) => {
      setSSecteurs(response.data);
    });
  }, []);

  // Créez un objet pour stocker les correspondances entre les secteurs et les stations
  const operatorSecteurMap = {};

  // Parcourez le tableau des secteurs et créez une correspondance avec les stations
  secteurs.forEach((secteur) => {
    operatorSecteurMap[secteur.id_secteur] = secteur.name_secteur;
  });

  // Maintenant, ajoutez le nom de la station correspondante à chaque opérateur
  for (const key in stations) {
    if (stations.hasOwnProperty(key)) {
      const station = stations[key];
      const name_secteur = station.id_secteur;
      station.name_secteur = operatorSecteurMap[name_secteur];
    }
  }

  const column = [
    {
      name: "Station",
      selector: (row) => row.name_station,
      sortable: true,
      wrap: true,
    },
    {
      name: "Capacité",
      selector: (row) => row.capa_max,
      sortable: true,
    },
    {
      name: "Secteur",
      selector: (row) => row.name_secteur,
      sortable: true,
      wrap: true,
    },
    // {
    //   name: "Id Station",
    //   selector: (row) => row.id_station,
    //   sortable: true,
    // },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            className="btn-edit-station"
            onClick={() => handleEditStation(row)}
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

  function handleStationSearch(event) {
    const newStation = stations.filter((row) => {
      return row.name_station
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });

    setStationSearch(newStation);
  }

  const handleEditStation = (stations) => {
    setEditStation(stations);
  };

  return (
    <div data-testid="station-main" className="main-station">
      <div>
        <div className="station-search-bar">
          <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input
              type="text"
              placeholder="Recherche..."
              onChange={handleStationSearch}
            />
          </div>
          <button
            className="button-add-station"
            onClick={() => {
              setAddStation(true);
            }}
          >
            <BiPlus />
          </button>
        </div>
        <hr className="station-search-hr" />
        <div>
          <DataTable
            className="data-table-container"
            columns={column}
            data={stationSearch}
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
      <div className="add-station-modal">
        {addStation && <AddStation setOpenModal={setAddStation} />}
        {editStation && (
          <EditStation
            setOpenModal={setEditStation}
            EditStation={editStation}
          />
        )}
      </div>
    </div>
  );
}

export default Station;
