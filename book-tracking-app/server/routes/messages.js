const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const sequenceGenerator = require('./sequenceGenerator');

router.get('/', (req, res) => {
  Message.find().populate('sender').then(messages => {
    res.status(200).json(messages);
  });
});

router.post('/', (req, res) => {
  const id = sequenceGenerator.nextId('messages');

  const message = new Message({
    id: id.toString(),
    subject: req.body.subject,
    text: req.body.text,
    sender: req.body.sender
  });

  message.save().then(created => res.status(201).json(created));
});

router.delete('/:id', (req, res) => {
  Message.deleteOne({ id: req.params.id }).then(() => {
    res.status(204).json();
  });
});

module.exports = router;
