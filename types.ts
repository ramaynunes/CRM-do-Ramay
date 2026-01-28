export enum DealStage {
  LEAD = 'Lead',
  QUALIFIED = 'Qualified',
  PROPOSAL = 'Proposal',
  NEGOTIATION = 'Negotiation',
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost'
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  avatarUrl: string;
  lastContacted: string;
  notes: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: DealStage;
  contactId?: string;
  companyName?: string;
  probability: number;
  expectedCloseDate: string;
  tags: string[];
}

export interface AIAnalysisResult {
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  riskScore: number; // 0-100
  summary: string;
  nextSteps: string[];
}

export interface EmailDraft {
  subject: string;
  body: string;
}