const multer = require('multer');

const limits = {
  fileSize: 300, // 1MB
}

const fileFilter = function fileFilter(req, file, cb) {
  
  if (!file.mimetype.includes('image/')) {
    return cb(null, false)
  }

  cb(null, true); // accept
}

const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  fileFilter,
  limits,
});

const multerErrorHandler = function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    return res.render('upload_error', {
      message: err.message,
      returnTo: req.originalUrl,
    });
  }
  next(err)
}

module.exports = {
  upload,
  uploadErrorHandler: multerErrorHandler, 
};