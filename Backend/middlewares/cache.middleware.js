const Redis = require("ioredis");

let redisClient = null;
let isRedisConnected = false;

// Initialize Redis with progressive enhancement (graceful fallback if offline)
try {
  const redisUrl =
    process.env.REDIS_URL ||
    (process.env.REDIS_HOST
      ? `redis://${process.env.REDIS_USERNAME || "default"}:${process.env.REDIS_PASSWORD || ""}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT || 6379}`
      : "redis://127.0.0.1:6379");

  redisClient = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
      if (times > 1) return null; // Stop retrying after 1 attempt if offline
      return 500;
    },
  });

  redisClient
    .connect()
    .then(() => {
      isRedisConnected = true;
      console.log("[✔] Redis Cache Connected Successfully");
    })
    .catch(() => {
      console.log("[ℹ] Redis server offline. Caching disabled (falling back seamlessly to MongoDB)");
    });

  redisClient.on("error", () => {
    // Suppress repeated error logs when offline
    isRedisConnected = false;
  });
} catch (err) {
  console.log("[ℹ] Redis client initialization skipped");
}

/**
 * Progressive Cache Middleware
 * @param {number} durationSeconds - Time to live in seconds
 */
const cacheMiddleware = (durationSeconds = 3600) => {
  return async (req, res, next) => {
    // If Redis is not connected or request is not GET, bypass cache
    if (!isRedisConnected || req.method !== "GET" || !redisClient) {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        res.setHeader("X-Cache", "HIT");
        return res.status(200).json(JSON.parse(cachedData));
      }
    } catch (err) {
      // If redis read fails, silently proceed to DB
    }

    // Intercept res.json to store the result in cache
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode === 200 && isRedisConnected) {
        res.setHeader("X-Cache", "MISS");
        redisClient.setex(key, durationSeconds, JSON.stringify(body)).catch(() => {});
      }
      return originalJson(body);
    };

    next();
  };
};

module.exports = {
  cacheMiddleware,
  redisClient,
};
