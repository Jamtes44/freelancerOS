import React from 'react';
import { ScreenId } from '../types';

interface HeaderProps {
  onNavigate: (screen: ScreenId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onToggleMobileMenu?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  searchQuery,
  onSearchChange,
  onToggleMobileMenu,
  onLogout,
}) => {
  return (
    <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-16 bg-canvas-white border-b border-border-subtle z-40 flex items-center justify-between px-space-md lg:px-space-xl">
      <div className="flex items-center gap-space-sm lg:gap-space-md flex-1 max-w-lg">
        {/* Mobile menu trigger */}
        <button
          className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-container-low"
          type="button"
          onClick={onToggleMobileMenu}
          title="Menú"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-subtlest text-[20px]">
            search
          </span>
          <input
            className="w-full h-10 pl-10 pr-space-md bg-canvas-white border border-border-strong rounded-[3px] text-body-sm font-body-sm text-text-primary placeholder:text-text-subtlest focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
            placeholder="Buscar clientes, facturas, contratos..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-space-md">
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-[10000px] text-body-sm font-body-sm text-text-secondary border border-border-subtle">
          <span className="material-symbols-outlined text-[16px] text-status-pagada">
            monetization_on
          </span>
          <span className="font-semibold text-text-primary">COP</span>
          <span className="text-text-subtlest">(Pesos Colombianos)</span>
        </div>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-container-low transition-colors"
          type="button"
          title="Ayuda y documentación"
          onClick={() => onNavigate('configuracion')}
        >
          <span className="material-symbols-outlined text-[20px]">help_outline</span>
        </button>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-container-low transition-colors relative"
          type="button"
          title="Notificaciones"
          onClick={() => onNavigate('cuentas-cobro')}
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-status-vencida"></span>
        </button>
        <button
          className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary-container/30 transition-all"
          type="button"
          title="Mi perfil"
          onClick={() => onNavigate('configuracion')}
        >
          <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
        </button>
        {onLogout && (
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-container-low transition-colors"
            type="button"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            onClick={onLogout}
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        )}
      </div>
    </header>
  );
};
