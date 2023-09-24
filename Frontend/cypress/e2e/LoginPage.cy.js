describe("Login Page test", () => {
  it("Should submit and retrieve an error message then correct login auth", () => {
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
      "ney11"
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
      .type("jordynaiya@gmail.com");

    //On se connecte avec des identifiants correct et on verifie qu'on n'est connecté
    cy.get(".login-button").click();

    cy.get(".Toastify__toast-body > :nth-child(2)").contains(
      "Connexion réussie ! 🚀"
    );

    cy.get(".user-profile-name").contains("jordynaiya@gmail.com");
  });
});
