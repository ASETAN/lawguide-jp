export const mockAlerts = {
    date: new Date().toLocaleDateString('ja-JP'),
    sources: {
        eGov: [
            {
                law_id: '123456',
                law_title: '個人情報保護法改正 (令和7年)',
                enforcement_date: '2025-04-01',
                summary: 'デジタル社会の形成を図るための関係法律の整備に関する法律により、個人情報保護法が改正されます。第三者提供の記録義務が厳格化されます。',
                link: '#'
            },
            {
                law_id: '789012',
                law_title: '電子帳簿保存法 (スキャナ保存要件緩和)',
                enforcement_date: '2025-01-01',
                summary: 'スキャナ保存制度の要件が大幅に緩和され、タイムスタンプ付与期間が延長されます。',
                link: '#'
            },
            {
                law_id: '345678',
                law_title: '労働基準法 (デジタル給与払い)',
                enforcement_date: '2025-04-01',
                summary: '賃金のデジタル払い（資金移動業者口座への振込）が解禁されます。同意取得フローの実装が必要です。',
                link: '#'
            },
            {
                law_id: '901234',
                law_title: '特定商取引法 (定期購入規制)',
                enforcement_date: '2025-06-01',
                summary: '詐欺的な定期購入商法への規制が強化されます。最終確認画面での表示義務事項が追加されます。',
                link: '#'
            }
        ],
        kanpou: [
            {
                date: '2025-02-15',
                type: '省令',
                title: 'デジタル庁設置法関連の施行規則改正',
                source: '本紙第1234号',
                pages: '2-4',
                url: '#'
            },
            {
                date: '2025-02-15',
                type: '告示',
                title: '厚生労働省告示 第56号',
                source: '本紙第1234号',
                pages: '8',
                url: '#'
            }
        ]
    }
};
