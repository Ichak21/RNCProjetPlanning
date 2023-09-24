import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  fireEvent,
  screen,
  cleanup,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SupportPage from "../components/Support/SupportPage";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";

// mock pour le toatufy
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
  },
}));

afterEach(() => {
  cleanup();
});

describe("Support Page tests", () => {
  it("should render Support Page when we get in", () => {
    render(<SupportPage />);

    // Utiliser getByRole pour sélectionner le titre
    const titleElement = screen.getByRole("heading", { level: 1 });

    // Extraire le texte du titre (y compris le contenu du span)
    const titleText = titleElement.textContent;

    // Vérifier que le titre contient le texte attendu
    expect(titleText).toContain("Contactez-nous");

    // Vérifier que les champs de formulaire sont présents dans le DOM (comme précédemment)
    const nomInput = screen.getByPlaceholderText("Votre nom");
    const emailInput = screen.getByPlaceholderText("Votre adresse email");
    const sujetInput = screen.getByPlaceholderText("Sujet du message");
    const messageTextarea = screen.getByPlaceholderText("Votre message");
    const envoyerButton = screen.getByRole("button", { name: "Envoyer" });

    expect(nomInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(sujetInput).toBeInTheDocument();
    expect(messageTextarea).toBeInTheDocument();
    expect(envoyerButton).toBeInTheDocument();
  });

  it("Should retrieve all elements of Support Form", () => {
    render(<SupportPage />);

    // Sélectionner le bouton "Envoyer"
    const envoyerButton = screen.getByRole("button", { name: "Envoyer" });

    // Vérifiez que le bouton a les classes CSS spécifiques
    expect(envoyerButton).toHaveClass("support-button");

    // Vérifier que le message d'erreur requis s'affiche pour chaque champ requis
    const nomInput = screen.getByPlaceholderText("Votre nom");
    const emailInput = screen.getByPlaceholderText("Votre adresse email");
    const sujetInput = screen.getByPlaceholderText("Sujet du message");
    const messageTextarea = screen.getByPlaceholderText("Votre message");

    // Vérifier que les messages d'erreur requis s'affichent pour chaque champ requis
    expect(nomInput).toHaveAttribute("required");
    expect(emailInput).toHaveAttribute("required");
    expect(sujetInput).toHaveAttribute("required");
    expect(messageTextarea).toHaveAttribute("required");
  });
});
