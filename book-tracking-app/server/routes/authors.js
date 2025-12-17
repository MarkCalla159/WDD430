const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const sequenceGenerator = require('./sequenceGenerator');

router.get('/', (req, res) => {
  Author.find().then(authors => res.status(200).json(authors));
});

router.post('/', (req, res) => {
  const id = sequenceGenerator.nextId('authors');

  const author = new Author({
    id: id.toString(),
    name: req.body.name,
    email: req.body.email
  });

  author.save().then(created => res.status(201).json(created));
});

router.put('/:id', (req, res) => {
  Author.findOne({ id: req.params.id }).then(author => {
    author.name = req.body.name;
    author.email = req.body.email;

    Author.updateOne({ id: req.params.id }, author).then(() => {
      res.status(204).json();
    });
  });
});

router.delete('/:id', (req, res) => {
  Author.deleteOne({ id: req.params.id }).then(() => {
    res.status(204).json();
  });
});

module.exports = router;
