describe("On simule une entièrement saisie manuelle de planning ", () => {
  // Connection to Postes Saisie
  beforeEach(() => {
    // On lance l'URL de la page saisie
    cy.visit("http://localhost:3000/login");

    cy.get("p").contains(
      "Pour vous connecter à votre compte en tant que Team Leader, veuillez fournir votre adresse e-mail et votre mot de passe associé."
    );

    cy.get(".email-section > .MuiInputBase-root > .MuiInputBase-input").type(
      "jordynaiya@gmail.com"
    );
    cy.get(".password-section > .MuiInputBase-root > .MuiInputBase-input").type(
      "ney11"
    );
    cy.get(".login-button").click();

    cy.wait(1500);

    cy.visit("http://localhost:3000/saisie");
  });

  it("Should totally test entering of planning fields", () => {
    //On clique sur le lien Secteur
    cy.get('a[href*="saisie"]').click();

    //AMAURY LACOMBE --> OP Selectionné
    cy.get("#row-1 > .sc-gKHVLF > input").click();

    //CHoix de l'équipe (shift)
    cy.get(".MuiFormGroup-root").contains("Mat").click();

    //Click sur continuer
    cy.get(".MuiButton-label").click();

    //Vérification du tableau de planning vide (pas présent)
    cy.get(".sc-ivDvhZ").contains("Aucune information trouvée");

    //Clique sur le bouton pour ajouter un planning
    cy.get(".button-add-planning").click();

    //Choix OP
    cy.get(":nth-child(1) > .MuiInputBase-root > .MuiSelect-root").click();
    cy.get(".MuiList-root").contains("AMAURY LACOMBE").click();

    //Choix Station
    cy.get(":nth-child(2) > .MuiInputBase-root > .MuiSelect-root").click();
    cy.get(".MuiList-root").contains("9").click();

    //Choix Type de semaine (actu ou prochaine)
    cy.get(":nth-child(3) > .MuiInputBase-root > .MuiSelect-root").click();
    cy.get(".MuiList-root").contains("Semaine Actuelle").click();

    //Choix du jour de travail
    cy.get('[style="display: flex; justify-content: center;"]')
      .contains("Lundi")
      .click();

    //Valider le planning
    cy.get(".footer > :nth-child(2)").click();

    //On recommence la même action pour tester qu'on ne peut pas ajouter 2 fois la même personne à la même date
    //Clique sur le bouton pour ajouter un planning
    cy.get(".button-add-planning").click();

    //Choix OP
    cy.get(":nth-child(1) > .MuiInputBase-root > .MuiSelect-root").click();
    cy.get(".MuiList-root").contains("AMAURY LACOMBE").click();

    //Choix Station
    cy.get(":nth-child(2) > .MuiInputBase-root > .MuiSelect-root").click();
    cy.get(".MuiList-root").contains("9").click();

    //Choix Type de semaine (actu ou prochaine)
    cy.get(":nth-child(3) > .MuiInputBase-root > .MuiSelect-root").click();
    cy.get(".MuiList-root").contains("Semaine Actuelle").click();

    //Choix du jour de travail
    cy.get('[style="display: flex; justify-content: center;"]')
      .contains("Lundi")
      .click();

    //Valider le planning
    cy.get(".footer > :nth-child(2)").click();

    //On vérifie qu'on a un alert message
    cy.on("window:confirm", (str) => {
      expect(str).to.equal(
        "L'opérateur  AMAURY LACOMBE est déjà dans un poste le Lundi [11-09-2023]. Doublon non autorisé."
      );
    });

    //On décoche Lundi et on choisi Mardi
    cy.get('[style="display: flex; justify-content: center;"]')
      .contains("Lundi")
      .click();

    cy.get('[style="display: flex; justify-content: center;"]')
      .contains("Mardi")
      .click();

    cy.get(".footer > :nth-child(2)").click();

    //================= PHASE 2 ===================================

    //Vérif de la validation du planning générer

    cy.get(".MuiButton-containedPrimary > .MuiButton-label").click();
  });
});
