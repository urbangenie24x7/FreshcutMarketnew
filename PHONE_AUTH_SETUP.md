# 📱 Phone OTP Authentication Setup

## ✅ Updated Authentication Flow

The app now uses **Phone + OTP + Password** authentication instead of email:

### **New Authentication Flow:**
1. **Enter Phone Number** (+91 format)
2. **Enter Name & Select Account Type** (Customer/Vendor)
3. **Receive OTP** via SMS
4. **Verify OTP** to complete registration/login

### **Files Updated:**
- ✅ `AuthProvider` - Added `sendOTP()` and `verifyOTP()` methods
- ✅ `PhoneAuthScreen` - Phone number input with name and type
- ✅ `OTPVerificationScreen` - 6-digit OTP verification
- ✅ `AuthWrapper` - Routes to phone auth instead of email
- ✅ `UserModel` - Email field now optional

### **Firebase Console Setup:**

1. **Enable Phone Authentication:**
   - Go to [Firebase Console](https://console.firebase.google.com/project/freshcuts-5cb4c)
   - Authentication → Sign-in method
   - Enable "Phone" provider

2. **Add Test Phone Numbers (Optional):**
   ```
   +91 98765 43210 → OTP: 123456
   +91 87654 32109 → OTP: 654321
   ```

### **Test the Flow:**

1. **Run the App:**
   ```bash
   flutter run -d android
   ```

2. **Test Registration:**
   - Enter: `+91 98765 43210`
   - Name: `Test Customer`
   - Type: `Customer`
   - Tap "Send OTP"
   - Enter received OTP
   - Tap "Verify & Continue"

### **Indian Phone Numbers Supported:**
```
+91 98765 43210    - Customer Test
+91 87654 32109    - Vendor Test
+91 99887 76543    - Customer Delhi
+91 88776 65432    - Vendor Delhi
```

### **Features:**
- ✅ Phone number validation (+91 format)
- ✅ OTP auto-detection (Android)
- ✅ Resend OTP functionality
- ✅ User type selection (Customer/Vendor)
- ✅ Automatic login after verification
- ✅ No email required

**The app now uses modern phone-based authentication perfect for Indian users! 🇮🇳📱**