const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

module.exports = {
  signUpBodyValidation(body) {
    const schema = Joi.object({
      name: Joi.string().required().label("Name"),
      email: Joi.string().email().required().label("Email"),
      password: passwordComplexity().required().label("Password"),
    });
    return schema.validate(body);
  },
  logInBodyValidation(body) {
    const schema = Joi.object({
      email: Joi.string().email().required().label("Email"),
      password: Joi.string().required().label("Password"),
    });
    return schema.validate(body);
  },
  refreshTokenBodyValidation(body) {
    const schema = Joi.object({
      refreshToken: Joi.string().required().label("Refresh Token"),
    });
    return schema.validate(body);
  },
}