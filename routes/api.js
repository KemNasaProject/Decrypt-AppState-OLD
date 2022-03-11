const router = require("express").Router();
const { home,check,data } = require("../controllers/index");

router.get("/", home);
router.get("/getKey", check);
router.get("/data", data)
module.exports = router;