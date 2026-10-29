// Netlify Functions - Database Client (Turso/libSQL)
// Usage: import { db } from './db.ts'

import { createClient } from '@libsql/client';

// Turso connection from environment variables
const TURSO_URL = process.env.TURSO_DATABASE_URL || process.env.DB_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN || process.env.DB_AUTH_TOKEN;

if (!TURSO_URL) {
  console.warn('⚠️ TURSO_DATABASE_URL not set - database functions will not work');
}

export const db = TURSO_URL 
  ? createClient({
      url: TURSO_URL,
      authToken: TURSO_TOKEN,
    })
  : null;

export async function initDatabase() {
  if (!db) return;
  
  await db.batch([
    `CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      contact TEXT NOT NULL,
      chronology TEXT NOT NULL,
      loss_amount INTEGER DEFAULT 0,
      evidence_files TEXT DEFAULT '[]',
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending','verified','rejected')),
      reporter_ip TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      verified_at DATETIME
    )`,
    `CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status)`,
    `CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type)`,
    `CREATE INDEX IF NOT EXISTS idx_reports_created ON reports(created_at DESC)`,
    `CREATE TABLE IF NOT EXISTS ai_analysis_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      input_text TEXT,
      result_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
  ]);
}

export interface Report {
  id: number;
  type: string;
  contact: string;
  chronology: string;
  loss_amount: number;
  evidence_files: string;
  status: string;
  reporter_ip: string | null;
  created_at: string;
  verified_at: string | null;
  view_count: number;
}

export async function getReports(params: {
  search?: string;
  type?: string;
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<{ reports: Report[]; total: number }> {
  if (!db) throw new Error('Database not configured');
  
  const { search = '', type = '', status = 'verified', limit = 20, offset = 0 } = params;
  
  let where = 'WHERE 1=1';
  const args: any[] = [];
  
  if (status) {
    where += ' AND status = ?';
    args.push(status);
  }
  if (type) {
    where += ' AND type = ?';
    args.push(type);
  }
  if (search) {
    where += ' AND (contact LIKE ? OR chronology LIKE ?)';
    args.push(`%${search}%`, `%${search}%`);
  }
  
  // Get total count
  const countResult = await db.execute({
    sql: `SELECT COUNT(*) as total FROM reports ${where}`,
    args,
  });
  const total = countResult.rows[0]?.total as number || 0;
  
  // Get paginated results
  const result = await db.execute({
    sql: `SELECT * FROM reports ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    args: [...args, limit, offset],
  });
  
  const reports = result.rows.map(row => ({
    id: row.id as number,
    type: row.type as string,
    contact: row.contact as string,
    chronology: row.chronology as string,
    loss_amount: row.loss_amount as number,
    evidence_files: row.evidence_files as string,
    status: row.status as string,
    reporter_ip: row.reporter_ip as string | null,
    created_at: row.created_at as string,
    verified_at: row.verified_at as string | null,
    view_count: row.view_count as number || 0,
  }));
  
  return { reports, total };
}

export async function createReport(data: {
  type: string;
  contact: string;
  chronology: string;
  loss_amount?: number;
  evidence_files?: string[];
  reporter_ip?: string;
}): Promise<number> {
  if (!db) throw new Error('Database not configured');
  
  const result = await db.execute({
    sql: `INSERT INTO reports (type, contact, chronology, loss_amount, evidence_files, reporter_ip, status)
          VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
    args: [
      data.type,
      data.contact,
      data.chronology,
      data.loss_amount || 0,
      JSON.stringify(data.evidence_files || []),
      data.reporter_ip || null,
    ],
  });
  
  return result.lastInsertRowid as number;
}

export async function getReportById(id: number): Promise<Report | null> {
  if (!db) throw new Error('Database not configured');
  
  const result = await db.execute({
    sql: 'SELECT * FROM reports WHERE id = ?',
    args: [id],
  });
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  return {
    id: row.id as number,
    type: row.type as string,
    contact: row.contact as string,
    chronology: row.chronology as string,
    loss_amount: row.loss_amount as number,
    evidence_files: row.evidence_files as string,
    status: row.status as string,
    reporter_ip: row.reporter_ip as string | null,
    created_at: row.created_at as string,
    verified_at: row.verified_at as string | null,
    view_count: row.view_count as number || 0,
  };
}

export async function incrementViewCount(id: number): Promise<void> {
  if (!db) return;
  await db.execute({
    sql: 'UPDATE reports SET view_count = view_count + 1 WHERE id = ?',
    args: [id],
  });
}

export async function logAIAnalysis(inputText: string, resultJson: string): Promise<void> {
  if (!db) return;
  await db.execute({
    sql: 'INSERT INTO ai_analysis_log (input_text, result_json) VALUES (?, ?)',
    args: [inputText, resultJson],
  });
}