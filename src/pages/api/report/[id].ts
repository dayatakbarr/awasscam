import type { APIRoute } from 'astro';
import { getReportById, incrementViewCount } from '../../../lib/db';

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = parseInt(params.id || '0');

    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const report = await getReportById(id);

    if (!report) {
      return new Response(JSON.stringify({ error: 'Report not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Increment view count asynchronously
    incrementViewCount(id).catch(console.error);

    return new Response(JSON.stringify({
      report: {
        ...report,
        evidence_files: report.evidence_files ? JSON.parse(report.evidence_files) : [],
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (e: any) {
    console.error('Get report error:', e);
    return new Response(JSON.stringify({ error: e.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};