import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Pipeline } from './pages/Pipeline';
import { Contacts } from './pages/Contacts';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </HashRouter>
  );
}