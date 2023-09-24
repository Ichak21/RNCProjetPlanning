import React from "react";
import {
  render,
  cleanup,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import Secteur from "../components/Secteur/Secteur";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";

import axios from "axios";

const dummySecteurs = [
  {
    name_secteur: "SECTEUR 1",
    id_secteur: 1,
  },
  {
    name_secteur: "SECTEUR 2",
    id_secteur: 2,
  },
  {
    name_secteur: "ADAPTATION",
    id_secteur: 3,
  },
  {
    name_secteur: "KITS",
    id_secteur: 4,
  },
  {
    name_secteur: "MAGASIN",
    id_secteur: 5,
  },
];

jest.mock("axios");

afterEach(() => {
  cleanup();
});

describe("Unit Test for Secteur Component", () => {
  it("Should render Secteur component", () => {
    axios.get.mockResolvedValue({ data: [] });
    render(<Secteur />);

    // Recherche l'élément par sa classe
    const mainSecteurElement = screen.getByTestId("secteur-main");

    // Vérifie que l'élément avec la classe main-secteur est présent dans le DOM
    expect(mainSecteurElement).toBeInTheDocument();
  });

  it("Should render Secteur component and all elements", () => {
    axios.get.mockResolvedValue({ data: [] });
    render(<Secteur />);

    // Vérifie que l'élément avec la classe main-secteur est présent dans le DOM
    const mainSecteurElement = screen.getByTestId("secteur-main");
    expect(mainSecteurElement).toBeInTheDocument();

    // Vérifie que l'élément avec la classe secteur-search-bar est présent dans le DOM
    const secteurSearch = document.querySelector(".secteur-search-bar");
    expect(secteurSearch).toBeInTheDocument();

    // Vérifie que l'élément avec la classe button-add-secteur est présent dans le DOM
    const addSecteur = document.querySelector(".button-add-secteur");
    expect(addSecteur).toBeInTheDocument();

    // Vérifie que l'élément avec la classe data-table-container est présent dans le DOM
    const secteurTable = document.querySelector(".data-table-container");
    expect(secteurTable).toBeInTheDocument();
  });

  it("Should render 5 Secteurs from mocked API", async () => {
    axios.get.mockResolvedValue({ data: dummySecteurs });
    await act(async () => {
      render(<Secteur />);
    });

    console.log(dummySecteurs);

    // Vérifie que l'élément avec la classe data-table-container est présent dans le DOM
    const secteurs = await waitFor(() =>
      document.querySelectorAll("#cell-1-undefined")
    );
    expect(secteurs).toHaveLength(5);
  });
});
