import { Contact, Deal, DealStage } from "./types";

export const MOCK_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Alice Freeman',
    email: 'alice@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Solutions',
    role: 'CTO',
    avatarUrl: 'https://picsum.photos/200/200?random=1',
    lastContacted: '2023-10-25',
    notes: 'Interested in AI integration. Budget cycle opens in Nov.',
  },
  {
    id: 'c2',
    name: 'Bob Smith',
    email: 'bob.smith@logistics.io',
    phone: '+1 (555) 987-6543',
    company: 'Logistics IO',
    role: 'VP of Operations',
    avatarUrl: 'https://picsum.photos/200/200?random=2',
    lastContacted: '2023-10-20',
    notes: 'Skeptical about pricing. Needs ROI analysis.',
  },
  {
    id: 'c3',
    name: 'Catherine Wu',
    email: 'c.wu@financeflow.net',
    phone: '+1 (555) 456-7890',
    company: 'FinanceFlow',
    role: 'Director of IT',
    avatarUrl: 'https://picsum.photos/200/200?random=3',
    lastContacted: '2023-10-28',
    notes: 'Very enthusiastic. Ready to sign pending legal review.',
  }
];

export const MOCK_DEALS: Deal[] = [
  {
    id: 'd1',
    title: 'Enterprise License Q4',
    value: 125000,
    stage: DealStage.NEGOTIATION,
    contactId: 'c1',
    probability: 75,
    expectedCloseDate: '2023-11-15',
    tags: ['SaaS', 'Enterprise'],
  },
  {
    id: 'd2',
    title: 'Fleet Management System',
    value: 55000,
    stage: DealStage.PROPOSAL,
    contactId: 'c2',
    probability: 40,
    expectedCloseDate: '2023-12-01',
    tags: ['IoT'],
  },
  {
    id: 'd3',
    title: 'Security Audit',
    value: 15000,
    stage: DealStage.CLOSED_WON,
    contactId: 'c3',
    probability: 100,
    expectedCloseDate: '2023-10-15',
    tags: ['Consulting'],
  },
  {
    id: 'd4',
    title: 'Annual Maintenance',
    value: 8000,
    stage: DealStage.LEAD,
    contactId: 'c2',
    probability: 10,
    expectedCloseDate: '2024-01-15',
    tags: ['Renewal'],
  }
];
