import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', '..', 'data');

const BASE_URL = process.env.IVY_API_BASE_URL || 'https://solve.ivy.homes';
const API_KEY = process.env.IVY_API_KEY || 'IVY26-8C91903DE8E1';

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

async function getAuthToken() {
  console.log('[Auth] Logging in to Ivy Homes API...');
  const res = await axios.post(`${BASE_URL}/auth/login`, {
    email: 'demo1@ivy.homes',
    password: '2d172eb5da'
  }, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    }
  });
  return res.data.access_token;
}

async function fetchEndpointAll(endpoint, outFile, token) {
  console.log(`[Fetch] Fetching all records from ${endpoint}...`);
  const allRecords = [];
  let offset = 0;
  const limit = 50;

  while (true) {
    try {
      const res = await axios.get(`${BASE_URL}${endpoint}?offset=${offset}&limit=${limit}`, {
        headers: {
          'X-API-Key': API_KEY,
          'Authorization': `Bearer ${token}`
        }
      });

      const data = res.data;
      const results = data.results || [];
      allRecords.push(...results);

      if (results.length === 0 || data.has_more === false) {
        break;
      }

      offset += limit;
      await new Promise(r => setTimeout(r, 40));
    } catch (err) {
      console.error(`[Fetch Error] at offset ${offset}:`, err.response?.data || err.message);
      break;
    }
  }

  const filePath = path.join(dataDir, outFile);
  fs.writeFileSync(filePath, JSON.stringify(allRecords, null, 2));
  console.log(`[Saved] ${allRecords.length} records saved to ${outFile}`);
  return allRecords;
}

async function main() {
  try {
    const token = await getAuthToken();
    console.log('[Auth] Logged in successfully.');

    await fetchEndpointAll('/v1/listings', 'listings.json', token);
    await fetchEndpointAll('/v1/rentals', 'rentals.json', token);
    await fetchEndpointAll('/v1/projects', 'projects.json', token);

    console.log('[Complete] Full dataset updated successfully.');
  } catch (err) {
    console.error('[Error in fetchAllData]:', err.message);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
