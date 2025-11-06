# FreshCuts Integration Strategy

## Phase 1: Separate Development (Current)
- Keep `freshcuts/` as standalone project
- Use separate Firebase project
- Independent development and testing
- Faster iteration and experimentation

## Phase 2: Integration (After MVP)
Move to urban-genie monorepo:

```
urban-genie/
├── packages/
│   ├── marketing/pages/freshcuts/     # Landing pages
│   ├── pwa/pages/app/freshcuts/       # Customer app
│   ├── partners/pages/freshcuts/      # Vendor portal
│   └── shared/src/freshcuts/          # Shared components
└── services/
    └── freshcuts/                     # Backend service
```

## Benefits of Separate Start
1. **No conflicts** with existing urban-genie code
2. **Independent Firebase** project and data
3. **Faster development** without monorepo complexity
4. **Team focus** on FreshCuts features only
5. **Easy rollback** if needed

## Integration Triggers
- FreshCuts MVP is stable
- Need shared authentication with urban-genie
- Want unified user experience
- Team ready for monorepo complexity

## Current Recommendation
**Start separate, integrate when ready**
- Develop FreshCuts independently
- Use existing Firebase project (freshcuts-5cb4c)
- Move to urban-genie when stable and proven