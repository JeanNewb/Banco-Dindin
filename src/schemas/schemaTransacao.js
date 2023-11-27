const joi = require("joi");
"descricao", "valor", "data", "categoria_id", "tipo";
const schemaTransacao = joi.object({
  descricao: joi.string().trim().required().messages({
    "string.base": "O campo descricao deve ser uma string",
    "string.empty": "O campo descricao não pode estar vazio.",
    "any.required": "O campo descricao é obrigatório",
  }),

  valor: joi.number().integer().required().messages({
    "number.base": "O campo valor deve ser um número Inteiro",
    "any.required": "O campo valor é obrigatório",
    "number.integer":"O campo valor deve ser um número Inteiro"
  }),
  data: joi.string().trim().required().messages({
    "string.base": "O campo descricao deve ser uma string",
    "any.required": "O campo senha é obrigatório",
    "string.empty": "O campo senha não pode estar vazio.",
  }),

  categoria_id: joi.string().trim().required().messages({
    "string.base": "O campo categoria_id deve ser uma string",
    "any.required": "O campo categoria_id é obrigatório",
    "string.empty": "O campo categoria_id não pode estar vazio.",
  }),

  tipo: joi.string().required().trim().messages({
    "string.base": "O campo tipo deve ser uma string",
    "any.required": "O campo tipo é obrigatório",
    "string.empty": "O campo tipo não pode estar vazio.",
  }),
});

module.exports = schemaTransacao;
