var express = require("express");
var router = express.Router();
const {
  create,
  get,
  getById,
  update,
  deleteUser,
} = require("../controllers/userController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "userProfiles",
  filename: (req, file, cb) => {
    const fileName = `${file.fieldname}_${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, fileName);
  },
});
let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

router.post("/create", upload.single("profile"), create);
router.get("/get-all", get);
router.get("/get/:id", getById);
router.patch("/update/:id", upload.single("profile"), update);
router.delete("/delete/:id", deleteUser);

module.exports = router;
