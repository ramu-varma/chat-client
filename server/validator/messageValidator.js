const Joi = require('joi');

const messageSchema = Joi.object({
  sender: Joi.string().required(),
  text: Joi.string().required(),
  time: Joi.string().required()
});

module.exports = { messageSchema };
