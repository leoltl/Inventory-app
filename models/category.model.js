const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { 
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  description: { 
    type: String,
    default: '',
    maxLength: 150,
  },
});

// Virtual for category's URL
CategorySchema
  .virtual('url')
  .get(function () {
    return `/catalog/category/${this._id}`;
  });

module.exports = mongoose.model('Category', CategorySchema);
