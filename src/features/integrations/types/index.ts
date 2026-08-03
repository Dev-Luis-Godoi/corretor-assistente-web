export interface WhatsAppAccount {
  id: string
  name: string
  phoneNumber: string | null
  instanceName: string | null
  isConnected: boolean
  createdAt: string
  updatedAt: string
}

export interface WhatsAppQrCode {
  base64: string | null
  pairingCode: string | null
  count: number | null
}

export interface WhatsAppAccountsResponse {
  accounts: WhatsAppAccount[]
}

export interface CreateWhatsAppAccountResponse {
  account: WhatsAppAccount
  qrCode: WhatsAppQrCode
}

export interface ConnectWhatsAppAccountResponse {
  accountId: string
  qrCode: WhatsAppQrCode
}

export interface WhatsAppAccountStatusResponse {
  accountId: string
  state: string
  connected: boolean
  phoneNumber: string | null
}
