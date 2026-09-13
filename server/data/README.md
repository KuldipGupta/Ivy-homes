# Ivy Homes Empirical Dataset Cache

This directory holds the empirical datasets fetched directly from the upstream Ivy Homes API (`https://solve.ivy.homes`) using the script `server/src/scripts/fetchAllData.js`.

## Dataset Inventory
- `listings.json`: All 4,700 sale listings retrieved using continuous offset pagination (`offset=0,50,...`). Includes active, inactive, duplicate, corrupt, and advance-fee scam records.
- `rentals.json`: 1,900 residential rental units in Bangalore, including 176 units in Sarjapur Road.
- `projects.json`: 520 residential builder developments with pricing data normalized from Lakhs and Crores into standard INR.

## Refreshing Data
To refresh or re-pull fresh records from the upstream API:
```bash
npm run fetch-data
```
