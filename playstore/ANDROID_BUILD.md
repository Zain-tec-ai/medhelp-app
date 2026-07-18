# MedZen Performance Optimization Guide

## Prerequisites

1. **Android Studio** - Download from https://developer.android.com/studio
2. **Java Development Kit (JDK)** - Java 11 or later
3. **Android SDK** - Installed via Android Studio
4. **Node.js & npm** - For building the web app
5. **Capacitor CLI** - `npm install -g @capacitor/cli`

## Setup Steps

### 1. Install Capacitor

```bash
npm install
npm install @capacitor/core @capacitor/cli
```

### 2. Add Android Platform

```bash
npx cap add android
```

This creates an `android/` directory with the native Android project.

### 3. Configure Build

Edit `capacitor.config.json`:

```json
{
  "appId": "com.medzen.app",
  "appName": "MedZen",
  "webDir": "public",
  "plugins": {
    "Camera": {
      "permissions": ["CAMERA", "READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE"]
    }
  }
}
```

### 4. Build Android App

```bash
# Copy web files to Android
npx cap copy android

# Sync dependencies
npx cap sync android

# Open in Android Studio
npx cap open android
```

### 5. Build in Android Studio

1. Open Android Studio
2. Open the `android/` folder
3. Wait for Gradle to sync
4. Build > Build Bundle(s) / APK(s) > Build APK(s)

## Signing the App

### Generate Keystore

```bash
keytool -genkey -v -keystore medzen-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias medzen-app
```

### Sign APK

```bash
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore medzen-release.keystore \
  app-release-unsigned.apk medzen-app
```

### Optimize APK

```bash
zipalign -v 4 app-release-unsigned.apk app-release.apk
```

## Play Store Submission

### 1. Create Google Play Developer Account
- Go to https://play.google.com/console
- Pay $25 registration fee
- Set up billing

### 2. Create App Listing
- App name: "MedZen"
- Category: "Medical"
- Content rating: Complete questionnaire
- Pricing: Free
- Distribution: Available in all countries (or specify)

### 3. Upload APK/Bundle
- Build > Generate Signed Bundle / APK
- Upload to Play Console
- Add screenshots (up to 8)
- Write app description
- Set privacy policy URL
- Review and submit

### Screenshots Requirements
- 1080x1920 pixels
- PNG or JPEG
- Show key app features
- Include text overlays if helpful

### Icon Requirements
- 512x512 pixels
- PNG
- No transparency required

## Version Management

Update in `package.json`:

```json
{
  "version": "1.0.0"
}
```

And in `android/app/build.gradle`:

```gradle
android {
  defaultConfig {
    versionCode 1
    versionName "1.0.0"
  }
}
```

## Testing

### Local Testing
```bash
# Build APK for testing
cd android
./gradlew assembleDebug

# Install on connected device
adb install app/build/outputs/apk/debug/app-debug.apk
```

### Google Play Testing
- Internal testing track (limited testers)
- Closed testing track (private groups)
- Open testing track (public beta)
- Production release

## Troubleshooting

### Build fails with "SDK not found"
- Open Android Studio
- Go to Settings > Appearance & Behavior > System Settings > Android SDK
- Install API level 30 or higher

### App crashes on startup
- Check Android Logcat: `adb logcat`
- Ensure permissions in AndroidManifest.xml
- Verify webDir path in capacitor.config.json

### Camera not working
- Request permissions in AndroidManifest.xml
- Check app permissions in Android settings
- Use proper permission checking APIs

## Optimization Tips

1. **Reduce APK size:**
   - Enable ProGuard/R8 obfuscation
   - Use App Bundle instead of APK
   - Remove unused resources

2. **Improve performance:**
   - Enable code optimization in build.gradle
   - Use native modules for heavy operations
   - Profile with Android Profiler

3. **Better battery life:**
   - Minimize background work
   - Use Capacitor's background task APIs
   - Optimize sensor usage

## Resources

- Capacitor Documentation: https://capacitorjs.com/docs
- Android Studio Guide: https://developer.android.com/studio/intro
- Play Console Help: https://support.google.com/googleplay/android-developer
- Android Security: https://developer.android.com/training/articles/security-tips
