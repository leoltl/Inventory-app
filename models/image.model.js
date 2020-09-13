const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  data: {
    type: Buffer,
  },
  content_type: {
    type: String,
  },
});

// Virtual for Image's URL
ImageSchema
  .virtual('url')
  .get(function () {
    return `/images/${this._id}`;
  });

module.exports = mongoose.model('Image', ImageSchema);
