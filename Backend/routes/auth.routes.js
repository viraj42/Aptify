const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {
  registerValidation,
  loginValidation,
} = require("../utils/auth.validation");
const { authLimiter } = require("../middlewares/rateLimit.middleware");

router.use(authLimiter);

router.post("/register", registerValidation, authController.register);
router.post("/login", loginValidation, authController.login);
router.post("/google", authController.googleLogin);

module.exports = router;
