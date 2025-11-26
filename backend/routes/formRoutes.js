const express = require("express");
const router = express.Router();
const multer = require("multer"); // Import multer
const {
  sendApplyForm,
  sendBusinessInquiry,
} = require("../controllers/formController"); // Update path

// Configure Multer (store in memory for email attachment)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Apply 'upload.single("cv")' middleware
// "cv" must match the name used in frontend: fd.append("cv", formData.cvFile);
router.post("/send-apply-form", upload.single("cv"), sendApplyForm);

router.post("/send-business-inquiry", sendBusinessInquiry);

module.exports = router;
