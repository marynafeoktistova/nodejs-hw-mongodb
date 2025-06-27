import Joi from 'joi';

const allowedContactTypes = ['personal', 'home', 'work'];

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().length(12).pattern(/^\d+$/).required(),
  email: Joi.string().email().allow(null, '').optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string()
    .valid(...allowedContactTypes)
    .required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().length(12).pattern(/^\d+$/),
  email: Joi.string().email().allow(null, ''),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...allowedContactTypes),
}).min(1);
