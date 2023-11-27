const express = require("express");
const {
  cadastrarUsuario,
  login,
  detalharUsuario,
  atualizarUsuario,
  listarCategorias,
} = require("./controladores/usuarios");
const verificaValores = require("./intermediarios/verificaValores");
const verificarUsuarioLogado = require("./intermediarios/autorizacao");
const verificarEmail = require("./intermediarios/verificarEmail");
const {
  cadastrarTransacao,
  listarTransacoesUsuario,
  detalharTransacao,
  atualizarTransacao,
  deletarTransacao,
  extratoTransacao,
} = require("./controladores/transacoes");
const schemaUsuario = require("./schemas/shemaUsuario");
const schemaLogin = require("./schemas/schemaLogin");
const schemaTransacao = require("./schemas/schemaTransacao");
const buscarRegistro = require("./intermediarios/buscarTransacao");

const rotas = express();

rotas.post(
  "/usuario",
  verificaValores(schemaUsuario),
  verificarEmail,
  cadastrarUsuario
);

rotas.post("/login", verificaValores(schemaLogin), login);

rotas.use(verificarUsuarioLogado);

rotas.get("/usuario", detalharUsuario);
rotas.get("/categoria", listarCategorias);
rotas.put(
  "/usuario",
  verificaValores(schemaUsuario),
  verificarEmail,
  atualizarUsuario
);

rotas.get("/transacao", listarTransacoesUsuario);
rotas.post("/transacao", verificaValores(schemaTransacao), cadastrarTransacao);
rotas.get("/transacao/extrato", extratoTransacao);
rotas.get("/transacao/:id", buscarRegistro, detalharTransacao);
rotas.put(
  "/transacao/:id",
  verificaValores(schemaTransacao),
  buscarRegistro,
  atualizarTransacao
);
rotas.delete("/transacao/:id",buscarRegistro, deletarTransacao);

module.exports = rotas;
