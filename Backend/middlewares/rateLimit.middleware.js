const rateLimit = require("express-rate-limit");

/**
 * Global API Rate Limiter
 * Protects all backend API routes against general DDoS and excessive scraping.
 * Limit: 300 requests per 15 minutes per IP.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

/**
 * Authentication Rate Limiter
 * Protects login, signup, and OAuth routes against brute-force password guessing and spam registrations.
 * Limit: 20 requests per 15 minutes per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many authentication attempts from this IP, please try again after 15 minutes.",
  },
});

/**
 * AI Recommendation Rate Limiter
 * Protects expensive LLM (Groq/Anthropic) API calls against token exhaustion and budget abuse.
 * Limit: 15 requests per 15 minutes per IP.
 */
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "AI recommendation quota exceeded for this IP, please try again after 15 minutes.",
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  aiLimiter,
};
