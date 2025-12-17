const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const sequenceGenerator = require('./sequenceGenerator');

router.get('/', (req, res) => {
  Book.find().populate('author').then(books => {
    res.status(200).json(books);
  });
});

router.post('/', (req, res) => {
  const id = sequenceGenerator.nextId('books');

  const book = new Book({
    id: id.toString(),
    title: req.body.title,
    description: req.body.description,
    author: req.body.author
  });

  book.save().then(created => {
    res.status(201).json(created);
  });
});

router.put('/:id', (req, res) => {
  Book.findOne({ id: req.params.id }).then(book => {
    book.title = req.body.title;
    book.description = req.body.description;
    book.author = req.body.author;

    Book.updateOne({ id: req.params.id }, book).then(() => {
      res.status(204).json();
    });
  });
});

router.delete('/:id', (req, res) => {
  Book.deleteOne({ id: req.params.id }).then(() => {
    res.status(204).json();
  });
});

module.exports = router;

