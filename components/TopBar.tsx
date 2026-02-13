import React from 'react';
import { RiDownloadLine, RiMailAddLine } from '@remixicon/react';

const TopBar: React.FC = () => {
  return (
    <header className="h-[80px] w-full bg-white px-8 flex items-center justify-between border-b border-transparent sticky top-0 z-40">
      <h2 className="text-[24px] font-medium text-[#202020] leading-[28px]">
        Conversaciones
      </h2>

      <div className="flex items-center gap-3">
        {/* New Conversation Button */}
        <button className="flex items-center gap-3 px-4 py-[10px] bg-[#EFEFFF] hover:bg-[#E5E5FF] rounded-[4px] transition-colors h-[48px]">
          <span className="text-[#6464FF] font-medium text-[16px] leading-[24px]">
            Nueva conversación
          </span>
        </button>

        {/* Download Button */}
        <button className="flex items-center justify-center w-[40px] h-[40px] text-[#A7A8A9] hover:bg-gray-50 rounded-[4px]">
          <RiDownloadLine size={24} />
        </button>

        {/* Divider */}
        <div className="h-[32px] w-[1px] bg-[#DFE1E6] mx-2"></div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md">
          <span className="text-[#202020] text-[16px] leading-[24px]">
            Company name
          </span>
          <div className="w-[40px] h-[40px] bg-black rounded-full flex items-center justify-center text-white font-medium text-[16px]">
            TB
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;