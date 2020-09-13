const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
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
  },
  price: {
    type: Number,
    min: 0,
    default: 999999,
  },
  number_in_stock: {
    type: Number,
    min: 0,
    default: 0,
  },
  category: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Category' 
  }],
  image_id: {
    type: String,
    default: '',
  }
});

// Virtual for items's URL
ItemSchema
  .virtual('url')
  .get(function () {
    return `/catalog/item/${this._id}`;
  });

ItemSchema
  .virtual('edit_url')
  .get(function () {
    return `/catalog/item/${this._id}/edit`;
  });

module.exports = mongoose.model('Item', ItemSchema)
