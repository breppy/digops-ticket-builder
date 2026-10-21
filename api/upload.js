export const config = {
  runtime: 'edge',
};

// Proxies a single base64-encoded file to Airtable's attachment upload endpoint.
// Keeps the Airtable token server-side. The client sends one request per file.
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

  const apiKey = process.env.DIGOPS_AT_TOKEN || process.env.VITE_AT_TOKEN;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Airtable token not configured on server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { baseId, recordId, fieldId, filename, contentType, file } = await req.json();

    if (!baseId || !recordId || !fieldId || !file) {
      return new Response(JSON.stringify({ error: 'Missing baseId, recordId, fieldId, or file' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(`https://content.airtable.com/v0/${baseId}/${recordId}/${fieldId}/uploadAttachment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contentType: contentType || 'application/octet-stream',
        file,
        filename: filename || 'upload',
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to upload attachment', detail: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
