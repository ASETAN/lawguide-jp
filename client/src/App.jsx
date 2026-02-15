import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LawViewer from './pages/LawViewer';
import ImpactWorkflow from './pages/ImpactWorkflow';
import ApprovalList from './pages/ApprovalList';
import Settings from './pages/Settings';
import Proposals from './pages/Proposals';

// Placeholder pages for routes not yet implemented
const Placeholder = ({ title }) => (
  <div className="p-10 text-center text-gray-500">
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p>この機能は現在開発中です。</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="laws/:id" element={<LawViewer />} />
          <Route path="laws" element={<Placeholder title="法令一覧" />} />
          <Route path="proposals" element={<Proposals />} />
          <Route path="audit" element={<Placeholder title="監査ログ" />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
