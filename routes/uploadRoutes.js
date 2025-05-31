const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const upload = require("../middlewares/uploadMiddleware");
const { uploadImage } = require("../services/uploadService");

router.post("/image", protect, upload.single("image"), uploadImage);

module.exports = router;
