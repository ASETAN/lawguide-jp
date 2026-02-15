import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, AlertTriangle, FileText, Settings, ShieldCheck, CheckCircle } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { name: 'ダッシュボード', path: '/', icon: LayoutDashboard },
        { name: '法令一覧', path: '/laws', icon: BookOpen },
        { name: '承認待ち', path: '/approvals', icon: CheckCircle },
        { name: '影響分析', path: '/impact', icon: AlertTriangle },
        { name: '開発提案', path: '/proposals', icon: FileText },
        { name: '監査ログ', path: '/audit', icon: ShieldCheck },
        { name: '設定', path: '/settings', icon: Settings },
    ];

    return (
        <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-10">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <BookOpen className="text-blue-400" />
                    LawGuideJP
                </h1>
                <p className="text-xs text-slate-400 mt-1">法改正キャッチアップ</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                        <span className="font-bold text-sm">HT</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Hanagata Takumi</p>
                        <p className="text-xs text-slate-500">管理者</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
