# DHERST Website

Department of Higher Education, Research, Science and Technology - Papua New Guinea

## PHP-Based Image Selection System

This website uses a **pure PHP-based system** with **NO JavaScript timers, intervals, or countdowns**.

### Files:
- `index.php` - Main homepage (displays selected image)
- `image-selector.php` - Private image selector (accessible via direct URL)
- `config/selected_image.json` - Stores the selected image number
- `styles.css` - CSS styling
- `image-selector.css` - Image selector styling

### How it works:
1. **Image Selection**: Access `image-selector.php` directly in browser
2. **Select Image**: Choose any image number (1-50)
3. **Apply**: Click "Apply Selection" - saves to JSON file
4. **Display**: Main page (`index.php`) reads from JSON file and displays the image
5. **No Timers**: Image stays exactly as selected until manually changed

### Features:
- ✅ **Pure PHP** - No JavaScript timers or intervals
- ✅ **File-based storage** - Uses JSON file for persistence
- ✅ **Instant updates** - Changes apply immediately
- ✅ **Error handling** - Validates image numbers (1-50)
- ✅ **Debug info** - Shows system status
- ✅ **Web-ready** - Works on any PHP-enabled web server

### Usage:
- **Public**: Visit `index.php` (or just the domain)
- **Private**: Visit `image-selector.php` to change images
