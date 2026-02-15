import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, ArrowRight, Save } from 'lucide-react';

const ImpactWorkflow = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const lawId = searchParams.get('law_id');

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        lawId: lawId || '',
        domains: [],
        riskLevel: 'low',
        summary: '',
        tasks: []
    });

    const domains = [
        { id: 'privacy', label: '個人情報保護' },
        { id: 'security', label: '情報セキュリティ' },
        { id: 'tax', label: '税務・会計' },
        { id: 'labor', label: '労務・人事' },
        { id: 'business', label: '事業規制' }
    ];

    const handleDomainToggle = (id) => {
        setFormData(prev => ({
            ...prev,
            domains: prev.domains.includes(id)
                ? prev.domains.filter(d => d !== id)
                : [...prev.domains, id]
        }));
    };

    const handleSave = async () => {
        // Mock save
        console.log('Saving workflow:', formData);
        // In a real app, POST /api/analysis
        alert('影響分析を保存しました。');
        navigate('/');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">影響分析ワークフロー</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className={`px-3 py-1 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1. 領域特定</span>
                    <ArrowRight size={16} />
                    <span className={`px-3 py-1 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2. リスク評価</span>
                    <ArrowRight size={16} />
                    <span className={`px-3 py-1 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3. 対応策定</span>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                {step === 1 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <CheckCircle className="text-blue-500" />
                            影響を受ける業務領域を選択してください
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {domains.map(domain => (
                                <button
                                    key={domain.id}
                                    onClick={() => handleDomainToggle(domain.id)}
                                    className={`p-4 rounded-lg border-2 text-left transition-all ${formData.domains.includes(domain.id)
                                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                            : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                >
                                    <span className="font-bold block text-gray-800">{domain.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                onClick={() => setStep(2)}
                                disabled={formData.domains.length === 0}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                次へ <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <AlertTriangle className="text-orange-500" />
                            リスクレベルと概要を入力してください
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">リスクレベル</label>
                            <div className="flex gap-4">
                                {['low', 'medium', 'high'].map(level => (
                                    <label key={level} className="flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="riskLevel"
                                            value={level}
                                            checked={formData.riskLevel === level}
                                            onChange={e => setFormData({ ...formData, riskLevel: e.target.value })}
                                            className="sr-only peer"
                                        />
                                        <div className={`text-center p-3 rounded-lg border-2 peer-checked:ring-2 transition-all ${level === 'high' ? 'peer-checked:border-red-500 peer-checked:bg-red-50' :
                                                level === 'medium' ? 'peer-checked:border-orange-500 peer-checked:bg-orange-50' :
                                                    'peer-checked:border-green-500 peer-checked:bg-green-50'
                                            }`}>
                                            <span className="font-bold uppercase">{level}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">影響概要メモ</label>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                                placeholder="具体的にどのような影響が想定されるか記述してください..."
                                value={formData.summary}
                                onChange={e => setFormData({ ...formData, summary: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-between pt-4">
                            <button onClick={() => setStep(1)} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">戻る</button>
                            <button
                                onClick={() => setStep(3)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                次へ <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Save className="text-green-600" />
                            対応タスクのドラフト作成
                        </h3>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-2">AIによる提案タスク（モック）:</p>
                            <ul className="list-disc pl-5 space-y-1 text-gray-800">
                                <li>プライバシーポリシーの改定案作成</li>
                                <li>システムログ保存期間の設定変更</li>
                                <li>従業員向け周知メールの配信</li>
                            </ul>
                        </div>

                        <div className="flex justify-between pt-4">
                            <button onClick={() => setStep(2)} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">戻る</button>
                            <button
                                onClick={handleSave}
                                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-md flex items-center gap-2"
                            >
                                分析を完了して保存 <CheckCircle size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImpactWorkflow;
