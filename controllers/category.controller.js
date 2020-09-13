const multer = require('multer');
const { body, sanitizeBody, validationResult } = require('express-validator');

const Category = require('../models/category.model');
const Item     = require('../models/item.model');
const Image    = require('../models/image.model');

const upload = multer({ storage: multer.memoryStorage() });

exports.create_get = function create_get(req, res) {
  res.render('category_create');
}
exports.create_post = [
  upload.single('image'),
  body('name').isLength({ min: 1}).trim().withMessage('Category name is required.'),
  sanitizeBody('name').escape(),
  async function create_post(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('category_create', {
        category: req.body,
        errors:   errors.array() 
      });
    }

    if (req.file) {
      var image = new Image ({
        data: req.file.buffer,
        content_type: req.file.mimetype,
      });
      await image.save();
    }

    const category = new Category({
      name:        req.body.name,
      description: req.body.description,
      image_id:    (image && image.url) || '',
    });

    try {
      await category.save();
      res.redirect(category.url);
    } catch(e) {
      next(e);
    }
  } 
];

exports.update_get = async function update_get(req, res, next) {
  const [category] = await Category.find({ _id: req.params.id });
  res.render('category_create', {
    category,
    isEdit: true,
  })
}

exports.update_post = [
  upload.single('image'),
  body('name').isLength({ min: 1}).trim().withMessage('Category name is required.'),
  sanitizeBody('name').escape(),
  async function update_post(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('category_create', {
        category: req.body,
        isEdit: true,
        errors: errors.array() 
      });
    }

    if (req.file) {
      var image = new Image ({
        data: req.file.buffer,
        content_type: req.file.mimetype,
      });
      await image.save();
    }

    const category = new Category({
      _id:         req.params.id,
      name:        req.body.name,
      description: req.body.description,
      image_id:    (image && image.url) || req.body.image_id,
    });

    try {
      await Category.findByIdAndUpdate(req.params.id, category);
      res.redirect(category.url);
    } catch (e) {
      next(e)
    }
  }
];

exports.delete_post = async function delete_post(req, res) {
  try {
    await Category.findByIdAndRemove(req.params.id);
    res.redirect('/catalog/admin')
  } catch (e) {
    next(e)
  }
}

exports.detail = async function detail(req, res) {
  try {
    const [category, items] = await Promise.all([
      Category.findById(req.params.id),
      Item.find({ category: req.params.id }),
    ]);
    res.render('category_detail', { category, items });
  } catch(e) {
    next(e)
  }
}
exports.list = function list(req, res) {
  res.status(500).send('TO BE IMPLEMENTED');
}

exports.index = async function index(req, res) {
  try {
    const categories = await Category.find({});
    const items = await Item.find({});
    res.render('index', { categories, items });
  } catch(e) {
    console.log('smthg wrong, ', e)
    next(e);
  }
}

exports.admin = async function admin(req, res) {
  try {
    const categories = await Category.find({}).select('name');
    const items = await Item.find({}).select('name');
    
    const categoryHeader = Object.keys(categories[1]._doc);
    const itemHeader = Object.keys(categories[1]._doc);

    res.render('admin', {
      categories: buildRows(categories, categoryHeader),
      items: buildRows(items, itemHeader),
    });
  } catch(e) {
    console.log('smthg wrong, ', e)
    next(e);
  }
}

function buildRows(results, headerKeys) {
  const columns = [...headerKeys.filter((key) => key !== '__v' && key !== '_id'), 'url', 'edit_url']
  const rows = results.map((result) => {
    return columns.map((columnKey) => {
      return result[columnKey];
    });
  });
  return [columns, ...rows];
}