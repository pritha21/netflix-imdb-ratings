# 📁 Project Structure

Complete overview of the Netflix IMDb Ratings extension file structure.

## 📂 Directory Layout

```
netflix_extension/
├── 📄 manifest.json              # Extension manifest (Manifest V3)
├── 🔧 config.js                  # Configuration file (API key & settings)
├── 📜 content.js                 # Main content script (Netflix integration)
├── 🔌 api-service.js             # API service (OMDb integration & caching)
├── 🎨 styles.css                 # Overlay styling
├── 🖼️  popup.html                # Extension popup UI
├── ⚙️  popup.js                  # Popup functionality
├── 🧪 test-api.html              # API key testing tool
├── 🎨 create-icons.html          # Icon generator tool
├── 🚀 setup-help.ps1             # Setup validation script (PowerShell)
│
├── 📚 Documentation
│   ├── README.md                 # Main documentation
│   ├── QUICK_START.md            # 5-minute setup guide
│   ├── INSTALL.md                # Detailed installation guide
│   ├── CHANGELOG.md              # Version history
│   ├── PROJECT_STRUCTURE.md      # This file
│   └── LICENSE                   # MIT License
│
└── 🖼️  icons/                    # Extension icons
    ├── icon16.png                # 16x16 toolbar icon
    ├── icon48.png                # 48x48 management icon
    └── icon128.png               # 128x128 web store icon
```

---

## 📄 Core Files

### manifest.json
**Purpose:** Extension manifest file (Manifest V3 specification)

**Key Sections:**
- Basic metadata (name, version, description)
- Permissions (storage, API access)
- Content scripts configuration
- Popup configuration

**Dependencies:** None

---

### config.js
**Purpose:** Centralized configuration for all extension settings

**Contents:**
- OMDb API key and endpoint
- Cache settings (duration, prefix)
- Rate limiting parameters
- UI preferences (position, animation)
- Performance tuning options

**Used by:** content.js, api-service.js

**⚠️ Important:** User must edit this file to add their API key

---

### content.js
**Purpose:** Main content script that runs on Netflix pages

**Responsibilities:**
- Detect Netflix title elements
- Extract title information
- Create and display rating overlays
- Handle dynamic content loading (MutationObserver)
- Manage debouncing and performance

**Dependencies:**
- config.js (configuration)
- api-service.js (API calls)
- styles.css (overlay styling)

**Key Functions:**
- `init()` - Initialize extension
- `observeNetflixContent()` - Watch for new content
- `processVisibleTitles()` - Process all visible titles
- `processTitleElement()` - Handle individual title
- `extractTitleInfo()` - Extract title from HTML
- `createRatingOverlay()` - Create rating badge

---

### api-service.js
**Purpose:** API service layer with caching and rate limiting

**Responsibilities:**
- Fetch ratings from OMDb API
- Implement localStorage caching
- Handle rate limiting
- Manage request queue
- Implement retry logic
- Handle errors gracefully

**Dependencies:**
- config.js (API key, settings)

**Key Functions:**
- `getRating(title, year)` - Get rating (with cache check)
- `processQueue()` - Process request queue
- `makeRequest()` - Make API call with retries
- `getFromCache()` - Retrieve cached data
- `saveToCache()` - Store data in cache
- `clearAllCache()` - Clear all cached ratings

