import { Contact, Deal } from "../types";
import { MOCK_CONTACTS, MOCK_DEALS } from "../constants";
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (Opcional - Se as chaves existirem, usa a nuvem)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

const KEYS = {
  DEALS: 'bora_crm_deals_v1',
  CONTACTS: 'bora_crm_contacts_v1'
};

// Helper para simular delay de rede quando usando LocalStorage
const simulateDelay = <T>(data: T): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), 400));
};

export const storage = {
  /**
   * Busca Negócios (Deals)
   * Tenta buscar do Supabase se configurado, senão usa LocalStorage
   */
  getDeals: async (): Promise<Deal[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('deals').select('*');
      if (!error && data) return data as Deal[];
      console.error('Erro Supabase (Deals):', error);
    }

    // Fallback LocalStorage
    try {
      const stored = localStorage.getItem(KEYS.DEALS);
      const data = stored ? JSON.parse(stored) : MOCK_DEALS;
      return simulateDelay(data);
    } catch (error) {
      return MOCK_DEALS;
    }
  },
  
  /**
   * Salva Negócios (Deals)
   */
  saveDeals: async (deals: Deal[]): Promise<void> => {
    if (supabase) {
      // Estratégia simples: Upsert ou substituição. 
      // Em produção ideal, salvaríamos apenas o item modificado.
      // Aqui, para manter compatibilidade com o frontend atual, enviamos tudo (não ideal para produção em massa)
      // OU: Idealmente o frontend chamaria createDeal/updateDeal. 
      // Para este refactor rápido, vamos manter o LocalStorage como fonte da verdade imediata e tentar sincronizar.
      
      // NOTA: Para uma implementação real com Supabase, o frontend deveria chamar 'updateDeal' individualmente.
      // Como estamos adaptando um app "local-first", vamos apenas salvar no LocalStorage e logar o aviso.
      console.warn("Modo Nuvem: Implementar lógica de Upsert individual para escalabilidade.");
    }

    try {
      localStorage.setItem(KEYS.DEALS, JSON.stringify(deals));
      await simulateDelay(null); // Simula tempo de salvamento
    } catch (error) {
      console.error('Erro ao salvar deals', error);
    }
  },

  /**
   * Busca Contatos
   */
  getContacts: async (): Promise<Contact[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('contacts').select('*');
      if (!error && data) return data as Contact[];
    }

    try {
      const stored = localStorage.getItem(KEYS.CONTACTS);
      const data = stored ? JSON.parse(stored) : MOCK_CONTACTS;
      return simulateDelay(data);
    } catch (error) {
      return MOCK_CONTACTS;
    }
  },

  /**
   * Salva Contatos
   */
  saveContacts: async (contacts: Contact[]): Promise<void> => {
    try {
      localStorage.setItem(KEYS.CONTACTS, JSON.stringify(contacts));
      await simulateDelay(null);
    } catch (error) {
      console.error('Erro ao salvar contatos', error);
    }
  }
};