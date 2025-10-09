# Simple Cloudinary Setup - No .env needed!

## ✅ Fixed! Your upload function is now ready to use.

### Step 1: Get Your Cloudinary Credentials

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. **Copy your Cloud Name** from the top-right corner
3. Go to **Settings** > **Upload**
4. Click **Add upload preset**
5. Fill in:
   - **Preset name**: `gems_upload` (or any name)
   - **Signing Mode**: **Unsigned** (very important!)
   - **Folder**: `STJ` (optional)
   - **Format**: **Auto**
6. Click **Save** and copy the preset name

### Step 2: Update Your Upload Function

Open `src/pages/uploadfunctionnew.jsx` and replace the config at the top:

```javascript
// Replace these with your actual credentials
const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "your_actual_cloud_name_here",      // Replace this
  UPLOAD_PRESET: "your_actual_upload_preset_here", // Replace this
  FOLDER: "STJ"
};
```

### Step 3: Example

If your cloud name is `myjewelstore` and preset is `gems_upload`:

```javascript
const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "myjewelstore",
  UPLOAD_PRESET: "gems_upload", 
  FOLDER: "STJ"
};
```

### Step 4: Test

1. Save the file
2. Restart your development server: `npm start`
3. Try uploading an image in your AddGem form

## 🎉 That's it! No more deprecation warnings and no .env issues!

Your images will now upload to Cloudinary and the URLs will be sent to your backend.



