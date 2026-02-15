import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';

const app = new Hono().basePath('/api');

// --- Helpers ---
const json = (c, data) => c.json(data);

// --- Routes ---

// GET /api/alerts
app.get('/alerts', async (c) => {
    try {
        const { results: releases } = await c.env.DB.prepare(
            'SELECT *, id as law_id, title as law_title, url as link FROM releases ORDER BY publication_date DESC LIMIT 20'
        ).all();

        const { results: kanpou } = await c.env.DB.prepare(
            'SELECT * FROM kanpou ORDER BY date DESC LIMIT 20'
        ).all();

        return json(c, {
            date: new Date().toLocaleDateString('ja-JP'),
            sources: {
                eGov: releases || [],
                kanpou: kanpou || []
            }
        });
    } catch (err) {
        console.error(err);
        return c.json({ error: err.message }, 500);
    }
});

// GET /api/laws/:id
app.get('/laws/:id', async (c) => {
    const id = c.req.param('id');
    const law = await c.env.DB.prepare('SELECT * FROM releases WHERE id = ?').bind(id).first();

    if (!law) return c.json({ error: 'Not found' }, 404);

    // Mock diff text for now as we don't have the full crawler logic on edge yet for diffs
    // In a real app, we would store the diff text in D1 too.
    const diff = `(第1条)\n- この法律は、公布の日から施行する。\n+ この法律は、デジタル社会形成基本法の施行の日から施行する。`;

    return json(c, {
        ...law,
        law_title: law.title,
        law_text: diff // assigning mockup diff
    });
});

// POST /api/impact (Save Analysis)
app.post('/impact', async (c) => {
    const body = await c.req.json();
    const id = crypto.randomUUID();

    await c.env.DB.prepare(
        'INSERT INTO impact_analysis (id, law_id, status, risk_level, affected_departments, comments) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(id, body.lawId, 'pending', body.riskLevel, JSON.stringify(body.departments), body.comments).run();

    return json(c, { success: true, id });
});

// POST /api/crawl (Manual Trigger) - Simple implementation
app.post('/crawl', async (c) => {
    // In a real D1 app, we would fetch data from e-Gov API here and insert into D1
    // For demonstration "Live" feel, we will verify D1 connection and insert a sample if empty

    const count = await c.env.DB.prepare('SELECT count(*) as c FROM releases').first();

    if (count.c === 0) {
        // Seed initial data if empty
        await c.env.DB.prepare(`
        INSERT INTO releases (id, title, enforcement_date, summary, url) VALUES 
        ('123456', '個人情報保護法改正 (令和7年)', '2025-04-01', 'デジタル社会の形成を図るための関係法律の整備に関する法律により、個人情報保護法が改正されます。第三者提供の記録義務が厳格化されます。', '#'),
        ('789012', '電子帳簿保存法 (スキャナ保存要件緩和)', '2025-01-01', 'スキャナ保存制度の要件が大幅に緩和され、タイムスタンプ付与期間が延長されます。', '#'),
        ('345678', '労働基準法 (デジタル給与払い)', '2025-04-01', '賃金のデジタル払い（資金移動業者口座への振込）が解禁されます。同意取得フローの実装が必要です。', '#'),
        ('901234', '特定商取引法 (定期購入規制)', '2025-06-01', '詐欺的な定期購入商法への規制が強化されます。最終確認画面での表示義務事項が追加されます。', '#')
      `).run();
        return json(c, { message: 'Seeded initial data' });
    }

    return json(c, { message: 'Crawl triggered (stub)', current_count: count.c });
});

export const onRequest = handle(app);
