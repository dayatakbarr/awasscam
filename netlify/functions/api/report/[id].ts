import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getReportById, incrementViewCount } from "../../db";

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

    const report = await getReportById(id);

    if (!report) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Report not found' }),
      };
    }

    // Increment view count asynchronously
    incrementViewCount(id).catch(console.error);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        report: {
          ...report,
          evidence_files: report.evidence_files ? JSON.parse(report.evidence_files) : [],
        },
      }),
    };
  } catch (e: any) {
    console.error('Get report error:', e);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: e.message || 'Internal server error' }),
    };
  }
};

export { handler };