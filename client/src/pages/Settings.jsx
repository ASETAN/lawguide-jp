import React, { useState, useEffect } from 'react';
import { Save, Building2 } from 'lucide-react';

const Settings = () => {
    const [industry, setIndustry] = useState('it');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('lawguide_industry');
        if (saved) setIndustry(saved);
    }, []);

    const handleSave = () => {
        localStorage.setItem('lawguide_industry', industry);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
        // Trigger a custom event so other components can update immediately
        window.dispatchEvent(new Event('settings-updated'));
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">設定</h2>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
                    <Building2 className="text-blue-500" />
                    企業プロフィール設定
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            自社の業種
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                            選択した業種に基づいて、法令改正の影響度（レコメンドスコア）が自動計算されます。
                        </p>
                        <select
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="it">情報通信・ITサービス</option>
                            <option value="finance">金融・保険</option>
                            <option value="manufacturing">製造・メーカー</option>
                            <option value="healthcare">医療・ヘルスケア</option>
                            <option value="construction">建設・不動産</option>
                            <option value="retail">小売・流通</option>
                        </select>
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex items-center gap-2"
                        >
                            <Save size={18} />
                            設定を保存
                        </button>
                        {isSaved && (
                            <span className="text-green-600 text-sm font-medium animate-fade-in">
                                保存しました！ダッシュボードのスコアが更新されます。
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
