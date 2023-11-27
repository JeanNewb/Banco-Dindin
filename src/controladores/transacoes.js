const knex = require("../conexao");

const cadastrarTransacao = async (req, res) => {
  const { tipo, descricao, valor, data, categoria_id } = req.body;
  const { id } = req.usuario;

  try {
    const categoria = await knex("categorias")
      .where({ id: categoria_id })
      .first();

    if (!categoria) {
      return res
        .status(400)
        .json({ mensagem: "Não existe a categoria informada" });
    }

    const campoTipo = ["entrada", "saida"];

    if (!campoTipo.includes(tipo)) {
      return res
        .status(400)
        .json({ mensagem: "O Tipo informado não é válido" });
    }

    const cadastroTransacao = await knex("transacoes")
      .insert({
        tipo,
        descricao,
        valor,
        data,
        usuario_id: id,
        categoria_id,
      })
      .returning("*");

    const transacao = {
      ...cadastroTransacao[0],
      categoria_nome: categoria.descricao,
    };

    return res.json(transacao);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const listarTransacoesUsuario = async (req, res) => {
  const { id } = req.usuario;

  try {
    const transacoesUsuario = await knex
      .select(
        "transacoes.id",
        "tipo",
        "transacoes.descricao",
        "valor",
        "data",
        "usuario_id",
        "transacoes.categoria_id",
        "categorias.descricao as categoria_nome"
      )
      .from("transacoes")
      .join("categorias", "transacoes.categoria_id", "categorias.id")
      .where({ usuario_id: id });

    res.json(transacoesUsuario);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const detalharTransacao = async (req, res) => {
  const { id } = req.params;
  const usuario = req.usuario;

  try {
    const detalhar = await knex
      .select(
        "transacoes.id",
        "tipo",
        "transacoes.descricao",
        "valor",
        "data",
        "usuario_id",
        "categoria_id",
        "categorias.descricao as categoria_nome"
      )
      .from("transacoes")
      .join("categorias", "transacoes.categoria_id", "categorias.id")
      .where({
        "transacoes.id": id,
        usuario_id: usuario.id,
      });

    if (!detalhar) {
      return res
        .status(401)
        .json({ mensagem: "Usuário não tem autorização para isso." });
    }
    return res.json(detalhar);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const atualizarTransacao = async (req, res) => {
  const { id } = req.params;
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  const usuarioLogado = req.usuario;

  try {
    await knex("transacoes")
      .update({
        descricao,
        valor,
        data,
        categoria_id,
        tipo,
      })
      .where({ id, usuario_id: usuarioLogado.id });

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json("Erro interno do servidor");
  }
};

const deletarTransacao = async (req, res) => {
  const { id } = req.params;
 
  try {
    await knex("transacoes").where({ id }).del();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json("Erro interno do servidor.");
  }
};

const extratoTransacao = async (req, res) => {
  const { id } = req.usuario;

  try {

    const entrada = await knex("transacoes").sum("valor").where({tipo:"entrada",usuario_id:id}).first()

    const saida = await knex("transacoes").sum("valor").where({tipo:"saida",usuario_id:id}).first()

    res.json({
      entrada:
        entrada.sum === null
          ? (entrada.sum = "0")
          : entrada.sum,
      saida:
        saida.sum === null
          ? (saida.sum = "0")
          : saida.sum,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = {
  cadastrarTransacao,
  listarTransacoesUsuario,
  detalharTransacao,
  atualizarTransacao,
  deletarTransacao,
  extratoTransacao,
};
