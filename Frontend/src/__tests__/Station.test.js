import React from "react";
import {
  render,
  cleanup,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import Station from "../components/Station/Station";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";

import axios from "axios";

const dummyStations = [
  {
    name_station: "Secouriste",
    capa_max: 100,
    id_secteur: 6,
    id_station: 52,
  },
  {
    name_station: "Pompiers",
    capa_max: 100,
    id_secteur: 6,
    id_station: 53,
  },
  {
    name_station: "Habilitation elec",
    capa_max: 100,
    id_secteur: 6,
    id_station: 54,
  },
  {
    name_station: "Habillitation ATEX",
    capa_max: 100,
    id_secteur: 6,
    id_station: 55,
  },
];

jest.mock("axios");

afterEach(() => {
  cleanup();
});

describe("Unit Test for Station Component", () => {
  it("Should render Station component", () => {
    axios.get.mockResolvedValue({ data: [] });
    render(<Station />);

    // Recherche l'élément par sa classe
    const mainStationElement = screen.getByTestId("station-main");

    // Vérifie que l'élément avec la classe main-Station est présent dans le DOM
    expect(mainStationElement).toBeInTheDocument();
  });

  it("Should render Station component and all elements", () => {
    axios.get.mockResolvedValue({ data: [] });
    render(<Station />);

    // Vérifie que l'élément avec la classe main-Station est présent dans le DOM
    const mainStationElement = screen.getByTestId("station-main");
    expect(mainStationElement).toBeInTheDocument();

    // Vérifie que l'élément avec la classe Station-search-bar est présent dans le DOM
    const StationSearch = document.querySelector(".station-search-bar");
    expect(StationSearch).toBeInTheDocument();

    // Vérifie que l'élément avec la classe button-add-Station est présent dans le DOM
    const addStation = document.querySelector(".button-add-station");
    expect(addStation).toBeInTheDocument();

    // Vérifie que l'élément avec la classe data-table-container est présent dans le DOM
    const StationTable = document.querySelector(".data-table-container");
    expect(StationTable).toBeInTheDocument();
  });

  it("Should render 5 Stations from mocked API", async () => {
    axios.get.mockResolvedValue({ data: dummyStations });
    await act(async () => {
      render(<Station />);
    });

    console.log(dummyStations);

    // Vérifie que l'élément avec la classe data-table-container est présent dans le DOM
    const Stations = await waitFor(() =>
      document.querySelectorAll("#cell-1-undefined")
    );
    expect(Stations).toHaveLength(4);
  });
});
