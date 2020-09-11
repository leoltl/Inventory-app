const Item = require('../models/item.model');

exports.create_get = function create_get(req, res) {
  res.status(500).send('TO BE IMPLEMENTED');
}
exports.create_post = function create_post(req, res) {
  res.status(500).send('TO BE IMPLEMENTED');
}

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