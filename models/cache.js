class Cache {
  constructor() {
    this.data = new Map();
  }

  /**
   * Retrieves a value from the cache.
   * @param {string} key - The cache key.
   * @returns {any|null} - The cached value or null if not found or expired.
   */
  get(key) {
    const entry = this.data.get(key);
    if (!entry) return null;

    if (entry.expiry && entry.expiry < Date.now()) {
      this.data.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Sets a value in the cache with an optional TTL.
   * @param {string} key - The cache key.
   * @param {any} value - The value to store.
   * @param {number} ttlMs - Time to live in milliseconds.
   */
  set(key, value, ttlMs) {
    const expiry = ttlMs ? Date.now() + ttlMs : null;
    this.data.set(key, { value, expiry });
  }
}

module.exports = { Cache };
