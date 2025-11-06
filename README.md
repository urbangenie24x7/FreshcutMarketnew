# FreshCuts - Local Meat Vendor Marketplace

A Next.js web application connecting customers with local meat vendors within a 3-5km radius. Built with Firebase backend and Cloudinary image storage.

## 🚀 Features

### Customer Features
- Location-based vendor discovery
- Browse products by category (Chicken, Mutton, Fish, Prawns, Crabs, Eggs)
- Product variations (weight, size, quantity)
- Shopping cart and order management
- Real-time vendor availability

### Vendor Features
- Product pricing and availability management
- Order management dashboard
- Delivery options configuration
- Sales analytics

### Admin Features
- Vendor onboarding and management
- Product catalog management with Cloudinary image upload
- Platform margin settings
- Comprehensive product CRUD operations

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Image Storage**: Cloudinary
- **State Management**: React Context
- **Icons**: Heroicons
- **Mobile**: Capacitor (iOS/Android ready)

## 📱 Project Structure

```
freshcuts-web/
├── components/          # Reusable UI components
├── lib/                # Firebase config & utilities
├── pages/
│   ├── admin/          # Admin dashboard
│   ├── customer/       # Customer marketplace
│   └── vendor/         # Vendor management
├── public/             # Static assets
└── styles/             # Global styles
```

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/urbangenie24x7/freshcuts.git
   cd freshcuts/freshcuts-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   ```
   Add your Firebase and Cloudinary credentials to `.env.local`

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Firebase Setup
- Create Firebase project
- Enable Authentication, Firestore, Storage
- Add web app configuration to `.env.local`

### Cloudinary Setup
- Create Cloudinary account
- Add cloud name and API key to `.env.local`
- Configure upload preset "Freshcuts"

## 📦 Available Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - ESLint check
- `npm run cap:android` - Build for Android
- `npm run cap:ios` - Build for iOS

## 🗄️ Database Collections

- `users` - User profiles and authentication
- `vendors` - Vendor shop details and settings
- `products` - Product catalog with variations
- `orders` - Order transactions and tracking

## 🎯 Key Features

### Product Variations System
- Weight-based pricing for chicken/mutton
- Size options for prawns and fish
- Quantity-based pricing for eggs
- Dynamic price calculation

### Delivery Options
- Free delivery
- Fixed delivery charges
- Conditional free delivery above minimum order

### Admin Product Management
- Category-based organization
- Image upload and management
- Product duplication
- Variations editing
- CRUD operations

## 🔐 User Roles

- **Customer**: Browse, shop, order tracking
- **Vendor**: Product management, order fulfillment
- **Admin**: System management, vendor onboarding

## 📱 Mobile Ready

Built with Capacitor for native iOS and Android deployment:
```bash
npm run cap:android  # Android build
npm run cap:ios      # iOS build
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

For support, email support@freshcuts.com or create an issue on GitHub.