# FreshCuts App - Test Data

## 📱 Test Phone Numbers (India)

### For Testing SMS/Phone Authentication:
```
+91 98765 43210    - Customer Test Account (Mumbai)
+91 87654 32109    - Vendor Test Account (Mumbai)
+91 99887 76543    - Customer Test Account (Delhi)
+91 88776 65432    - Vendor Test Account (Delhi)
+91 77665 54321    - Customer Test Account (Bangalore)
+91 66554 43210    - Vendor Test Account (Bangalore)
+91 95555 12345    - Admin Test Account
```

### Alternative India Numbers:
```
+91 90123 45678    - Customer (Chennai)
+91 89012 34567    - Vendor (Chennai)
+91 78901 23456    - Customer (Pune)
+91 67890 12345    - Vendor (Pune)
```

## 👤 Test User Accounts

### Customer Accounts:
```
Email: customer1@freshcuts.com
Phone: +91 98765 43210
Password: test123456
Type: Customer
Location: Mumbai

Email: customer2@freshcuts.com  
Phone: +91 99887 76543
Password: test123456
Type: Customer
Location: Delhi
```

### Vendor Accounts:
```
Email: vendor1@freshcuts.com
Phone: +91 87654 32109
Password: test123456
Type: Vendor
Shop: Fresh Meat Corner
Location: Mumbai

Email: vendor2@freshcuts.com
Phone: +91 88776 65432
Password: test123456
Type: Vendor
Shop: Delhi Meat Shop
Location: Delhi
```

## 🏪 Test Vendor Data

### Vendor 1 - Fresh Meat Corner (Mumbai)
```
Location: 19.0760° N, 72.8777° E
Address: Linking Road, Bandra West, Mumbai, Maharashtra 400050
Phone: +91 87654 32109
Categories: Mutton, Chicken, Fish
Rating: 4.5 stars
Total Orders: 156
```

### Vendor 2 - Delhi Meat Shop (Delhi)
```
Location: 28.6139° N, 77.2090° E
Address: Connaught Place, New Delhi, Delhi 110001
Phone: +91 88776 65432
Categories: Chicken, Fish, Eggs
Rating: 4.2 stars
Total Orders: 89
```

### Vendor 3 - Bangalore Butcher (Bangalore)
```
Location: 12.9716° N, 77.5946° E
Address: MG Road, Bangalore, Karnataka 560001
Phone: +91 66554 43210
Categories: Mutton, Chicken, Fish
Rating: 4.7 stars
Total Orders: 203
```

## 🥩 Test Product Data

### Mutton Products:
```
- Fresh Mutton Curry Cut - ₹650/kg
- Mutton Leg Piece - ₹680/kg  
- Mutton Liver - ₹420/kg
- Mutton Ribs - ₹620/kg
- Mutton Keema - ₹580/kg
```

### Chicken Products:
```
- Whole Chicken - ₹180/kg
- Chicken Breast - ₹220/kg
- Chicken Drumsticks - ₹200/kg
- Chicken Wings - ₹160/kg
```

### Fish Products:
```
- Fresh Pomfret - ₹350/kg
- Kingfish Steaks - ₹280/kg
- Prawns Large - ₹450/kg
- Fish Curry Cut - ₹200/kg
```

### Egg Products:
```
- Farm Fresh Eggs - ₹6/piece
- Brown Eggs - ₹7/piece
- Duck Eggs - ₹12/piece
- Quail Eggs - ₹3/piece
```

## 📦 Test Order Data

### Sample Orders:
```
Order #1001:
- Customer: customer1@freshcuts.com
- Vendor: Fresh Meat Corner
- Items: Chicken 1kg (₹180), Eggs 12pcs (₹72)
- Total: ₹252
- Status: Delivered

Order #1002:
- Customer: customer2@freshcuts.com  
- Vendor: Quality Butcher Shop
- Items: Fish 500g (₹100), Prawns 250g (₹112)
- Total: ₹212
- Status: Preparing
```

## 🗺️ Test Location Data

### Customer Locations:
```
Customer 1: 19.0760° N, 72.8777° E (Mumbai - Bandra West)
Customer 2: 28.6139° N, 77.2090° E (Delhi - Connaught Place)
Customer 3: 12.9716° N, 77.5946° E (Bangalore - MG Road)
Customer 4: 13.0827° N, 80.2707° E (Chennai - T Nagar)
```

### Vendor Locations (within 5km radius):
```
Mumbai Area:
- Vendor 1: 19.0760° N, 72.8777° E (Bandra West)
- Vendor 2: 19.0728° N, 72.8826° E (Khar West)
- Vendor 3: 19.0596° N, 72.8295° E (Juhu)

Delhi Area:
- Vendor 4: 28.6139° N, 77.2090° E (Connaught Place)
- Vendor 5: 28.6328° N, 77.2197° E (Karol Bagh)
- Vendor 6: 28.5494° N, 77.2001° E (Lajpat Nagar)

Bangalore Area:
- Vendor 7: 12.9716° N, 77.5946° E (MG Road)
- Vendor 8: 12.9698° N, 77.5986° E (Brigade Road)
- Vendor 9: 12.9279° N, 77.6271° E (Koramangala)
```

## 🔐 Firebase Test Configuration

### Test Project Settings:
```
Project ID: freshcuts-test
Project Number: 123456789012
Web App ID: 1:123456789012:web:abcdef1234567890
Android Package: com.freshcuts.app
iOS Bundle ID: com.freshcuts.app
```

## 📱 Testing Scenarios

### Customer Flow:
1. Sign up with customer1@freshcuts.com
2. Allow location access
3. Browse "Chicken" category  
4. Add items to cart
5. Place order
6. Track order status

### Vendor Flow:
1. Sign up with vendor1@freshcuts.com
2. Setup shop profile
3. Add products with images
4. Receive order notification
5. Update order status
6. View analytics

**Use these test credentials to verify all app functionality!**