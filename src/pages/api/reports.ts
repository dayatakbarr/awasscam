import type { APIRoute } from 'astro';
import { getReports } from '../../lib/db';

export const GET: APIRoute = async ({ url }) => {
  try {
    const search = url.searchParams.get('q') || '';
    const type = url.searchParams.get('type') || '';
    const status = url.searchParams.get('status') || 'verified';
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0');

    const { reports, total } = await getReports({ search, type, status, limit, offset });

    return new Response(JSON.stringify({ reports, total, limit, offset }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (e: any) {
    console.error('Get reports error:', e);
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