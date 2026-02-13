import React, { useState } from 'react';
import WizardStep1 from './wizard/WizardStep1';
import WizardStep2 from './wizard/WizardStep2';
import WizardStep3 from './wizard/WizardStep3';
import WizardStep4 from './wizard/WizardStep4';
import { SendingConfig } from './wizard/types';

interface CampaignWizardProps {
  onExit: () => void;
}

const CampaignWizard: React.FC<CampaignWizardProps> = ({ onExit }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<SendingConfig>({
    scheduleType: 'now',
    scheduledDate: '',
    scheduledTime: '',
    strategy: 'safe',
    
    // Monitoring Defaults (Recommended)
    monitoringLevel: 'recommended',
    notificationChannels: ['Email', 'WhatsApp'],
    notificationFrequency: 'summary_1h',
    notifyOnMetaPause: true,
    notifyOnCompletion: true,
    notifyOnFailure: true,
    failureThreshold: 15,
    isSlackConnected: false,
    isWebhookConfigured: false,
    webhookUrl: ''
  });

  const handleStartCampaign = (newConfig: SendingConfig) => {
    setConfig(newConfig);
    setStep(3);
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen p-8 flex flex-col">
      {/* Wizard Header / Progress */}
      {step < 4 && (
        <div className="max-w-4xl mx-auto w-full mb-8 flex items-center justify-between">
            <button onClick={onExit} className="text-sm text-[#767676] hover:text-[#202020] font-medium">
                Cancelar y salir
            </button>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-[#202020]' : 'bg-[#DFE1E6]'}`}></div>
                <div className={`w-8 h-[1px] ${step >= 2 ? 'bg-[#202020]' : 'bg-[#DFE1E6]'}`}></div>
                <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-[#202020]' : 'bg-[#DFE1E6]'}`}></div>
                <div className={`w-8 h-[1px] ${step >= 3 ? 'bg-[#202020]' : 'bg-[#DFE1E6]'}`}></div>
                <div className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-[#202020]' : 'bg-[#DFE1E6]'}`}></div>
            </div>
            <div className="w-[100px]"></div> {/* Spacer for center alignment */}
        </div>
      )}

      {/* Main Wizard Content Area */}
      <div className="flex-1 max-w-5xl mx-auto w-full bg-white rounded-xl shadow-sm border border-[#DFE1E6] p-8 md:p-10 relative overflow-hidden flex flex-col">
        {step === 1 && (
            <WizardStep1 onContinue={() => setStep(2)} />
        )}
        {step === 2 && (
            <WizardStep2 onBack={() => setStep(1)} onStart={handleStartCampaign} />
        )}
        {step === 3 && (
            <WizardStep3 config={config} onComplete={() => setStep(4)} />
        )}
        {step === 4 && (
            <WizardStep4 onClose={onExit} config={config} />
        )}
      </div>
    </div>
  );
};

export default CampaignWizard;