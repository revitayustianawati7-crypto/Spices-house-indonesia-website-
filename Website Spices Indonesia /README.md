# Spices House Indonesia Website

Full-stack B2B website for Indonesian spices export with lead capture endpoint.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start server:

```bash
npm run dev
```

3. Open:

`http://localhost:3000`

## Lead capture endpoint

- `POST /api/inquiries`
- Saves inquiries to `data/inquiries.jsonl`
- Optional webhook forwarding with `SALES_WEBHOOK_URL`

### Optional environment variables

- `PORT` (default `3000`)
- `SALES_WEBHOOK_URL` (forward every RFQ to CRM/automation webhook)
