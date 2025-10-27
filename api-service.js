/**
 * API Service for fetching IMDb ratings from OMDb API
 * Handles caching, rate limiting, and error handling
 */

class APIService {
  constructor() {
    this.requestQueue = [];
    this.isProcessing = false;
    this.requestCount = 0;
    this.requestTimestamp = Date.now();
    this.activeRequests = 0;
  }

  /**
   * Get IMDb rating for a title
   * @param {string} title - Movie or series title
   * @param {number} year - Release year (optional but recommended)
   * @returns {Promise<Object>} - Rating data
   */
  async getRating(title, year = null) {
    console.log(`🔍 Fetching rating for title: ${title}${year ? ` (${year})` : ''}`);
    
    // Check cache first
    const cacheKey = this.getCacheKey(title, year);
    const cachedData = await this.getFromCache(cacheKey);
    
    if (cachedData) {
      console.log(`✅ Found in cache: ${title} - Rating: ${cachedData.imdbRating || 'N/A'}`);
      return cachedData;
    }

    // Add to request queue
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ title, year, resolve, reject });
      this.processQueue();
    });
  }

  /**
   * Process the request queue with rate limiting
   */
  async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      // Rate limiting check
      if (!this.canMakeRequest()) {
        await this.waitForRateLimit();
      }

      // Concurrent request limit
      if (this.activeRequests >= CONFIG.MAX_CONCURRENT_REQUESTS) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.REQUEST_DELAY));
        continue;
      }

      const request = this.requestQueue.shift();
      this.makeRequest(request);

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, CONFIG.REQUEST_DELAY));
    }

    this.isProcessing = false;
  }

  /**
   * Make API request with retry logic
   */
  async makeRequest(request, retryCount = 0) {
    const { title, year, resolve, reject } = request;
    
    try {
      this.activeRequests++;
      this.requestCount++;

      const fetchFromAPI = async (title, year = null) => {
        console.log(`🌐 Making API request for: ${title}${year ? ` (${year})` : ''}`);
        
        try {
          // Build URL with parameters
          const params = new URLSearchParams({
            apikey: CONFIG.OMDB_API_KEY,
            t: title,
            type: 'movie', // Default to movie, can be overridden by the API
            r: 'json',
            plot: 'short',
            ...(year && { y: year })
          });

          const url = `${CONFIG.OMDB_API_URL}?${params.toString()}`;
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          // Process response
          const result = this.processResponse(data, title, year);
          
          // Cache the result
          const cacheKey = this.getCacheKey(title, year);
          await this.saveToCache(cacheKey, result);

          this.activeRequests--;
          resolve(result);
        } catch (error) {
          this.activeRequests--;
          throw error;
        }
      };

      await fetchFromAPI(title, year);

    } catch (error) {
      this.activeRequests--;
      
      // Retry logic
      if (retryCount < CONFIG.MAX_RETRIES) {
        console.log(`Retrying request for "${title}" (attempt ${retryCount + 1}/${CONFIG.MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
        this.makeRequest(request, retryCount + 1);
      } else {
        console.error(`Failed to fetch rating for "${title}":`, error);
        reject({ rating: null, error: error.message }); // ✅ FIXED: Changed from resolve to reject
      }
    }
  }

/**
 * Process OMDb API response
 */
processResponse(data, title, year) {
  if (data.Response === 'True') {
    console.log(`✅ Successfully fetched: ${title} - Rating: ${data.imdbRating || 'N/A'}`);
    return {
      rating: data.imdbRating ? parseFloat(data.imdbRating) : null, // ✅ FIXED: Convert to number
      year: data.Year,
      title: data.Title,
      type: data.Type,
      found: true
    };
  } else {
    console.warn(`⚠️ No data found for: ${title}${year ? ` (${year})` : ''} - ${data.Error || 'Unknown error'}`);
    return {
      rating: null,
      error: data.Error || 'No data found',
      found: false
    };
  }
}

  /**
   * Check if we can make a request (rate limiting)
   */
  canMakeRequest() {
    const now = Date.now();
    const timeDiff = now - this.requestTimestamp;

    // Reset counter every minute
    if (timeDiff >= 60000) {
      this.requestCount = 0;
      this.requestTimestamp = now;
      return true;
    }

    return this.requestCount < CONFIG.MAX_REQUESTS_PER_MINUTE;
  }

  /**
   * Wait for rate limit to reset
   */
  async waitForRateLimit() {
    const now = Date.now();
    const timeDiff = now - this.requestTimestamp;
    const waitTime = 60000 - timeDiff;
    
    console.log(`Rate limit reached. Waiting ${Math.ceil(waitTime / 1000)} seconds...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    this.requestCount = 0;
    this.requestTimestamp = Date.now();
  }

  /**
   * Generate cache key
   */
  getCacheKey(title, year) {
    const normalizedTitle = title.toLowerCase().trim();
    return `${CONFIG.CACHE_PREFIX}${normalizedTitle}${year ? `_${year}` : ''}`;
  }

  /**
   * Get data from cache (localStorage)
   */
  async getFromCache(key) {
    try {
      const cached = localStorage.getItem(key);
      
      if (!cached) {
        return null;
      }

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is expired
      if (now - timestamp > CONFIG.CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  }

  /**
   * Save data to cache (localStorage)
   */
  async saveToCache(key, data) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Cache write error:', error);
      
      // Clear old cache entries if quota exceeded
      if (error.name === 'QuotaExceededError') {
        this.clearOldCache();
      }
    }
  }

  /**
   * Clear old cache entries
   */
  clearOldCache() {
    const now = Date.now();
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(CONFIG.CACHE_PREFIX)) {
        try {
          const cached = JSON.parse(localStorage.getItem(key));
          if (now - cached.timestamp > CONFIG.CACHE_DURATION) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          // Remove invalid cache entries
          localStorage.removeItem(key);
        }
      }
    });
  }

  /**
   * Clear all cache
   */
  clearAllCache() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CONFIG.CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    console.log('All cache cleared');
  }
}

// Create and expose the API service instance
const apiService = new APIService();

// Make apiService available globally
window.apiService = apiService;