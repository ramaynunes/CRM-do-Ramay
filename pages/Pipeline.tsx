import React, { useState, useEffect } from 'react';
import { Deal, DealStage, Contact } from '../types';
import { storage } from '../services/storage';
import { Modal } from '../components/Modal';
import { Clock, Pencil, Trash2, Loader2 } from 'lucide-react';

const COLUMNS = [
  { id: DealStage.LEAD, label: 'Novos Leads', color: 'bg-slate-100' },
  { id: DealStage.QUALIFIED, label: 'Qualificado', color: 'bg-blue-50' },
  { id: DealStage.PROPOSAL, label: 'Proposta', color: 'bg-indigo-50' },
  { id: DealStage.NEGOTIATION, label: 'Negociação', color: 'bg-purple-50' },
  { id: DealStage.CLOSED_WON, label: 'Fechado', color: 'bg-green-50' },
];

const COMPANY_OPTIONS = [
  "Base Show",
  "BORA Soluções Esportivas",
  "Copa BORA",
  "Outra"
];

export const Pipeline: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDealId, setEditingDealId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [dealsData, contactsData] = await Promise.all([
        storage.getDeals(),
        storage.getContacts()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Form State
  const [formData, setFormData] = useState<Partial<Deal>>({
    title: '',
    value: 0,
    stage: DealStage.LEAD,
    companyName: 'Base Show',
    probability: 20,
    tags: ['Novo']
  });

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('dealId', id);
  };

  const handleDrop = async (e: React.DragEvent, stage: DealStage) => {
    const id = e.dataTransfer.getData('dealId');
    // Atualiza UI otimisticamente
    const updatedDeals = deals.map(d => d.id === id ? { ...d, stage } : d);
    setDeals(updatedDeals);
    
    // Salva no background
    await storage.saveDeals(updatedDeals);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const openNewDealModal = () => {
    setEditingDealId(null);
    setFormData({
      title: '',
      value: 0,
      stage: DealStage.LEAD,
      companyName: 'Base Show',
      probability: 20,
      tags: ['Novo']
    });
    setIsModalOpen(true);
  };

  const openEditDealModal = (deal: Deal) => {
    setEditingDealId(deal.id);
    setFormData({
      title: deal.title,
      value: deal.value,
      stage: deal.stage,
      companyName: deal.companyName || 'Base Show',
      probability: deal.probability,
      tags: deal.tags
    });
    setIsModalOpen(true);
  };

  const handleDeleteDeal = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este negócio?")) {
      const updatedDeals = deals.filter(d => d.id !== id);
      setDeals(updatedDeals);
      await storage.saveDeals(updatedDeals);
    }
  };

  const handleSaveDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.value) return;

    let updatedDeals: Deal[];

    if (editingDealId) {
      // Editando
      updatedDeals = deals.map(d => d.id === editingDealId ? {
        ...d,
        title: formData.title!,
        value: Number(formData.value),
        stage: formData.stage as DealStage,
        companyName: formData.companyName,
      } : d);
    } else {
      // Criando novo
      const deal: Deal = {
        id: `d${Date.now()}`,
        title: formData.title!,
        value: Number(formData.value),
        stage: formData.stage as DealStage,
        companyName: formData.companyName,
        probability: formData.probability || 10,
        expectedCloseDate: new Date().toISOString().split('T')[0],
        tags: ['Novo']
      };
      updatedDeals = [...deals, deal];
    }

    setDeals(updatedDeals);
    setIsModalOpen(false);
    await storage.saveDeals(updatedDeals);
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pipeline de Vendas</h1>
        <button 
          onClick={openNewDealModal}
          className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-sm font-medium"
        >
          + Novo Negócio
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 h-full min-w-[1200px]">
          {COLUMNS.map((col) => (
            <div 
              key={col.id} 
              className={`flex-1 flex flex-col rounded-2xl ${col.color} p-4`}
              onDrop={(e) => handleDrop(e, col.id as DealStage)}
              onDragOver={handleDragOver}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700">{col.label}</h3>
                <span className="bg-white/50 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                  {deals.filter(d => d.stage === col.id).length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3">
                {deals.filter(d => d.stage === col.id).map(deal => {
                   const contact = contacts.find(c => c.id === deal.contactId);
                   const displayCompany = deal.companyName || contact?.company || 'Sem empresa';

                   return (
                    <div 
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-200/60 cursor-move hover:shadow-md transition-all group relative"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                          {deal.tags[0]}
                        </span>
                        
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3 bg-white pl-2">
                          <button 
                            onClick={() => openEditDealModal(deal)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteDeal(deal.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 pr-6">{deal.title}</h4>
                      <p className="text-gray-500 text-xs mb-3">{displayCompany}</p>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <span className="font-bold text-gray-900 text-sm">R$ {deal.value.toLocaleString()}</span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(deal.expectedCloseDate).toLocaleDateString('pt-BR', {month:'short', day:'numeric'})}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDealId ? "Editar Negócio" : "Novo Negócio"}
      >
        <form onSubmit={handleSaveDeal} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input 
              type="text" 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Contrato Anual"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
            <input 
              type="number" 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none"
              value={formData.value}
              onChange={e => setFormData({...formData, value: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none"
              value={formData.companyName}
              onChange={e => setFormData({...formData, companyName: e.target.value})}
            >
              {COMPANY_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estágio</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none"
              value={formData.stage}
              onChange={e => setFormData({...formData, stage: e.target.value as DealStage})}
            >
              {COLUMNS.map(col => (
                <option key={col.id} value={col.id}>{col.label}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors">
            {editingDealId ? "Salvar Alterações" : "Criar Negócio"}
          </button>
        </form>
      </Modal>
    </div>
  );
};