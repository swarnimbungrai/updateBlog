const multer = require("multer"); //handle file uploads

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); //uploaded image will be stored in this folder, uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = {
  multer,
  storage,
};