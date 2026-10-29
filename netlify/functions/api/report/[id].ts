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
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    // Extract ID from path: /.netlify/functions/api/report/123
    const pathParts = event.path.split('/');
    const id = parseInt(pathParts[pathParts.length - 1] || '0');

    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid ID' }),
      };
    }

    // TODO: Query DB (Turso/Neon/Supabase)
    // For now, return 404
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Report not found' }),
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