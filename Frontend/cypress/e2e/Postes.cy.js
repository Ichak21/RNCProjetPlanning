describe("Test Postes : Station & Secteurs", () => {
  // Connection to Postes Page
  beforeEach(() => {
    // On lance l'URL de la page Poste
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
  });
  it("Should test Secteur section", () => {
    //On clique sur le lien Secteur
    cy.get('a[href*="secteur"]').click();

    cy.wait(3000);

    cy.get(".sc-ivDvhZ").should("not.exist");
    //On vérifie que le tableau de secteur est présents
    cy.get('div.rdt_TableBody[role="rowgroup"]').should(
      "have.length.greaterThan",
      0
    );

    cy.get('input[placeholder="Recherche..."]').type("ffff");

    cy.get(".sc-ivDvhZ").should("exist");

    cy.wait(2000);

    cy.get('input[placeholder="Recherche..."]').clear().type("Secteur 1");

    //On verifie que le secteur est présent sur le tableau après recherche
    cy.get('div.rdt_TableBody[role="rowgroup"]')
      .find('div.rdt_TableRow[role="row"]')
      .should("have.length", 1);

    cy.get("#cell-1-undefined > div").contains("SECTEUR 1");
    cy.wait(1500);
    cy.get("input").clear();
  });

  it("Should test Secteur Station", () => {
    //On clique sur le lien station
    cy.get('a[href*="station"]').click();

    cy.wait(3000);

    cy.get(".sc-ivDvhZ").should("not.exist");
    //On vérufie que le tableau de station est présents
    cy.get('div.rdt_TableBody[role="rowgroup"]').should(
      "have.length.greaterThan",
      0
    );

    cy.get('input[placeholder="Recherche..."]').type("azerty");

    cy.get(".sc-ivDvhZ").should("exist");

    cy.wait(2000);

    cy.get('input[placeholder="Recherche..."]').clear().type("leader 5S");

    //On verifie que la station est présente sur le tableau après recherche
    cy.get('div.rdt_TableBody[role="rowgroup"]')
      .find('div.rdt_TableRow[role="row"]')
      .should("have.length", 1);

    cy.get("#cell-1-undefined > div").contains("Leader 5S");
    cy.wait(1500);
    cy.get("input").clear();
  });
});
