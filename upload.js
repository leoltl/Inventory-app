const multer = require('multer');
const { MulterError } = multer;

const limits = {
  fileSize: 1000000, // 1MB
}

class uploadError extends MulterError {
  constructor(message) {
    super();
    this.message = message
  }
}

const fileFilter = function fileFilter(req, file, cb) {
  
  if (!file.mimetype.includes('image/')) {
    return cb(new uploadError('File type not accepted.'), false)
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
  if (err instanceof MulterError) {
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