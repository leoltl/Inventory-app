const Image = require('../models/image.model');

exports.detail = async function detail(req, res) {
  try {
    const image = await Image.findById(req.params.id);
    res.header('Content-Type', image.content_type);
    res.end(image.data);
  } catch(e) {
    next(e)
  }
};
