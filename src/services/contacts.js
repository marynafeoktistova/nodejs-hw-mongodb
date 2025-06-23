import { Contact } from '../db/models/contact.js';

export const getContacts = async (query = {}) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = query;

  const skip = (page - 1) * perPage;
  const limit = Number(perPage);
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const filter = {};

  if (type) {
    filter.contactType = type;
  }

  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true';
  }

  const totalItems = await Contact.countDocuments(filter);
  const contacts = await Contact.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    data: contacts,
    page: Number(page),
    perPage: limit,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

export const getContactById = (id) => Contact.findById(id);

export const createContact = (data) => Contact.create(data);

export const updateContact = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });

export const deleteContact = (id) => Contact.findByIdAndDelete(id);
