/**
 * Popup script for extension settings and cache management
 */

// Update stats on popup load
document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  
  // Refresh button
  document.getElementById('refresh-btn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id);
        window.close();
      }
    });
  });
  
  // Clear cache button
  document.getElementById('clear-cache-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all cached ratings?')) {
      clearCache();
    }
  });
});

/**
 * Update statistics display
 */
function updateStats() {
  // Count cached items
  const keys = Object.keys(localStorage);
  const cachePrefix = 'imdb_rating_';
  const cachedItems = keys.filter(key => key.startsWith(cachePrefix));
  
  // Calculate cache size
  let totalSize = 0;
  cachedItems.forEach(key => {
    const item = localStorage.getItem(key);
    if (item) {
      totalSize += new Blob([item]).size;
    }
  });
  
  // Update display
  document.getElementById('cached-count').textContent = cachedItems.length;
  document.getElementById('cache-size').textContent = formatBytes(totalSize);
}

/**
 * Clear all cached ratings
 */
function clearCache() {
  const keys = Object.keys(localStorage);
  const cachePrefix = 'imdb_rating_';
  
  keys.forEach(key => {
    if (key.startsWith(cachePrefix)) {
      localStorage.removeItem(key);
    }
  });
  
  updateStats();
  
  // Show success message
  const btn = document.getElementById('clear-cache-btn');
  const originalText = btn.textContent;
  btn.textContent = '✓ Cache Cleared';
  btn.style.background = 'rgba(46, 204, 113, 0.5)';
  
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
  }, 2000);
}

/**
 * Format bytes to human-readable size
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