**API Used:** OMDb API (https://www.omdbapi.com/)

---

### styles.css
**Purpose:** Styling for IMDb rating overlays

**Features:**
- Rating badge styling
- Color coding (green/orange/red)
- Position variants (top-left, top-right, etc.)
- Animations (fade-in, pulse)
- Responsive design
- Loading spinner
- Hover effects

**Selectors:**
- `.imdb-rating-overlay` - Main badge
- `.high-rating` - 8.0+ (green)
- `.medium-rating` - 6.0-7.9 (orange)
- `.low-rating` - <6.0 (red)
- `.na-rating` - No rating (gray)
- `.loading` - Loading state

---

### popup.html
**Purpose:** Extension popup interface

**Features:**
- Status indicator
- Cache statistics
- Refresh button
- Clear cache button
- Beautiful gradient UI

**Dependencies:**
- popup.js (functionality)

---

### popup.js
**Purpose:** Popup functionality and cache management

**Responsibilities:**
- Display cache statistics
- Handle refresh button
- Handle clear cache button
- Format display data

**Key Functions:**
- `updateStats()` - Update statistics display
- `clearCache()` - Clear all cached ratings
- `formatBytes()` - Format size display

---

## 🧪 Utility Files

### test-api.html
**Purpose:** Interactive API key testing tool

**Features:**
- Test OMDb API key
- Display test results
- Show sample movie data
- Auto-load API key from config.js
- Beautiful UI with loading states

**When to use:**
- After getting an API key
- Before loading extension
- Troubleshooting API issues

---

### create-icons.html
**Purpose:** Generate extension icons

**Features:**
- Generate all three required icon sizes
- Preview icons
- Download all icons at once
- Canvas-based icon creation

**When to use:**
- During initial setup
- To create custom icons

---

### setup-help.ps1
**Purpose:** PowerShell script to validate setup

**Features:**
- Check for required files
- Validate API key configuration
- Check icon files
- Provide next steps
- Open helpful files

**How to run:**
```powershell
# Right-click → Run with PowerShell
# Or in terminal:
.\setup-help.ps1
```

---

## 📚 Documentation Files

### README.md
**Primary documentation** covering:
- Features overview
- Installation instructions
- Configuration guide
- Troubleshooting
- API information
- Project details

**Audience:** All users

---

### QUICK_START.md
**Fast-track setup guide** for users who want to get running quickly.

**Time estimate:** 5 minutes

**Covers:**
- Minimal steps only
- Quick troubleshooting
- Success indicators

**Audience:** Experienced users

---

### INSTALL.md
**Comprehensive installation guide** with detailed steps.

**Covers:**
- Detailed prerequisites
- Step-by-step instructions
- Screenshots and examples
- Extensive troubleshooting
- Verification checklist

**Audience:** All users (especially first-time users)

---

### CHANGELOG.md
**Version history** and release notes.

**Format:** Based on [Keep a Changelog](https://keepachangelog.com/)

**Sections:**
- Unreleased features
- Version history
- Known issues
- Browser compatibility

---

### LICENSE
**MIT License** for the extension.

Allows:
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

---

## 🖼️ Icons Directory

### Required Icon Sizes

| File | Size | Usage |
|------|------|-------|
| icon16.png | 16×16px | Browser toolbar |
| icon48.png | 48×48px | Extension management |
| icon128.png | 128×128px | Chrome Web Store |

**Format:** PNG with transparency

**How to create:**
- Use `create-icons.html`
- Or design custom icons
- Or use any image editor

---

## 🔄 Data Flow

### 1. Extension Load
```
Chrome loads extension
   ↓
Reads manifest.json
   ↓
Injects content scripts to Netflix
   ↓
Loads: config.js → api-service.js → content.js
```

### 2. Rating Display
```
User opens Netflix
   ↓
content.js detects title elements
   ↓
Extracts title information
   ↓
api-service.js checks cache
   ↓
If not cached: Fetch from OMDb API
   ↓
Save to cache
   ↓
content.js creates overlay
   ↓
Rating badge displayed
```

### 3. Caching Flow
```
Request for rating
   ↓
Check localStorage (key: imdb_rating_[title])
   ↓
Found? → Return cached data
   ↓
Not found? → API call → Cache → Return
```

---

## 🧩 Dependencies

### External Dependencies
- **OMDb API**: Movie rating data source
- **Chrome Extension APIs**: storage, runtime

### Internal Dependencies
```
content.js
   ├── config.js (settings)
   ├── api-service.js (API calls)
   └── styles.css (overlay styles)

api-service.js
   └── config.js (API key, limits)

popup.js
   └── localStorage (cache data)
```

---

## 💾 Storage

### localStorage Keys
```javascript
// Cache entries
'imdb_rating_[title]_[year]' → {data, timestamp}
'imdb_rating_the_matrix_1999' → {rating: 8.7, ...}

// No other storage used
```

### Cache Entry Format
```javascript
{
  data: {
    rating: 8.7,
    votes: "1,234,567",
    year: "1999",
    title: "The Matrix",
    type: "movie",
    found: true
  },
  timestamp: 1698268800000
}
```

---

## 🎯 Entry Points

1. **Netflix pages:** content.js initializes
2. **Extension popup:** popup.html opens
3. **API testing:** test-api.html (standalone)
4. **Icon creation:** create-icons.html (standalone)
5. **Setup validation:** setup-help.ps1 (standalone)

---

## 📏 Code Statistics

| File | Lines | Purpose |
|------|-------|---------|
| content.js | ~400 | Main logic |
| api-service.js | ~300 | API handling |
| styles.css | ~250 | Styling |
| popup.html | ~150 | Popup UI |
| popup.js | ~100 | Popup logic |
| config.js | ~50 | Configuration |
| **Total** | ~1,250 | Core code |

---

## 🔒 Security Notes

### Sensitive Data
- **API key in config.js** - Keep private
- Consider adding config.js to .gitignore if sharing code

### Data Collection
- **None** - Extension doesn't collect user data
- All processing is local
- Only title names sent to OMDb API

### Permissions
- `storage` - For localStorage caching only
- `https://www.omdbapi.com/*` - API access only

---

## 🚀 Performance Profile

### Memory Usage
- Initial: ~1-2 MB
- With cache: ~2-5 MB
- Grows slowly with use

### CPU Usage
- Initial load: ~50-100ms
- Per title: ~5-10ms (cached)
- API call: ~100-200ms

### Network
- Only when cache miss
- Throttled by rate limiting
- ~10-20 requests per page load (initially)

---

## 🛠️ Development Workflow

### Making Changes

1. **Edit files** in extension directory
2. **Reload extension:**
   - Go to chrome://extensions/
   - Click reload icon (↻)
3. **Refresh Netflix** page
4. **Test changes**

### Debugging

1. **Content script:**
   - F12 on Netflix page
   - Console tab
   
2. **Popup:**
   - Right-click extension icon
   - "Inspect popup"

3. **Background/Service worker:**
   - chrome://extensions/
   - Click "Inspect views"

---

## 📊 File Size Reference

Approximate file sizes:

| File | Size | Compressible |
|------|------|--------------|
| content.js | ~15 KB | Yes |
| api-service.js | ~10 KB | Yes |
| styles.css | ~8 KB | Yes |
| popup.html | ~4 KB | Yes |
| config.js | ~2 KB | Yes |
| icons/* | ~5 KB total | No (PNG) |

**Total extension size:** ~50 KB (without documentation)

---

This structure is designed for:
- ✅ Modularity
- ✅ Maintainability
- ✅ Easy configuration
- ✅ Performance
- ✅ Clear separation of concerns
