describe("On simule l'utlisation de l'appli par un TL", () => {
  const tlEmail = "jordynaiya@gmail.com";
  const tlPwd = "ney11";

  it("Should simulate a full use of the app by the TL from login to actions", () => {
    //=========================== PHASE DE CONNEXION  ===============================

    // On lance l'URL de la page login
    cy.visit("http://localhost:3000/login");

    // Verif qu'on est bien dans la login page avec ce paragraphe
    cy.get("p").contains(
      "Pour vous connecter à votre compte en tant que Team Leader, veuillez fournir votre adresse e-mail et votre mot de passe associé."
    );

    // On entre des infos erronées
    cy.get(".email-section > .MuiInputBase-root > .MuiInputBase-input").type(
      "jordynaiy@gmail.com"
    );

    cy.get(".password-section > .MuiInputBase-root > .MuiInputBase-input").type(
      tlPwd
    );

    cy.get(".login-button").click();

    //On verifie qu'on a bien le message d'erreur d'authentification (email ou mdp pas connu)
    cy.get(".Toastify__toast-body > :nth-child(2)").contains(
      "L'e-mail ou le mot de passe est incorrect !"
    );
    cy.wait(3000);

    //On saisie l'email correct
    cy.get(".email-section > .MuiInputBase-root > .MuiInputBase-input")
      .clear()
      .type(tlEmail);

    //On se connecte avec des identifiants correct et on verifie qu'on n'est connecté
    cy.get(".login-button").click();

    cy.get(".Toastify__toast-body > :nth-child(2)").contains(
      "Connexion réussie ! 🚀"
    );

    //=========================== PHASE DE VERIF PROFILE  ===============================

    cy.get(".user-profile-name").contains("jordynaiya@gmail.com").click();

    //On clique sur le profile deroulant
    cy.get('[href="/profile"]').click();

    //On verifie que nous sommes bien sur la page de Profile
    cy.get("h1").contains("Mon Compte");
    cy.get("h3").contains(`Bienvenue ${tlEmail}`);

    //=========================== PHASE ACTIONS SUR SECTION OPEATEUR  ===============================

    //On clique sur le lien Opérateur
    cy.get('a[href*="operateur"]').click();

    cy.wait(1000);

    cy.get(".sc-ivDvhZ").should("not.exist");
    //On vérufie que le tableau d'opérateurs est présents
    cy.get('div.rdt_TableBody[role="rowgroup"]').should(
      "have.length.greaterThan",
      0
    );

    cy.get('input[placeholder="Recherche..."]').type("ffff");

    cy.get(".sc-ivDvhZ").should("exist");

    cy.get('input[placeholder="Recherche..."]')
      .clear()
      .type("alexandre baudry");

    //On verifie que la personne est présente sur le tableau après recherche
    cy.get('div.rdt_TableBody[role="rowgroup"]')
      .find('div.rdt_TableRow[role="row"]')
      .should("have.length", 1);

    cy.get("#cell-1-undefined > div").contains("ALEXANDRE BAUDRY");

    //AJOUTER UN OPERATEUR
    cy.get("input").clear();

    //On click sur le bouton pour ajouter un Opérateur
    cy.get(".button-add-operator").click();

    //On ferme le modale d'ajout d'OP puis on reouvre l'ajout des OP
    cy.get(".sc-hhWzdI").click();
    cy.wait(1000);

    cy.get(".button-add-operator").click();

    //Tester fermeture modal avec bouton annuler
    cy.get("#cancelBtn").click();
    cy.wait(1000);

    //Reouvre le modal Ajout OP
    cy.get(".button-add-operator").click();

    //On verifie qu'on est dans le modal d'ajout des OP
    cy.get("h3").contains("Ajouter un opérateur");

    //On récupère les champs et on les remplis puis on valide

    cy.get('input[name="fullName"]').type("John Doe");
    cy.get('input[name="CardID"]').type("92EZ");

    //Station
    cy.get(":nth-child(1) > .MuiInputBase-root > .MuiSelect-root").click();
    cy.get('ul[role="listbox"]')
      .contains("Leader 5S") // Recherche le texte "15" dans la liste
      .click();

    //Shift
    cy.get(":nth-child(2) > .MuiInputBase-root > .MuiSelect-root").click();
    cy.get('ul[role="listbox"]')
      .contains("2") // Recherche le texte "15" dans la liste
      .click();

    //Dates picker entrée et fin
    cy.get(
      ":nth-child(1) > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root"
    ).click();
    cy.get(".MuiPickersCalendar-transitionContainer")
      .contains("button", "5")
      .click();

    cy.get("body").click(0, 0);

    cy.get(
      ":nth-child(2) > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root"
    ).click();
    cy.get(".MuiPickersCalendar-transitionContainer")
      .contains("button", "25")
      .click();

    cy.get("body").click(0, 0);

    //Radio selection
    cy.get(".MuiTypography-root.MuiFormControlLabel-label.MuiTypography-body1")
      .contains("Temp")
      .click();

    //On clique sur valider y a une erreur car tous les champs ne sont pas saisies
    cy.get('[type="submit"]').click(); //Valider

    cy.get(".Toastify__toast-body > :nth-child(2)").contains(
      "Erreur lors de l'ajout !"
    );

    cy.wait(3000);

    //On rajoute le champ manquant
    cy.get(".MuiTypography-root.MuiFormControlLabel-label.MuiTypography-body1")
      .contains("Actif")
      .click();

    cy.get('[type="submit"]').click(); //Valider

    //On vériifie qu'on a le message de success d'ajout
    cy.get(".Toastify__toast-body > :nth-child(2)").contains(
      "Erreur lors de l'ajout !"
    );
    cy.wait(3000);

    //On recherche le nouveau OP
    //cy.get("input").clear();
    cy.get('input[placeholder="Recherche..."]').clear().type("john doe");
    cy.wait(1000);

    //On verifie que la personne est présente sur le tableau après recherche
    cy.get('div.rdt_TableBody[role="rowgroup"]')
      .find('div.rdt_TableRow[role="row"]')
      .should("have.length", 1);

    cy.get("#cell-1-undefined > div").contains("John Doe");

    //On supprime john doe pour faciliter les prochains tests
    cy.request({
      method: "DELETE",
      url: "http://127.0.0.1:8000/setting/operateur/724",
    }).then((response) => {
      // Vous pouvez effectuer des assertions sur la réponse ici, si nécessaire
      expect(response.status).to.eq(200); // Vérifiez que le statut de la réponse est OK (200)
    });

    // Modifier une entrée COMING SOON

    //=============
  });

  //
});
