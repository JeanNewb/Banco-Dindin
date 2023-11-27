const joi = require("joi");

const schemaLogin = joi.object({
  email: joi.string().email().required().messages({
    "string.base": "O campo email deve ser uma string",
    "string.email": "Deve ser um email válido",
    "any.required": "O campo email é obrigatório",
    "string.empty": "O campo email não pode estar vazio.",
  }),
  senha: joi.string().min(5).required().messages({
    "string.min": "A senha deve ter no mínimo 5 caracteres",
    "string.base": "O campo senha deve ser uma string",
    "any.required": "O campo senha é obrigatório",
    "string.empty": "O campo senha não pode estar vazio.",
  }),
});

module.exports = schemaLogin;
