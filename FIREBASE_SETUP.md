# Firebase Configuration Setup

## ✅ Template Files Created

I've created template Firebase configuration files. **Replace with your actual Firebase project credentials:**

### 1. Android Configuration
**File:** `android/app/google-services.json`
- Replace `freshcuts-demo` with your Firebase project ID
- Replace `AIzaSyDemoKeyReplace_With_Your_Actual_Key` with your API key
- Replace `123456789012` with your project number

### 2. iOS Configuration  
**File:** `ios/Runner/GoogleService-Info.plist`
- Replace all demo values with your actual Firebase iOS config
- Download from Firebase Console → Project Settings → iOS app

### 3. Web Configuration
**File:** `web/index.html`
- Replace `firebaseConfig` object with your web app config
- Get from Firebase Console → Project Settings → Web app

### 4. Google Maps API Keys
**Android:** `android/app/src/main/AndroidManifest.xml`
**iOS:** `ios/Runner/AppDelegate.swift`
- Replace `AIzaSyDemoKeyReplace_With_Your_Google_Maps_Key`

## 🚀 How to Get Real Firebase Config:

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "FreshCuts" or similar
4. Enable Google Analytics (optional)

### Step 2: Add Android App
1. Click "Add app" → Android
2. Package name: `com.freshcuts.app`
3. Download `google-services.json`
4. Replace the template file

### Step 3: Add iOS App  
1. Click "Add app" → iOS
2. Bundle ID: `com.freshcuts.app`
3. Download `GoogleService-Info.plist`
4. Replace the template file

### Step 4: Add Web App
1. Click "Add app" → Web
2. App nickname: "FreshCuts Web"
3. Copy the config object
4. Replace in `web/index.html`

### Step 5: Enable Firebase Services
1. **Authentication:** Enable Email/Password
2. **Firestore:** Create database in test mode
3. **Storage:** Create default bucket

### Step 6: Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps SDK for Android/iOS
3. Create API key
4. Replace in manifest files

## 🎯 After Setup:

```bash
# Restore original dependencies
copy pubspec_original.yaml pubspec.yaml
flutter pub get

# Run on Android
flutter run -d android

# Run on iOS  
flutter run -d ios

# Run on Web
flutter run -d chrome
```

## 📋 Firestore Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /vendors/{vendorId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /products/{productId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**The app is ready to run once you add real Firebase credentials!**