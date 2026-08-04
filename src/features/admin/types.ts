export type AccountStatus = "TRIAL" | "ACTIVE" | "SUSPENDED" | "CANCELED";

export interface PlatformAdmin {
  id: string;
  name: string;
  email: string;
  active: boolean;
  lastLoginAt: string | null;
}
export interface PlatformAccount {
  id: string;
  name: string;
  status: AccountStatus;
  trialEndsAt: string | null;
  suspendedAt: string | null;
  createdAt: string;
  updatedAt: string;
  broker: {
    id: string;
    name: string;
    email: string;
    lastLoginAt: string | null;
  } | null;
  whatsappAccounts: Array<{
    id: string;
    name: string;
    phoneNumber: string | null;
    isConnected: boolean;
  }>;
  _count: {
    leads: number;
    contacts: number;
    conversations: number;
    tasks: number;
  };
}
export interface AdminOverview {
  accounts: {
    total: number;
    trial: number;
    active: number;
    suspended: number;
    canceled: number;
  };
  brokers: number;
  leads: number;
  conversations: number;
  connectedWhatsapp: number;
  recentActivity: Array<{
    id: string;
    action: string;
    createdAt: string;
    admin: { name: string };
    targetOrganization: { name: string } | null;
  }>;
}
