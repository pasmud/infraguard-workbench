import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ScanResults from './pages/ScanResults';
import Exceptions from './pages/Exceptions';
import Compliance from './pages/Compliance';
import Reports from './pages/Reports';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scan-results" element={<ScanResults />} />
        <Route path="/exceptions" element={<Exceptions />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}
