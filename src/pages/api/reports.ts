import type { APIRoute } from 'astro';

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

function getDB(context: any) {
  return context.locals.runtime.env.DB;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const db = getDB(locals);
    const search = url.searchParams.get('q') || '';
    const type = url.searchParams.get('type') || '';
    const status = url.searchParams.get('status') || 'verified';
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let query = 'SELECT * FROM reports WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    if (search) {
      query += ' AND (contact LIKE ? OR chronology LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const { results } = await db.prepare(query).bind(...params).all<Report>();

    // Increment view count for returned reports
    if (results.length > 0) {
      const ids = results.map(r => r.id).join(',');
      await db.prepare(`UPDATE reports SET view_count = view_count + 1 WHERE id IN (${ids})`).run();
    }

    return new Response(JSON.stringify({ reports: results, limit, offset }), {
      headers: corsHeaders(),
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: corsHeaders(),
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders() });
};