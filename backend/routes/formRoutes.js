const express = require("express");
const router = express.Router();
const multer = require("multer");
const formController = require("../controllers/formController");

// Setup Multer here since it's only used for forms
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/send-apply-form",
  upload.single("cv"),
  formController.sendApplyForm
);
router.post("/send-business-inquiry", formController.sendBusinessInquiry);

module.exports = router;
