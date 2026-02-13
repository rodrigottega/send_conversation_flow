import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  RiUploadCloud2Line, 
  RiUserAddLine, 
  RiFileExcel2Line, 
  RiErrorWarningLine, 
  RiCheckboxCircleLine, 
  RiForbidLine, 
  RiLoader4Line,
  RiQuestionLine,
  RiArrowDownSLine
} from '@remixicon/react';
import { Contact, WizardStats } from './types';

interface WizardStep1Props {
  onContinue: () => void;
}

const COUNTRIES = [
  { code: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: '+52', flag: '🇲🇽', name: 'México' },
  { code: '+1',  flag: '🇺🇸', name: 'USA' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: '+51', flag: '🇵🇪', name: 'Perú' },
  { code: '+55', flag: '🇧🇷', name: 'Brasil' },
  { code: '+34', flag: '🇪🇸', name: 'España' },
];

const GENERATE_CONTACTS = (count: number): Contact[] => {
  const contacts: Contact[] = [];
  const risks: Contact['risk'][] = ['low', 'low', 'low', 'medium', 'high', 'unknown'];
  const statuses: Contact['status'][] = ['valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'valid', 'invalid', 'duplicate', 'opt-out'];
  
  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    contacts.push({
      id: `c-${i}`,
      phone: `+57 3${Math.floor(Math.random() * 999999999)}`,
      name: `User ${i + 1}`,
      status: status,
      risk: status === 'valid' ? risks[Math.floor(Math.random() * risks.length)] : 'unknown'
    });
  }
  return contacts;
};

