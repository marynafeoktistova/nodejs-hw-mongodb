import createError from 'http-errors';
import { deleteContact } from '../services/contacts.js';

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;

  const result = await deleteContact(contactId);
  if (!result) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
