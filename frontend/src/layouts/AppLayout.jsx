import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import UpgradeModal from '../components/UpgradeModal';
import Toast from '../components/Toast';
import { useProjects } from '../context/ProjectContext';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const { toast, closeToast } = useProjects();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Toast notifications */}
      <Toast toast={toast} onClose={closeToast} />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenUpgrade={() => setUpgradeModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenUpgrade={() => setUpgradeModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ onOpenUpgrade: () => setUpgradeModalOpen(true) }} />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
