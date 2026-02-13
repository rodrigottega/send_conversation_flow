import { 
  RiWhatsappLine, 
  RiLinkM, 
  RiMetaFill, 
  RiVerifiedBadgeLine, 
  RiBarChartBoxLine, 
  RiGraduationCapLine, 
  RiBookOpenLine, 
  RiSettings3Line, 
  RiGlobalLine,
  RiCustomerService2Line
} from '@remixicon/react';
import { NavItem, Campaign } from './types';

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: 'Conversaciones', icon: RiWhatsappLine, isActive: true },
  { label: 'Links de WhatsApp', icon: RiLinkM },
  { label: 'Meta Ads', icon: RiMetaFill },
  { label: 'Plantillas HSM', icon: RiVerifiedBadgeLine },
  { label: 'Métricas generales', icon: RiBarChartBoxLine },
  { label: 'Centro de Recursos', icon: RiGraduationCapLine },
  { label: 'Documentación API', icon: RiBookOpenLine },
  { label: 'Configuración', icon: RiSettings3Line },
  { label: 'Idioma', icon: RiGlobalLine },
];

export const OTHER_PLATFORMS_ITEMS: NavItem[] = [
  { label: 'Sales Suite', icon: RiCustomerService2Line },
];

export const CAMPAIGNS: Campaign[] = [
  {
    id: '81196',
    name: 'Mi primera campaña',
    usersCount: 0,
    type: 'Outbound',
  },
];