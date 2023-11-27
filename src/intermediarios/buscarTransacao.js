const knex = require("../conexao");

const buscarRegistro = async (req, res, next) => {
  const { id } = req.params;
  const usuario = req.usuario;
  console.log(usuario);
  const buscarRegistro = await knex("transacoes").where({ id }).first();

  if (!buscarRegistro) {
    return res.status(404).json({ mensagem: "Transação não encontrada." });
  }

  if (usuario.id !== buscarRegistro.usuario_id) {
    return res
      .status(404)
      .json({
        mensagem: "Usuário não tem permissão para isso",
      });
  }
  next();
};

module.exports = buscarRegistro;
