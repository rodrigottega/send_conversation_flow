import React, { useEffect, useState } from 'react';
import { RiSendPlaneFill, RiCheckDoubleLine } from '@remixicon/react';
import { SendingConfig } from './types';

interface WizardStep3Props {
  onComplete: () => void;
  config: SendingConfig;
}

const WizardStep3: React.FC<WizardStep3Props> = ({ onComplete, config }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // If fast strategy, simulate faster completion
    const duration = config.strategy === 'fast' ? 8000 : 12000; 
    const intervalTime = 100;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(100, (currentStep / steps) * 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 500); // Small delay before transition
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete, config.strategy]);

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in max-w-2xl mx-auto text-center">
      <div className="mb-8 relative">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
             <RiSendPlaneFill size={40} className="text-[#202020]" />
        </div>
      </div>
      
      <h2 className="text-[24px] font-semibold text-[#202020] mb-2">Enviando campaña...</h2>
      <p className="text-[#767676] mb-8">
          No cierres esta ventana. Estamos procesando el envío 
          {config.strategy === 'safe' ? ' en lotes seguros.' : ' en modo de alta velocidad.'}
      </p>

      <div className="w-full bg-gray-100 rounded-full h-4 mb-4 overflow-hidden">
        <div 
            className="bg-[#202020] h-full transition-all duration-100 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex justify-between w-full text-sm text-[#767676] px-1">
        <span>Iniciando...</span>
        <span className="font-medium text-[#202020]">{Math.round(progress)}%</span>
        <span>Completando</span>
      </div>

      <div className="mt-12 p-4 bg-gray-50 border border-[#DFE1E6] rounded-lg text-left w-full max-w-md">
        <h4 className="text-sm font-semibold text-[#202020] mb-2">Log de actividad</h4>
        <div className="space-y-2 text-xs text-[#767676]">
            {progress > 10 && <div className="flex items-center gap-2"><RiCheckDoubleLine size={14} className="text-green-600"/> Archivo procesado correctamente</div>}
            {progress > 30 && <div className="flex items-center gap-2"><RiCheckDoubleLine size={14} className="text-green-600"/> Validación de números completada</div>}
            {progress > 60 && (
                <div className="flex items-center gap-2">
                    <RiCheckDoubleLine size={14} className="text-green-600"/> 
                    {config.strategy === 'safe' 
                        ? 'Primer lote enviado (Modo Seguro)' 
                        : 'Enviando ráfaga inicial (Modo Rápido)'}
                </div>
            )}
            {progress > 90 && (
                <div className="flex items-center gap-2">
                    <RiCheckDoubleLine size={14} className="text-green-600"/> 
                    {config.strategy === 'safe' ? 'Optimizando velocidad de entrega...' : 'Verificando throughput...'}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default WizardStep3;