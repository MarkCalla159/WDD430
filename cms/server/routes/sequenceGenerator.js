var Sequence = require('../models/sequence');

var maxDocumentId;
var maxMessageId;
var maxContactId;
var sequenceId = null;

function SequenceGenerator() {
  initializeSequence();
}

async function initializeSequence() {
  try {
    const sequence = await Sequence.findOne();

    if (!sequence) {
      console.log("No sequence record found. Create one manually in MongoDB.");
      return;
    }

    sequenceId = sequence._id;
    maxDocumentId = sequence.maxDocumentId || 0;
    maxMessageId = sequence.maxMessageId || 0;
    maxContactId = sequence.maxContactId || 0;

    console.log("Sequence initialized:", {
      maxDocumentId,
      maxMessageId,
      maxContactId
    });

  } catch (err) {
    console.error("Error initializing sequence:", err);
  }
}

SequenceGenerator.prototype.nextId = async function (collectionType) {
  let updateObject = {};
  let nextId;

  switch (collectionType) {
    case 'documents':
      maxDocumentId++;
      updateObject = { maxDocumentId: maxDocumentId };
      nextId = maxDocumentId;
      break;

    case 'messages':
      maxMessageId++;
      updateObject = { maxMessageId: maxMessageId };
      nextId = maxMessageId;
      break;

    case 'contacts':
      maxContactId++;
      updateObject = { maxContactId: maxContactId };
      nextId = maxContactId;
      break;

    default:
      return -1;
  }

  try {
    await Sequence.updateOne({ _id: sequenceId }, { $set: updateObject });
  } catch (err) {
    console.error("nextId update error:", err);
    return null;
  }

  return nextId.toString();
};

module.exports = new SequenceGenerator();
