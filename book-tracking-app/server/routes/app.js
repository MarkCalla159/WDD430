const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Book Tracker API');
});

module.exports = router;
