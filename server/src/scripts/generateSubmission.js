import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { computeAnswers } from './calculateAnswers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getVerifiedFindings() {
  return [
    {
      endpoint: "/auth/login",
      category: "auth",
      documented: "Token expires in 86400 seconds (24 hours). There is no refresh flow. Response returns user with name and email.",
      actual: "Token expires in 900 seconds (15 minutes). Server returns refresh_token with refresh_url: /auth/refresh. User object contains only email, omitting name.",
      how_found: "Called POST /auth/login during authentication flow investigation and inspected JSON response fields.",
      impact: "User sessions expire silently after 15 minutes unless the undocumented refresh endpoint is handled. User display name cannot be sourced from login response.",
      evidence: []
    },
    {
      endpoint: "*",
      category: "auth",
      documented: "Every request must carry the API key appended as a query parameter: ?api_key=IVY26-XXXXXXXXXXXX",
      actual: "Passing api_key as a query parameter returns 401 Unauthorized with message 'send your key in the X-API-Key request header, not as a query parameter'.",
      how_found: "Invoked /health and /auth/login with query parameter and captured 401 error response detail.",
      impact: "Any client implementing the documented query parameter authentication fails completely on every request.",
      evidence: []
    },
    {
      endpoint: "/auth/logout",
      category: "auth",
      documented: "POST /auth/logout invalidates the current token server side.",
      actual: "Server returns { ok: true, note: 'tokens are stateless; discard them client side' } without server-side session invalidation.",
      how_found: "Called POST /auth/logout with active bearer token and inspected response body and repeated subsequent calls with the same token.",
      impact: "Logout must be enforced on the client side by clearing persisted storage; tokens remain cryptographically valid until JWT expiration.",
      evidence: []
    },
    {
      endpoint: "/v1/listings",
      category: "pagination",
      documented: "Every collection endpoint takes page (default 1) and limit (default 20, max 200). Response has total, page, page_size, results.",
      actual: "Server completely ignores 'page' parameter and requires 'offset'. Default and maximum limit is 50 (limits > 50 are capped at 50). Response format returns limit, offset, count, total, has_more, results.",
      how_found: "Called /v1/listings with page=2 and limit=200; observed offset remained 0, limit was capped at 50, and response metadata omitted page/page_size.",
      impact: "Clients requesting page-based pagination receive offset 0 repeatedly (endless loop of the first 50 records). Limits above 50 fail silently.",
      evidence: []
    },
    {
      endpoint: "/v1/listings",
      category: "completeness",
      documented: "GET /v1/listings returns only active sale listings in your city. Inactive, expired and withdrawn listings are excluded server side.",
      actual: "Endpoint returns all 4,700 listings in the database, of which 978 records have is_live: false.",
      how_found: "Retrieved complete dataset and inspected is_live boolean distribution across all records.",
      impact: "Client must explicitly filter by is_live or display inactive property status badges to prevent users from viewing withdrawn listings.",
      evidence: [
        "100-1000003",
        "100-1000010",
        "100-1000018",
        "100-1000021",
        "100-1000029",
        "100-1000034",
        "100-1000036",
        "100-1000045",
        "100-1000049",
        "100-1000057"
      ]
    },
    {
      endpoint: "/v1/listings",
      category: "pagination",
      documented: "total is the exact number of records matching your filters. To fetch every record, read total, divide by limit, and request that many pages.",
      actual: "Response metadata reports total: 4381, but paging beyond offset 4350 continues returning valid records until reaching offset 4700 (exactly 4,700 total retrievable records).",
      how_found: "Observed has_more: true at offset 4350 and continued pagination until offset 4650 yielded last records and offset 4700 returned count 0.",
      impact: "Clients relying on total metadata terminate pagination early and drop 319 active and valid listing records.",
      evidence: []
    },
    {
      endpoint: "/v1/listing/{id}",
      category: "missing_endpoint",
      documented: "GET /v1/listing/{listing_id} returns a single listing.",
      actual: "GET /v1/listing/{listing_id} returns 404 Not Found. The working endpoint is plural: GET /v1/listings/{listing_id}.",
      how_found: "Attempted fetching individual listings via singular path and reproduced 404; succeeded using plural path.",
      impact: "Direct listing detail page loads break with 404 errors if using the documented singular route.",
      evidence: [
        "MAG-1002627",
        "100-1002951",
        "DWE-1000041"
      ]
    },
    {
      endpoint: "/v1/listings/{id}/similar",
      category: "missing_endpoint",
      documented: "GET /v1/listings/{listing_id}/similar returns up to ten comparable listings.",
      actual: "Both /v1/listings/{listing_id}/similar and /v1/listing/{listing_id}/similar return 404 Not Found.",
      how_found: "Sent authenticated GET requests to both route variants across multiple valid listing IDs.",
      impact: "Similar properties section cannot rely on upstream API; backend must calculate comparable listings dynamically.",
      evidence: [
        "MAG-1002627",
        "ZER-1000001",
        "100-1000042"
      ]
    },
    {
      endpoint: "/v1/analytics/summary",
      category: "missing_endpoint",
      documented: "GET /v1/analytics/summary returns pre-computed aggregates for your city (total listings, median price, median price per sqft, breakdowns).",
      actual: "GET /v1/analytics/summary returns 404 Not Found. No /analytics or /summary endpoints exist.",
      how_found: "Probed /v1/analytics/summary, /v1/analytics, /analytics/summary, and /analytics; all returned 404.",
      impact: "Insights screen must compute genuine aggregations directly from empirical property datasets on the server.",
      evidence: []
    },
    {
      endpoint: "/v1/favourites",
      category: "missing_endpoint",
      documented: "GET /v1/favourites, POST /v1/favourites with body { id }, and DELETE /v1/favourites/{id} manage user saved properties.",
      actual: "All /v1/favourites and /favourites routes return 404 Not Found.",
      how_found: "Probed GET, POST, and DELETE requests with demo user authentication; received 404 Not Found.",
      impact: "Application-level favorites must be persisted in MongoDB associated with the authenticated user.",
      evidence: []
    },
    {
      endpoint: "/v1/listings",
      category: "filters",
      documented: "GET /v1/listings accepts min_price, max_price, and bedroom query parameters to filter listings.",
      actual: "min_price and max_price query parameters are quietly ignored by the server (total and results remain unchanged). The bedroom parameter is also ignored (bhk must be used instead).",
      how_found: "Queried /v1/listings?min_price=10000000&max_price=15000000 and received identical results and total (4,381) including properties outside the price window.",
      impact: "Listings search interface shows incorrect records unless client/server fallback filtering is applied.",
      evidence: [
        "100-1002346",
        "SQU-1000979",
        "ZER-1001207"
      ]
    },
    {
      endpoint: "/v1/listings",
      category: "sorting",
      documented: "GET /v1/listings accepts order parameter ('asc' or 'desc') for sort_by.",
      actual: "Passing order=desc is quietly ignored; server always returns ascending sort order regardless of the order argument.",
      how_found: "Queried /v1/listings?sort_by=price&order=desc and compared with order=asc; both returned identical items.",
      impact: "Users sorting by highest price or newest listings receive default ascending records unless client/backend sorts locally.",
      evidence: [
        "100-1002346",
        "ZER-1002632",
        "SQU-1002843"
      ]
    },
    {
      endpoint: "/v1/projects",
      category: "units",
      documented: "price_min and price_max are in rupees, integer, everywhere in the API.",
      actual: "In /v1/projects, price_min and price_max are stored as Lakhs (when >= 10) and Crores (when < 10) as floats/integers, not integer Rupees.",
      how_found: "Analyzed all 520 project records. Unconverted price_min exceeded price_max in 372 projects; converting values >= 10 as Lakhs and < 10 as Crores resolved 100% of price discrepancies.",
      impact: "Projects displayed directly with integer rupee formatting would show multi-crore luxury projects as costing ₹2 to ₹99.",
      evidence: [
        "P10001",
        "P10002",
        "P10003",
        "P10004",
        "P10068"
      ]
    },
    {
      endpoint: "/v1/listings",
      category: "units",
      documented: "Area: Square feet, integer, everywhere in the API.",
      actual: "24 listings from MagicHomes (MAG-*) report carpet_area and super_built_up_area in square meters (values 35-49 sqm) rather than square feet.",
      how_found: "Filtered listings with carpet_area < 50; discovered 24 1-BHK/builder floors priced at 35-70 Lakhs with carpet areas between 35 and 49 sqm (376 to 527 sqft).",
      impact: "Displays absurdly small areas (e.g. 40 sqft apartment) and distorts price-per-square-foot calculations by a factor of 10.76 if unnormalized.",
      evidence: [
        "MAG-1000037",
        "MAG-1004584",
        "MAG-1002229",
        "MAG-1001546",
        "MAG-1002335",
        "MAG-1001243",
        "MAG-1003097",
        "MAG-1002011",
        "MAG-1001130",
        "MAG-1003492"
      ]
    },
    {
      endpoint: "/v1/listings",
      category: "duplicates",
      documented: "Every listing_id is globally unique, and each listing corresponds to exactly one physical property.",
      actual: "11 distinct physical properties are duplicated across multiple syndication portals (e.g. dwelling, magichomes, 100acres) with different listing IDs and slightly different pricing.",
      how_found: "Grouped listings by (apartment_name, locality, bedroom, floor, carpet_area, facing_direction) and found 11 multi-record pairs.",
      impact: "Inventory counts overstate the true volume of physical real estate available by 11 units.",
      evidence: [
        "DWE-1000585",
        "MAG-1004441",
        "100-1003687",
        "MAG-1004174",
        "100-1002731",
        "DWE-1004649",
        "100-1003184",
        "MAG-1004533"
      ]
    },
    {
      endpoint: "/v1/projects",
      category: "consistency",
      documented: "total_listings in /v1/projects is the number of listings currently available in the project, recomputed whenever a listing is added or withdrawn, always agreeing with /v1/listings?project_id=...",
      actual: "392 out of 520 projects report a total_listings count that disagrees with the actual number of retrievable listings linked to that project_id.",
      how_found: "Counted retrievable listings grouped by project_id and compared with project.total_listings for each project.",
      impact: "Project detail cards display inaccurate listing counts if trusting the project record rather than real listing data.",
      evidence: [
        "P10001",
        "P10002",
        "P10003",
        "P10004",
        "P10005",
        "P10006",
        "P10007",
        "P10008"
      ]
    },
    {
      endpoint: "/v1/listings",
      category: "data_quality",
      documented: "Every listing corresponds to genuine active property data verified by the operations team.",
      actual: "At least 32 listings describe impossible physical entities: 8 negative prices (-₹7.58M to -₹19.58M), 8 impossible floor numbers (floor > total_floors), 8 with super_built_up_area < carpet_area, and 8 apartments/villas with 0 bedrooms and 0 bathrooms.",
      how_found: "Ran automated validation scripts verifying price > 0, floor <= total_floors, super_built_up_area >= carpet_area, and residential room constraints.",
      impact: "Corrupt records corrupt analytics averages, break UI floor badge logic, and show nonsensical negative pricing to end users.",
      evidence: [
        "100-1002346",
        "DWE-1001165",
        "DWE-1001183",
        "SQU-1000979",
        "MAG-1000179",
        "MAG-1000885",
        "MAG-1003269",
        "ZER-1001249",
        "100-1001077",
        "DWE-1003673"
      ]
    },
    {
      endpoint: "/v1/listings",
      category: "fraud",
      documented: "Descriptions are seller text shown as written, and contact numbers are verified.",
      actual: "92 listings are fraudulent advance-fee bait listings specifically designed to generate fake inquiries, demanding non-refundable booking fees ('Pay a token amount of Rs 25,000 today to block the unit', 'Site visit only after the booking amount is paid', 'Below market price, this week only').",
      how_found: "Identified text pattern clusters demanding advance token and booking amounts prior to property inspection.",
      impact: "Exposes users to real estate advance-fee scams and distorts market valuation metrics if not flagged or filtered.",
      evidence: [
        "100-1000060",
        "100-1000461",
        "100-1000995",
        "100-1001341",
        "100-1001464",
        "100-1001466",
        "100-1001559",
        "100-1001896",
        "100-1002376",
        "100-1002426"
      ]
    }
  ];
}

export function generateSubmission() {
  const answers = computeAnswers();
  const findings = getVerifiedFindings();

  const submission = {
    api_key: "IVY26-8C91903DE8E1",
    candidate: {
      name: "Kuldip Gupta",
      email: "kuldipgupta@mnnit.ac.in",
      repo_url: "https://github.com/KuldipGupta/Ivy-homes",
      demo_url: "https://ivy-homes-marketplace.vercel.app"
    },
    answers,
    findings
  };

  const rootPath = path.join(__dirname, '..', '..', '..', 'submission.json');
  fs.writeFileSync(rootPath, JSON.stringify(submission, null, 2));
  console.log(`Successfully generated submission.json at: ${rootPath}`);
  return submission;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSubmission();
}
