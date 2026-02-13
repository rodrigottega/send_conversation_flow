import React from 'react';
import { 
  RiCheckLine, 
  RiDownloadLine, 
  RiEyeLine, 
  RiPieChartLine,
  RiGroupLine,
  RiErrorWarningLine
} from '@remixicon/react';
import { SendingConfig } from './types';

interface WizardStep4Props {
  onClose: () => void;
  config?: SendingConfig;
}

const WizardStep4: React.FC<WizardStep4Props> = ({ onClose, config }) => {
  
  const getNotificationText = () => {
    const channels = config?.notificationChannels || [];
    if (channels.length === 0) {
        return "Si hay errores en el envío, te notificaremos de inmediato en el dashboard.";
    }
    
    // Join with commas and 'y' for the last item
    const channelString = channels.length === 1 
        ? channels[0] 
        : `${channels.slice(0, -1).join(', ')} y ${channels[channels.length - 1]}`;

    return `Si hay errores en el envío, te notificaremos de inmediato por ${channelString}.`;
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between mb-8 border-b border-[#DFE1E6] pb-6">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                    <RiCheckLine size={20} />
                </div>
                <h2 className="text-[24px] font-semibold text-[#202020]">Envío en progreso</h2>
            </div>
            <p className="text-[#767676]">Tu campaña se está enviando en segundo plano. Te notificaremos cuando termine.</p>
        </div>
        <div className="text-right">
             <span className="inline-block px-3 py-1 bg-gray-100 text-[#202020] text-sm font-medium rounded-full">
                Estado: Procesando Lote 1/3
             </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats Summary */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#DFE1E6] rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-[#202020] mb-4">Resumen Ejecutivo</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="block text-xs text-[#767676] uppercase tracking-wide">Enviados</span>
                        <span className="block text-xl font-bold text-[#202020]">9,240</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="block text-xs text-[#767676] uppercase tracking-wide">Excluidos</span>
                        <span className="block text-xl font-bold text-[#767676]">430</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="block text-xs text-[#767676] uppercase tracking-wide">Fallidos</span>
                        <span className="block text-xl font-bold text-red-600">120</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="block text-xs text-[#767676] uppercase tracking-wide">Respuestas</span>
                        <span className="block text-xl font-bold text-green-600">86</span>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-[#DFE1E6] rounded text-sm font-medium text-[#202020] hover:bg-gray-50">
                        <RiEyeLine size={16} /> Ver reporte detallado
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-[#DFE1E6] rounded text-sm font-medium text-[#202020] hover:bg-gray-50">
                        <RiDownloadLine size={16} /> Descargar CSV
                    </button>
                </div>
            </div>

            {/* Quick Insights */}
            <div>
                <h3 className="font-semibold text-[#202020] mb-3">Insights preliminares</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-[#DFE1E6] rounded-lg bg-white flex items-start gap-3">
                         <div className="p-2 bg-yellow-50 rounded text-yellow-700">
                             <RiErrorWarningLine size={18} />
                         </div>
                         <div>
                             <p className="text-sm font-medium text-[#202020]">Variable crítica</p>
                             <p className="text-xs text-[#767676] mt-1">La variable "nombre" faltó en el 15% de los fallidos.</p>
                         </div>
                    </div>
                    <div className="p-4 border border-[#DFE1E6] rounded-lg bg-white flex items-start gap-3">
                         <div className="p-2 bg-gray-100 rounded text-gray-700">
                             <RiGroupLine size={18} />
                         </div>
                         <div>
                             <p className="text-sm font-medium text-[#202020]">Opt-out alto</p>
                             <p className="text-xs text-[#767676] mt-1">El segmento "Inactivos" tuvo 40% más rechazos que el promedio.</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {/* What's Next Sidebar */}
        <div className="bg-[#FAFAFA] border border-[#DFE1E6] rounded-lg p-6 h-fit">
            <h3 className="font-semibold text-[#202020] mb-4">¿Qué sigue?</h3>
            <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-sm text-[#767676]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#202020] mt-1.5 flex-shrink-0"></div>
                    Revisa las métricas de apertura en ~1 hora.
                </li>
                <li className="flex gap-3 text-sm text-[#767676]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#202020] mt-1.5 flex-shrink-0"></div>
                    {getNotificationText()}
                </li>
                <li className="flex gap-3 text-sm text-[#767676]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#202020] mt-1.5 flex-shrink-0"></div>
                    Puedes cerrar esta ventana sin afectar el envío.
                </li>
            </ul>

            <button 
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#202020] text-white rounded font-medium hover:bg-[#333] transition-colors"
            >
                <RiPieChartLine size={18} />
                Revisar resultados
            </button>
        </div>
      </div>
    </div>
  );
};

export default WizardStep4;