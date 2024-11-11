const router = require("express").Router();
const multerUpload = require("../libs/multer");
const userControllers = require("../controllers/userControllers");

router.post("/user", userControllers.addUser);
router.put("/user/:id", userControllers.editUser);
router.get("/user/:id", userControllers.getUser);
router.delete("/user/:id", userControllers.deleteUser);

router.post("/image", multerUpload.single("image"), userControllers.addImage);

router.put(
  "/image/:id",
  multerUpload.single("image"),
  userControllers.updateImage
);

router.get("/image/:id", userControllers.getImage);

router.delete("/image/:id", userControllers.deleteImage);

router.post(
  "/image/more",
  multerUpload.array("image", 10),
  userControllers.handleMoreImage
);

module.exports = router;
