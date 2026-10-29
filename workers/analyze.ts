// Worker: AI Analysis for Scam Detection
// Deploy di Cloudflare Dashboard → Workers → Create Worker → awasscam-analyze
// Bindings: Workers AI "AI", D1 "DB" → awasscam-db

export interface Env {
  AI: any;
  DB: D1Database;
}

const SCAM_PROMPT = `Anda adalah analis keamanan siber yang mengkhususkan diri mendeteksi penipuan online di Indonesia.
Analisis pesan/bukti yang diberikan dan berikan respons JSON HANYA dengan format:
{
  "is_scam": boolean,
  "confidence": 0-100,
  "scam_type": "investasi|pinjol|phishing|belanja|lowongan|hadiah|lainnya",
  "risk_level": "low|medium|high|critical",
  "indicators": ["indikator1", "indikator2"],
  "advice": "saran singkat untuk pengguna (max 200 karakter)",
  "extracted_contacts": ["nomor", "link", "username", "rekening"]
}

Fokus pada modus Indonesia:
- Investasi bodong: trading bot, return tetap, binary option, forex robot, arisan digital
- Pinjol ilegal: bunga tinggi, akses kontak/galeri, intimidasi, tidak terdaftar OJK
- Phishing: SMS/email palsu bank/e-commerce/gov, link login palsu, minta OTP
- Belanja online: barang tidak dikirim, barang palsu, minta transfer ke rekening pribadi
- Lowongan palsu: bayar dulu, data entry, investasi modal, cryptocurrency
- Hadiah palsu: klik link, bayar biaya admin/asuransi, undian tidak diikuti`;

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
      const text = (formData.get('text') as string || '').trim();
      const image = formData.get('image') as File | null;

      if (!text && !image) {
        return new Response(JSON.stringify({ error: 'Text or image required' }), { 
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      let aiResponse: string;

      if (image) {
        // Vision model for image analysis
        const arrayBuffer = await image.arrayBuffer();
        const response = await env.AI.run('@cf/llava-1.5-7b-hf', {
          image: [...new Uint8Array(arrayBuffer)],
          prompt: `${SCAM_PROMPT}\n\nAnalisis gambar bukti penipuan ini (screenshot chat, transfer, dashboard, dll). Ekstrak: nomor telepon, link, username, nomor rekening, nama bank, jumlah uang, nama aplikasi/website, dan indikator penipuan visual.`
        });
        aiResponse = response.response || response.description || JSON.stringify(response);
      } else {
        // Text-only model (Llama 3.1 8B - fast, accurate for Indonesian)
        const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [
            { role: 'system', content: SCAM_PROMPT },
            { role: 'user', content: `Analisis pesan ini:\n\n${text}` }
          ],
          temperature: 0.1,
          max_tokens: 600
        });
        aiResponse = response.response || JSON.stringify(response);
      }

      // Parse JSON from AI response
      let parsed = parseAIResponse(aiResponse);

      // Log analysis to D1 for improving detection
      await logAnalysis(env.DB, text.substring(0, 500), parsed);

      return new Response(JSON.stringify({ success: true, analysis: parsed }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { 
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
  }
};

function parseAIResponse(response: string): any {
  try {
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : response;
    const parsed = JSON.parse(jsonStr);
    
    // Validate required fields
    return {
      is_scam: Boolean(parsed.is_scam),
      confidence: Math.max(0, Math.min(100, Number(parsed.confidence) || 50)),
      scam_type: ['investasi','pinjol','phishing','belanja','lowongan','hadiah','lainnya'].includes(parsed.scam_type) 
        ? parsed.scam_type : 'lainnya',
      risk_level: ['low','medium','high','critical'].includes(parsed.risk_level) 
        ? parsed.risk_level : 'medium',
      indicators: Array.isArray(parsed.indicators) ? parsed.indicators.slice(0, 5) : ['Analisis otomatis'],
      advice: String(parsed.advice || 'Periksa secara manual dan waspada').substring(0, 300),
      extracted_contacts: Array.isArray(parsed.extracted_contacts) ? parsed.extracted_contacts.slice(0, 10) : []
    };
  } catch {
    return {
      is_scam: true,
      confidence: 40,
      scam_type: 'lainnya',
      risk_level: 'medium',
      indicators: ['Gagal parsing AI response'],
      advice: 'Periksa manual - AI tidak bisa menganalisis dengan baik',
      extracted_contacts: []
    };
  }
}

async function logAnalysis(db: D1Database, text: string, result: any) {
  try {
    await db.prepare(`
      INSERT INTO ai_analysis_log (input_text, result_json, created_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `).bind(text, JSON.stringify(result)).run();
  } catch {
    // Table might not exist, ignore
  }
}