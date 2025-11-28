const express = require('express');
const router = express.Router();

const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');

// GET all messages
router.get('/', (req, res, next) => {
  Message.find()
    .then(messages => {
      res.status(200).json({
        message: 'Messages fetched successfully!',
        messages: messages
      });
    })
    .catch(error => {
      console.error('Error in GET messages:', error);
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});
// POST create a message
router.post('/', async (req, res, next) => {
  const maxMessageId = await sequenceGenerator.nextId("messages");

  const message = new Message({
    id: maxMessageId,
    subject: req.body.subject,
    msgText: req.body.msgText,
    sender: req.body.sender
  });
  message.save()
    .then(createdMessage => {
      res.status(201).json({
        message: 'Message created successfully!',
        messageObj: createdMessage
      });
    })
    .catch(error => {
      console.error('Error creating message:', error);
      res.status(500).json({
        message: 'An error occurred',
        error: error.message || error
      });
    });
});
// PUT update a message
router.put('/:id', (req, res, next) => {
  Message.findOne({ id: req.params.id })
    .then(message => {
      if (!message) {
        return res.status(500).json({
          message: 'Message not found.',
          error: { message: 'Message not found' }
        });
      }

      message.subject = req.body.subject;
      message.msgText = req.body.msgText;
      message.sender = req.body.sender;

      return Message.updateOne({ id: req.params.id }, message);
    })
    .then(result => {
      res.status(204).json({
        message: 'Message updated successfully'
      });
    })
    .catch(error => {
      console.error('Error updating message:', error);
      res.status(500).json({
        message: 'An error occurred',
        error: error.message || error
      });
    });
});
// DELETE a message
router.delete('/:id', (req, res, next) => {
  Message.deleteOne({ id: req.params.id })
    .then(result => {
      res.status(204).json({
        message: 'Message deleted successfully'
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
