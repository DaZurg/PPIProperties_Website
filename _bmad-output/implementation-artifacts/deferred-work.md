# Deferred Work

This file tracks pre-existing issues and deferred items discovered during code reviews.

## Deferred from: code review of story 3-2-implement-vanilla-javascript-filtering-logic (2026-04-07)

- **Bedrooms filter ineffective with current data** - All properties in properties.json have `bedrooms: 0`, which means any bedroom filter selection will return zero results. This is a data quality issue that needs to be addressed in the data source.

- **Parking counter may inaccurately count features** - The `countParkingSpaces()` function counts features containing "garage", "parking", or "carport" but cannot accurately determine actual parking space count (e.g., "Double Lock-up Garage" counts as 1, not 2).

- **No module export for independent testing** - The filtering functions are encapsulated in an IIFE and not exposed globally. This is a design choice that prioritizes encapsulation over testability. Unit testing can still be done via DOM interaction or by temporarily exposing functions.
