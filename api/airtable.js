export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.VITE_AT_TOKEN;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Airtable token not configured on server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { baseId, tableId } = body;

    if (!baseId || !tableId) {
      return new Response(JSON.stringify({ error: 'Missing baseId or tableId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const baseUrl = `https://api.airtable.com/v0/${baseId}/${tableId}`;
    const jsonHeaders = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

    // ---- List records (paginated) ----
    if (body.action === 'list') {
      const p = body.params || {};
      const records = [];
      let offset;
      do {
        const qs = new URLSearchParams();
        qs.set('pageSize', '100');
        if (p.filterByFormula) qs.set('filterByFormula', p.filterByFormula);
        (p.fields || []).forEach(f => qs.append('fields[]', f));
        if (offset) qs.set('offset', offset);

        const r = await fetch(`${baseUrl}?${qs.toString()}`, {
          headers: { 'Authorization': `Bearer ${apiKey}` },
        });
        const d = await r.json();
        if (!r.ok) {
          return new Response(JSON.stringify(d), { status: r.status, headers: jsonHeaders });
        }
        records.push(...(d.records || []));
        offset = d.offset;
      } while (offset);

      return new Response(JSON.stringify({ records }), { status: 200, headers: jsonHeaders });
    }

    // ---- Create a record ----
    const { fields } = body;
    if (!fields) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: jsonHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to reach Airtable API', detail: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
