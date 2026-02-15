import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const location = useLocation();

    // Simple mapping for header title based on path
    const getTitle = (path) => {
        if (path === '/') return 'ダッシュボード';
        if (path.startsWith('/laws')) return '法令一覧';
        if (path.startsWith('/proposals')) return 'AI提案 & 対応タスク';
        if (path.startsWith('/audit')) return '監査ログ';
        if (path.startsWith('/settings')) return '設定';
        return 'LawGuideJP';
    };

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Header title={getTitle(location.pathname)} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
