import type { APIRoute, GetStaticPaths } from 'astro';

// For static output, dynamic API routes need getStaticPaths
export const getStaticPaths: GetStaticPaths = async () => {
  return [];
};

interface Report {
  id: number;
  type: string;
  contact: string;
  chronology: string;
  loss_amount: number;
  evidence_files: string | null;
  status: string;
  created_at: string;
  verified_at: string | null;
  view_count: number;
}

function getDB(context: any) {
  return context.locals.runtime.env.DB;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const db = getDB(locals);
    const id = parseInt(params.id || '0');

    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), {
        status: 400,
        headers: corsHeaders(),
      });
    }

    const report = await db.prepare('SELECT * FROM reports WHERE id = ?').bind(id).first();

    if (!report) {
      return new Response(JSON.stringify({ error: 'Report not found' }), {
        status: 404,
        headers: corsHeaders(),
      });
    }

    // Increment view count
    await db.prepare('UPDATE reports SET view_count = view_count + 1 WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({
      report: {
        ...report,
        evidence_files: report.evidence_files ? JSON.parse(report.evidence_files) : []
      }
    }), {
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