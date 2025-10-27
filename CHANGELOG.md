# Changelog

All notable changes to the Netflix IMDb Ratings extension will be documented in this file.

## [1.0.0] - 2024-10-25

### 🎉 Initial Release

#### Features
- ✨ Automatic IMDb rating overlays on Netflix thumbnails
- 💾 Smart caching system (7-day cache duration)
- 🎨 Color-coded ratings (green/orange/red based on score)
- ⚡ Rate limiting and request optimization
- 🔄 Dynamic loading support for infinite scroll
- 🎯 Multiple Netflix page support (home, search, browse, my list)
- 📊 Extension popup with cache statistics
- 🎛️ Configurable settings via config.js
- 🔒 Privacy-focused (local storage only)

#### Technical Details
- Manifest V3 compliance
- OMDb API integration
- localStorage-based caching
- MutationObserver for dynamic content
- Debounced processing for performance
- Retry logic for failed requests
- Concurrent request limiting

#### Components
- `manifest.json` - Extension manifest
- `content.js` - Main content script
- `api-service.js` - API service with caching
- `config.js` - Configuration file
- `styles.css` - Overlay styling
- `popup.html/js` - Extension popup
- `create-icons.html` - Icon generator

#### Documentation
- README.md - Comprehensive documentation
- QUICK_START.md - Fast setup guide
- CHANGELOG.md - This file

### Known Issues
- Some regional Netflix titles may not match IMDb database
- Title matching depends on Netflix's title format
- Free OMDb API limited to 1,000 requests/day

### Browser Support
- ✅ Chrome 88+
- ✅ Edge 88+ (Chromium-based)
- ✅ Brave
- ✅ Opera

---

## [Unreleased]

### Planned Features
- [ ] Support for Rotten Tomatoes scores
- [ ] Metacritic integration
- [ ] Multiple streaming platform support
- [ ] User rating filters
- [ ] Export functionality
- [ ] Keyboard shortcuts
- [ ] Custom themes

---

Format based on [Keep a Changelog](https://keepachangelog.com/)
