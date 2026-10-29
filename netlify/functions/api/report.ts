import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

interface ReportBody {
  type: string;
  contact: string;
  chronology: string;
  loss_amount?: number;
  evidence_files?: string[];
}

function validateReport(data: ReportBody): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data.type) errors.push('Jenis penipuan wajib diisi');
  if (!data.contact) errors.push('Nomor/link/akun pelaku wajib diisi');
  if (!data.chronology) errors.push('Kronologi penipuan wajib diisi');
  if (data.chronology && data.chronology.length < 50) errors.push('Kronologi minimal 50 karakter');
  if (data.loss_amount && (isNaN(data.loss_amount) || data.loss_amount < 0)) errors.push('Kerugian tidak valid');
  return { valid: errors.length === 0, errors };
}

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body: ReportBody = JSON.parse(event.body || '{}');
    const { valid, errors } = validateReport(body);

    if (!valid) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, errors }),
      };
    }

    // TODO: Insert to DB (Turso/Neon/Supabase)
    // For now, return mock success
    const reportId = Date.now();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        reportId,
        message: 'Laporan terkirim, menunggu verifikasi',
      }),
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: e.message }),
    };
  }
};

export { handler };