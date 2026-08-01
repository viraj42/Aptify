const express = require("express");
const router = express.Router();
const topicController = require("../controllers/topic.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const { cacheMiddleware } = require("../middlewares/cache.middleware");

// Admin only
router.post("/", authMiddleware, adminMiddleware, topicController.createTopic);

// Public
router.get("/:sectionId", cacheMiddleware(3600), topicController.getTopicsBySection);

module.exports = router;
