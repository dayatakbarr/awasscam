import { c as createReport } from '../../chunks/db_CrdAA-r4.mjs';
export { renderers } from '../../renderers.mjs';

function validateReport(data) {
  const errors = [];
  if (!data.type) errors.push("Jenis penipuan wajib diisi");
  if (!data.contact) errors.push("Nomor/link/akun pelaku wajib diisi");
  if (!data.chronology) errors.push("Kronologi penipuan wajib diisi");
  if (data.chronology && data.chronology.length < 50) errors.push("Kronologi minimal 50 karakter");
  if (data.loss_amount && (isNaN(data.loss_amount) || data.loss_amount < 0)) errors.push("Kerugian tidak valid");
  return { valid: errors.length === 0, errors };
}
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { valid, errors } = validateReport(body);
    if (!valid) {
      return new Response(JSON.stringify({ success: false, errors }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const reporterIp = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
    const reportId = await createReport({
      type: body.type,
      contact: body.contact,
      chronology: body.chronology,
      loss_amount: body.loss_amount,
      evidence_files: body.evidence_files,
      reporter_ip: reporterIp
    });
    return new Response(JSON.stringify({
      success: true,
      reportId,
      message: "Laporan terkirim, menunggu verifikasi"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (e) {
    console.error("Create report error:", e);
    return new Response(JSON.stringify({ success: false, error: e.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
};
const OPTIONS = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
