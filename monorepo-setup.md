# FreshCuts Monorepo Integration

## Structure
```
packages/
├── marketing/pages/freshcuts/          # SEO landing pages
├── pwa/pages/app/freshcuts/           # Customer app
├── partners/pages/dashboard/freshcuts/ # Vendor portal
└── shared/src/freshcuts/              # Shared components
```

## Firebase Integration
- Reuse existing Firebase project: `freshcuts-5cb4c`
- Same Firestore collections
- Shared authentication across packages

## Key Benefits
1. **SEO**: Marketing site for organic discovery
2. **PWA**: App-like experience for customers  
3. **Vendor Portal**: Separate interface for vendors
4. **Shared Code**: Common components and utilities
5. **Single Backend**: One Firebase project

## Migration Steps
1. Move Flutter models to `packages/shared/src/freshcuts/types/`
2. Create Next.js pages in respective packages
3. Setup Firebase config in `packages/shared/src/firebase/`
4. Implement phone auth in PWA package
5. Build vendor dashboard in partners package

## Deployment
- Marketing: Vercel (urbangenie24x7.com/freshcuts)
- PWA: Vercel (app.urbangenie24x7.com/freshcuts)  
- Partners: Vercel (partners.urbangenie24x7.com/freshcuts)
- Mobile: Capacitor build from PWA