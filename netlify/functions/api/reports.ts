import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getReports } from "../db";

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
    const params = event.queryStringParameters || {};
    const search = params.q || '';
    const type = params.type || '';
    const status = params.status || 'verified';
    const limit = Math.min(parseInt(params.limit || '20'), 100);
    const offset = parseInt(params.offset || '0');

    const { reports, total } = await getReports({ search, type, status, limit, offset });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ reports, total, limit, offset }),
    };
  } catch (e: any) {
    console.error('Get reports error:', e);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: e.message || 'Internal server error' }),
    };
  }
};

export { handler };