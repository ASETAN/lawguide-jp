import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, ArrowRight } from 'lucide-react';

const LawViewer = () => {
    const { id } = useParams();
    const [law, setLaw] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLaw = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/laws/${id}`);
                const data = await res.json();
                setLaw(data);
            } catch (err) {
                console.error('Failed to fetch law:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLaw();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-gray-500">ロード中...</div>;
    if (!law) return <div className="p-8 text-center text-red-500">法令が見つかりませんでした。</div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-4 transition-colors">
                <ArrowLeft size={16} className="mr-1" /> ダッシュボードに戻る
            </Link>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="border-b border-gray-100 pb-6 mb-6">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold mb-2">
                        法令ID: {law.id}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900">{law.title}</h1>
                    <div className="flex gap-6 mt-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>改正公布: 2025-12-10</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FileText size={14} />
                            <span>カテゴリ: 個人情報保護</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                            改正差分 (ハイライト)
                        </h3>
                        <div
                            className="p-6 bg-gray-50 rounded-lg border border-gray-200 font-serif leading-relaxed text-lg"
                            dangerouslySetInnerHTML={{ __html: law.diff_html }}
                        />
                        <p className="text-xs text-gray-400 mt-2 text-right">※緑色は追加箇所、赤色は削除箇所を示します。</p>
                    </div>
                    <div className="flex justify-end">
                        <Link to={`/impact?law_id=${law.id}`} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-bold shadow-sm">
                            影響分析を開始する <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-600 mb-2">改正前</h4>
                            <div className="p-4 bg-gray-50 rounded border border-gray-200 text-gray-500 text-sm h-64 overflow-y-auto">
                                {law.previous_text}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-600 mb-2">改正後</h4>
                            <div className="p-4 bg-white rounded border border-blue-200 text-gray-800 text-sm h-64 overflow-y-auto shadow-sm">
                                {law.current_text}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LawViewer;
