export type ContactStatus = 'NEW' | 'READ' | 'IN_PROGRESS' | 'RESOLVED' | 'SPAM';

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
}
