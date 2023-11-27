const jwt = require("jsonwebtoken");
const senhajwt = require("../senhajwt");
const knex = require("../conexao");

const verificarUsuarioLogado = async (req, res, next) => {
  const { authorization } = req.headers;

  !authorization && res.status(401).json({ mensagem: "Não autorizado." });

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, senhajwt);

    const usuarioId = await knex("usuarios").where({ id }).first();

    !usuarioId && res.status(401).json({ mensagem: "Não autorizado." });

    req.usuario = usuarioId;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({
        mensagem:
          "Para acessar este recurso um token de autenticação válido deve ser enviado.",
      });
  }
};

module.exports = verificarUsuarioLogado;
