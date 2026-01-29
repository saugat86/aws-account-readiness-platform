import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

interface CacheEntry {
  data: any;
  timestamp: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxAge: number;
  private maxSize: number;

  constructor(maxAgeMinutes: number = 5, maxSize: number = 100) {
    this.maxAge = maxAgeMinutes * 60 * 1000; // Convert to milliseconds
    this.maxSize = maxSize;

    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  private generateKey(data: any): string {
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(data));
    return hash.digest('hex');
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: any): void {
    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Create a singleton cache instance
const scoringCache = new SimpleCache(5, 100); // 5 minutes, max 100 entries

/**
 * Caching middleware for scoring calculations
 * Caches based on request body hash
 */
export const cacheScoring = (req: Request, res: Response, next: NextFunction) => {
  // Only cache GET and POST requests
  if (req.method !== 'POST' && req.method !== 'GET') {
    return next();
  }

  // Generate cache key from request body
  const cacheKey = scoringCache['generateKey'](req.body);

  // Check if we have a cached response
  const cachedData = scoringCache.get(cacheKey);

  if (cachedData) {
    // Return cached response
    return res.json({
      ...cachedData,
      cached: true,
      cacheTimestamp: Date.now(),
    });
  }

  // Store original json method
  const originalJson = res.json.bind(res);

  // Override json method to cache the response
  res.json = function (data: any) {
    // Only cache successful responses
    if (data.success) {
      scoringCache.set(cacheKey, data);
    }

    // Call original json method
    return originalJson(data);
  };

  next();
};

export { scoringCache };
