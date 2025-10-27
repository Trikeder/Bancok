export interface User {
  id: string;
  email: string;
  phone?: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
}

export interface Wallet {
  id: string;
  userId: string;
  currency: string;
  availableBalance: number;
}