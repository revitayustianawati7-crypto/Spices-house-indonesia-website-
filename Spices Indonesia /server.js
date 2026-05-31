const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = Number(process.env.PORT) || 3000;
const siteRoot = __dirname;
const dataDirectory = path.join(siteRoot, 'data');
const leadsFilePath = path.join(dataDirectory, 'inquiries.jsonl');
const webhookUrl = process.env.SALES_WEBHOOK_URL || '';

app.use(express.json({ limit: '150kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(siteRoot, { extensions: ['html'] }));

function trimAndLimit(value, limit) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().replace(/\s+/g, ' ').slice(0, limit);
}

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sendSuccessResponse(request, response, payload) {
  const acceptsJson = request.accepts(['json', 'html']) === 'json';
  if (acceptsJson) {
    response.status(200).json(payload);
    return;
  }
  response.redirect('/contact.html?sent=1');
}

app.get('/api/health', (request, response) => {
  response.json({ ok: true, service: 'spices-house-indonesia', timestamp: new Date().toISOString() });
});

app.post('/api/inquiries', async (request, response) => {
  try {
    const fullName = trimAndLimit(request.body.fullName, 90);
    const company = trimAndLimit(request.body.company, 120);
    const email = trimAndLimit(request.body.email, 120).toLowerCase();
    const phone = trimAndLimit(request.body.phone, 40);
    const spice = trimAndLimit(request.body.spice, 40);
    const volume = trimAndLimit(request.body.volume, 40);
    const incoterms = trimAndLimit(request.body.incoterms, 20);
    const destination = trimAndLimit(request.body.destination, 120);
    const message = trimAndLimit(request.body.message, 800);
    const honeypot = trimAndLimit(request.body.website, 120);

    if (honeypot) {
      sendSuccessResponse(request, response, { ok: true, message: 'Thank you. Our team will contact you soon.' });
      return;
    }

    if (!fullName || !email || !spice || !volume) {
      response.status(400).json({ ok: false, message: 'Please complete all required form fields.' });
      return;
    }

    if (!isEmailValid(email)) {
      response.status(400).json({ ok: false, message: 'Please enter a valid business email address.' });
      return;
    }

    const inquiry = {
      id: `rfq_${Date.now()}`,
      createdAt: new Date().toISOString(),
      fullName,
      company,
      email,
      phone,
      spice,
      volume,
      incoterms,
      destination,
      message,
      source: request.headers.origin || request.headers.host || 'direct',
      ipAddress: request.ip,
      userAgent: request.get('user-agent') || ''
    };

    await fs.promises.mkdir(dataDirectory, { recursive: true });
    await fs.promises.appendFile(leadsFilePath, `${JSON.stringify(inquiry)}\n`, 'utf8');

    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry)
      }).catch(() => null);
    }

    sendSuccessResponse(request, response, {
      ok: true,
      message: 'Thank you. Your RFQ is submitted and our export team will reply within 24 hours.'
    });
  } catch (error) {
    response.status(500).json({
      ok: false,
      message: 'Server error while saving your request. Please email revita@spiceshouseindonesia.com directly.'
    });
  }
});

app.use('/api/*', (request, response) => {
  response.status(404).json({ ok: false, message: 'API route not found.' });
});

app.listen(port, () => {
  console.log(`Spices House Indonesia server running on http://localhost:${port}`);
});
