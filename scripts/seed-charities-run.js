const https = require('https');

const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0emNwemd1ZmN2b3NpampoaXJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDg2MjY2NywiZXhwIjoyMDkwNDM4NjY3fQ.AFQIJXoVHrnoFS8Zq4ElKWFT0FJ5jkHWDpSs8sYw7jQ';

const charities = [
  { name: 'Red Cross', description: 'International humanitarian organization', slug: 'red-cross', category: 'Healthcare', featured: true, status: 'active' },
  { name: 'World Wildlife Fund', description: 'Conserving nature globally', slug: 'wwf', category: 'Environment', featured: true, status: 'active' },
  { name: 'Doctors Without Borders', description: 'Medical humanitarian organization', slug: 'doctors-without-borders', category: 'Healthcare', featured: false, status: 'active' },
  { name: 'Local Food Bank', description: 'Community food assistance program', slug: 'local-food-bank', category: 'Social', featured: false, status: 'active' },
  { name: 'Childrens Cancer Research Fund', description: 'Funding innovative research', slug: 'childrens-cancer-fund', category: 'Healthcare', featured: true, status: 'active' },
  { name: 'Ocean Cleanup Initiative', description: 'Protecting oceans from pollution', slug: 'ocean-cleanup', category: 'Environment', featured: false, status: 'active' }
];

const body = JSON.stringify(charities);

const options = {
  hostname: 'vtzcpzgufcvosijjihirj.supabase.co',
  port: 443,
  path: '/rest/v1/charities',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + serviceRoleKey,
    'Content-Length': body.length,
    'Prefer': 'return=representation'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { 
    console.log('Status:', res.statusCode);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('✓ Charities seeded successfully!');
    } else {
      console.log('Response:', data);
    }
  });
});

req.on('error', (e) => { console.error('Error:', e); });
req.write(body);
req.end();
