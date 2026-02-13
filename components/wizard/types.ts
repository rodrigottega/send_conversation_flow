export interface Contact {
  id: string;
  phone: string;
  name: string;
  status: 'valid' | 'invalid' | 'duplicate' | 'opt-out';
  risk: 'low' | 'medium' | 'high' | 'unknown';
}

export interface WizardStats {
  total: number;
  valid: number;
  invalid: number;
  duplicates: number;
  optOut: number;
  score: number;
}

export interface SendingConfig {
  scheduleType: 'now' | 'later';
  scheduledDate: string;
  scheduledTime: string;
  strategy: 'safe' | 'fast';
  
  // Monitoring
  monitoringLevel: 'basic' | 'recommended' | 'strict' | 'custom';
  notificationChannels: string[]; // 'Email', 'WhatsApp', 'Slack', 'Webhooks'
  notificationFrequency: 'immediate' | 'summary_30m' | 'summary_1h';
  
  // Triggers
  notifyOnMetaPause: boolean;
  notifyOnCompletion: boolean;
  notifyOnFailure: boolean;
  failureThreshold: number;
  
  // Integrations State
  isSlackConnected: boolean;
  isWebhookConfigured: boolean;
  webhookUrl?: string;
}