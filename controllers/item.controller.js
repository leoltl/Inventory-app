const multer = require('multer');
const { body, sanitizeBody, validationResult } = require('express-validator');

const Category = require('../models/category.model');
const Item     = require('../models/item.model');
const Image    = require('../models/image.model');
const upload = multer({ storage: multer.memoryStorage() });

const itemValidator = [
  body('*').trim(),
  body('name')
    .notEmpty().withMessage('Name cannot be empty.')
    .escape(),
  body('price')
    .isNumeric().withMessage('Price has to be a numeric value.')
    .escape().toFloat(),
  body('number_in_stock')
    .isInt().withMessage('Number in stock has to be an Integer')
    .escape().toInt(),
]

exports.create_get = async function create_get(req, res, next) {
  try {
    const categories = await Category.find({});
    res.render('item_create', { categories });
  } catch (e) {
    next(e)
  }
}

exports.create_post = [
  upload.single('image'),
  ...itemValidator,
  async function create_post(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const categories = await Category.find({});
      (categories.find((category) => category._id == req.body.category)).checked = true;
      return res.render('item_create', {
        categories,
        item:   req.body,
        errors: errors.array(),
      });
    }
    let image;
    
    try {
      if (req.file) {
        image = new Image ({
          data: req.file.buffer,
          content_type: req.file.mimetype,
        });
        await image.save();
      }

      const item = new Item({
        name:            req.body.name,
        description:     req.body.description,
        price:           req.body.price,
        number_in_stock: req.body.number_in_stock,
        category:        req.body.category,
        image_id:        image ? image.url : '',
      });
      await item.save();

      res.redirect(item.url);
    } catch(e) {
      console.log(e)
      const categories = await Category.find({});
      res.render('item_create', {
        categories,
        item: req.body,
        errors: [{ msg: e.message }],
      })
    }
    
  },
];

exports.update_get = async function update_get(req, res, next) {
  try {
    const [item] = await Item.find({ _id: req.params.id }).populate('category');
    const categories = await Category.find({});
    (categories.find(({ _id }) => _id.equals(item.category[0]._id))).checked = true;
    res.render('item_create', {
      item,
      categories,
      isEdit: true,
    });
  } catch (e) {
    console.log(e)
    next(e)
  }
  
}
exports.update_post = [
  upload.single('image'),
  ...itemValidator,
  async function update_post(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const categories = await Category.find({});
      return res.render('item_create', {
        categories,
        item:   req.body,
        isEdit: true,
        errors: errors.array() 
      });
    }
    let image;
    
    if (req.file) {
      image = new Image ({
        data: req.file.buffer,
        content_type: req.file.mimetype,
      });
      await image.save();
    }

    const item = new Item({
      name:            req.body.name,
      description:     req.body.description,
      price:           req.body.price,
      number_in_stock: req.body.number_in_stock,
      category:        req.body.category,
      image_id:        (image ? image.url : req.body.image_id),
      _id:             req.params.id,
    });

    try {
      await Item.findByIdAndUpdate(req.params.id, item);
      res.redirect(item.url);
    } catch (e) {
      next(e)
    }
  }
]

exports.delete_post = async function delete_post(req, res, next) {
  try {
    await Item.findByIdAndRemove(req.params.id);
    res.redirect('/catalog/admin')
  } catch (e) {
    next(e)
  }
}

exports.detail = async function detail(req, res, next) {
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
