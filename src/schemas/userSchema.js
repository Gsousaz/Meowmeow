import joi from "joi";

export const userSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  cpf: joi
    .string()
    .pattern(new RegExp("^[0-9]{3}[0-9]{3}[0-9]{3}[0-9]{2}$"))
    .required(),
  telefone: joi
    .string()
    .pattern(new RegExp("^[0-9]{2}[0-9]{5}[0-9]{4}$"))
    .required(),
});
