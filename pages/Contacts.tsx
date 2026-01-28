import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { Contact } from '../types';
import { Modal } from '../components/Modal';
import { Phone, MoreHorizontal, Loader2 } from 'lucide-react';

export const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  useEffect(() => {
    const loadContacts = async () => {
      setLoading(true);
      const data = await storage.getContacts();
      setContacts(data);
      setLoading(false);
    };
    loadContacts();
  }, []);

  // Form State
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    notes: ''
  });

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.email) return;

    const contact: Contact = {
      id: `c${Date.now()}`,
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone || '',
      company: newContact.company || '',
      role: newContact.role || '',
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(newContact.name)}&background=random`,
      lastContacted: new Date().toISOString().split('T')[0],
      notes: newContact.notes || ''
    };

    const updatedContacts = [...contacts, contact];
    setContacts(updatedContacts);
    setIsAddModalOpen(false);
    setNewContact({
      name: '',
      email: '',
      phone: '',
      company: '',
      role: '',
      notes: ''
    });
    
    await storage.saveContacts(updatedContacts);
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p>Carregando contatos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Contatos</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar contatos..."
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 font-medium"
          >
            + Novo Contato
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Empresa</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cargo</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Último Contato</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredContacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={contact.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{contact.company}</td>
                <td className="px-6 py-4 text-gray-700">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700">
                    {contact.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">{contact.lastContacted}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Novo Contato"
      >
        <form onSubmit={handleAddContact} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input 
              type="text" 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none"
              value={newContact.name}
              onChange={e => setNewContact({...newContact, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none"
              value={newContact.email}
              onChange={e => setNewContact({...newContact, email: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none"
                value={newContact.company}
                onChange={e => setNewContact({...newContact, company: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none"
                value={newContact.role}
                onChange={e => setNewContact({...newContact, role: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input 
              type="tel" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none"
              value={newContact.phone}
              onChange={e => setNewContact({...newContact, phone: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors">
            Adicionar Contato
          </button>
        </form>
      </Modal>
    </div>
  );
};