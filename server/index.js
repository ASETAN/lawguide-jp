const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const eGovPoller = require('./ingestion/poller');
const kanpouCrawler = require('./ingestion/kanpou');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// API Routes

// Get recent alerts (combined source)
app.get('/api/alerts', async (req, res) => {
    const date = new Date().toISOString().split('T')[0];
    try {
        const eGovUpdates = await eGovPoller.checkForUpdates(date);
        const kanpouUpdates = await kanpouCrawler.fetchDaily(date);

        res.json({
            date,
            sources: {
                eGov: eGovUpdates,
                kanpou: kanpouUpdates
            }
        });
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
});

const differ = require('./lib/differ');

// Get specific law details (mock with real diff)
app.get('/api/laws/:id', (req, res) => {
    const { id } = req.params;

    const current_text = '第一条 個人情報の有用性に配慮しつつ、個人の権利利益を保護することを目的とする...';
    const previous_text = '第一条 個人の権利利益を保護することを目的とする...';

    const diff_html = differ.generateHtmlDiff(previous_text, current_text);

    res.json({
        id,
        title: '個人情報の保護に関する法律',
        current_text,
        previous_text,
        diff_html
    });
});

// Trigger analysis (mock)
app.post('/api/analysis', (req, res) => {
    const { law_id } = req.body;
    res.json({
        analysis_id: 'an-' + Date.now(),
        summary: '今回の改正により、事業者に対する報告義務が強化されました。',
        impacts: [
            { domain: 'compliance', risk: 'high', note: 'プライバシーポリシーの改定が必要' },
            { domain: 'system', risk: 'medium', note: 'ログ保存期間の見直し' }
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
