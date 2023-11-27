const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const senhajwt = require("../senhajwt");
const knex = require("../conexao");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = await knex("usuarios")
      .insert({
        nome,
        email,
        senha: senhaCriptografada,
      })
      .returning("*");

    if (!novoUsuario) {
      return res.status(400).json("O usuário não foi cadastrado.");
    }

    const { senha: _, ...usuario } = novoUsuario[0];

    return res.status(201).json(usuario);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await knex("usuarios").where({ email }).first();

    if (!usuario) {
      return res.status(400).json({ mensagem: "Email ou senha Incorreta" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(400).json({ mensagem: "Email ou senha Incorreta" });
    }

    const token = jwt.sign({ id: usuario.id }, senhajwt, {
      expiresIn: "1d",
    });

    const { senha: _, ...usuarioLogado } = usuario;

    return res.status(200).json({ usuario: usuarioLogado, token });
  } catch (error) {
    return res.status(500).json({ mesagem: "erro interno do servidor" });
  }
};

const detalharUsuario = async (req, res) => {
  const { senha: _, ...infoUsuario } = req.usuario;

  try {
    return res.status(200).json(infoUsuario);
  } catch (error) {
    return res.status(500).json({ mesagem: "erro interno do servidor" });
  }
};

const atualizarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  const { id } = req.usuario;

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    await knex("usuarios").where({ id }).update({
      nome,
      email,
      senha: senhaCriptografada,
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ mesagem: "erro interno do servidor" });
  }
};

const listarCategorias = async (req, res) => {
  try {
    const lista = await knex("categorias");
    res.json(lista);
  } catch (error) {
    return res.status(500).json({ mesagem: "erro interno do servidor" });
  }
};

module.exports = {
  cadastrarUsuario,
  login,
  detalharUsuario,
  atualizarUsuario,
  listarCategorias,
};
