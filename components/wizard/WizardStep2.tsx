import React, { useState, useEffect } from 'react';
import { 
  RiCalendarEventLine, 
  RiSendPlaneFill, 
  RiNotification3Line,
  RiSpeedLine,
  RiShieldCheckLine,
  RiFlashlightLine,
  RiTimerLine,
  RiBarChartBoxLine,
  RiErrorWarningLine,
  RiSlackFill,
  RiCodeBoxLine,
  RiMailLine,
  RiWhatsappLine,
  RiAddLine,
  RiCheckLine,
  RiCloseLine,
  RiSettings3Line,
  RiSubtractLine,
  RiAddFill
} from '@remixicon/react';
import { SendingConfig } from './types';

interface WizardStep2Props {
  onBack: () => void;
  onStart: (config: SendingConfig) => void;
}

const WizardStep2: React.FC<WizardStep2Props> = ({ onBack, onStart }) => {
  // Scheduling & Strategy State
  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [speedIndex, setSpeedIndex] = useState(1); // 1 = Balanced

  // Monitoring State
  const [isMonitoringEnabled, setIsMonitoringEnabled] = useState(false); // Default OFF
  const [monitoringLevel, setMonitoringLevel] = useState<'basic' | 'recommended' | 'strict' | 'custom'>('recommended');
  const [channels, setChannels] = useState<string[]>(['Email', 'WhatsApp']);
  const [frequency, setFrequency] = useState<'immediate' | 'summary_30m' | 'summary_1h'>('summary_1h');
  
  // Triggers
  const [notifyMetaPause, setNotifyMetaPause] = useState(true);
  const [notifyFailure, setNotifyFailure] = useState(true);
  const [notifyCompletion, setNotifyCompletion] = useState(true);
  const [failureThreshold, setFailureThreshold] = useState(20);

  // Integrations
  const [isSlackConnected, setIsSlackConnected] = useState(false);
  const [isWebhookConfigured, setIsWebhookConfigured] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');

  // Modals
  const [showSlackModal, setShowSlackModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);

  // Derived strategy
  const strategy = speedIndex <= 1 ? 'safe' : 'fast';

  // Apply Presets
  useEffect(() => {
    if (monitoringLevel === 'custom') return;

    if (monitoringLevel === 'basic') {
        setChannels(['Email']);
        setFrequency('immediate');
        setNotifyMetaPause(false);
        setNotifyFailure(false);
        setNotifyCompletion(true);
    } else if (monitoringLevel === 'recommended') {
        setChannels(['Email', 'WhatsApp']);
        setFrequency('summary_1h');
        setNotifyMetaPause(true);
        setNotifyFailure(true);
        setFailureThreshold(15);
        setNotifyCompletion(true);
    } else if (monitoringLevel === 'strict') {
        setChannels(['Email', 'WhatsApp']); // Slack would be added if connected
        setFrequency('immediate');
        setNotifyMetaPause(true);
        setNotifyFailure(true);
        setFailureThreshold(5);
        setNotifyCompletion(true);
    }
  }, [monitoringLevel]);

  // Handle Manual Change (Switch to Custom)
  const handleManualChange = (changer: () => void) => {
    setMonitoringLevel('custom');
    changer();
  };

  const toggleChannel = (channel: string) => {
    handleManualChange(() => {
        setChannels(prev => 
            prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
        );
    });
  };

  const adjustThreshold = (delta: number) => {
      handleManualChange(() => {
          setFailureThreshold(prev => Math.min(100, Math.max(1, prev + delta)));
      });
  };

  const handleThresholdInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value);
      if (!isNaN(val)) {
          handleManualChange(() => {
            setFailureThreshold(Math.min(100, Math.max(1, val)));
          });
      }
  };

  // Strategy Presets
  const selectSafeMode = () => setSpeedIndex(1); // Balanced
  const selectFastMode = () => setSpeedIndex(2); // Fast (Use 2 for Rápido card, or 3 for Turbo)

  // Integration Handlers
  const handleConnectSlack = () => {
    // Simulate API call
    setTimeout(() => {
        setIsSlackConnected(true);
        setShowSlackModal(false);
        // Auto-add to channels
        setChannels(prev => [...prev, 'Slack']); 
    }, 1000);
  };

  const handleSaveWebhook = () => {
    if(!webhookUrl) return;
    setIsWebhookConfigured(true);
    setShowWebhookModal(false);
    setChannels(prev => [...prev, 'Webhooks']);
  };

  const getSummaryText = () => {
    if (!isMonitoringEnabled) return 'No se enviarán notificaciones.';

    const activeEvents = [];
    if (notifyMetaPause) activeEvents.push('Meta limite el envío');
    if (notifyFailure) activeEvents.push(`fallas > ${failureThreshold}%`);
    if (notifyCompletion) activeEvents.push('al finalizar');

    if (activeEvents.length === 0) return 'No se enviarán notificaciones.';

    const channelsText = channels.filter(c => c !== 'Webhooks').join(' + ');
    const webhookText = channels.includes('Webhooks') ? ' Además enviaremos eventos a Webhooks.' : '';
    
    // Formatting natural language list
    const eventsText = activeEvents.length > 1 
        ? `${activeEvents.slice(0, -1).join(', ')} y ${activeEvents[activeEvents.length - 1]}`
        : activeEvents[0];

    const freqText = frequency === 'immediate' ? 'Tiempo real' : frequency === 'summary_30m' ? 'Resumen cada 30m' : 'Resumen cada 1h';

    return `Te avisaremos por ${channelsText || '...'} cuando ${eventsText}. Frecuencia: ${freqText}.${webhookText}`;
  };

  const handleStart = () => {
    // If monitoring is disabled, we might want to clear channels or set a flag
    // For now, passing current state, but parent logic should respect isMonitoringEnabled (or absence of channels)
    const finalChannels = isMonitoringEnabled ? channels : [];

    onStart({
        scheduleType,
        scheduledDate,
        scheduledTime,
        strategy,
        
        monitoringLevel,
        notificationChannels: finalChannels,
        notificationFrequency: frequency,
        
        notifyOnMetaPause: isMonitoringEnabled && notifyMetaPause,
        notifyOnFailure: isMonitoringEnabled && notifyFailure,
        notifyOnCompletion: isMonitoringEnabled && notifyCompletion,
        failureThreshold,
        
        isSlackConnected,
        isWebhookConfigured,
        webhookUrl
    });
  };

  // Configuration Data for speed levels
  const SPEED_LEVELS = [
    { label: 'Conservador', msgsPerMin: '~60 msg/min', estTime: '17 min', risk: 'Muy Bajo', desc: 'Prioriza la seguridad absoluta.', color: 'bg-green-500' },
    { label: 'Balanceado', msgsPerMin: '~120 msg/min', estTime: '8 min', risk: 'Bajo', desc: 'Equilibrio perfecto. Velocidad constante.', color: 'bg-green-600' },
    { label: 'Rápido', msgsPerMin: '~300 msg/min', estTime: '3 min', risk: 'Medio', desc: 'Mayor velocidad. Solo bases verificadas.', color: 'bg-orange-500' },
    { label: 'Turbo', msgsPerMin: 'Sin límite', estTime: '< 1 min', risk: 'Alto', desc: 'Envío inmediato (Límites API).', color: 'bg-red-500' }
  ];
  const currentSpeed = SPEED_LEVELS[speedIndex];

  return (
    <div className="flex flex-col h-full animate-fade-in text-[#202020] w-full relative">
      <div className="flex items-start justify-between mb-8">
        <div>
            <h2 className="text-[24px] font-semibold mb-2">Configuración de envío</h2>
            <p className="text-[#767676]">Define cómo y cuándo quieres enviar tu campaña.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={onBack}
                className="px-6 py-2.5 rounded font-medium border border-[#DFE1E6] text-[#767676] hover:bg-gray-50 hover:text-[#202020] transition-colors"
            >
                Atrás
            </button>
            <button 
                onClick={handleStart}
                className="px-6 py-2.5 rounded font-medium bg-[#202020] text-white hover:bg-[#333] flex items-center gap-2"
            >
                <RiSendPlaneFill size={18} />
                Iniciar envío
            </button>
        </div>
      </div>

      <div className="space-y-8 w-full pb-8">
        {/* Scheduling */}
        <div className="bg-white border border-[#DFE1E6] rounded-lg p-6 shadow-sm w-full">
            <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                <RiCalendarEventLine size={20} className="text-[#202020]" />
                Programación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label 
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${scheduleType === 'now' ? 'border-[#202020] bg-gray-50 ring-1 ring-[#202020]' : 'border-[#DFE1E6] hover:bg-gray-50'}`}
                    onClick={() => setScheduleType('now')}
                >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${scheduleType === 'now' ? 'border-[#202020]' : 'border-[#DFE1E6]'}`}>
                        {scheduleType === 'now' && <div className="w-2.5 h-2.5 rounded-full bg-[#202020]"></div>}
                    </div>
                    <div>
                        <span className="block font-medium">Enviar ahora</span>
                        <span className="text-xs text-[#767676]">Comenzar inmediatamente</span>
                    </div>
                </label>
                <label 
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${scheduleType === 'later' ? 'border-[#202020] bg-gray-50 ring-1 ring-[#202020]' : 'border-[#DFE1E6] hover:bg-gray-50'}`}
                    onClick={() => setScheduleType('later')}
                >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${scheduleType === 'later' ? 'border-[#202020]' : 'border-[#DFE1E6]'}`}>
                         {scheduleType === 'later' && <div className="w-2.5 h-2.5 rounded-full bg-[#202020]"></div>}
                    </div>
                    <div>
                        <span className="block font-medium">Programar</span>
                        <span className="text-xs text-[#767676]">Elegir fecha y hora</span>
                    </div>
                </label>
            </div>
            {scheduleType === 'later' && (
                <div className="mt-4 pt-4 border-t border-[#DFE1E6] grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                    <div>
                        <label className="block text-sm font-medium mb-1">Fecha</label>
                        <input type="date" className="w-full h-10 border border-[#DFE1E6] rounded px-3 text-sm focus:outline-none focus:border-[#202020]" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Hora</label>
                        <input type="time" className="w-full h-10 border border-[#DFE1E6] rounded px-3 text-sm focus:outline-none focus:border-[#202020]" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
                    </div>
                </div>
            )}
        </div>

        {/* Monitoring Section (Redesigned with Toggle) */}
        <div className="bg-white border border-[#DFE1E6] rounded-lg p-6 shadow-sm w-full transition-all">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="font-medium text-lg flex items-center gap-2 mb-1">
                        <RiNotification3Line size={20} className="text-[#202020]" />
                        Monitoreo del envío
                    </h3>
                    <p className="text-sm text-[#767676]">
                        Recibe alertas si Meta limita el envío o si ocurre algo que requiera acción.
                    </p>
                </div>
                <button
                    onClick={() => setIsMonitoringEnabled(!isMonitoringEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isMonitoringEnabled ? 'bg-[#202020]' : 'bg-gray-200'}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${isMonitoringEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>

            {isMonitoringEnabled && (
                <div className="animate-fade-in">
                    {/* Presets Control */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-3">
                        <div className="inline-flex bg-gray-100 rounded-lg p-1">
                            {(['basic', 'recommended', 'strict'] as const).map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setMonitoringLevel(level)}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                                        monitoringLevel === level 
                                        ? 'bg-white text-[#202020] shadow-sm' 
                                        : 'text-[#767676] hover:text-[#202020]'
                                    }`}
                                >
                                    {level === 'basic' ? 'Básico' : level === 'recommended' ? 'Recomendado' : 'Estricto'}
                                </button>
                            ))}
                        </div>
                        {monitoringLevel === 'custom' && (
                            <span className="text-xs font-semibold bg-[#202020] text-white px-3 py-1.5 rounded-full flex items-center gap-1">
                                <RiSettings3Line size={12} />
                                Personalizado
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-[#DFE1E6] pt-8">
                        {/* Column 1: Channels */}
                        <div className="border-r border-transparent lg:border-[#DFE1E6] lg:pr-8">
                            <h4 className="text-sm font-semibold text-[#202020] mb-5">Canales</h4>
                            <div className="space-y-4">
                                {/* Email */}
                                <div className="flex items-center gap-4 group">
                                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                                        <div className={`w-9 h-9 rounded flex items-center justify-center transition-colors ${channels.includes('Email') ? 'bg-[#202020] text-white' : 'bg-gray-100 text-[#767676]'}`}>
                                            <RiMailLine size={18} />
                                        </div>
                                        <span className="text-sm font-medium text-[#202020]">Email</span>
                                    </label>
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 rounded border-gray-300 text-[#202020] focus:ring-[#202020] cursor-pointer"
                                        checked={channels.includes('Email')}
                                        onChange={() => toggleChannel('Email')}
                                    />
                                </div>
                                
                                {/* WhatsApp */}
                                <div className="flex items-center gap-4 group">
                                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                                        <div className={`w-9 h-9 rounded flex items-center justify-center transition-colors ${channels.includes('WhatsApp') ? 'bg-[#202020] text-white' : 'bg-gray-100 text-[#767676]'}`}>
                                            <RiWhatsappLine size={18} />
                                        </div>
                                        <span className="text-sm font-medium text-[#202020]">WhatsApp</span>
                                    </label>
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 rounded border-gray-300 text-[#202020] focus:ring-[#202020] cursor-pointer"
                                        checked={channels.includes('WhatsApp')}
                                        onChange={() => toggleChannel('WhatsApp')}
                                    />
                                </div>

                                {/* Slack */}
                                <div className="flex items-center gap-4 group">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`w-9 h-9 rounded flex items-center justify-center transition-colors ${isSlackConnected ? (channels.includes('Slack') ? 'bg-[#202020] text-white' : 'bg-white border border-gray-200 text-[#202020]') : 'bg-gray-50 text-gray-400'}`}>
                                            <RiSlackFill size={18} />
                                        </div>
                                        <span className={`text-sm font-medium ${isSlackConnected ? 'text-[#202020]' : 'text-[#767676]'}`}>Slack</span>
                                        {!isSlackConnected && (
                                            <button 
                                                onClick={() => setShowSlackModal(true)}
                                                className="text-xs font-medium text-[#202020] hover:underline flex items-center gap-1 ml-auto"
                                            >
                                                <RiAddLine size={14}/> Conectar
                                            </button>
                                        )}
                                    </div>
                                    {isSlackConnected && (
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 rounded border-gray-300 text-[#202020] focus:ring-[#202020] cursor-pointer"
                                            checked={channels.includes('Slack')}
                                            onChange={() => toggleChannel('Slack')}
                                        />
                                    )}
                                </div>

                                {/* Webhooks */}
                                <div className="flex items-center gap-4 group">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`w-9 h-9 rounded flex items-center justify-center transition-colors ${isWebhookConfigured ? (channels.includes('Webhooks') ? 'bg-[#202020] text-white' : 'bg-white border border-gray-200 text-[#202020]') : 'bg-gray-50 text-gray-400'}`}>
                                            <RiCodeBoxLine size={18} />
                                        </div>
                                        <span className={`text-sm font-medium ${isWebhookConfigured ? 'text-[#202020]' : 'text-[#767676]'}`}>Webhooks</span>
                                        {!isWebhookConfigured ? (
                                            <button 
                                                onClick={() => setShowWebhookModal(true)}
                                                className="text-xs font-medium text-[#202020] hover:underline flex items-center gap-1 ml-auto"
                                            >
                                                <RiSettings3Line size={14}/> Configurar
                                            </button>
                                        ) : (
                                            <button onClick={() => setShowWebhookModal(true)} className="text-xs text-[#767676] hover:text-[#202020] ml-auto"><RiSettings3Line size={16}/></button>
                                        )}
                                    </div>
                                    {isWebhookConfigured && (
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 rounded border-gray-300 text-[#202020] focus:ring-[#202020] cursor-pointer"
                                            checked={channels.includes('Webhooks')}
                                            onChange={() => toggleChannel('Webhooks')}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Events & Frequency */}
                        <div className="space-y-8">
                            {/* Events */}
                            <div>
                                <h4 className="text-sm font-semibold text-[#202020] mb-5">Avisarme cuando...</h4>
                                <div className="space-y-4">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#202020] focus:ring-[#202020]"
                                            checked={notifyMetaPause}
                                            onChange={(e) => handleManualChange(() => setNotifyMetaPause(e.target.checked))}
                                        />
                                        <div>
                                            <span className="block text-sm font-medium text-[#202020] group-hover:text-[#000]">Meta pause o limite el envío</span>
                                            <span className="block text-xs text-[#767676]">Calidad / rate limits. Treble reintentará automáticamente.</span>
                                        </div>
                                    </label>

                                    <div className={`flex items-start gap-3 transition-all ${notifyFailure ? 'opacity-100' : 'opacity-50'}`}>
                                        <input 
                                            type="checkbox" 
                                            className="mt-2 w-4 h-4 rounded border-gray-300 text-[#202020] focus:ring-[#202020] cursor-pointer"
                                            checked={notifyFailure}
                                            onChange={(e) => handleManualChange(() => setNotifyFailure(e.target.checked))}
                                        />
                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                                <span className="text-sm font-medium text-[#202020]">La tasa de fallas supere el</span>
                                                
                                                {/* Improved Percentage Stepper - Fixed Width */}
                                                <div className="flex items-center w-fit">
                                                    <button 
                                                        disabled={!notifyFailure || failureThreshold <= 0}
                                                        onClick={() => adjustThreshold(-10)}
                                                        className="w-8 h-8 flex items-center justify-center border border-r-0 border-[#DFE1E6] rounded-l bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                                    >
                                                        <RiSubtractLine size={14} />
                                                    </button>
                                                    <div className="h-8 border-y border-[#DFE1E6] flex items-center justify-center w-[80px] bg-white relative">
                                                        <input 
                                                            type="number"
                                                            disabled={!notifyFailure}
                                                            value={failureThreshold}
                                                            onChange={handleThresholdInputChange}
                                                            className="w-full h-full text-center text-sm font-semibold text-[#202020] focus:outline-none disabled:text-gray-400 pl-1"
                                                        />
                                                        <span className="absolute right-3 text-xs text-[#767676] pointer-events-none">%</span>
                                                    </div>
                                                    <button 
                                                        disabled={!notifyFailure || failureThreshold >= 100}
                                                        onClick={() => adjustThreshold(10)}
                                                        className="w-8 h-8 flex items-center justify-center border border-l-0 border-[#DFE1E6] rounded-r bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                                    >
                                                        <RiAddFill size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <span className="block text-xs text-[#767676]">Incluye errores de entrega, opt-out e inválidos.</span>
                                        </div>
                                    </div>

                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#202020] focus:ring-[#202020]"
                                            checked={notifyCompletion}
                                            onChange={(e) => handleManualChange(() => setNotifyCompletion(e.target.checked))}
                                        />
                                        <div>
                                            <span className="block text-sm font-medium text-[#202020] group-hover:text-[#000]">El envío termine</span>
                                            <span className="block text-xs text-[#767676]">Te avisaremos aunque siga en progreso parcial.</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Frequency */}
                            <div className="pt-4 border-t border-dashed border-[#DFE1E6]">
                                <h4 className="text-sm font-semibold text-[#202020] mb-3">Frecuencia</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input 
                                            type="radio" name="freq" 
                                            className="w-4 h-4 text-[#202020] focus:ring-[#202020]"
                                            checked={frequency === 'immediate'}
                                            onChange={() => handleManualChange(() => setFrequency('immediate'))}
                                        />
                                        <span className="text-sm text-[#202020] group-hover:text-[#000]">En tiempo real (cada evento)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input 
                                            type="radio" name="freq" 
                                            className="w-4 h-4 text-[#202020] focus:ring-[#202020]"
                                            checked={frequency === 'summary_30m'}
                                            onChange={() => handleManualChange(() => setFrequency('summary_30m'))}
                                        />
                                        <span className="text-sm text-[#202020] group-hover:text-[#000]">Resumen cada 30 min</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input 
                                            type="radio" name="freq" 
                                            className="w-4 h-4 text-[#202020] focus:ring-[#202020]"
                                            checked={frequency === 'summary_1h'}
                                            onChange={() => handleManualChange(() => setFrequency('summary_1h'))}
                                        />
                                        <span className="text-sm text-[#202020] group-hover:text-[#000]">Resumen cada 1 hora <span className="text-[#767676] text-xs ml-1">(Recomendado)</span></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Dynamic Summary Footer */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-[#DFE1E6] flex gap-3">
                        <RiTimerLine className="text-[#202020] flex-shrink-0 mt-0.5" size={18} />
                        <div className="text-sm text-[#202020] leading-relaxed">
                            <span className="font-semibold block mb-1">Resumen</span>
                            {getSummaryText()}
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Strategy Section */}
        <div className="bg-white border border-[#DFE1E6] rounded-lg p-6 shadow-sm w-full">
            <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                <RiSpeedLine size={20} className="text-[#202020]" />
                Tipo de envío
            </h3>
            
            {/* Quick Selectors (Restored) */}
            <div className="mb-8">
                <label className="block text-sm font-medium mb-3">Estrategia general</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div 
                        onClick={selectSafeMode}
                        className={`p-4 border rounded-lg flex flex-col gap-2 cursor-pointer transition-all h-full ${strategy === 'safe' ? 'border-[#202020] bg-gray-50 ring-1 ring-[#202020]' : 'border-[#DFE1E6] hover:bg-gray-50'}`}
                     >
                        <div className="flex items-center gap-2 mb-1">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${strategy === 'safe' ? 'border-[#202020]' : 'border-gray-300'}`}>
                                {strategy === 'safe' && <div className="w-2 h-2 rounded-full bg-[#202020]"></div>}
                            </div>
                            <div className="flex items-center gap-1 font-semibold text-[#202020]"><RiShieldCheckLine size={18}/> Seguro (Recomendado)</div>
                        </div>
                        <p className="text-sm text-[#767676] pl-6">Optimizado para entregabilidad y protección de número.</p>
                     </div>
                     <div 
                        onClick={selectFastMode}
                        className={`p-4 border rounded-lg flex flex-col gap-2 cursor-pointer transition-all h-full ${strategy === 'fast' ? 'border-[#202020] bg-gray-50 ring-1 ring-[#202020]' : 'border-[#DFE1E6] hover:bg-gray-50'}`}
                     >
                        <div className="flex items-center gap-2 mb-1">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${strategy === 'fast' ? 'border-[#202020]' : 'border-gray-300'}`}>
                                {strategy === 'fast' && <div className="w-2 h-2 rounded-full bg-[#202020]"></div>}
                            </div>
                            <div className="flex items-center gap-1 font-semibold text-[#202020]"><RiFlashlightLine size={18}/> Rápido</div>
                        </div>
                        <p className="text-sm text-[#767676] pl-6">Optimizado para velocidad y volumen masivo.</p>
                     </div>
                </div>
            </div>

            {/* Granular Slider Control */}
            <div className="mb-6 px-2">
                 <div className="flex justify-between items-center mb-6">
                    <label className="block text-sm font-medium">Ajuste fino de velocidad</label>
                    <span className="text-xs font-semibold bg-gray-100 text-[#202020] px-2 py-1 rounded">
                        Modo actual: {currentSpeed.label}
                    </span>
                 </div>
                 
                 <div className="relative pt-2 pb-6">
                    {/* Range Slider */}
                    <input 
                        type="range" 
                        min="0" max="3" step="1"
                        value={speedIndex}
                        onChange={(e) => setSpeedIndex(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#202020]"
                    />
                    <div className="flex justify-between text-xs text-[#767676] mt-3 font-medium px-1">
                        {SPEED_LEVELS.map((lvl, idx) => (
                            <span 
                                key={lvl.label} 
                                onClick={() => setSpeedIndex(idx)}
                                className={`cursor-pointer transition-colors ${speedIndex === idx ? 'text-[#202020] font-bold' : ''}`}
                            >
                                {lvl.label}
                            </span>
                        ))}
                    </div>
                 </div>
            </div>
            
            {/* Performance Estimation */}
            <div className="bg-[#FAFAFA] border border-[#DFE1E6] rounded-lg p-5">
                <h4 className="font-semibold text-sm text-[#202020] mb-4 flex items-center gap-2">
                    <RiBarChartBoxLine size={18} /> Estimación de tiempo de envío
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                        <span className="block text-xs text-[#767676] mb-1">Velocidad de salida</span>
                        <div className="flex items-center gap-2">
                            <RiSpeedLine size={16} className="text-[#202020]"/>
                            <span className="font-semibold text-[#202020]">{currentSpeed.msgsPerMin}</span>
                        </div>
                    </div>
                    <div>
                        <span className="block text-xs text-[#767676] mb-1">Tiempo (por 1k contactos)</span>
                        <div className="flex items-center gap-2">
                            <RiTimerLine size={16} className="text-[#202020]"/>
                            <span className="font-semibold text-[#202020]">{currentSpeed.estTime}</span>
                        </div>
                    </div>
                    <div>
                        <span className="block text-xs text-[#767676] mb-1">Nivel de Riesgo</span>
                        <div className="flex items-center gap-2">
                            <RiErrorWarningLine size={16} className={speedIndex <= 1 ? 'text-green-600' : speedIndex === 2 ? 'text-orange-500' : 'text-red-500'}/>
                            <span className={`font-semibold ${speedIndex <= 1 ? 'text-green-700' : speedIndex === 2 ? 'text-orange-600' : 'text-red-600'}`}>
                                {currentSpeed.risk}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="pt-4 border-t border-[#DFE1E6] text-sm text-[#767676]">
                    <p>{currentSpeed.desc}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Slack Modal (Fixed Full Screen) */}
      {showSlackModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <div className="bg-white border border-[#DFE1E6] rounded-lg shadow-xl w-[400px] p-6 animate-fade-in mx-4">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                          <RiSlackFill size={24}/> Conectar Slack
                      </h3>
                      <button onClick={() => setShowSlackModal(false)}><RiCloseLine className="text-[#767676] hover:text-[#202020]"/></button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded mb-6 text-center">
                      <p className="text-sm text-[#202020] mb-2">Simulando OAuth con Slack...</p>
                      <div className="w-full bg-gray-200 h-1 rounded overflow-hidden">
                          <div className="bg-[#202020] h-full w-2/3 animate-pulse"></div>
                      </div>
                  </div>
                  <button 
                    onClick={handleConnectSlack}
                    className="w-full py-2.5 bg-[#202020] text-white rounded font-medium hover:bg-[#333]"
                  >
                      Autorizar conexión
                  </button>
              </div>
          </div>
      )}

      {/* Webhook Modal (Fixed Full Screen) */}
      {showWebhookModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <div className="bg-white border border-[#DFE1E6] rounded-lg shadow-xl w-[450px] p-6 animate-fade-in mx-4">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                          <RiCodeBoxLine size={24}/> Configurar Webhooks
                      </h3>
                      <button onClick={() => setShowWebhookModal(false)}><RiCloseLine className="text-[#767676] hover:text-[#202020]"/></button>
                  </div>
                  <div className="space-y-4 mb-6">
                      <div>
                          <label className="block text-sm font-medium mb-1">Endpoint URL</label>
                          <input 
                            type="text" 
                            placeholder="https://api.tudominio.com/webhook"
                            value={webhookUrl}
                            onChange={(e) => setWebhookUrl(e.target.value)}
                            className="w-full h-10 border border-[#DFE1E6] rounded px-3 focus:border-[#202020] focus:outline-none"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Secret Token (Opcional)</label>
                          <input type="password" placeholder="sk_test_..." className="w-full h-10 border border-[#DFE1E6] rounded px-3 focus:border-[#202020] focus:outline-none" />
                      </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                      <button onClick={() => setShowWebhookModal(false)} className="px-4 py-2 border border-[#DFE1E6] rounded text-[#202020] font-medium hover:bg-gray-50">Cancelar</button>
                      <button 
                        onClick={handleSaveWebhook}
                        disabled={!webhookUrl}
                        className={`px-4 py-2 rounded text-white font-medium ${webhookUrl ? 'bg-[#202020] hover:bg-[#333]' : 'bg-gray-300 cursor-not-allowed'}`}
                      >
                          Guardar configuración
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default WizardStep2;