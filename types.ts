import { RemixiconComponentType } from '@remixicon/react';

export interface NavItem {
  label: string;
  icon: RemixiconComponentType;
  isActive?: boolean;
  hasCounter?: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  usersCount: number;
  type: 'Outbound' | 'Inbound';
}