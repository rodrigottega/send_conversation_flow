import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Toolbar from './components/Toolbar';
import CampaignCard from './components/CampaignCard';
import CampaignWizard from './components/CampaignWizard';
import { CAMPAIGNS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'wizard'>('dashboard');

  const handleStartCampaign = () => {
    setView('wizard');
  };

  const handleExitWizard = () => {
    setView('dashboard');
  };

  // Render Full Screen Wizard
  if (view === 'wizard') {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-sans antialiased text-[#202020]">
        <CampaignWizard onExit={handleExitWizard} />
      </div>
    );
  }

  // Render Dashboard Layout
  return (
    <div className="flex min-h-screen bg-[#F9FAFB] font-sans antialiased text-[#202020]">
      <Sidebar />
      
      {/* Main Content Wrapper */}
      <div className="flex-1 ml-[272px] relative flex flex-col">
        <TopBar />
        
        <main className="flex-1 p-6 pl-8 animate-fade-in">
            {/* Toolbar Section */}
            <div className="mt-2">
                <Toolbar />
            </div>

            {/* Content Grid */}
            <div className="mt-8">
                <h2 className="text-[20px] font-semibold text-[#202020] mb-6 tracking-tight">
                Todas tus conversaciones
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {CAMPAIGNS.map(campaign => (
                    <CampaignCard 
                        key={campaign.id} 
                        campaign={campaign} 
                        onSend={handleStartCampaign}
                    />
                ))}
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;