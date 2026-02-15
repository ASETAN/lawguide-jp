import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';

import { mockAlerts } from '../data/mockAlerts';

const Dashboard = () => {
    const [alerts, setAlerts] = useState({ eGov: [], kanpou: [] });
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState('');
    const [industry, setIndustry] = useState(localStorage.getItem('lawguide_industry') || 'it');

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            // Attempt fetch, fallback to mock if it fails or if 500/404
            const res = await fetch('/api/alerts');
            if (!res.ok) throw new Error('API not available');
            const data = await res.json();
            setAlerts(data.sources);
            setDate(data.date);
        } catch (err) {
            console.warn('Backend API unavailable, using mock data:', err);
            setAlerts(mockAlerts.sources);
            setDate(mockAlerts.date);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();

        const handleSettingsUpdate = () => {
            setIndustry(localStorage.getItem('lawguide_industry') || 'it');
        };
        window.addEventListener('settings-updated', handleSettingsUpdate);
        return () => window.removeEventListener('settings-updated', handleSettingsUpdate);
    }, []);

    // Mock scoring logic based on industry
    const calculateImpactScore = (law) => {
        let score = 50; // Base score
        const text = (law.law_title + law.summary).toLowerCase();

        // Simple keyword matching for demo
        const rules = {
            it: ['個人情報', '通信', 'デジタル', '電波'],
            finance: ['金融', '銀行', '資金', '決済'],
            manufacturing: ['環境', '安全', '輸出', '労働'],
            healthcare: ['医療', '薬', '健康', '保険'],
            construction: ['建設', '土地', '建築'],
            retail: ['消費', '表示', '食品']
        };

        const keywords = rules[industry] || [];
        keywords.forEach(kw => {
            if (text.includes(kw)) score += 30;
        });

        return Math.min(score, 100);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'bg-red-100 text-red-700 border-red-200';
        if (score >= 60) return 'bg-orange-100 text-orange-700 border-orange-200';
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">自社関連の重要改正</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                        {alerts.eGov.filter(a => calculateImpactScore(a) >= 80).length}
                        <span className="text-sm font-normal text-gray-500 ml-2">件</span>
                    </p>
                    <div className="mt-2 text-xs text-blue-600 font-medium bg-blue-50 inline-block px-2 py-1 rounded">
                        業種: {industry === 'it' ? 'ITサービス' : industry.toUpperCase()}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">未レビュー</h3>
                    <p className="text-3xl font-bold text-orange-600 mt-2">3</p>
                    <div className="mt-2 text-xs text-orange-600 font-medium bg-orange-50 inline-block px-2 py-1 rounded">
                        要アクション
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">重大な改正</h3>
                    <p className="text-3xl font-bold text-red-600 mt-2">1</p>
                    <div className="mt-2 text-xs text-red-600 font-medium bg-red-50 inline-block px-2 py-1 rounded">
                        個人情報保護法関連
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* e-Gov Section */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            e-Gov 法令更新 ({date})
                        </h3>
                        <button onClick={fetchAlerts} className="text-gray-400 hover:text-blue-600 transition-colors">
                            <RefreshCw size={16} />
                        </button>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {alerts.eGov.length === 0 ? (
                            <p className="p-4 text-gray-500 text-sm">更新はありません。</p>
                        ) : (
                            alerts.eGov.map((item, idx) => {
                                const score = calculateImpactScore(item);
                                return (
                                    <div key={idx} className="p-5 hover:bg-gray-50 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-blue-700">{item.law_title}</h4>
                                            <span className={`text-xs px-2 py-1 rounded font-bold border ${getScoreColor(score)}`}>
                                                影響度: {score}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.summary}</p>
                                        <div className="mt-3 flex items-center gap-4 text-xs">
                                            <span className="text-gray-400">施行予定: {item.enforcement_date}</span>
                                            <a href={item.link} target="_blank" rel="noreferrer" className="flex items-center text-blue-500 hover:text-blue-700 font-medium">
                                                原文 <ExternalLink size={12} className="ml-1" />
                                            </a>
                                            <Link to={`/laws/${item.law_id}`} className="ml-auto flex items-center gap-1 text-gray-500 group-hover:text-blue-600 transition-colors">
                                                詳細分析へ <ArrowRight size={14} />
                                            </Link>                                    </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>

                {/* Kanpou Section */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            官報 公布情報 ({date})
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {alerts.kanpou.length === 0 ? (
                            <p className="p-4 text-gray-500 text-sm">更新はありません。</p>
                        ) : (
                            alerts.kanpou.map((item, idx) => (
                                <div key={idx} className="p-5 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 mb-1 inline-block">
                                                {item.type}
                                            </span>
                                            <h4 className="font-bold text-gray-800">{item.title}</h4>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500">
                                        <p>{item.source} (p.{item.pages})</p>
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center text-green-600 hover:text-green-800 text-xs font-medium">
                                            官報を開く <ExternalLink size={12} className="ml-1" />
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
