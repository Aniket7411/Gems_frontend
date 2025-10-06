# Cloudinary Setup for AddGem Form

## Configuration Required

To use the Cloudinary integration in your AddGem form, you need to:

### 1. Update Cloudinary Configuration

In `src/pages/AddGem.js`, update these values in the `uploadToCloudinary` function:

```javascript
// Replace with your actual Cloudinary cloud name
const response = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
    method: 'POST',
    body: formData
});

// Replace with your actual upload preset
formData.append('upload_preset', 'YOUR_UPLOAD_PRESET');
```

### 2. Create Upload Preset in Cloudinary

1. Go to your Cloudinary Dashboard
2. Navigate to Settings > Upload
3. Create a new upload preset with:
   - **Preset name**: `gems_preset` (or update the code)
   - **Signing Mode**: Unsigned (for public uploads)
   - **Folder**: `gems/` (optional, for organization)
   - **Format**: Auto (or specify formats)

### 3. Environment Variables (Optional)

You can also use environment variables for better security:

```javascript
const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData
});

formData.append('upload_preset', UPLOAD_PRESET);
```

Add to your `.env` file:
```
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 4. Features Included

✅ **Hero Image Upload**: Main display image (required)
✅ **Additional Images**: Multiple optional images
✅ **Image Preview**: Shows uploaded images with remove option
✅ **Progress Indication**: Loading state during upload
✅ **Error Handling**: Proper error messages for failed uploads
✅ **File Validation**: 5MB limit, image types only

### 5. Data Structure Sent to Backend

```javascript
{
    heroImage: "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/hero_image.jpg",
    additionalImages: [
        "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/image1.jpg",
        "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/image2.jpg"
    ]
}
```

That's it! Your AddGem form is now ready with Cloudinary integration.
