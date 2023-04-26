// Important requires
const Joi = require("joi");

/**
 * Validation schema using Joi for event
 */
const eventValidSchema = Joi.object({
  eventName: Joi.string().required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
  description: Joi.string().required(),
  city: Joi.string().required(),
  imageURL: Joi.string().trim().regex(/^\S+$/).required(),
  availableTickets: Joi.number().integer().positive().min(0).required(),
  price: Joi.number().min(0).precision(2).required(),
  date: Joi.string().pattern(/^([0-2][1-9]|[1-3]0|31)-(0[1-9]|1[0-2])-\d{4}$/).required(),
  time: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  type: Joi.string().required()
});

/**
 * Validation schema using Joi for event
 */
const eventTypeValidSchema = Joi.object({
  eventTypeName: Joi.string().required(),
});


module.exports = { eventValidSchema,eventTypeValidSchema };
