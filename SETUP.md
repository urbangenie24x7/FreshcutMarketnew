# FreshCuts Setup Guide

## Firebase Configuration

1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project named "FreshCuts"

2. **Add Android App:**
   - Package name: `com.freshcuts.app`
   - Download `google-services.json`
   - Place in `android/app/` directory

3. **Add iOS App:**
   - Bundle ID: `com.freshcuts.app`
   - Download `GoogleService-Info.plist`
   - Place in `ios/Runner/` directory

4. **Enable Firebase Services:**
   - Authentication (Email/Password)
   - Firestore Database
   - Storage

## Google Maps Setup

1. **Get API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Maps SDK for Android/iOS
   - Create API key

2. **Add to Android:**
   - Add to `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <meta-data android:name="com.google.android.geo.API_KEY"
              android:value="YOUR_API_KEY"/>
   ```

3. **Add to iOS:**
   - Add to `ios/Runner/AppDelegate.swift`:
   ```swift
   GMSServices.provideAPIKey("YOUR_API_KEY")
   ```

## Run Commands

```bash
# Install dependencies
flutter pub get

# Run on device
flutter run

# Build APK
flutter build apk

# Build iOS
flutter build ios
```

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /vendors/{vendorId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /products/{productId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.vendorId;
    }
    
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.customerId || 
         request.auth.uid == resource.data.vendorId);
    }
  }
}
```