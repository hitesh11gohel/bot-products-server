var express = require("express");
var Users = require("./users-router");
var Products = require("./products-router");
var router = express.Router();
const { signin } = require("../controllers/userController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/signin", signin);
router.use("/users", Users);
router.use("/products", Products);

module.exports = router;
