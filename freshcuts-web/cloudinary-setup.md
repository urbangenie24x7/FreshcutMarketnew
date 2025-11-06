# Cloudinary Setup (2 minutes)

## 1. Create Free Account
- Go to [cloudinary.com](https://cloudinary.com)
- Sign up for free account
- Note your **Cloud Name** (e.g., "freshcuts")

## 2. Create Upload Preset
1. In Cloudinary Dashboard → Settings → Upload
2. Click **Add upload preset**
3. **Preset name**: `freshcuts`
4. **Signing Mode**: `Unsigned`
5. **Folder**: `products`
6. **Save**

## 3. Update Code
Replace the cloud name in admin dashboard:
```javascript
'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload'
```

## 4. Benefits
- ✅ Free 25GB storage + 25GB bandwidth
- ✅ Automatic image optimization
- ✅ Fast CDN delivery
- ✅ No Firebase setup needed
- ✅ Works immediately