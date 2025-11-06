# FreshCuts Deployment Guide

## Production Checklist

### 1. Firebase Configuration
- [ ] Add `google-services.json` to `android/app/`
- [ ] Add `GoogleService-Info.plist` to `ios/Runner/`
- [ ] Configure Firestore security rules
- [ ] Enable Firebase Authentication
- [ ] Set up Firebase Storage

### 2. Google Maps Setup
- [ ] Get Google Maps API key
- [ ] Add API key to `android/app/src/main/AndroidManifest.xml`
- [ ] Add API key to `ios/Runner/AppDelegate.swift`
- [ ] Enable Maps SDK for Android/iOS

### 3. App Icons & Branding
- [ ] Replace app icons in `android/app/src/main/res/`
- [ ] Replace app icons in `ios/Runner/Assets.xcassets/`
- [ ] Update app name in configurations

### 4. Build Configuration
```bash
# Android Release Build
flutter build apk --release
flutter build appbundle --release

# iOS Release Build
flutter build ios --release
```

### 5. Store Deployment
- [ ] Create Google Play Console account
- [ ] Create Apple Developer account
- [ ] Upload to respective stores
- [ ] Configure app store listings

### 6. Environment Variables
Create `.env` file:
```
GOOGLE_MAPS_API_KEY=your_api_key_here
FIREBASE_PROJECT_ID=your_project_id
```

### 7. Performance Optimization
- [ ] Enable code obfuscation
- [ ] Optimize images
- [ ] Test on various devices
- [ ] Performance profiling

### 8. Security
- [ ] Review Firestore rules
- [ ] Implement proper authentication
- [ ] Secure API endpoints
- [ ] Test security vulnerabilities

## Production Commands

```bash
# Clean build
flutter clean
flutter pub get

# Build for production
flutter build apk --release --obfuscate --split-debug-info=build/debug-info
flutter build appbundle --release --obfuscate --split-debug-info=build/debug-info

# iOS build
flutter build ios --release --obfuscate --split-debug-info=build/debug-info
```

## Monitoring & Analytics
- Set up Firebase Analytics
- Configure Crashlytics
- Monitor app performance
- Track user engagement