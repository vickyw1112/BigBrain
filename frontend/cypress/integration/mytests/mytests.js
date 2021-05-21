context('happy path',()=>{
  it('happy path 1',()=>{
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

    cy.wait(1000);

    cy.get('[data-test-target=PlayGameButton]')
      .last()
      .focus()
      .click();

    // wait for fetching session id from backend
    cy.wait(1000);

    cy.get('[data-test-target=CopySessionIdButton]')
      .focus()
      .click();

    // wait for rounting to host game page
    cy.wait(500);
    cy.get('[data-test-target=HostGameStartButton]')
      .focus()
      .click()

    cy.wait(1000);
    cy.get('[data-test-target=NavBarMenuButton]')
      .focus()
      .click()

    cy.get('[data-test-target=NavBarLogoutButton]')
      .focus()
      .click()
    
    cy.wait(1000);
    
    cy.get('input[type=email]')
      .focus()
      .type(email)

    cy.get('input[type=password]')
      .focus()
      .type(password);

    cy.get('button[type=buton]')
      .focus()
      .click();
  });
});