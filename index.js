import express from "express";

const app = express();
const host = "0.0.0.0";
const porta = 3000;


app.use(express.urlencoded({ extended: true }));


let fornecedores = [];

//menu
function gerarMenu() {
  return `
  <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4 border-bottom">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">Menu</a>
      <ul class="navbar-nav">
        <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="cadastros" role="button" data-bs-toggle="dropdown">Cadastros</a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="/cadastroFornecedor">Fornecedor</a></li>
          </ul>
        </li>
        <li class="nav-item"><a class="nav-link" href="/login">Login</a></li>
        <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>
      </ul>
    </div>
  </nav>
  `;
}

//home
app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="pt-br">
  <head>
    <meta charset="UTF-8">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <title>Home</title>
  </head>
  <body class="bg-light">
    ${gerarMenu()}
    <div class="container text-center">
      <h1 class="mt-5">Bem-vindo ao Sistema!</h1>
      <p class="text-muted">Utilize o menu para acessar as funcionalidades do site.</p>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
  </body>
  </html>
  `);
});

//cadastro
app.get("/cadastroFornecedor", (req, res) => {
  res.send(gerarFormulario());
});


app.post("/cadastroFornecedor", (req, res) => {
  const { cnpj, razao, fantasia, endereco, cidade, uf, cep, email, telefone } = req.body;
  const erros = {};

  if (!cnpj) erros.cnpj = "Informe o CNPJ";
  if (!razao) erros.razao = "Informe a Razão Social";
  if (!fantasia) erros.fantasia = "Informe o Nome Fantasia";
  if (!endereco) erros.endereco = "Informe o Endereço";
  if (!cidade) erros.cidade = "Informe a Cidade";
  if (!uf) erros.uf = "Informe a UF";
  if (!cep) erros.cep = "Informe o CEP";
  if (!email) erros.email = "Informe o E-mail";
  if (!telefone) erros.telefone = "Informe o Telefone";

  if (Object.keys(erros).length > 0) {
    res.send(gerarFormulario(req.body, erros));
  } else {
    fornecedores.push({ cnpj, razao, fantasia, endereco, cidade, uf, cep, email, telefone });
    res.send(gerarFormulario({}, {}, fornecedores, "Fornecedor cadastrado com sucesso!"));
  }
});

//login
app.get("/login", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="pt-br">
  <head>
    <meta charset="UTF-8">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <title>Login</title>
  </head>
  <body class="bg-light">
    ${gerarMenu()}
    <div class="container col-md-4 mt-5">
      <h3 class="text-center">Login</h3>
      <form method="POST" action="/login" class="border p-4 bg-white rounded">
        <div class="mb-3">
          <label class="form-label">Usuário</label>
          <input type="text" name="usuario" class="form-control">
        </div>
        <div class="mb-3">
          <label class="form-label">Senha</label>
          <input type="password" name="senha" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary">Entrar</button>
      </form>
    </div>
  </body>
  </html>
  `);
});

//valida login
app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;
  if (usuario === "admin" && senha === "1234") {
    res.send(`
      ${gerarMenu()}
      <div class="container text-center mt-5">
        <h3>Login realizado com sucesso!</h3>
        <a href="/" class="btn btn-success mt-3">Voltar ao menu</a>
      </div>
    `);
  } else {
    res.send(`
      ${gerarMenu()}
      <div class="container text-center mt-5">
        <h3 class="text-danger">Usuário ou senha inválidos!</h3>
        <a href="/login" class="btn btn-secondary mt-3">Tentar novamente</a>
      </div>
    `);
  }
});

//logout
app.get("/logout", (req, res) => {
  res.send(`
    ${gerarMenu()}
    <div class="container text-center mt-5">
      <h3>Logout efetuado com sucesso!</h3>
      <a href="/" class="btn btn-primary mt-3">Voltar à Home</a>
    </div>
  `);
});

//validacao
function gerarFormulario(valores = {}, erros = {}, lista = fornecedores, mensagem = "") {
  const getVal = (campo) => valores[campo] || "";
  const getErr = (campo) => erros[campo] ? `<div class="text-danger">${erros[campo]}</div>` : "";

  let tabela = "";
  if (lista.length > 0) {
    tabela = `
      <h4 class="mt-5">Fornecedores cadastrados</h4>
      <table class="table table-striped mt-2">
        <thead>
          <tr><th>CNPJ</th><th>Razão Social</th><th>Fantasia</th><th>Cidade</th><th>UF</th></tr>
        </thead>
        <tbody>
          ${lista.map(f => `
            <tr>
              <td>${f.cnpj}</td>
              <td>${f.razao}</td>
              <td>${f.fantasia}</td>
              <td>${f.cidade}</td>
              <td>${f.uf}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    `;
  }

  return `
  <!DOCTYPE html>
  <html lang="pt-br">
  <head>
    <meta charset="UTF-8">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <title>Cadastro de Fornecedor</title>
  </head>
  <body class="bg-light">
    ${gerarMenu()}
    <div class="container">
      <h2>Cadastro de Fornecedor</h2>
      ${mensagem ? `<div class="alert alert-success">${mensagem}</div>` : ""}
      <form method="POST" action="/cadastroFornecedor" class="bg-white p-4 border rounded">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">CNPJ</label>
            <input type="text" name="cnpj" class="form-control" value="${getVal("cnpj")}">
            ${getErr("cnpj")}
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Razão Social</label>
            <input type="text" name="razao" class="form-control" value="${getVal("razao")}">
            ${getErr("razao")}
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Nome Fantasia</label>
            <input type="text" name="fantasia" class="form-control" value="${getVal("fantasia")}">
            ${getErr("fantasia")}
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Endereço</label>
            <input type="text" name="endereco" class="form-control" value="${getVal("endereco")}">
            ${getErr("endereco")}
          </div>
          <div class="col-md-4 mb-3">
            <label class="form-label">Cidade</label>
            <input type="text" name="cidade" class="form-control" value="${getVal("cidade")}">
            ${getErr("cidade")}
          </div>
          <div class="col-md-2 mb-3">
            <label class="form-label">UF</label>
            <input type="text" name="uf" maxlength="2" class="form-control" value="${getVal("uf")}">
            ${getErr("uf")}
          </div>
          <div class="col-md-3 mb-3">
            <label class="form-label">CEP</label>
            <input type="text" name="cep" class="form-control" value="${getVal("cep")}">
            ${getErr("cep")}
          </div>
          <div class="col-md-4 mb-3">
            <label class="form-label">E-mail</label>
            <input type="email" name="email" class="form-control" value="${getVal("email")}">
            ${getErr("email")}
          </div>
          <div class="col-md-3 mb-3">
            <label class="form-label">Telefone</label>
            <input type="text" name="telefone" class="form-control" value="${getVal("telefone")}">
            ${getErr("telefone")}
          </div>
        </div>
        <button type="submit" class="btn btn-success">Cadastrar</button>
        <a href="/" class="btn btn-secondary">Voltar</a>
      </form>
      ${tabela}
    </div>
  </body>
  </html>
  `;
}


app.listen(porta, host, () => {
  console.log(`Servidor rodando em http://${host}:${porta}`);
});
