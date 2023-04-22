// Important requires
const Joi = require("joi");

/**
 * Validation schema using Joi for event
 */
const eventValidSchemaRegister = Joi.object({
  eventName: Joi.string().required(),
  location: Joi.string().required(),
  availableTickets: Joi.number().integer().positive().min(0).required(),
  price: Joi.number().min(0).precision(2).required()
});


module.exports = { eventValidSchemaRegister };
