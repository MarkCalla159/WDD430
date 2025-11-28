const express = require('express');
const router = express.Router();

const sequenceGenerator = require('./sequenceGenerator');
const Contact = require('../models/contact');
// GET all contacts
router.get('/', (req, res, next) => {
  Contact.find()
    .populate('group')
    .then(contacts => {
      res.status(200).json({
        message: 'Contacts fetched successfully!',
        contacts: contacts
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});
// POST create contact
router.post('/', async (req, res, next) => {
  const maxContactId = await sequenceGenerator.nextId("contacts");

  let groupReferences = [];
  if (Array.isArray(req.body.group)) {
    groupReferences = req.body.group.map(g => g._id || g);
  }

  const contact = new Contact({
    id: maxContactId,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    imageUrl: req.body.imageUrl,
    group: groupReferences
  });
  contact.save()
    .then(createdContact => {
      res.status(201).json({
        message: 'Contact created successfully!',
        contact: createdContact
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});
// PUT update contact
router.put('/:id', (req, res, next) => {
  Contact.findOne({ id: req.params.id })
    .then(contact => {
      if (!contact) {
        return res.status(500).json({
          message: 'Contact not found.',
          error: { contact: 'Contact not found' }
        });
      }
      contact.name = req.body.name;
      contact.email = req.body.email;
      contact.phone = req.body.phone;
      contact.imageUrl = req.body.imageUrl;
      if (Array.isArray(req.body.group)) {
        contact.group = req.body.group.map(g => g._id || g);
      }

      return Contact.updateOne({ id: req.params.id }, contact);
    })
    .then(result => {
      res.status(204).json({
        message: 'Contact updated successfully'
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});
// DELETE contact
router.delete('/:id', (req, res, next) => {
  Contact.deleteOne({ id: req.params.id })
    .then(result => {
      res.status(204).json({
        message: 'Contact deleted successfully'
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

module.exports = router;