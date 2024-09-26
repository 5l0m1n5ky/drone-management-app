import { TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from "./login.service";
import { RouterTestingModule } from "@angular/router/testing";
import { ToastModule } from 'primeng/toast';
import { MessageService } from "primeng/api";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe('LoginComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        ToastModule,
        NoopAnimationsModule,
      ],
      providers: [
        LoginService,
        MessageService
      ]
    });
  });

  it('can mount', () => {

    cy.mount(LoginComponent)
    cy.get('#side-image').should('be.visible');
  });

  it('should render the login form correctly', () => {

    cy.mount(LoginComponent)
    cy.get('form').should('be.visible')
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should render the login form correctly on mobile device', () => {

    cy.mount(LoginComponent)
    cy.viewport('iphone-6');
    cy.get('form').should('be.visible');
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should display validation errors if form is not valid', () => {

    cy.mount(LoginComponent)
    cy.get('#email').focus();
    cy.get('form').click();
    cy.contains('Adres e-mail jest wymagany').should('be.visible');
    cy.get('#password').focus();
    cy.get('form').click();
    cy.contains('Hasło jest wymagane').should('be.visible');
  });

  it('should toggle password visibility', () => {

    cy.mount(LoginComponent)
    cy.get('#password').should('have.attr', 'type', 'password');
    cy.get('button[matSuffix]').click();
    cy.get('#password').should('have.attr', 'type', 'text');
  });

  it('should enable submit button when form is valid', () => {

    cy.mount(LoginComponent)
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('Password123');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should submit the form with valid credentials', () => {

    cy.mount(LoginComponent)
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('Password123');
    cy.get('button[type="submit"]').click();
    cy.get('app-loading-spinner').should('exist');
  });
});

