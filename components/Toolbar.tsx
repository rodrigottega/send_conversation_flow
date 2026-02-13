import React from 'react';
import { 
  RiSearchLine, 
  RiFolderTransferLine,
  RiDeleteBinLine 
} from '@remixicon/react';

const Toolbar: React.FC = () => {
  return (
    <div className="w-full h-[42px] flex items-center gap-4 mb-10">
      {/* Search Bar */}
      <div className="relative w-[257px] h-[42px]">
        <input 
          type="text" 
          placeholder="Buscar por nombre o id..." 
          className="w-full h-full pl-[40px] pr-4 bg-white border-b-[1.1px] border-[#DFE1E6] text-[14px] text-[#202020] placeholder-[#767676] focus:outline-none focus:border-[#6464FF] transition-colors"
        />
        <RiSearchLine 
          size={20} 
          className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#0F0F0F]"
        />
      </div>

      {/* Actions Group */}
      <div className="flex items-center gap-3">
        {/* Seleccionar */}
        <button className="h-[42px] px-3 bg-white rounded-[2px] flex items-center gap-3 hover:bg-gray-50 border border-transparent hover:border-gray-200">
          <div className="w-[18px] h-[18px] border-[2px] border-[#B2B2B2] rounded-[2px]"></div>
          <span className="text-[#767676] font-medium text-[16px]">Seleccionar</span>
        </button>

        {/* Mover a folder */}
        <button className="h-[42px] px-3 bg-white rounded-[2px] flex items-center gap-2 hover:bg-gray-50 border border-transparent hover:border-gray-200 group">
          <div className="text-[#B2B2B2] group-hover:text-[#9494A1]">
             <RiFolderTransferLine size={24} />
          </div>
          <span className="text-[#B2B2B2] group-hover:text-[#9494A1] font-medium text-[16px]">Mover a folder</span>
        </button>

        {/* Eliminar */}
        <button className="h-[42px] px-3 bg-white rounded-[2px] flex items-center gap-2 hover:bg-gray-50 border border-transparent hover:border-gray-200 group">
          <div className="text-[#B2B2B2] group-hover:text-[#9494A1]">
            <RiDeleteBinLine size={24} />
          </div>
          <span className="text-[#B2B2B2] group-hover:text-[#9494A1] font-medium text-[16px]">Eliminar</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;