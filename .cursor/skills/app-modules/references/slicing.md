# Slicing

[placement](placement.md) · [baseline](baseline.md#scaffold-order-workspace) · record shape [layout](layout.md#record-feature)

Create `modules/<feature>/` only when ([architecture](architecture.md) — avoid micro-modules):

1. Distinct `lib/state.ts` record type  
2. List, detail, or form route (usually all three)  
3. `messages` namespace in `en` + `vi`  

Else: `modules/ui/` or parent feature.

Merge when same record was split by mistake. Cross-imports → portal first, not merge by default.

## Checklist

```text
- [ ] placement decision tree
- [ ] layout record shape + thin app page
- [ ] imports matrix
- [ ] en + vi messages
- [ ] portal register if portal/ exists ([portal](portal.md))
- [ ] npm run check
```

Monorepo: [ecosystem](ecosystem.md) before `packages/`.
