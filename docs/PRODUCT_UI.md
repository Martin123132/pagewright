# Product UI Direction

## Intent

Pagewright should feel open and explorable while still making the correct path obvious. Users can jump to any operation, but the interface always shows the next useful action.

## Primary Surface

The first product surface is a local web workbench served by the FastAPI app:

- Operation rail on the left for free-roam switching.
- Job stage in the center for files, settings, run state, and results.
- Path rail on the right for guided progress.
- Sample-run affordance for every tool so new users can see a real output immediately.
- Compact route compare mode for users who know the result they want but not the operation name.
- Recent-output rail for quickly returning to finished jobs.
- Bundle download for multi-output jobs so users can claim a whole result set in one move.
- Ordered staging controls so merge/image workflows are explicit and adjustable before running.
- D-drive storage status visible in the chrome.

## Design System

- Background: cool near-white work surface.
- Chrome: ink-black rail, white panels, thin graphite borders.
- Accents: pagewright red for primary action, amber for active path, green for completed outputs.
- Radius: 8px or less.
- Type: system UI stack with tight product-control sizing.
- Icons: compact inline SVG controls with consistent 1.8px stroke.
- Motion: short, purposeful transitions only.

## Product Principles

- The usable tool is the first screen.
- No marketing hero.
- No page caps, upload anxiety, watermark framing, or subscription copy.
- Clear local status: files stay on this machine and output paths are D-scoped.
- Empty states should be calm and actionable, not explanatory essays.
