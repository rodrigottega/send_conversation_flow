import React from 'react';
import { 
  RiMoreFill, 
  RiBarChartLine, 
  RiPencilLine, 
  RiWhatsappLine 
} from '@remixicon/react';
import { Campaign } from '../types';

interface CampaignCardProps {
  campaign: Campaign;
  onSend: (id: string) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onSend }) => {
  return (
    <div className="w-[383px] h-[206px] bg-white border border-[#DFE1E6] rounded-[8px] relative hover:shadow-sm transition-shadow">
      {/* Card Header */}
      <div className="flex flex-row items-center justify-between pt-[8px] px-[16px] pb-[8px] h-[44px]">
        <div className="flex items-center gap-2">
            <h3 className="font-medium text-[16px] text-[#393939] leading-[21px]">
                {campaign.name}
            </h3>
        </div>
        <button className="w-[24px] h-[24px] flex items-center justify-center text-[#AFC3D2] hover:bg-gray-100 rounded">
          <RiMoreFill className="rotate-90" size={20} />
        </button>
      </div>

      {/* Card Body Info */}
      <div className="px-[25px] flex flex-col mt-4 gap-3">
        {/* ID */}
        <div className="text-[13px] font-semibold text-[#393939] leading-[21px]">
          ID: {campaign.id}
        </div>
        
        {/* Users */}
        <div className="flex items-center gap-1 text-[13px] font-semibold text-[#393939] leading-[21px]">
          Usuarios: <span className="text-[#5087FF] text-[16px] font-semibold ml-1">{campaign.usersCount}</span>
        </div>

        {/* Outbound Label */}
        <div className="flex items-center text-[14px] font-semibold text-[#393939] leading-[21px] mt-2">
          {campaign.type}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="absolute bottom-[20px] left-[16px] right-[16px] flex items-center justify-end gap-2">
        {/* Chart Button */}
        <button className="w-[40px] h-[40px] bg-[#F7F8FF] border border-[#D5DCFF] rounded-[4px] flex items-center justify-center text-[#6464FF] hover:bg-[#EBEFFF] shadow-[0px_1px_1px_rgba(182,182,194,0.09)]">
          <RiBarChartLine size={20} />
        </button>

        {/* Edit Button */}
        <button className="w-[40px] h-[40px] bg-[#F7F8FF] border border-[#D5DCFF] rounded-[4px] flex items-center justify-center text-[#6464FF] hover:bg-[#EBEFFF] shadow-[0px_1px_1px_rgba(182,182,194,0.09)]">
          <RiPencilLine size={20} />
        </button>

        {/* Enviar Button */}
        <button 
          onClick={() => onSend(campaign.id)}
          className="h-[40px] bg-[#6464FF] text-white rounded-[4px] flex items-center px-3 gap-1 hover:bg-[#5050FF] shadow-[0px_1px_1px_rgba(182,182,194,0.09)] transition-colors"
        >
           <span className="font-medium text-[16px]">Enviar</span>
           <RiWhatsappLine size={20} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default CampaignCard;