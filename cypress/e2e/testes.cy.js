/*Instruções:
instalar o Node.js
criar uma pasta para o teste
abrir a pasta no VSCode
no terminal, digitar os seguintes comandos:
npm init
npm install cypress
npx cypress open*/

//CADASTRO DE USUÁRIO

describe('Cadastro de Usuário', () => {
    it('deve cadastrar um novo usuário com sucesso', () => {
      // Acessar a página de login
      cy.visit('https://magento.nublue.co.uk/', {
      failOnStatusCode: false, 
    });
      cy.wait(4000);
  
      // Clicar no link "Criar Conta"
      cy.get('.account-create > a').click();
  
      // Preencher o formulário de cadastro
      cy.get('#firstname').type('Nome');
      cy.get('#lastname').type('Sobrenome');
      cy.get('#email').type('email@example.com');
      cy.get('#password').type('Senha123');
      cy.get('#confirmation').type('Senha123');
  
      // Aceitar termos e condições
      cy.get('#is_subscribed').click();
  
      // Clicar no botão "Criar Conta"
      cy.get('button[title="Create an Account"]').click();
  
      // Validar mensagem de sucesso
      cy.get('.success-msg').should('contain', 'Thank you for registering with Magento.');
    });
  });

//LOGIN

describe('Login de Usuário', () => {
  it('deve logar com sucesso usando email e senha válidos', () => {
    cy.visit('https://magento.nublue.co.uk/');

    // Clicar no link "Entrar"
    cy.get('.account-login > a').click();

    // Preencher o formulário de login
    cy.get('#email').type('usuario@example.com');
    cy.get('#pass').type('Senha123');

    // Clicar no botão "Entrar"
    cy.get('button[title="Login"]').click();

    // Validar se o usuário está logado
    cy.get('.header .account-cart-wrapper').should('be.visible');
  });

  it('deve exibir mensagem de erro para email inválido', () => {
    cy.visit('https://magento.nublue.co.uk/customer/account/login/');

    // Preencher o formulário com email inválido
    cy.get('#email').type('emailinvalido');
    cy.get('#pass').type('Senha123');

    // Clicar no botão "Entrar"
    cy.get('button[title="Login"]').click();

    // Validar mensagem de erro
    cy.get('.error-msg').should('contain', 'Invalid login or password.');
  });

  it('deve exibir mensagem de erro para senha inválida', () => {
    cy.visit('https://magento.nublue.co.uk/customer/account/login/');

    // Preencher o formulário com senha inválida
    cy.get('#email').type('usuario@example.com');
    cy.get('#pass').type('SenhaInvalida');

    // Clicar no botão "Entrar"
    cy.get('button[title="Login"]').click();

    // Validar mensagem de erro
    cy.get('.error-msg').should('contain', 'Invalid login or password.');
  });
});

//ESQUECER SENHA

describe('Esquecer Senha', () => {
  it('deve enviar um email de recuperação de senha com sucesso', () => {
    // Acessar a página de login
    cy.visit('https://magento.nublue.co.uk/customer/account/login/');

    // Clicar no link "Esqueceu sua senha?"
    cy.get('.forgot-password-link > a').click();

    // Preencher o email do usuário
    cy.get('#email').type('email@example.com');

    // Clicar no botão "Solicitar Nova Senha"
    cy.get('button[title="Retrieve Password"]').click();

    // Validar mensagem de sucesso
    cy.get('.success-msg').should('contain', 'A password reset link has been sent to your email address.')

  });
});


//ADICIONAR AO CARRINHO

describe('Adicionar Produto ao Carrinho', () => {
  it('deve adicionar o produto "Stellar Solar Jacket" azul tamanho P ao carrinho', () => {
    // Acessar a página do produto
    cy.visit('https://magento.nublue.co.uk/stellar-solar-jacket.html');

    // Selecionar a cor azul
    cy.get('#swatch-29').click();

    // Selecionar o tamanho P
    cy.get('#swatch-83').click();

    // Clicar no botão "Adicionar ao Carrinho"
    cy.get('button[title="Add to Cart"]').click();

    // Validar mensagem de sucesso
    cy.get('.success-msg').should('contain', 'The product has been added to cart.');

    // Acessar o carrinho
    cy.get('.action.showcart').click();

    // Validar o produto no carrinho
    cy.get('.product-name').should('contain', 'Stellar Solar Jacket');
    cy.get('.cart-item-price').should('contain', '£75.00');
  });
});

//FINALIZAR COMPRA

describe('Finalizar Compra', () => {
  it('deve finalizar a compra com sucesso', () => {
    // Acessar o carrinho
    cy.visit('https://magento.nublue.co.uk/checkout/cart/');

    // Clicar no botão "Continuar para Checkout"
    cy.get('button[title="Proceed to Checkout"]').click();

    // Preencher o formulário de checkout
    cy.get('#billing:first-child').within(() => {
      cy.get('#firstname').type('Nome');
      cy.get('#lastname').type('Sobrenome');
      cy.get('#street_1').type('Endereço');
      cy.get('#city').type('Cidade');
      cy.get('#region_id').select('12'); // Selecione a região
      cy.get('#postcode').type('CEP');
      cy.get('#telephone').type('Telefone');
    });

    // Selecionar método de envio
    cy.get('#shipping-method-freeshipping_freeshipping').click();

    // Clicar no botão "Continuar para Revisão"
    cy.get('button[title="Continue"]').click();

    // Revisar o pedido
    cy.get('.order-summary').should('contain', 'Stellar Solar Jacket');
    cy.get('.order-summary').should('contain', '£75.00');

    // Confirmar o pedido
    cy.get('button[title="Place Order"]').click();

    // Validar mensagem de sucesso
    cy.get('.success-msg').should('contain', 'Thank you for your purchase!');
  });
});
