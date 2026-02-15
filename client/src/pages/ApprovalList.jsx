import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

const ApprovalList = () => {
    // Mock data for approval requests
    const [requests] = useState([
        {
            id: 'an-001',
            lawTitle: '個人情報の保護に関する法律',
            risk: 'high',
            submittedBy: 'Hanagata Takumi',
            date: '2026-02-15',
            status: 'pending'
        },
        {
            id: 'an-002',
            lawTitle: '電波法',
            risk: 'low',
            submittedBy: 'Yamada Taro',
            date: '2026-02-14',
            status: 'pending'
        }
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">承認待ちアイテム</h2>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                    未承認: {requests.length}件
                </span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状態</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">法令名</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">リスク</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">担当者</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">申請日</th>
                            <th className="relative px-6 py-3">
                                <span className="sr-only">操作</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {requests.map((req) => (
                            <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="flex items-center text-orange-600 text-sm font-medium">
                                        <Clock size={16} className="mr-1" /> 承認待ち
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{req.lawTitle}</div>
                                    <div className="text-xs text-gray-500">ID: {req.id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${req.risk === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                                            req.risk === 'medium' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                'bg-green-50 text-green-700 border-green-200'
                                        }`}>
                                        {req.risk === 'high' ? '高' : req.risk === 'medium' ? '中' : '低'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {req.submittedBy}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {req.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900 flex items-center justify-end gap-1">
                                        レビュー <ArrowRight size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApprovalList;
