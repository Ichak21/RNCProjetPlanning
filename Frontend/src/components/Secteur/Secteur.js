import React, { useState } from "react";
import "../../styles/Secteur.css";
import colors from "../../styles/colors";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";
import { BiPlus } from "react-icons/bi";
import { MdModeEdit } from "react-icons/md";
import axios from "axios";
import AddSecteur from "./AddSecteur";
import EditSecteur from "./EditSecteur";

function Secteur() {
  const [addSecteur, setAddSecteur] = useState(false);
  const [editSecteur, setEditSecteur] = useState(null);

  const baseURL = "http://127.0.0.1:8000/setting/secteur";
  const [Secteurs, setSecteurs] = useState([]);
  const [SecteurSearch, setSecteurSearch] = useState([]);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setSecteurs(response.data);
      setSecteurSearch(response.data);
    });
  }, []);
  const column = [
    {
      name: "Nom",
      selector: (row) => row.name_secteur,
      sortable: true,
      wrap: true,
    },
    // {
    //   name: "Id Secteur",
    //   selector: (row) => row.id_secteur,
    // },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            className="btn-edit-secteur"
            onClick={() => handleEditSecteur(row)}
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

  function handleSecteurSearch(event) {
    const newSecteur = Secteurs.filter((row) => {
      return row.name_secteur
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });

    setSecteurSearch(newSecteur);
  }

  const handleEditSecteur = (Secteurs) => {
    setEditSecteur(Secteurs);
  };

  return (
    <div data-testid="secteur-main" className="main-secteur">
      <div>
        <div className="secteur-search-bar">
          <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input
              type="text"
              placeholder="Recherche..."
              onChange={handleSecteurSearch}
            />
          </div>
          <button
            className="button-add-secteur"
            onClick={() => {
              setAddSecteur(true);
            }}
          >
            <BiPlus />
          </button>
        </div>
        <hr className="secteur-search-hr" />
        <div>
          <DataTable
            className="data-table-container"
            columns={column}
            data={SecteurSearch}
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
      <div className="add-secteur-modal">
        {addSecteur && <AddSecteur setOpenModal={setAddSecteur} />}
        {editSecteur && (
          <EditSecteur
            setOpenModal={setEditSecteur}
            EditSecteur={editSecteur}
          />
        )}
      </div>
    </div>
  );
}

export default Secteur;
