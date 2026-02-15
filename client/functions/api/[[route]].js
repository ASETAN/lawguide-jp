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

// GET /api/proposals (Dynamic generation based on D1 data)
app.get('/proposals', async (c) => {
    try {
        // Fetch recent laws from D1
        // Fetch recent laws from D1
        const { results } = await c.env.DB.prepare(
            'SELECT * FROM releases ORDER BY enforcement_date DESC LIMIT 10'
        ).all();

        const laws = results || [];

        const proposals = [];
        let idCounter = 1;

        // Keyword-based rule engine (Simulation of AI analysis)
        const rules = [
            {
                keywords: ['個人情報', 'プライバシー', 'データ'],
                generate: (law) => ([
                    {
                        type: 'compliance',
                        title: 'プライバシーポリシーの改定',
                        description: `「${law.title}」の施行に伴い、第三者提供の記録義務等が変更される可能性があります。利用規約と同意フローの見直しを推奨します。`,
                        tech: 'frontend',
                        priority: 'high',
                        files: ['client/src/pages/Register.jsx', 'client/src/components/ConsentForm.jsx']
                    },
                    {
                        type: 'business',
                        title: 'データポータビリティ機能の提供',
                        description: `【ビジネスチャンス】「${law.title}」によりユーザーのデータ権利意識が高まっています。データエクスポート機能を新プランとして提供することで、競合他社と差別化できます。`,
                        tech: 'backend',
                        priority: 'medium',
                        files: ['server/api/export.js']
                    }
                ])
            },
            {
                keywords: ['デジタル', '情報通信', '電波', 'ネット'],
                generate: (law) => ([
                    {
                        type: 'business',
                        title: 'DX対応コンサルティングプラン',
                        description: `【ビジネスチャンス】「${law.title}」は企業のデジタル化を後押しする内容です。既存顧客向けに、この法改正に対応したIT導入補助金の活用サポートプランを提案できます。`,
                        tech: 'fullstack',
                        priority: 'high',
                        files: ['client/src/pages/Pricing.jsx']
                    }
                ])
            },
            {
                keywords: ['環境', 'エネルギー', '炭素'],
                generate: (law) => ([
                    {
                        type: 'business',
                        title: 'グリーンテック・ブランディング',
                        description: `【ビジネスチャンス】「${law.title}」への早期対応をプレスリリースすることで、環境配慮型企業としてのブランド価値を向上させることができます。`,
                        tech: 'frontend',
                        priority: 'medium',
                        files: ['client/src/pages/About.jsx']
                    }
                ])
            },
            {
                keywords: ['金融', '資金', '決済', '銀行'],
                generate: (law) => ([
                    {
                        type: 'compliance',
                        title: '決済システム本人確認(eKYC)の強化',
                        description: `「${law.title}」により、マネーロンダリング対策の要件が強化される可能性があります。本人確認フローの再点検が必要です。`,
                        tech: 'backend',
                        priority: 'high',
                        files: ['server/services/kycHooks.js']
                    }
                ])
            },
            {
                // Default rule for unmatched laws
                keywords: [],
                generate: (law) => ([
                    {
                        type: 'compliance',
                        title: `${law.title} 影響調査`,
                        description: `新規公布された「${law.title}」について、社内業務への影響を一次調査する必要があります。`,
                        tech: 'frontend',
                        priority: 'low',
                        files: ['docs/compliance_check.md']
                    }
                ])
            }
        ];

        for (const law of laws) {
            let matched = false;
            for (const rule of rules) {
                if (rule.keywords.length > 0 && rule.keywords.some(k => law.title.includes(k) || law.summary.includes(k))) {
                    const generatedItems = rule.generate(law);
                    generatedItems.forEach(item => {
                        proposals.push({
                            id: `prop-${idCounter++}`,
                            law: law.title,
                            title: item.title,
                            description: item.description,
                            category: item.type, // 'business' or 'compliance'
                            type: item.tech,     // 'frontend', 'backend', 'fullstack'
                            priority: item.priority,
                            files: item.files
                        });
                    });
                    matched = true;
                }
            }
            // If no specific keywords matched, use default ONLY if we don't have enough proposals yet
            if (!matched && proposals.length < 5) {
                const defaultRule = rules[rules.length - 1];
                const items = defaultRule.generate(law);
                items.forEach(item => {
                    proposals.push({
                        id: `prop-${idCounter++}`,
                        law: law.title,
                        title: item.title,
                        description: item.description,
                        category: item.type,
                        type: item.tech,
                        priority: item.priority,
                        files: item.files
                    });
                });
            }
        }

        return json(c, proposals);
    } catch (err) {
        console.error(err);
        return c.json({ error: err.message }, 500);
    }
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
