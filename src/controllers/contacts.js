import createError from 'http-errors';
import fs from 'fs/promises';
import cloudinary from '../utils/cloudinary.js';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

export const getAllContactsController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await getContacts(userId, req.query);

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// GET /contacts/:contactId
export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user.id;

    const contact = await getContactById(contactId, userId);

    if (!contact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully retrieved contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// POST /contacts
export const createContactController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { path } = req.file || {};

    let photoUrl = null;

    if (path) {
      const result = await cloudinary.uploader.upload(path, {
        folder: 'contacts',
      });
      photoUrl = result.secure_url;
      await fs.unlink(path); // очищення тимчасового файлу
    }

    const newContact = await createContact({
      ...req.body,
      userId,
      photo: photoUrl,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /contacts/:contactId
export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user.id;
    const { path } = req.file || {};

    let photoUrl = null;

    if (path) {
      const result = await cloudinary.uploader.upload(path, {
        folder: 'contacts',
      });
      photoUrl = result.secure_url;
      await fs.unlink(path);
    }

    const updatedData = photoUrl ? { ...req.body, photo: photoUrl } : req.body;

    const updatedContact = await updateContact(contactId, userId, updatedData);

    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /contacts/:contactId
export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user.id;

    const deleted = await deleteContact(contactId, userId);

    if (!deleted) {
      throw createError(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
