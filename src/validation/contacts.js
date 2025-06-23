import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phone: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  contactType: Joi.string().min(3).max(20).optional(),
  isFavourite: Joi.boolean().optional(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phone: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  contactType: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
}).min(1);
