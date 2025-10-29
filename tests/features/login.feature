# language: pt
Funcionalidade: Autenticação de Usuário no Coffeemon

  @Login
  Cenário: Login com credenciais válidas
    Dado que estou na tela de login do Coffeemon
    Quando eu insiro o email "usuario_teste@exemplo.com"
    E eu insiro a senha "senha123"
    E eu toco no botão de login
    Então eu devo ser redirecionado para a tela de E-commerce
