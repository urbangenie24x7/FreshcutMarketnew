# Firebase Storage Setup Instructions

## 1. Enable Firebase Storage
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your `freshcuts-5cb4c` project
3. Click **Storage** in left sidebar
4. Click **Get Started**
5. Choose **Start in test mode** (for now)
6. Select a location (choose closest to your users)

## 2. Update Storage Rules
1. In Firebase Console → Storage → Rules tab
2. Replace the rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

3. Click **Publish**

## 3. Verify Storage Bucket
Make sure your `.env.local` has:
```
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=freshcuts-5cb4c.appspot.com
```

## 4. Test Upload
After setup, try uploading an image in Admin Dashboard.