import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, KanbanSquare, Settings } from 'lucide-react';
import clsx from 'clsx';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/pipeline', icon: KanbanSquare, label: 'Pipeline' },
    { to: '/contacts', icon: Users, label: 'Contatos' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-gray-100 flex flex-col justify-center">
        {/* Representação visual do Logo Bora Soluções Esportivas */}
        <div className="flex flex-col items-start leading-none select-none">
          <div className="flex items-center">
             <span className="text-4xl font-black italic tracking-tighter text-brand-600" style={{ transform: 'skewX(-10deg)' }}>
               BORA
             </span>
          </div>
          <span className="text-[0.6rem] font-bold text-gray-700 tracking-widest uppercase mt-1 ml-0.5">
            Soluções Esportivas
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                isActive
                  ? "bg-brand-50 text-brand-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Configurações</span>
        </button>
      </div>
    </div>
  );
};