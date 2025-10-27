# 📦 Installation Guide

Complete step-by-step installation instructions for the Netflix IMDb Ratings extension.

## 📋 Prerequisites Checklist

Before you begin, make sure you have:
- [ ] Google Chrome (version 88 or higher)
- [ ] An email address to register for OMDb API
- [ ] 5-10 minutes of time

## 🎯 Installation Steps

### Step 1: Get Your OMDb API Key

1. **Visit the OMDb API website:**
   - Go to: https://www.omdbapi.com/apikey.aspx

2. **Select the FREE plan:**
   - Click on the "FREE!" option (1,000 daily limit)
   - This is sufficient for personal use

3. **Register your email:**
   - Enter your email address
   - Complete the form
   - Click "Submit"

4. **Verify your email:**
   - Check your inbox for an email from OMDb API
   - Click the verification link
   - You'll receive your API key

5. **Save your API key:**
   - Copy the API key (it looks like: `abc12345`)
   - Keep it handy for the next step

**📝 Example API Key Format:** `1a2b3c4d` (8 characters, alphanumeric)

---

### Step 2: Download the Extension

**Option A: Download ZIP**
1. Download the extension folder as a ZIP file
2. Extract it to a permanent location (e.g., `Documents/ChromeExtensions/`)
3. **Important:** Don't delete this folder after installation!

**Option B: Git Clone** (if you have Git installed)
```bash
git clone <repository-url>
cd netflix-imdb-ratings
```

---

### Step 3: Configure the Extension

1. **Open the extension folder:**
   - Navigate to where you extracted/cloned the extension

2. **Edit config.js:**
   - Right-click `config.js` → Open with Notepad (or any text editor)
   
3. **Add your API key:**
   - Find this line:
     ```javascript
     OMDB_API_KEY: 'YOUR_API_KEY_HERE',
     ```
   - Replace `YOUR_API_KEY_HERE` with your actual API key:
     ```javascript
     OMDB_API_KEY: '1a2b3c4d',  // Your actual key here
     ```
   
4. **Save the file:**
   - File → Save (or Ctrl+S)
   - Close the editor

**⚠️ Important:** Make sure to keep the quotes around your API key!

---

### Step 4: Create Extension Icons

**Option A: Use the Icon Generator (Recommended)**
1. Double-click `create-icons.html` in the extension folder
2. It will open in your browser
3. Click "Download All Icons" button
4. Save each icon in the `icons/` folder:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)

**Option B: Skip Icons (Temporary)**
- The extension will work without icons
- You can add them later

---

### Step 5: Test Your API Key (Optional but Recommended)

1. **Open test-api.html:**
   - Double-click `test-api.html` in the extension folder

2. **Test your API key:**
   - Your API key should auto-load from config.js
   - Click "Test API Key"
   - You should see: ✅ Success with movie details

3. **If it fails:**
   - Double-check your API key in config.js
   - Make sure you verified your email
   - Check if you have internet connection

---

### Step 6: Load Extension in Chrome

1. **Open Chrome Extensions page:**
   - Method 1: Type `chrome://extensions/` in the address bar
   - Method 2: Menu → More Tools → Extensions
   - Method 3: Use the Extensions icon in toolbar

2. **Enable Developer Mode:**
   - Look for "Developer mode" toggle in the top-right
   - Turn it ON (it should turn blue)

3. **Load the extension:**
   - Click "Load unpacked" button (top-left area)
   - Navigate to your extension folder
   - Select the folder and click "Select Folder"

4. **Verify installation:**
   - You should see "Netflix IMDb Ratings" in your extensions list
   - Make sure it's enabled (toggle is blue/on)

**📸 Screenshot Guide:**
```
chrome://extensions/
┌─────────────────────────────────┐
│ [Toggle] Developer mode      ON │
├─────────────────────────────────┤
│ [Load unpacked] [Pack extension]│
└─────────────────────────────────┘
```

---

### Step 7: Test the Extension

1. **Go to Netflix:**
   - Open a new tab
   - Navigate to https://www.netflix.com
   - Log in if needed

