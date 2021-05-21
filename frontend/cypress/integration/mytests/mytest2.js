context('happy path2',()=>{
    it('happy path 2',()=>{
      cy.visit('localhost:3000/login');
      // Before running this test, should make sure that the login info has been resgistered (in backend)
      const email = 'comp6080@email.com';
      const password = 'comp6080';
      const newGameName = 'dummyGame';
      cy.get('input[type=email]')
      .focus()
      .type(email)
  
      cy.get('input[type=password]')
        .focus()
        .type(password);
  
      cy.get('button[type=buton]')
        .focus()
        .click();
  
      cy.get('button')
        .last()
        .focus()
        .click();
      
      cy.get("input[type=text]")
        .focus()
        .type(newGameName);
  
      cy.get('[data-test-target=ConfirmNewGameNameButton]')
        .focus()
        .click();

      cy.wait(500);
       
      cy.get('[data-test-target=GameCardMenuEditGame]')
        .first()
        .click({force: true});

      cy.get('[data-test-target=EditGameNameField]')
        .first()
        .clear()
        .type('NewDummyGameName')

        cy.get('[data-test-target=SubmitNewGameNameButton]')
        .first()
        .click()

        cy.wait(500);

        cy.get('[data-test-target=GameCardMenuEditGameQuestion]')
        .first()
        .click({force: true});

        cy.get('[data-test-target=AddGameQuestionButton]')
        .first()
        .click({force: true});

        cy.wait(1000);

        cy.get('[data-test-target=ExitNewQuestionEditPage]')
        .first()
        .click({force: true});

        cy.wait(1000);
        cy.get('[data-test-target=NavBarMenuButton]')
          .focus()
          .click()

        cy.wait(500);
        cy.get('[data-test-target=NavBarLogoutButton]')
          .focus()
          .click()
    });
});