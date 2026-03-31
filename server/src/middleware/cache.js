import NodeCache from 'node-cache';

// Cache configuration: 5 minutes default TTL, check period every 10 minutes
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes
  checkperiod: 600, // 10 minutes
  useClones: false, // Store references, not clones (faster)
});

/**
 * Cache middleware factory
 * @param {number} duration - Cache duration in seconds (default: 300 = 5 minutes)
 * @returns {Function} Express middleware
 *
 * Usage: router.get('/projects', cacheMiddleware(600), projectController.getProjects)
 */
export const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create cache key from URL + query params
    const key = req.originalUrl || req.url;

    // Check if we have cached data
    const cachedData = cache.get(key);

    if (cachedData) {
      console.log(`[Cache] HIT: ${key}`);
      return res.json(cachedData);
    }

    // Store original res.json to override it
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = (data) => {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log(`[Cache] SET: ${key} (TTL: ${duration}s)`);
        cache.set(key, data, duration);
      }
      return originalJson(data);
    };

    next();
  };
};

/**
 * Clear cache by pattern or all cache
 * @param {string|RegExp} pattern - Pattern to match keys (optional, clears all if not provided)
 * @returns {number} Number of keys deleted
 */
export const clearCache = (pattern) => {
  if (!pattern) {
    console.log('[Cache] Clearing all cache');
    return cache.flushAll();
  }

  const keys = cache.keys();
  let deletedCount = 0;

  keys.forEach((key) => {
    if (typeof pattern === 'string') {
      if (key.includes(pattern)) {
        cache.del(key);
        deletedCount++;
      }
    } else if (pattern instanceof RegExp) {
      if (pattern.test(key)) {
        cache.del(key);
        deletedCount++;
      }
    }
  });

  console.log(`[Cache] Cleared ${deletedCount} keys matching: ${pattern}`);
  return deletedCount;
};

/**
 * Get cache statistics
 * @returns {Object} Cache stats
 */
export const getCacheStats = () => {
  return cache.getStats();
};

export default cache;