2. **Look for ratings:**
   - Browse the homepage
   - You should see small rating badges on thumbnails
   - They appear in the corner you configured (default: top-left)

3. **Check different pages:**
   - ✓ Home page
   - ✓ Browse/Categories
   - ✓ Search results
   - ✓ My List

**🎯 What to expect:**
- Ratings appear as badges (e.g., "⭐ 8.5")
- Color coding:
  - 🟢 Green = 8.0+ (Great!)
  - 🟠 Orange = 6.0-7.9 (Good)
  - 🔴 Red = <6.0 (Fair)
  - ⚪ Gray = N/A (Not rated)

---

## ✅ Verification Checklist

After installation, verify:
- [ ] Extension appears in chrome://extensions/
- [ ] Extension is enabled
- [ ] No error messages in extension details
- [ ] Ratings appear on Netflix thumbnails
- [ ] Can click extension icon for popup
- [ ] No console errors (F12 → Console)

---

## 🔧 Troubleshooting

### Issue: "API key not configured" warning

**Solution:**
1. Open `config.js`
2. Verify your API key is correct
3. Make sure it's between quotes: `'your-key-here'`
4. Save the file
5. Go to chrome://extensions/
6. Click the reload icon (↻) on the extension

---

### Issue: No ratings appearing

**Possible causes & solutions:**

1. **API key not set:**
   - Check config.js has your real API key
   - Use test-api.html to verify it works

2. **Extension not loaded:**
   - Go to chrome://extensions/
   - Make sure extension is enabled
   - Try reloading it

3. **Console errors:**
   - Press F12 on Netflix page
   - Check Console tab for errors
   - Report specific errors if needed

4. **Netflix page not supported:**
   - Try the main homepage first
   - Some Netflix pages may not be supported yet

---

### Issue: Wrong ratings or mismatches

**Explanation:**
- The extension uses Netflix's title text to search IMDb
- Some titles have different names on Netflix vs IMDb
- Regional variations can cause mismatches

**No fix available** - this is a limitation of automated matching

---

### Issue: Extension icon missing

**Solution:**
- Either create icons using create-icons.html
- Or add default icons to the icons/ folder
- The extension works fine without icons

---

### Issue: Extension slows down Netflix

**Solution:**
1. Open `config.js`
2. Increase these values:
   ```javascript
   OBSERVER_DEBOUNCE: 1000,        // Change from 500 to 1000
   MAX_CONCURRENT_REQUESTS: 3,     // Change from 5 to 3
   REQUEST_DELAY: 200,             // Change from 100 to 200
   ```
3. Save and reload extension

---

## 🔄 Updating the Extension

When a new version is released:

1. Download the new version
2. Go to chrome://extensions/
3. Click "Remove" on old version
4. Follow installation steps again
5. Your cache and API key settings persist

---

## ❌ Uninstalling

To remove the extension:

1. Go to chrome://extensions/
2. Find "Netflix IMDb Ratings"
3. Click "Remove"
4. Confirm removal
5. Delete the extension folder from your computer

**Note:** This will clear all cached ratings.

---

## 🆘 Still Having Issues?

1. **Check Chrome version:**
   - Menu → Help → About Google Chrome
   - Update if needed (requires 88+)

2. **Try incognito mode:**
   - This isolates the extension from other extensions
   - chrome://extensions/ → "Allow in incognito"

3. **Clear browser cache:**
   - Settings → Privacy → Clear browsing data
   - Check "Cached images and files"

4. **Check browser console:**
   - F12 on Netflix page
   - Look for error messages
   - Take screenshots of errors

5. **Verify API key is active:**
   - Visit https://www.omdbapi.com/
   - Log in and check your API key status
   - Make sure you didn't exceed daily limit

---

## 📞 Getting Help

If you still need help:

1. Read the main README.md
2. Check QUICK_START.md for fast solutions
3. Look at common issues above
4. Create a GitHub issue with:
   - Chrome version
   - Extension version
   - Error messages
   - Steps to reproduce

---

**That's it! Enjoy enhanced Netflix browsing! 🎬⭐**
