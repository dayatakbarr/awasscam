import { createClient } from '@libsql/client';

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;
if (!TURSO_URL) {
  console.warn("⚠️ TURSO_DATABASE_URL not set");
}
const db = TURSO_URL ? createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN
}) : null;
async function getReports(params) {
  if (!db) throw new Error("Database not configured");
  const { search = "", type = "", status = "verified", limit = 20, offset = 0 } = params;
  let where = "WHERE 1=1";
  const args = [];
  if (status) {
    where += " AND status = ?";
    args.push(status);
  }
  if (type) {
    where += " AND type = ?";
    args.push(type);
  }
  if (search) {
    where += " AND (contact LIKE ? OR chronology LIKE ?)";
    args.push(`%${search}%`, `%${search}%`);
  }
  const countResult = await db.execute({
    sql: `SELECT COUNT(*) as total FROM reports ${where}`,
    args
  });
  const total = countResult.rows[0]?.total || 0;
  const result = await db.execute({
    sql: `SELECT * FROM reports ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    args: [...args, limit, offset]
  });
  const reports = result.rows.map((row) => ({
    id: row.id,
    type: row.type,
    contact: row.contact,
    chronology: row.chronology,
    loss_amount: row.loss_amount,
    evidence_files: row.evidence_files,
    status: row.status,
    reporter_ip: row.reporter_ip,
    created_at: row.created_at,
    verified_at: row.verified_at,
    view_count: row.view_count || 0
  }));
  return { reports, total };
}
async function createReport(data) {
  if (!db) throw new Error("Database not configured");
  const result = await db.execute({
    sql: `INSERT INTO reports (type, contact, chronology, loss_amount, evidence_files, reporter_ip, status)
          VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
    args: [
      data.type,
      data.contact,
      data.chronology,
      data.loss_amount || 0,
      JSON.stringify(data.evidence_files || []),
      data.reporter_ip || null
    ]
  });
  return result.lastInsertRowid;
}
async function getReportById(id) {
  if (!db) throw new Error("Database not configured");
  const result = await db.execute({
    sql: "SELECT * FROM reports WHERE id = ?",
    args: [id]
  });
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id,
    type: row.type,
    contact: row.contact,
    chronology: row.chronology,
    loss_amount: row.loss_amount,
    evidence_files: row.evidence_files,
    status: row.status,
    reporter_ip: row.reporter_ip,
    created_at: row.created_at,
    verified_at: row.verified_at,
    view_count: row.view_count || 0
  };
}
async function incrementViewCount(id) {
  if (!db) return;
  await db.execute({
    sql: "UPDATE reports SET view_count = view_count + 1 WHERE id = ?",
    args: [id]
  });
}

export { getReports as a, createReport as c, getReportById as g, incrementViewCount as i };
