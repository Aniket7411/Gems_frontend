# Environment Variables Setup for Cloudinary

## Step 1: Create .env file

Create a `.env` file in your project root directory with the following content:

```env
# Cloudinary Configuration
# Get these values from your Cloudinary Dashboard (https://cloudinary.com/console)

# Your Cloudinary Cloud Name (found in Dashboard > Settings > Account Details)
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name_here

# Your Cloudinary Upload Preset (create one in Dashboard > Settings > Upload)
# Make sure to set it as "Unsigned" for public uploads
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here

# Optional: API Key and Secret (only needed for signed uploads)
# REACT_APP_CLOUDINARY_API_KEY=your_api_key_here
# REACT_APP_CLOUDINARY_API_SECRET=your_api_secret_here
```

## Step 2: Get Your Cloudinary Credentials

### Cloud Name
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. In the top-right corner, you'll see your **Cloud Name**
3. Copy this value and replace `your_cloud_name_here` in the .env file

### Upload Preset
1. In Cloudinary Dashboard, go to **Settings** > **Upload**
2. Click **Add upload preset**
3. Fill in the details:
   - **Preset name**: `gems_upload` (or any name you prefer)
   - **Signing Mode**: **Unsigned** (for public uploads)
   - **Folder**: `STJ` (optional, for organization)
   - **Format**: **Auto** (recommended)
4. Click **Save**
5. Copy the preset name and replace `your_upload_preset_here` in the .env file

## Step 3: Restart Your Development Server

After creating the .env file:
```bash
npm start
```

## Step 4: Test the Upload

Your AddGem form should now properly upload images to Cloudinary and return the image URLs that will be sent to your backend.

## Troubleshooting

If you still get "Unknown API key" error:
1. Double-check your cloud name in the .env file
2. Make sure the upload preset is set to "Unsigned"
3. Restart your development server after changing .env
4. Check the browser console for any error messages
