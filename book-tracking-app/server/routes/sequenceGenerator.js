const Sequence = require('../models/sequence');

let maxBookId;
let maxAuthorId;
let maxMessageId;
let sequenceId = null;

function SequenceGenerator() {
  Sequence.findOne().exec((err, seq) => {
    if (err) {
      console.log(err);
      return;
    }
    sequenceId = seq._id;
    maxBookId = seq.maxBookId;
    maxAuthorId = seq.maxAuthorId;
    maxMessageId = seq.maxMessageId;
  });
}

SequenceGenerator.prototype.nextId = function (collection) {
  let updateObject = {};
  let nextId;

  switch (collection) {
    case 'books':
      maxBookId++;
      updateObject = { maxBookId };
      nextId = maxBookId;
      break;
    case 'authors':
      maxAuthorId++;
      updateObject = { maxAuthorId };
      nextId = maxAuthorId;
      break;
    case 'messages':
      maxMessageId++;
      updateObject = { maxMessageId };
      nextId = maxMessageId;
      break;
    default:
      return -1;
  }

  Sequence.updateOne({ _id: sequenceId }, { $set: updateObject }).exec();
  return nextId;
};

module.exports = new SequenceGenerator();
