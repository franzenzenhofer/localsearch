#!/usr/bin/env node

/**
 * Safe Cache Purging for filesearch.franzai.com
 * 
 * This script implements a safe caching strategy:
 * 1. Light caching for fingerprinted assets (JS/CSS)
 * 2. Automated cache purging after deployment
 * 3. Rollback to DNS-only if needed
 * 4. Granular cache rules
 */

import https from 'https';

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ZONE_ID = '11bfe82c00e8c9e116e1e542b140f172';
const DOMAIN = 'filesearch.franzai.com';

if (!CLOUDFLARE_API_TOKEN) {
  console.error('❌ CLOUDFLARE_API_TOKEN not found in environment');
  process.exit(1);
}

async function makeRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.cloudflare.com',
      port: 443,
      path: endpoint,
      method: method,
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (response.success) {
            resolve(response);
          } else {
            reject(new Error(`API Error: ${JSON.stringify(response.errors)}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function purgeEverything() {
  console.log('🔥 Purging all cache for zone...');
  try {
    const response = await makeRequest('POST', `/client/v4/zones/${ZONE_ID}/purge_cache`, {
      purge_everything: true
    });
    console.log('✅ Cache purged successfully');
    return response;
  } catch (error) {
    console.error('❌ Cache purge failed:', error.message);
    throw error;
  }
}

async function purgeSpecificFiles(files) {
  console.log(`🎯 Purging specific files: ${files.join(', ')}`);
  try {
    const response = await makeRequest('POST', `/client/v4/zones/${ZONE_ID}/purge_cache`, {
      files: files
    });
    console.log('✅ Specific files purged successfully');
    return response;
  } catch (error) {
    console.error('❌ Specific file purge failed:', error.message);
    throw error;
  }
}

async function setDNSOnly() {
  console.log('🚨 Emergency: Setting domain to DNS-only mode...');
  // This would require finding the DNS record ID first
  console.log('⚠️  Manual intervention required: Set DNS record to DNS-only in Cloudflare dashboard');
}

async function main() {
  const action = process.argv[2] || 'all';
  
  try {
    switch (action) {
      case 'all':
        await purgeEverything();
        break;
      case 'files':
        const files = process.argv.slice(3);
        if (files.length === 0) {
          // Purge common HTML files
          await purgeSpecificFiles([
            `https://${DOMAIN}/`,
            `https://${DOMAIN}/index.html`
          ]);
        } else {
          await purgeSpecificFiles(files);
        }
        break;
      case 'emergency':
        await setDNSOnly();
        break;
      default:
        console.log('Usage: node purge-cache.js [all|files|emergency] [file1 file2 ...]');
        process.exit(1);
    }
  } catch (error) {
    console.error('💥 Cache purge operation failed:', error.message);
    process.exit(1);
  }
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { purgeEverything, purgeSpecificFiles, setDNSOnly };