# Quick Cloudinary Setup (No .env needed!)

## Step 1: Get Your Cloudinary Credentials

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. **Copy your Cloud Name** from the top-right corner
3. Go to **Settings** > **Upload**
4. Click **Add upload preset**
5. Fill in:
   - **Preset name**: `gems_upload` (or any name)
   - **Signing Mode**: **Unsigned** (important!)
   - **Folder**: `STJ` (optional)
   - **Format**: **Auto**
6. Click **Save** and copy the preset name

## Step 2: Update the Config File

Open `src/uploadfunction/cloudinaryConfig.js` and replace:

```javascript
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "your_actual_cloud_name_here",      // Replace with your cloud name
  UPLOAD_PRESET: "your_actual_upload_preset_here", // Replace with your preset name
  FOLDER: "STJ"
};
```

## Step 3: Test

1. Save the file
2. Restart your development server: `npm start`
3. Try uploading an image in your AddGem form

## Example:
If your cloud name is `myjewelstore` and preset is `gems_upload`:

```javascript
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "myjewelstore",
  UPLOAD_PRESET: "gems_upload", 
  FOLDER: "STJ"
};
```

That's it! No .env file needed. 🎉



