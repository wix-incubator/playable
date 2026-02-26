# Bundle size comparison: Original (Haste) vs New (Rollup)

Comparison of **Original** build (haste-preset-playable: Rollup for core, Webpack for adapters) vs **New** build (Rollup + Terser for all).  
Source: `dist-statics-old` (original) vs `dist-statics-new` (new). JS only, no source maps.

## Size comparison

| Bundle | Original | New | Diff |
|--------|----------|-----|------|
| playable.bundle.js | 663.2 KB | 612.1 KB | **-51 KB (-7.7%)** |
| playable.bundle.min.js | 255.8 KB | 333.1 KB | **+77 KB (+30.2%)** |
| playable-dash.bundle.js | 2.79 MB | 2.31 MB | **-495 KB (-17.3%)** |
| playable-dash.bundle.min.js | 920.2 KB | 870.9 KB | **-49 KB (-5.4%)** |
| playable-hls.bundle.js | 1.74 MB | 1.50 MB | **-248 KB (-14.0%)** |
| playable-hls.bundle.min.js | 653.3 KB | 624.8 KB | **-28 KB (-4.4%)** |

## Summary

- **Development builds (.js):** All three bundles are **smaller** with the new build (−7.7%, −17.3%, −14.0%).
- **Production (playable-dash, playable-hls):** Minified adapter bundles are **smaller** (−5.4%, −4.4%).
- **Production (playable.bundle.min.js):** Core minified bundle is **~30% larger** in the new build (256 KB → 333 KB). Likely causes: different minifier (Terser vs Uglify in the old Rollup preset), different compression options, or less dead-code removal. Worth tuning Terser (e.g. `compress`, `mangle`, `format`) or enabling more aggressive options to try to match or beat the original.

## How to re-run the comparison

```bash
node scripts/compare-bundle-sizes.js dist-statics-old dist/statics
```

(Use `dist-statics-new` instead of `dist/statics` if you kept a copy of the new build there.)
