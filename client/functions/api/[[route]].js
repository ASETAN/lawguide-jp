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

import { XMLParser } from 'fast-xml-parser';

// ... imports ...

// POST /api/crawl (Trigger e-Gov Fetch)
app.post('/crawl', async (c) => {
    try {
        console.log('Fetching from e-Gov API...');
        const res = await fetch('https://laws.e-gov.go.jp/api/1/lawlists/1');
        const xmlText = await res.text();

        const parser = new XMLParser();
        const jsonObj = parser.parse(xmlText);

        const laws = jsonObj.DataRoot.ApplData.LawNameListInfo;
        // Take top 20 for demo (API returns thousands)
        const recentLaws = Array.isArray(laws) ? laws.slice(-20).reverse() : [laws];

        const stmt = c.env.DB.prepare(`
            INSERT OR IGNORE INTO releases (id, title, enforcement_date, summary, url) 
            VALUES (?, ?, ?, ?, ?)
        `);

        let count = 0;
        const batch = [];

        for (const law of recentLaws) {
            const dateStr = law.PromulgationDate.toString();
            const formattedDate = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;

            batch.push(stmt.bind(
                law.LawId,
                law.LawName,
                formattedDate, // Using promulgation date as proxy
                `公布日: ${formattedDate} (法令番号: ${law.LawNo})`,
                `https://elaws.e-gov.go.jp/document?lawid=${law.LawId}`
            ));
            count++;
        }

        await c.env.DB.batch(batch);

        return json(c, {
            message: `Successfully crawled ${count} laws from e-Gov`,
            fetched: count
        });

    } catch (err) {
        console.error(err);
        return c.json({ error: err.message }, 500);
    }
});

export const onRequest = handle(app);
