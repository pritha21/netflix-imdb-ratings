/**
 * Configuration file for the Netflix IMDb Ratings extension
 * 
 * IMPORTANT: Replace 'YOUR_API_KEY_HERE' with your actual OMDb API key
 * Get your free API key from: https://www.omdbapi.com/apikey.aspx
 */

const CONFIG = {
  // OMDb API configuration
  OMDB_API_KEY: '2d132d9c', // Replace with your actual API key
  OMDB_API_URL: 'https://www.omdbapi.com/',
  
  // Cache settings
  CACHE_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  CACHE_PREFIX: 'imdb_rating_',
  
  // Rate limiting
  MAX_REQUESTS_PER_MINUTE: 50,
  REQUEST_DELAY: 100, // milliseconds between requests
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // milliseconds
  
  // UI settings
  OVERLAY_POSITION: 'top-left', // Options: 'top-left', 'top-right', 'bottom-left', 'bottom-right'
  SHOW_ANIMATION: true,
  
  // Performance settings
  OBSERVER_DEBOUNCE: 500, // milliseconds
  MAX_CONCURRENT_REQUESTS: 5
};

