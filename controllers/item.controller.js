const { body, sanitizeBody, validationResult } = require('express-validator');

const Category = require('../models/category.model');
const Item     = require('../models/item.model');


exports.create_get = async function create_get(req, res) {
  const categories = await Category.find({});
  res.render('item_create', { categories });
}
exports.create_post = [
  body('name').notEmpty().withMessage('Name cannot be empty.'),
  body('price').isNumeric().withMessage('Price has to be a numeric value.'),
  body('number_in_stock').isInt().withMessage('Number in stock has to be an Integer'),
  body('image_url').isURL().withMessage('Image URL has to be a valid URL'),
  
  sanitizeBody('*').trim(),
  sanitizeBody('name').escape(),
  sanitizeBody('price').escape().toFloat(),
  sanitizeBody('number_in_stock').escape().toInt(),
  async function create_post(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const categories = await Category.find({});
      (categories.find((category) => category._id == req.body.category)).checked = true;
      return res.render('item_create', {
        item: req.body,
        errors: errors.array(),
        categories,
      });
    }

    try {
      const item = new Item({
        name:            req.body.name,
        description:     req.body.description,
        price:           req.body.price,
        number_in_stock: req.body.number_in_stock,
        category:        req.body.category,
        image_url:       req.body.image_url
      })
      await item.save();
      res.redirect(item.url);
    } catch(e) {
      console.log(e)
      const categories = await Category.find({});
      res.render('item_create', {
        item: req.body,
        categories,
      })
    }
    
  },
];

exports.update_get = function update_get(req, res) {
  res.status(500).send('TO BE IMPLEMENTED');
}
exports.update_post = function update_post(req, res) {
  res.status(500).send('TO BE IMPLEMENTED');
}

exports.delete_get = function delete_get(req, res) {
  res.status(500).send('TO BE IMPLEMENTED');
}
exports.delete_post = function delete_post(req, res) {
  res.status(500).send('TO BE IMPLEMENTED');
}

exports.detail = async function detail(req, res) {
  try {
    const item = await Item.findById(req.params.id);
    res.render('item_detail', { item });
  } catch(e) {
    next(e)
  }
}
exports.list = function list(req, res) {
  res.status(500).send('TO BE IMPLEMENTED');
}