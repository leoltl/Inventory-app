var createError = require('http-errors');
const Image = require('../models/image.model');

exports.detail = async function detail(req, res, next) {
  try {
    const image = await Image.findById(req.params.id);
    console.log(image)
    if (image === null) {
      return next(createError(404));
    }
    res.header('Content-Type', image.content_type);
    res.end(image.data);
  } catch(e) {
    next(e)
  }
};
