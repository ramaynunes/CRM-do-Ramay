import { Contact, Deal } from "../types";
import { MOCK_CONTACTS, MOCK_DEALS } from "../constants";

const KEYS = {
  DEALS: 'bora_crm_deals_v1',
  CONTACTS: 'bora_crm_contacts_v1'
};

export const storage = {
  getDeals: (): Deal[] => {
    try {
      const stored = localStorage.getItem(KEYS.DEALS);
      if (!stored) return MOCK_DEALS;
      return JSON.parse(stored);
    } catch (error) {
      console.error('Erro ao carregar deals', error);
      return MOCK_DEALS;
    }
  },
  
  saveDeals: (deals: Deal[]) => {
    try {
      localStorage.setItem(KEYS.DEALS, JSON.stringify(deals));
    } catch (error) {
      console.error('Erro ao salvar deals', error);
    }
  },

  getContacts: (): Contact[] => {
    try {
      const stored = localStorage.getItem(KEYS.CONTACTS);
      if (!stored) return MOCK_CONTACTS;
      return JSON.parse(stored);
    } catch (error) {
      console.error('Erro ao carregar contatos', error);
      return MOCK_CONTACTS;
    }
  },

  saveContacts: (contacts: Contact[]) => {
    try {
      localStorage.setItem(KEYS.CONTACTS, JSON.stringify(contacts));
    } catch (error) {
      console.error('Erro ao salvar contatos', error);
    }
  }
};