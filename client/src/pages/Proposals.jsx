import React, { useState } from 'react';
import { FileCode, Database, Server, Copy, Check, TrendingUp, Lightbulb, ArrowRight, Github, ExternalLink } from 'lucide-react';

const Proposals = () => {
    const [copiedId, setCopiedId] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [repoConnected, setRepoConnected] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const res = await fetch('/api/proposals');
                if (res.ok) {
                    const data = await res.json();
                    setProposals(data);
                } else {
                    // Fallback if API fails
                    console.warn('Failed to fetch proposals, using mock.');
                    setProposals([
                        {
                            id: 'mock-1',
                            law: 'データ取得エラー (フォールバック)',
                            title: 'API接続を確認してください',
                            description: 'サーバーからの提案データの取得に失敗しました。',
                            category: 'compliance',
                            type: 'frontend',
                            files: []
                        }
                    ]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProposals();
    }, []);

    const handleAction = (id) => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'frontend': return <FileCode size={18} className="text-blue-500" />;
            case 'backend': return <Server size={18} className="text-green-500" />;
            case 'fullstack': return <Database size={18} className="text-purple-500" />;
            default: return <FileCode size={18} />;
        }
    };

    const getCategoryBadge = (category) => {
        if (category === 'business') {
            return (
                <span className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-200">
                    <Lightbulb size={14} />
                    ビジネス機会
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                <Check size={14} />
                コンプライアンス対応
            </span>
        );
    };

    const filteredProposals = activeTab === 'all'
        ? proposals
        : proposals.filter(p => p.category === activeTab);

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">AI開発提案</h2>
                    <p className="text-gray-500 text-sm mt-1">法改正の影響分析に基づき、必要な修正だけでなく<span className="font-bold text-purple-600">新たなビジネスチャンス</span>も提案します。</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${repoConnected ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                >
                    <Github size={18} />
                    {repoConnected ? '連携済み: lawguide-jp/core' : 'GitHub Issue連携設定'}
                </button>
            </div>

            <div className="flex space-x-2 border-b border-gray-200 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    すべて ({proposals.length})
                </button>
                <button
                    onClick={() => setActiveTab('business')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'business' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    ビジネス機会 ({proposals.filter(p => p.category === 'business').length})
                </button>
                <button
                    onClick={() => setActiveTab('compliance')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'compliance' ? 'border-gray-600 text-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    コンプライアンス対応 ({proposals.filter(p => p.category === 'compliance').length})
                </button>
            </div>

            <div className="grid gap-6">
                {filteredProposals.map((task) => (
                    <div key={task.id} className={`rounded-xl shadow-sm border p-6 flex flex-col md:flex-row gap-6 transition-all hover:shadow-md ${task.category === 'business' ? 'bg-gradient-to-r from-white to-purple-50 border-purple-100' : 'bg-white border-gray-200'
                        }`}>
                        {/* Left: Indicator */}
                        <div className="md:w-64 flex-shrink-0 space-y-3">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                {getCategoryBadge(task.category)}
                            </div>
                            <div className="text-xs text-gray-400 font-medium">関連法令</div>
                            <div className="text-sm text-blue-800 bg-blue-50 px-3 py-2 rounded border border-blue-100 font-medium">
                                {task.law}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
                                {getTypeIcon(task.type)}
                                <span className="uppercase">{task.type}</span>
                            </div>
                        </div>

                        {/* Middle: Content */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    {task.title}
                                    {task.category === 'business' && <TrendingUp size={20} className="text-purple-500" />}
                                </h3>
                                <p className="text-gray-600 mt-2 leading-relaxed text-sm">{task.description}</p>
                            </div>

                            <div className="bg-white/50 rounded-lg border border-gray-200 p-3">
                                <div className="text-xs text-gray-500 font-bold mb-2 uppercase tracking-wide">
                                    {task.category === 'business' ? '実装推奨コンポーネント:' : '修正対象ファイル候補:'}
                                </div>
                                <ul className="space-y-1">
                                    {task.files.map((file, idx) => (
                                        <li key={idx} className="text-sm font-mono text-gray-700 flex items-center gap-2">
                                            <FileCode size={14} className="text-gray-400" />
                                            {file}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-col gap-3 justify-center md:border-l md:pl-6 border-gray-100/50">
                            <button
                                onClick={() => handleAction(task.id)}
                                className={`w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${copiedId === task.id
                                    ? 'bg-green-100 text-green-700'
                                    : task.category === 'business'
                                        ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-200'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                                    }`}
                            >
                                {copiedId === task.id ? <Check size={18} /> : (repoConnected ? <Github size={18} /> : (task.category === 'business' ? <Lightbulb size={18} /> : <Copy size={18} />))}
                                {copiedId === task.id ? (repoConnected ? 'Issue作成完了' : 'コピー完了') : (repoConnected ? 'Issueを作成' : (task.category === 'business' ? '企画案をコピー' : 'タスクをコピー'))}
                            </button>
                            {!repoConnected && (
                                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-medium text-sm bg-white">
                                    詳細仕様を生成
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Mock Connect Modal */}
            {showModal && (
                <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center rounded-xl z-20 backdrop-blur-sm p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Github /> リポジトリ連携
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            連携するGitHubリポジトリを選択してください。
                            提案タスクを直接Issueとして起票できるようになります。
                        </p>
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-500 mb-1">リポジトリ選択</label>
                            <select className="w-full p-2 border border-gray-300 rounded bg-gray-50">
                                <option>hanagata/lawguide-jp</option>
                                <option>hanagata/compliance-core</option>
                                <option>hanagata/frontend-monorepo</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm font-medium"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={() => { setRepoConnected(true); setShowModal(false); }}
                                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 text-sm font-medium"
                            >
                                連携する
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Proposals;
