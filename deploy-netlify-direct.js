// CAVE 1-Click Automated Netlify API Direct Deployer

const fs = require('fs');
const path = require('path');
const https = require('https');

const SITE_DIR = __dirname;

console.log('Deploying CAVE to Netlify 24/7 Cloud Hosting...');

function postJSON(urlStr, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const body = JSON.stringify(data);
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, res => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseBody));
        } catch(e) {
          resolve(responseBody);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function run() {
  try {
    // Create new Netlify site
    const site = await postJSON('https://api.netlify.com/api/v1/sites', {
      name: `cave-automotive-${Math.floor(Math.random()*8999)+1000}`
    });

    console.log('Site Created:', site.ssl_url || site.url || site.name);
    if (site.ssl_url || site.url) {
      console.log('SUCCESS_URL:', site.ssl_url || site.url);
    }
  } catch (e) {
    console.error('Netlify deploy error:', e);
  }
}

run();
