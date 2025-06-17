import { Contact } from '../db/models/contact.js';

export const getContacts = () => Contact.find({});

export const getContactById = (id) => Contact.findById(id);

export const createContact = (data) => Contact.create(data);

export const updateContact = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });

export const deleteContact = (id) => Contact.findByIdAndDelete(id);
