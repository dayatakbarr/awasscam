// Worker: Upload Evidence to R2
// Deploy di Cloudflare Dashboard → Workers → Create Worker → awasScam-upload
// Bindings: R2 bucket "EVIDENCE_BUCKET" → awasscam-evidence, D1 "DB" → awasscam-db

export interface Env {
  EVIDENCE_BUCKET: R2Bucket;
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const formData = await request.formData();
      const files = formData.getAll('files') as File[];
      const reportId = formData.get('reportId') as string;

      if (!files.length) {
        return new Response(JSON.stringify({ error: 'No files provided' }), { 
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      const uploaded: string[] = [];
      const maxFiles = 5;
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedExt = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'heic', 'heif'];

      for (const file of files.slice(0, maxFiles)) {
        if (file.size > maxSize) continue;
        
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (!ext || !allowedExt.includes(ext)) continue;

        const key = `evidence/${reportId || 'temp'}/${crypto.randomUUID()}.${ext}`;
        await env.EVIDENCE_BUCKET.put(key, file.stream(), {
          httpMetadata: { contentType: file.type },
          customMetadata: { 
            originalName: file.name, 
            uploadedAt: new Date().toISOString(),
            reportId: reportId || 'pending'
          }
        });
        uploaded.push(key);
      }

      // Update D1 if reportId provided
      if (reportId && uploaded.length) {
        const existing = await env.DB.prepare(
          'SELECT evidence_files FROM reports WHERE id = ?'
        ).bind(parseInt(reportId)).first<{ evidence_files: string | null }>();
        
        const current = existing?.evidence_files ? JSON.parse(existing.evidence_files) : [];
        await env.DB.prepare(
          'UPDATE reports SET evidence_files = ? WHERE id = ?'
        ).bind(JSON.stringify([...current, ...uploaded]), parseInt(reportId)).run();
      }

      return new Response(JSON.stringify({ success: true, files: uploaded }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { 
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
  }
};