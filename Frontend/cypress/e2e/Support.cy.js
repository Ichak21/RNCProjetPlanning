describe("Support form submission test", () => {
  // Connection to Support Page
  beforeEach(() => {
    // On lance l'URL de la page Support
    cy.visit("http://localhost:3000/login");

    // On vérifie si nous avons accès aux pages privées (il faut être authentifié)

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
    cy.visit("http://localhost:3000/support");
  });

  it("Should submit and retrieve an error message name not correct", () => {
    //On rempli le champ nom du formulaire de contact avec un nom erroné
    cy.get('.support-name-email-container > [type="text"]').type("hb5");

    //IDEM pour Email
    cy.get('[type="email"]').type("john@doe.com");

    //IDEM pour le sujet (objet du message)
    cy.get(".support-subject-container > .support-input").type("Test E2E");

    //IDEM pour le contenu du message
    cy.get(".support-textarea").type("test fonctionnel de l'appli");

    //On clicque sur le bouton d'envoi du formulaire
    cy.get(".support-button").click();

    //On vérifie qu'on a bien notre message Toast d'erreur
    cy.get(".Toastify__toast-body > :nth-child(2)").contains(
      "Veuillez saisir correctement tous les champs"
    );
    cy.wait(2000);
  });

  it("Should submit a support message and retrrieve a success alart", () => {
    //On rempli le champ nom du formulaire de contact
    cy.get('.support-name-email-container > [type="text"]').type("John doe");

    //IDEM pour Email
    cy.get('[type="email"]').type("john@doe.com");

    //IDEM pour le sujet (objet du message)
    cy.get(".support-subject-container > .support-input").type("Test E2E");

    //IDEM pour le contenu du message
    cy.get(".support-textarea").type("test fonctionnel de l'appli");

    //On clicque sur le bouton d'envoi du formulaire
    cy.get(".support-button").click();

    //On vérifie qu'on a bien notre message Toast d'erreur
    cy.get(".Toastify__toast-body > :nth-child(2)").contains(
      "Votre message a été envoyé ! 🚀"
    );
  });
});
