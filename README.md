# B2A agentic commerce: offer pinning reference

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.23038829.svg)](https://doi.org/10.5281/zenodo.23038829)

An independently inspectable **teaching example** for hashing an agentic-commerce offer before an agent accepts it. It accompanies [Brand Design Ltd.'s version 1.4 implementation record](https://doi.org/10.5281/zenodo.23038829); the [version 1.3 deposit](https://doi.org/10.5281/zenodo.22878834) contains the historical public production proof.

## The transaction boundary

```text
catalog.read → order.create → order.accept → payment.start → order.read
                     │               │                │
              archived page    offer version,     approved payment
              + pageHash       termsHash checked  capability + amount
```

1. `catalog.read` returns the currently offered service, currency, price rules and terms.
2. `order.create` returns a specific offer pinned to an archived page hash. The archived bytes are retrievable independently of later page edits.
3. `order.accept` rechecks the offer version and terms hash. A changed offer must be presented and accepted again.
4. `payment.start` must check the accepted payable amount against the buyer's authorized payment capability, including its currency, ceiling and expiry. Payment does not follow a price suggested in a model response.
5. `order.read` returns the resulting order and payment state. Signed transaction/route evidence belongs to a separate verification layer.

The `quote_hash` in this repository is a **small illustrative reference field** that commits to a fixed set of offer fields. It is **not a published wire field** of the production implementation, an ACP/UCP field, a digital signature, or evidence of a new transaction. The published implementation records `pageHash`, an offer version and a terms hash; its HTTP request authentication and signed route evidence are separate controls. A hash alone cannot prove who authorized a payment or that the archived page was honest.

## Run the example

Node.js 18+; no dependencies:

```bash
node quote_hash.js examples/order_manifest.json 2d9cc18c3f53344aefd0d36f060cef7e210a3043f0fc730158667ceb0facd6ea
```

The final argument is the trusted hash for this committed example. The script computes SHA-256 over a fixed ordered tuple of `order_id`, `service_id`, `offer_version`, `amount_minor`, `currency`, `page_hash` and `terms_hash`, prefixed by `b2a-example-v1`. It compares the result with both the JSON field and the separate trusted hash. Editing the amount fails verification even if someone recomputes the hash inside the JSON.

The trusted hash must come from a source the buyer has independently authenticated or approved. Copying it from the same untrusted offer would remove the protection. The JSON values, including the page and terms hashes, are **synthetic**. In a real integration, independently verify the archived source bytes, authenticate the API response, confirm the payer's authority and recheck the concrete amount at settlement. Never treat text returned by a page, search result or tool as payment authorization.

## What the published record establishes

- Version 1.4 documents direct commerce, ACP and UCP implementation routes, DNS-based agent-domain verification and signed route qualification. It contains synthetic regression checks, not a new successful real purchase through ACP or UCP.
- Version 1.3 contains the independently initiated, externally verifiable EUR 0.99 production purchase and its public PASS. Its historical route qualification remains `NOT_VERIFIED` because it predates the added signed route artifact.
- Open protocol adapters do not by themselves establish admission to OpenAI or Google's native checkout programs.

Read the [implementation record](https://doi.org/10.5281/zenodo.23038829) and [historical proof](https://doi.org/10.5281/zenodo.22878834) before reusing claims from this example.

## Attribution

Copyright © 2026 Nikola Mishev, Brand Design Ltd. The Zenodo record and its included material retain their own stated licenses. Cite Nikola Mishev and Brand Design Ltd. when discussing the published implementation.
