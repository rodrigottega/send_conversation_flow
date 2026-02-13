import React from 'react';
import { MAIN_NAV_ITEMS, OTHER_PLATFORMS_ITEMS } from '../constants';
import { NavItem } from '../types';

const NavItemComponent: React.FC<{ item: NavItem }> = ({ item }) => {
  return (
    <div className="px-4 py-[2px] w-full">
      <div 
        className={`
          relative flex items-center gap-2 px-2 py-2 w-full h-9 rounded-lg transition-colors cursor-pointer group
          ${item.isActive ? 'text-white' : 'text-[#D5D5DE] hover:bg-[#2A2A2E]'}
        `}
      >
        {item.isActive && (
          <div className="absolute inset-0 bg-[#B6B6C2] opacity-15 rounded-lg pointer-events-none" />
        )}
        
        <item.icon 
          size={20} 
          className={item.isActive ? 'text-[#FFFFFF]' : 'text-[#9494A1] group-hover:text-[#D5D5DE]'} 
        />
        
        <span className="text-[16px] font-medium leading-4 tracking-tight">
            {item.label}
        </span>
      </div>
    </div>
  );
};

const Sidebar: React.FC = () => {
  return (
    <aside className="fixed top-0 left-0 w-[272px] h-full bg-[#121214] border-r border-[#2A2A2E] flex flex-col pt-6 pb-3 z-50">
      {/* Logo Section */}
      <div className="px-4 pb-4 mb-2">
        <div className="px-1 flex items-center gap-2">
            <img 
              src="https://cdn.prod.website-files.com/698a2f0dabb52ca2751815e9/698e0b09547e3cc5ce98e90a_Treble.ai%20vertical_white.svg" 
              alt="treble.ai"
              className="w-[108px] h-[27px]"
            />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col gap-0 overflow-y-auto">
        {MAIN_NAV_ITEMS.map((item, index) => (
          <NavItemComponent key={index} item={item} />
        ))}

        {/* Divider */}
        <div className="px-2 py-1 my-1">
             <div className="h-[1px] bg-[#2A2A2E] w-full rounded-full mx-2 max-w-[224px]"></div>
        </div>

        {/* Section Title */}
        <div className="px-4 py-[2px] mb-1">
            <div className="px-2 py-2">
                <span className="text-[#9494A1] text-[14px] font-medium leading-4">
                    Otras plataformas
                </span>
            </div>
        </div>

        {/* Other Platforms */}
        {OTHER_PLATFORMS_ITEMS.map((item, index) => (
          <NavItemComponent key={`other-${index}`} item={item} />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;