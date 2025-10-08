LOGIN DE USUARIOS
 
Funcionalidade: Login
    Eu como usuário quero acessar o site com minha conta

Cenário: usuário precisa logar no site
Dado que estou na tela de login
Quando preencho o campo nome com "gigio"
E preencho a senha com "123"
E clico no botão "Fazer Login"
Então a tela homepage deve ser mostrada.

Código:

@app.router("/login", methods = ["POST"])
def login(user, password):
    try:
        if user == gigio and password == 123:
            print("Bem vindo ao Login")
            return RedirectResponse(url = "localhost:3000/home", status_code = 300)
        else
            print("Usuário ou senha incorretos")
            return 401
    except:
        
    
@app.router("/home", methods = ["GET"])    
def home()
    return "Hello word"

Funcionalidade: Recuperar senha
    Eu como usuário perdi minha senha e quero recuperar

Cenário: usuário precisa recuperar a senha
Dado que estou na tela de login
Quando clico no botão "Recuperar senha"
E preencho o campo "e-mail" com "gigio@email.com"
E clico em recuperar
Então um email de recuperação é enviado
Quando eu recebo o email de recuperação
E coloco o codigo no campo "cod_recuperacao"
Então a tela de redefinição deve exibir
Quando preencho o campo "definir nova senha" com "321"
E clico em enviar
Então a senha seve ser Redefinida

/controller
@app.router("/login/recuperar", methods = ["POST"])
def recover(email):
    return 

@app.router("/login/redefinir", methods = ["POST"])
def redefine(password):
    
/service
def send_email(receiver):
    receiver = "gigio@email.com"
    msg = "Código para redefinição de senha"
    code = "3728"
    try:
        
    except:








