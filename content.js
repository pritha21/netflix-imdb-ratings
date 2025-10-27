/**
 * Content Script for Netflix IMDb Ratings Extension
 * Detects Netflix titles and overlays IMDb ratings
 */

// Track processed elements to avoid duplicates
const processedElements = new WeakSet();

// Debounce timer
let debounceTimer = null;

// Initialize extension
function init() {
  console.log('🎬 Netflix IMDb Ratings extension loaded');
  
  // Validate API key
  if (!CONFIG.OMDB_API_KEY || CONFIG.OMDB_API_KEY === 'eb8a3577') { // ✅ FIXED: Added !CONFIG.OMDB_API_KEY check
    console.error('❌ OMDb API key not configured. Please set it in config.js');
    showApiKeyWarning();
    return;
  }

  // Start observing Netflix content
  observeNetflixContent();
  
  // Process initially visible titles
  processVisibleTitles();
}

/**
 * Observe Netflix content for dynamic loading
 */
function observeNetflixContent() {
  // Main content observer
  const observer = new MutationObserver((mutations) => {
    // Debounce to avoid excessive processing
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      processVisibleTitles();
    }, CONFIG.OBSERVER_DEBOUNCE);
  });

  // Observe the main content area
  const targetNode = document.body;
  observer.observe(targetNode, {
    childList: true,
    subtree: true
  });

  // Also observe scroll events
  let scrollTimer = null;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      processVisibleTitles();
    }, CONFIG.OBSERVER_DEBOUNCE);
  }, { passive: true });
}

/**
 * Process all visible title elements
 */
function processVisibleTitles() {
  // Netflix uses different selectors for different pages
  const selectors = [
    // Row items (homepage sliders)
    '.title-card-container',
    '.slider-item',
    // Billboard (main featured item)
    '.billboard-row',
    // Search results
    '.search-result-item',
    // Browse results
    '.galleryContent > div',
    // My List
    '.title-card'
  ];

  const titleElements = document.querySelectorAll(selectors.join(', '));
  
  titleElements.forEach(element => {
    if (!processedElements.has(element) && isElementVisible(element)) {
      processedElements.add(element);
      processTitleElement(element);
    }
  });
}

/**
 * Check if element is visible in viewport
 */
function isElementVisible(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top < window.innerHeight &&
    rect.bottom > 0 &&
    rect.left < window.innerWidth &&
    rect.right > 0
  );
}

/**
 * Process individual title element
 */
async function processTitleElement(element) {
  // Extract title information
  const titleInfo = extractTitleInfo(element);
  
  if (!titleInfo || !titleInfo.title) {
    return;
  }

  // Add data attribute to prevent reprocessing
  element.setAttribute('data-imdb-processing', 'true');

  // Add loading overlay
  const loadingOverlay = createLoadingOverlay();
  addOverlay(element, loadingOverlay);

  try {
    // Fetch rating from API
    const ratingData = await apiService.getRating(titleInfo.title, titleInfo.year);
    
      // ✅ ADD LOGGING HERE
    console.log('Rating data:', ratingData);
    console.log('Rating type:', typeof ratingData.rating);
    console.log('Rating value:', ratingData.rating);
    // Remove loading overlay
    loadingOverlay.remove();
    
    // Create and add rating overlay
    if (ratingData && ratingData.rating !== null) {
      const overlay = createRatingOverlay(ratingData.rating);
      addOverlay(element, overlay);
      element.setAttribute('data-imdb-rating', ratingData.rating);
    } else {
      // Show N/A for titles without ratings
      const overlay = createNARatingOverlay();
      addOverlay(element, overlay);
      element.setAttribute('data-imdb-rating', 'N/A');
    }
  } catch (error) {
    console.error('Error processing title:', titleInfo.title, error);
    loadingOverlay.remove();
  }
}

/**
 * Extract title information from Netflix element
 */
