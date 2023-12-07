const express = require("express");
const router = express.Router();
const {
  getProductById,
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const Auth = require("../middlewares/auth"); // Middlewares
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "upload",
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

router.get("/get-all", Auth, getAllProducts);
router.post("/create", Auth, upload.single("image"), createProduct);
router.get("/get/:id", Auth, getProductById);
router.patch("/update/:id", Auth, upload.single("image"), updateProduct);
router.delete("/delete/:id", Auth, deleteProduct);

module.exports = router;