const WizardStep1: React.FC<WizardStep1Props> = ({ onContinue }) => {
  // State
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'valid_only'>('all');

  // Manual Entry State
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const stats: WizardStats = useMemo(() => {
    const total = contacts.length;
    if (total === 0) return { total: 0, valid: 0, invalid: 0, duplicates: 0, optOut: 0, score: 0 };
    
    const valid = contacts.filter(c => c.status === 'valid').length;
    const invalid = contacts.filter(c => c.status === 'invalid').length;
    const duplicates = contacts.filter(c => c.status === 'duplicate').length;
    const optOut = contacts.filter(c => c.status === 'opt-out').length;
    
    // Fake score calc
    const score = Math.max(0, 100 - (invalid * 2) - (duplicates * 5) - (optOut * 3));
    
    return { total, valid, invalid, duplicates, optOut, score };
  }, [contacts]);

  const hasIssues = stats.invalid > 0 || stats.duplicates > 0 || stats.optOut > 0;

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setContacts(prev => [...GENERATE_CONTACTS(50), ...prev]);
      setIsUploading(false);
    }, 1500);
  };

  const handleManualAdd = () => {
    if (!manualName.trim() || !manualPhone.trim()) return;

    const fullPhone = `${selectedCountry.code} ${manualPhone.trim()}`;
    
    // Check if phone already exists
    const isDuplicate = contacts.some(c => c.phone.replace(/\s/g, '') === fullPhone.replace(/\s/g, ''));

    const newContact: Contact = {
      id: `m-${Date.now()}`,
      phone: fullPhone,
      name: manualName,
      status: isDuplicate ? 'duplicate' : 'valid',
      risk: isDuplicate ? 'high' : 'low'
    };

    setContacts(prev => [newContact, ...prev]);
    setManualName('');
    setManualPhone('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        handleManualAdd();
    }
  };

  const filteredContacts = useMemo(() => {
    if (filter === 'valid_only') {
      return contacts.filter(c => c.status === 'valid');
    }
    return contacts;
  }, [contacts, filter]);

  return (
    <div className="flex flex-col h-full animate-fade-in w-full">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[24px] font-semibold text-[#202020]">Importar contactos</h2>
        <button 
            disabled={contacts.length === 0}
            onClick={onContinue}
            className={`px-6 py-2.5 rounded font-medium transition-colors ${
                contacts.length > 0 
                ? 'bg-[#202020] text-white hover:bg-[#333]' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
            Continuar
        </button>
      </div>
      
      {/* Input Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Manual Entry */}
          <div className="p-4 border border-dashed border-[#DFE1E6] rounded-lg bg-white flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-2">
                  <RiUserAddLine size={20} className="text-[#202020]" />
                  <span className="font-medium text-[#202020]">Agregar manual</span>
              </div>
              <div className="flex gap-2">
                  {/* Custom Country Selector */}
                  <div className="relative" ref={dropdownRef}>
                      <button 
                        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                        className="h-10 border border-[#DFE1E6] rounded px-2 bg-white text-sm min-w-[80px] flex items-center justify-between gap-1 hover:border-[#B2B2B2] transition-colors"
                      >
                          <span className="flex items-center gap-1">
                            <span>{selectedCountry.flag}</span>
                            <span>{selectedCountry.code}</span>
                          </span>
                          <RiArrowDownSLine size={14} className="text-[#767676]" />
                      </button>
                      
                      {isCountryDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-[200px] bg-white border border-[#DFE1E6] rounded shadow-lg z-10 max-h-[200px] overflow-y-auto">
                            {COUNTRIES.map(country => (
                              <div 
                                key={country.code}
                                onClick={() => {
                                  setSelectedCountry(country);
                                  setIsCountryDropdownOpen(false);
                                }}
                                className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between text-sm"
                              >
                                <span className="flex items-center gap-2">
                                    <span>{country.flag}</span>
                                    <span className="text-[#202020]">{country.name}</span>
                                </span>
                                <span className="text-[#767676] text-xs">{country.code}</span>
                              </div>
                            ))}
                        </div>
                      )}
                  </div>

                  <input 
                    type="text" 
                    placeholder="300 123 4567" 
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-10 flex-1 border border-[#DFE1E6] rounded px-3 text-sm focus:outline-none focus:border-[#6464FF]" 
                  />
              </div>
              <input 
                type="text" 
                placeholder="Nombre (Variable)" 
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-10 w-full border border-[#DFE1E6] rounded px-3 text-sm focus:outline-none focus:border-[#6464FF]" 
              />
              <button 
                onClick={handleManualAdd}
                disabled={!manualName || !manualPhone}
                className={`h-9 mt-1 border border-[#DFE1E6] rounded text-sm font-medium transition-colors ${
                  manualName && manualPhone 
                    ? 'bg-[#202020] text-white border-[#202020] hover:bg-[#333]' 
                    : 'bg-white text-[#202020] hover:bg-gray-50 opacity-60 cursor-not-allowed'
                }`}
              >
                  Agregar a la lista
              </button>
          </div>

          {/* Upload Entry */}
          <div 
              onClick={handleUpload}
              className="p-4 border border-dashed border-[#DFE1E6] rounded-lg bg-white flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors h-[216px] md:h-auto group"
          >
              {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                      <RiLoader4Line className="animate-spin text-[#202020]" size={32} />
                      <span className="text-sm text-[#767676]">Procesando archivo...</span>
                  </div>
              ) : (
                  <>
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                          <RiUploadCloud2Line size={20} className="text-[#202020]" />
                      </div>
                      <div className="text-center">
                          <p className="font-medium text-[#202020] text-sm">Haz click para subir CSV o Excel</p>
                          <p className="text-xs text-[#767676] mt-1">Columna requerida: "nombre"</p>
                      </div>
                  </>
              )}
          </div>
      </div>

      {contacts.length > 0 && (
        <>
            {/* Analysis Cards - Only show if there are issues */}
            {hasIssues && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in">
                  {/* Quality Score */}
                  <div className="bg-white border border-[#DFE1E6] rounded-lg p-5 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-[#202020]">Calidad de base</h3>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${stats.score > 70 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {stats.score}/100 ({stats.score > 70 ? 'Buena' : 'Regular'})
                            </span>
                        </div>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[#767676]">Teléfonos inválidos</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-[#202020]">{Math.round((stats.invalid / stats.total) * 100)}%</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[#767676]">Duplicados</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-[#202020]">{Math.round((stats.duplicates / stats.total) * 100)}%</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[#767676]">Opt-out</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-[#202020]">{Math.round((stats.optOut / stats.total) * 100)}%</span>
                                </div>
                            </div>
                        </div>
                      </div>

                      {/* Toggle Exclusion */}
                      <div className="pt-4 border-t border-[#DFE1E6] flex items-center justify-between">
                          <span className="text-sm font-medium text-[#202020]">Excluir inválidos y opt-out</span>
                          <button 
                              onClick={() => setFilter(filter === 'all' ? 'valid_only' : 'all')}
                              className={`w-10 h-6 rounded-full relative transition-colors duration-200 ease-in-out focus:outline-none ${filter === 'valid_only' ? 'bg-[#202020]' : 'bg-gray-300'}`}
                          >
                              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform duration-200 ease-in-out ${filter === 'valid_only' ? 'translate-x-5' : 'translate-x-1'}`}></div>
                          </button>
                      </div>
                  </div>

                  {/* Impact Simulator */}
                  <div className="bg-[#FAFAFA] border border-[#DFE1E6] rounded-lg p-5">
                      <h3 className="font-semibold text-[#202020] mb-4">Simulador de impacto</h3>
                      <div className="space-y-2">
                          <p className="text-sm text-[#202020]">
                              Enviarás a <span className="font-bold">{filter === 'valid_only' ? stats.valid : stats.total}</span> contactos
                          </p>
                          <p className="text-sm text-[#767676]">
                              Se excluirán <span className="font-medium">{filter === 'valid_only' ? stats.total - stats.valid : 0}</span> (opt-out / inválidos)
                          </p>
                          <div className="mt-4 pt-4 border-t border-[#DFE1E6]">
                              <p className="text-sm font-medium text-[#202020]">Tasa estimada de entrega: <span className="text-green-600">Alta</span></p>
                          </div>
                      </div>
                  </div>
              </div>
            )}

            {/* Table */}
            <div className="border border-[#DFE1E6] rounded-lg overflow-hidden bg-white shadow-sm mb-8 animate-fade-in">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#F9FAFB] border-b border-[#DFE1E6]">
                        <tr>
                            <th className="px-4 py-3 font-medium text-[#767676]">Nombre</th>
                            <th className="px-4 py-3 font-medium text-[#767676]">Teléfono</th>
                            <th className="px-4 py-3 font-medium text-[#767676]">
                                <div className="flex items-center gap-1">
                                    Estado
                                </div>
                            </th>
                            <th className="px-4 py-3 font-medium text-[#767676]">
                                <div className="flex items-center gap-1">
                                    Riesgo <RiQuestionLine size={14} />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DFE1E6]">
                        {filteredContacts.map(contact => (
                            <tr key={contact.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-[#202020]">{contact.name}</td>
                                <td className="px-4 py-3 text-[#767676]">{contact.phone}</td>
                                <td className="px-4 py-3">
                                    {contact.status === 'valid' && <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded text-xs font-medium"><RiCheckboxCircleLine size={14}/> Válido</span>}
                                    {contact.status === 'invalid' && <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded text-xs font-medium"><RiErrorWarningLine size={14}/> Inválido</span>}
                                    {contact.status === 'duplicate' && <span className="inline-flex items-center gap-1 text-orange-700 bg-orange-50 px-2 py-0.5 rounded text-xs font-medium"><RiFileExcel2Line size={14}/> Duplicado</span>}
                                    {contact.status === 'opt-out' && <span className="inline-flex items-center gap-1 text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-xs font-medium"><RiForbidLine size={14}/> Opt-out</span>}
                                </td>
                                <td className="px-4 py-3">
                                    {contact.risk === 'low' && <span className="text-green-600 font-medium text-xs">Prob. Alta</span>}
                                    {contact.risk === 'medium' && <span className="text-yellow-600 font-medium text-xs">Prob. Media</span>}
                                    {contact.risk === 'high' && <span className="text-red-600 font-medium text-xs">Riesgo Alto</span>}
                                    {contact.risk === 'unknown' && <span className="text-gray-400 text-xs">Sin historial</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="px-4 py-3 border-t border-[#DFE1E6] bg-[#F9FAFB] text-xs text-[#767676] text-center">
                    Mostrando {filteredContacts.length} de {contacts.length} contactos cargados
                </div>
            </div>
        </>
      )}
    </div>
  );
};

export default WizardStep1;