function extractTitleInfo(element) {
  let title = null;
  let year = null;

  // Try multiple methods to extract title
  
  // Method 1: aria-label attribute
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) {
    title = cleanTitle(ariaLabel);
  }

  // Method 2: Look for title text in child elements
  if (!title) {
    const titleElement = element.querySelector('[class*="title"]');
    if (titleElement) {
      title = cleanTitle(titleElement.textContent);
    }
  }

  // Method 3: Look for image alt text
  if (!title) {
    const img = element.querySelector('img');
    if (img && img.alt) {
      title = cleanTitle(img.alt);
    }
  }

  // Method 4: Look for anchor text
  if (!title) {
    const link = element.querySelector('a');
    if (link && link.textContent) {
      title = cleanTitle(link.textContent);
    }
  }

  // Try to extract year if present
  if (title) { // ✅ FIXED: Added null check before using match()
    const yearMatch = title.match(/$(\d{4})$/);
    if (yearMatch) {
      year = parseInt(yearMatch[1]);
      title = title.replace(/\s*$\d{4}$\s*/, '').trim();
    }
  }

  return { title, year };
}

/**
 * Clean and normalize title text
 */
function cleanTitle(text) {
  if (!text) return null;
  
  return text
    .replace(/^Watch\s+/i, '')
    .replace(/^Play\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Create rating overlay element
 */
function createRatingOverlay(rating) {
  const overlay = document.createElement('div');
  overlay.className = 'imdb-rating-overlay';
  
  // ✅ FIXED: Convert rating to number if it's a string
  const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;
  
  // Add rating class based on value
  if (numericRating >= 8.0) {
    overlay.classList.add('high-rating');
  } else if (numericRating >= 6.0) {
    overlay.classList.add('medium-rating');
  } else {
    overlay.classList.add('low-rating');
  }
  
  // Add position class
  const position = CONFIG.OVERLAY_POSITION.replace('_', '-');
  overlay.classList.add(position);
  
  // Add animation class if enabled
  if (CONFIG.SHOW_ANIMATION) {
    overlay.classList.add('fade-in');
  }
  
  // Star icon SVG
  const starIcon = `
    <svg class="star-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
    </svg>
  `;
  
  overlay.innerHTML = `
    ${starIcon}
    <span class="rating-text">${numericRating.toFixed(1)}</span>
  `;
  
  return overlay;
}

/**
 * Create N/A rating overlay
 */
function createNARatingOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'imdb-rating-overlay na-rating';
  
  const position = CONFIG.OVERLAY_POSITION.replace('_', '-');
  overlay.classList.add(position);
  
  overlay.innerHTML = '<span class="rating-text">N/A</span>';
  
  return overlay;
}

/**
 * Create loading overlay
 */
function createLoadingOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'imdb-rating-overlay loading';
  
  const position = CONFIG.OVERLAY_POSITION.replace('_', '-');
  overlay.classList.add(position);
  
  overlay.innerHTML = '<div class="spinner"></div>';
  
  return overlay;
}

/**
 * Add overlay to element
 */
function addOverlay(element, overlay) {
  // Ensure element has relative positioning
  const position = window.getComputedStyle(element).position;
  if (position === 'static') {
    element.style.position = 'relative';
  }
  
  // Remove existing overlay if any
  const existingOverlay = element.querySelector('.imdb-rating-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }
  
  // Add overlay to element
  element.appendChild(overlay);
}

/**
 * Show API key warning
 */
function showApiKeyWarning() {
  const warning = document.createElement('div');
  warning.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #e74c3c;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    max-width: 300px;
  `;
  
  warning.innerHTML = `
    <strong>⚠️ Netflix IMDb Ratings</strong><br>
    API key not configured. Please update config.js
  `;
  
  document.body.appendChild(warning);
  
  setTimeout(() => {
    warning.remove();
  }, 5000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM already loaded, initialize immediately
  init();
}
