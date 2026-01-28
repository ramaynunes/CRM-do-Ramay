import React, { useMemo, useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { DollarSign, TrendingUp, Users, Activity, Loader2 } from 'lucide-react';
import { storage } from '../services/storage';
import { Deal } from '../types';

const StatCard = ({ icon: Icon, title, value, change, positive }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-brand-50 rounded-xl">
        <Icon className="w-6 h-6 text-brand-600" />
      </div>
      <span className={`text-sm font-medium px-2 py-1 rounded-full ${positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {change}
      </span>
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

export const Dashboard: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const loadedDeals = await storage.getDeals();
      setDeals(loadedDeals);
      setLoading(false);
    };
    loadData();
  }, []);
  
  const stats = useMemo(() => {
    const totalValue = deals.reduce((acc, deal) => acc + deal.value, 0);
    const activeDeals = deals.length;
    const avgTicket = activeDeals > 0 ? totalValue / activeDeals : 0;
    
    // Simulação de dados de gráfico baseada no volume atual
    const graphData = [
      { name: 'Jan', revenue: totalValue * 0.4 },
      { name: 'Fev', revenue: totalValue * 0.6 },
      { name: 'Mar', revenue: totalValue * 0.5 },
      { name: 'Abr', revenue: totalValue * 0.8 },
      { name: 'Mai', revenue: totalValue * 0.7 },
      { name: 'Jun', revenue: totalValue * 0.9 },
      { name: 'Jul', revenue: totalValue },
    ];

    return { totalValue, activeDeals, avgTicket, graphData };
  }, [deals]);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p>Carregando Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Sistema Online
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={DollarSign} 
          title="Valor Total Pipeline" 
          value={`R$ ${stats.totalValue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`} 
          change="Real" 
          positive={true} 
        />
        <StatCard 
          icon={TrendingUp} 
          title="Taxa de Conversão" 
          value="Calculando..." 
          change="--" 
          positive={true} 
        />
        <StatCard 
          icon={Users} 
          title="Negócios Ativos" 
          value={stats.activeDeals} 
          change="Atual" 
          positive={true} 
        />
        <StatCard 
          icon={Activity} 
          title="Ticket Médio" 
          value={`R$ ${stats.avgTicket.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`} 
          change="Médio" 
          positive={true} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Projeção de Receita (Estimada)</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.graphData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={-10} tickFormatter={(value) => `R$${(value/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toLocaleString()}`, 'Receita']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Últimos Negócios</h2>
          <div className="space-y-6 max-h-[320px] overflow-y-auto pr-2">
            {deals.slice(-5).reverse().map((deal, i) => (
              <div key={deal.id} className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Novo negócio: {deal.companyName || deal.title}</p>
                  <p className="text-xs text-gray-500 mt-1">R$ {deal.value.toLocaleString()} • {deal.stage}</p>
                </div>
              </div>
            ))}
            {deals.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">Nenhum negócio cadastrado ainda.</p>
            )}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors">
            Ver Pipeline Completo
          </button>
        </div>
      </div>
    </div>
  );
};