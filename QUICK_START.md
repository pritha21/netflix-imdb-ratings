# ⚡ Quick Start Guide

Get up and running in 5 minutes!

## 🚀 Fast Track Installation

### 1. Get API Key (2 minutes)
1. Visit: https://www.omdbapi.com/apikey.aspx
2. Choose **FREE** plan
3. Enter your email
4. Check your email for the API key

### 2. Configure Extension (1 minute)
1. Open `config.js` in a text editor
2. Find this line:
   ```javascript
   OMDB_API_KEY: 'YOUR_API_KEY_HERE',
   ```
3. Replace `YOUR_API_KEY_HERE` with your actual API key
4. Save the file

### 3. Create Icons (1 minute)
1. Open `create-icons.html` in Chrome
2. Click "Download All Icons"
3. Save all three icons in the `icons/` folder:
   - icon16.png
   - icon48.png
   - icon128.png

### 4. Load in Chrome (1 minute)
1. Open Chrome
2. Go to: `chrome://extensions/`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked**
5. Select the `netflix_extension` folder
6. Done! ✅

### 5. Test It Out
1. Go to: https://www.netflix.com
2. Look for IMDb ratings on movie thumbnails
3. They should appear as small badges in the corner

## ✅ Success Indicators

You'll know it's working when:
- ⭐ Ratings appear on Netflix thumbnails
- 🎬 Extension icon shows in Chrome toolbar
- ✓ No error messages in browser console

## 🆘 Quick Troubleshooting

**No ratings showing?**
- Press F12 → Check Console tab for errors
- Make sure API key is correctly set in `config.js`
- Try refreshing the Netflix page

**"API key not configured" warning?**
- Double-check `config.js` has your real API key
- Make sure you saved the file after editing
- Reload the extension in `chrome://extensions/`

**Icons not showing?**
- Create them using `create-icons.html`
- Or temporarily remove the `icons` section from `manifest.json`

## 🎯 Next Steps

Once it's working:
- Explore configuration options in `config.js`
- Customize overlay position and colors
- Check out the full README.md for advanced features

## 📞 Need Help?

1. Read the full README.md
2. Check browser console (F12) for specific errors
3. Verify your API key is active at omdbapi.com

---

**That's it! Enjoy your enhanced Netflix experience! 🍿**
