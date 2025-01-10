export interface Certificate {
  id: string;
  recipientName: string;
  courseName: string;
  issuerName: string;
  issueDate: string;
  expiryDate?: string;
  description: string;
  hash: string;
  status: 'valid' | 'revoked';
}

export interface Institution {
  id: string;
  name: string;
  logo: string;
  verificationCount: number;
}