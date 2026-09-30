// Synthetic reference only: not a Brand Design production wire schema.
const fs = require('node:fs');
const crypto = require('node:crypto');

const file = process.argv[2] || 'examples/order_manifest.json';
const offer = JSON.parse(fs.readFileSync(file, 'utf8'));
const fields = [
  'b2a-example-v1',
  offer.order_id,
  offer.service_id,
  offer.offer_version,
  offer.amount_minor,
  offer.currency,
  offer.page_hash,
  offer.terms_hash,
];

if (offer.example_only !== true ||
    !Number.isSafeInteger(offer.amount_minor) || offer.amount_minor <= 0 ||
    !['EUR', 'USD', 'GBP'].includes(offer.currency) ||
    fields.slice(1).some(value => value === undefined || value === null) ||
    !/^[0-9a-f]{64}$/.test(offer.page_hash) ||
    !/^[0-9a-f]{64}$/.test(offer.terms_hash)) {
  throw new Error('Invalid synthetic example manifest');
}

const computed = crypto.createHash('sha256')
  .update(JSON.stringify(fields), 'utf8').digest('hex');
console.log(`computed quote_hash: ${computed}`);
if (!/^[0-9a-f]{64}$/.test(offer.quote_hash) ||
    !crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(offer.quote_hash, 'hex'))) {
  console.error('FAIL: committed offer fields have changed');
  process.exit(1);
}
console.log('PASS: synthetic offer matches quote_hash');
