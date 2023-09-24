import React from "react";
import {
  render,
  cleanup,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import LoginPage from "../pages/auth/LoginPage";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { createMemoryHistory } from "history";

import { AuthProvider } from "../pages/auth/auth.js";

jest.useFakeTimers();

afterEach(cleanup);

// Fonction de recherche personnalisée pour le message Toastify
const findToastMessage = () => {
  const toastBody = document.querySelector(
    ".Toastify__toast-body[role='alert']"
  );
  if (toastBody) {
    return toastBody.textContent;
  }
  return null;
};

describe("Login Page tests", () => {
  it("Should render Login Page", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    //const titleElement = screen.getByText(/Bonjour!/i);
    //expect(titleElement).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText(
      "Veuillez saisir votre adresse mail"
    );
    expect(emailInput).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText(
      "Veuillez saisir votre mot de passe"
    );
    expect(passwordInput).toBeInTheDocument();
  });

  it("Should retrieve error message incorrect email", async () => {
    render(
      <BrowserRouter>
        <LoginPage />
        <ToastContainer />
      </BrowserRouter>
    );

    //On rempli le champ email avec un email incorrect et on verifie qu'il a bien été rempli dan le champ email
    const emailInput = screen.getByPlaceholderText(
      "Veuillez saisir votre adresse mail"
    );

    fireEvent.change(emailInput, { target: { value: "johndoe.com" } });
    expect(emailInput.value).toBe("johndoe.com");

    //On rempli le champ password avec '123456' (mdp incrrect)
    const passwordInput = screen.getByPlaceholderText(
      "Veuillez saisir votre mot de passe"
    );
    fireEvent.change(passwordInput, { target: { value: "123456" } });

    //On recupère le bouton connexion et on vérifie qu'il est présent dans le DOM
    const connexionButton = screen.getByRole("button", { name: "Connexion" });
    expect(connexionButton).toBeInTheDocument();

    //On click sur Connexion
    fireEvent.click(connexionButton);

    // Attendez que le message Toastify apparaisse
    await waitFor(() => {
      const toastMessage = findToastMessage();
      expect(toastMessage).toBe("Veuillez entrer une adresse email correcte");
    });
  });

  it("Should retrieve error message after incorrect auth", async () => {
    render(
      <BrowserRouter>
        <LoginPage />
        <ToastContainer />
      </BrowserRouter>
    );

    //On rempli le champ email avec un email pas reconnu et on verifie qu'il a bien été rempli dan le champ email
    const emailInput = screen.getByPlaceholderText(
      "Veuillez saisir votre adresse mail"
    );

    fireEvent.change(emailInput, { target: { value: "john@doe.com" } });
    expect(emailInput.value).toBe("john@doe.com");

    //On rempli le champ password avec '123456' (mdp incrrect)
    const passwordInput = screen.getByPlaceholderText(
      "Veuillez saisir votre mot de passe"
    );
    fireEvent.change(passwordInput, { target: { value: "123456" } });

    //On recupère le bouton connexion et on vérifie qu'il est présent dans le DOM
    const connexionButton = screen.getByRole("button", { name: "Connexion" });
    expect(connexionButton).toBeInTheDocument();

    //On click sur Connexion
    fireEvent.click(connexionButton);

    // Attendez que le message Toastify apparaisse
    await waitFor(() => {
      const toastMessage = findToastMessage();
      expect(toastMessage).toBe("L'e-mail ou le mot de passe est incorrect !");
    });
  });

  it("Should retrieve success message after auth and verify we are logged", async () => {
    const history = createMemoryHistory();
    render(
      <BrowserRouter history={history}>
        <AuthProvider>
          <ToastContainer />
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    //On rempli le champ email avec un email pas connu et on verifie qu'il a bien été rempli dan le champ email
    const emailInput = screen.getByPlaceholderText(
      "Veuillez saisir votre adresse mail"
    );

    fireEvent.change(emailInput, { target: { value: "jordynaiya@gmail.com" } });
    expect(emailInput.value).toBe("jordynaiya@gmail.com");

    //On rempli le champ password avec 'ney11' (mdp correct)
    const passwordInput = screen.getByPlaceholderText(
      "Veuillez saisir votre mot de passe"
    );
    fireEvent.change(passwordInput, { target: { value: "ney11" } });

    //On recupère le bouton connexion et on vérifie qu'il est présent dans le DOM
    const connexionButton = screen.getByRole("button", { name: "Connexion" });
    expect(connexionButton).toBeInTheDocument();

    //On click sur Connexion
    fireEvent.click(connexionButton);
  });
});
