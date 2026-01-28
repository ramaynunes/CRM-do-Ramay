import React from 'react';
import { X, Sparkles, AlertCircle, Info } from 'lucide-react';

interface AIMagicModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isLoading: boolean;
  children: React.ReactNode;
}

export const AIMagicModal: React.FC<AIMagicModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  isLoading,
  children 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-semibold text-lg">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {!process.env.API_KEY && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg flex items-start gap-3 text-sm border border-blue-100">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Modo Demonstração Ativo</p>
                <p>Nenhuma Chave de API detectada. As funcionalidades de Inteligência Artificial apresentarão dados simulados para fins de teste.</p>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand-600 animate-pulse" />
                </div>
              </div>
              <p className="text-gray-500 font-medium animate-pulse">Consultando a IA...</p>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};