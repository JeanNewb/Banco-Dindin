const knex = require("../conexao");

const verificarEmail = async (req, res, next) => {
  const { email } = req.body;
  const emailUsuarioLogado = req.usuario.email;

  try {
    const usuario = await knex("usuarios").where({ email }).first();

    if (emailUsuarioLogado !== usuario.email) {
      if (usuario) {
        return res.status(400).json({ menssage: "Email existente" });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({ menssage: "Erro interno do servidor" });
  }
};

module.exports = verificarEmail;
