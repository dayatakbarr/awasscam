import type { APIRoute } from 'astro';

function getDB(context: any) {
  return context.locals.runtime.env.DB;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}

function validateReport(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data.type) errors.push('Jenis penipuan wajib diisi');
  if (!data.contact) errors.push('Nomor/link/akun pelaku wajib diisi');
  if (!data.chronology) errors.push('Kronologi penipuan wajib diisi');
  if (data.chronology && data.chronology.length < 50) errors.push('Kronologi minimal 50 karakter');
  if (data.loss_amount && (isNaN(data.loss_amount) || data.loss_amount < 0)) errors.push('Kerugian tidak valid');
  return { valid: errors.length === 0, errors };
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = getDB(locals);
    const body = await request.json();
    const { valid, errors } = validateReport(body);

    if (!valid) {
      return new Response(JSON.stringify({ success: false, errors }), {
        status: 400,
        headers: corsHeaders(),
      });
    }

    const evidenceFiles = body.evidence_files ? JSON.stringify(body.evidence_files) : null;
    const reporterIP = request.headers.get('CF-Connecting-IP') || 'unknown';

    const result = await db.prepare(`
      INSERT INTO reports (type, contact, chronology, loss_amount, evidence_files, reporter_ip, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `).bind(
      body.type,
      body.contact,
      body.chronology,
      body.loss_amount || 0,
      evidenceFiles,
      reporterIP
    ).run();

    return new Response(JSON.stringify({
      success: true,
      reportId: result.meta.last_row_id,
      message: 'Laporan terkirim, menunggu verifikasi'
    }), {
      headers: corsHeaders(),
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: corsHeaders(),
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders() });
};