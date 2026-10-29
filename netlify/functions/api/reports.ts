import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

interface Report {
  id: number;
  type: string;
  contact: string;
  chronology: string;
  loss_amount: number;
  evidence_files: string | null;
  status: string;
  created_at: string;
  view_count: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

function getDB() {
  // For Netlify, use a serverless DB like Turso, Neon, or Supabase
  // This is a placeholder - replace with actual DB connection
  return null;
}

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const params = event.queryStringParameters || {};
    const search = params.q || '';
    const type = params.type || '';
    const status = params.status || 'verified';
    const limit = Math.min(parseInt(params.limit || '20'), 100);
    const offset = parseInt(params.offset || '0');

    // TODO: Replace with actual DB query (Turso/Neon/Supabase)
    // For now, return empty array - will work once DB is connected
    const reports: Report[] = [];

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ reports, limit, offset }),
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: e.message }),
    };
  }
};

export { handler };