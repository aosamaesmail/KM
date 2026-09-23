export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const gasUrl = process.env.GAS_WEB_APP_URL;
  const secret = process.env.GAS_API_SECRET;

  if (!gasUrl || !secret) {
    return res.status(500).json({
      ok: false,
      error: 'Server configuration is incomplete.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: body.action,
        data: body.data || {},
        apiSecret: secret
      })
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { ok: false, error: 'Invalid response from Apps Script.' };
    }

    return res.status(response.ok ? 200 : 502).json(data);
  } catch (error) {
    return res.status(502).json({
      ok: false,
      error: 'Could not connect to Apps Script.'
    });
  }
}
