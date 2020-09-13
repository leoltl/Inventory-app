const Image = require('../models/image.model');

exports.detail = async function detail(req, res, next) {
  try {
    const image = await Image.findById(req.params.id);
    if (image === null) return res.render('404');
    res.header('Content-Type', image.content_type);
    res.end(image.data);
  } catch(e) {
    next(e)
  }
};
