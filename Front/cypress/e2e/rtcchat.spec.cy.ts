// A few basic end-to-end tests.

describe('RTCChat', () => {
  before(function() {
    // Clearing the test database.
    const mutation = `
    mutation {
      clearTestDB
    }`
    cy.request({
      url: 'http://localhost:4000',
      method: 'POST',
      body: {
        query: mutation
      }
    })    
  })
  
  it('login screen opens', () => {
    cy.visit('localhost:3000/')
    cy.contains('Login')
  })
  
  describe('signing up and logging in', function() {    
    it('wrong credentials error is shown', function() {
      cy.get('#userName').type('Belphegor')
      cy.get('#pwd').type('Secret')
      cy.get('#login-btn').click()
      cy.get('.notification').should('have.class', 'error')
    })

    it('users can be created', function() {
      cy.contains('Create account').click()
      cy.get('#userName').type('Antti')
      cy.get('#pwd').type('Salasana')
      cy.get('#signup-btn').click()
      cy.wait(1000)
  
      cy.contains('Create account').click()
      cy.get('#userName').type('Pena')
      cy.get('#pwd').type('Salasana')
      cy.get('#signup-btn').click()
      cy.wait(1000)
    })

    it('user can log in and add a friend', () => {
      cy.contains('Login')
      cy.get('#userName').type('Antti')
      cy.get('#pwd').type('Salasana')
      cy.get('#login-btn').click()
      cy.wait(1000)
      cy.contains(`You don't have any contacts`)
  
      cy.get('#find').type('Pena')
      cy.contains('Add').click()
      cy.wait(1000)
    })

    describe('sending messages', function() {
      after('log out', function() {
        cy.get('.dropdown').click()
        cy.get('#logout').click()
      })

      it('message view opens without errors', function() {
        cy.contains('Pena').click()
        cy.get('.notification').should('not.exist')
        cy.contains('No messages.')    
      })

      it('a message can be sent', function() {
        cy.get('#message-text-input').type('Test message')
        cy.get('.button-send').click()
        cy.contains('Test message')
      })
    })

    describe('receiving messages', function() {
      it('another user can log in', function() {
        cy.contains('Login')
        const mutation = `
          mutation login($name: String!, $pwd: String!) {
            login(name: $name, pwd: $pwd) {
              token,
              user {
                name,
                user_id
                connections {
                  name
                  user_id
                  img
                  connection_id
                }
              }
            }
          }
        `
        cy.request({
          url: 'http://localhost:4000',
          method: 'POST',
          body: {
            query: mutation,
            variables: { name: 'Pena', pwd: 'Salasana' }
          }
        }).then(res => {
          const { body } = res
          localStorage.setItem('RTCChatUser', JSON.stringify({
            token: body.data.login.token,
            user: body.data.login.user
          }))
          cy.visit('localhost:3000/')
        })
      })

      it('user gets message alert and message', function() {
        cy.get('.alert').contains('!')
        cy.contains('Antti').click()
        cy.get('.message-bubble')
          .should('have.class', 'friend')
          .contains('Test message')
      })
    })
  })
})
