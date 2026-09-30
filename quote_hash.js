// Synthetic reference only: not a Brand Design production wire schema.
const fs = require('node:fs');
const crypto = require('node:crypto');

const file = process.argv[2] || 'examples/order_manifest.json';
const trustedHash = process.argv[3];
if (!/^[0-9a-f]{64}$/.test(trustedHash || '')) {
  console.error('Usage: node quote_hash.js <manifest.json> <trusted_quote_hash>');
  process.exit(2);
}
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
    ![offer.order_id, offer.service_id, offer.offer_version]
      .every(value => typeof value === 'string' && value.length > 0) ||
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
    !crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(offer.quote_hash, 'hex')) ||
    !crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(trustedHash, 'hex'))) {
  console.error('FAIL: offer does not match the trusted commitment');
  process.exit(1);
}
console.log('PASS: synthetic offer matches the trusted quote_hash');
