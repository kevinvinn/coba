const multer = require("multer");

const upload = multer({
  fileFilter: (req, file, cb) => {
    const allowedType = ["image/jpg", "image/jpeg", "image/png"];
    if (allowedType.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const err = new Error("foto only brok");
      cb(err, false);
    }
  },
  onError: (err, next) => {
    next(err);
  },
});

module.exports = upload;
