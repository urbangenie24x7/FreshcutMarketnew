# FreshCuts Seed Data Uploader

This directory contains scripts to upload master data to Firebase Firestore.

## Setup

1. **Download Service Account Key:**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save as `serviceAccountKey.json` in this directory

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Upload Data:**
   ```bash
   npm run upload
   ```

## Files

- `master_data.json` - Contains all seed data (products, vendors, catalog)
- `upload_seed.js` - Node.js script to upload data to Firebase
- `package.json` - Dependencies and scripts
- `serviceAccountKey.json` - Firebase service account key (you need to add this)

## Data Structure

### Collections Created:
- `product_catalog` - Master product catalog with images
- `vendors` - Vendor information for RAM SVR area
- `products` - Vendor-specific products with pricing

### Usage:
After uploading, your Firebase database will have all the master data, and the Flutter app can fetch it directly without needing the seed button.