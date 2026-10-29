import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { createReport } from "../db";

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

    const reporterIp = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown';
    const reportId = await createReport({
      type: body.type,
      contact: body.contact,
      chronology: body.chronology,
      loss_amount: body.loss_amount,
      evidence_files: body.evidence_files,
      reporter_ip: reporterIp,
    });

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
    console.error('Create report error:', e);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: e.message || 'Internal server error' }),
    };
  }
};

export { handler };