import React, { useState } from 'react';
import { ScreenId } from '../types';

export interface SearchResult {
  key: string;
  icon: string;
  label: string;
  sublabel: string;
  onSelect: () => void;
}

interface HeaderProps {
  onNavigate: (screen: ScreenId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchResults: SearchResult[];
  overdueCount: number;
  onOpenOverdue: () => void;
  onToggleMobileMenu?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  searchQuery,
  onSearchChange,
  searchResults,
  overdueCount,
  onOpenOverdue,
  onToggleMobileMenu,
  onLogout,
}) => {
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(0);
  const open = focused && searchQuery.trim().length > 0;

  const select = (r: SearchResult) => {
    onSearchChange('');
    setActive(0);
    r.onSelect();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && searchResults[active]) {
      e.preventDefault();
      select(searchResults[active]);
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      onSearchChange('');
      e.currentTarget.blur();
    }
  };

  return (
    <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-16 bg-canvas-white border-b border-border-subtle z-40 flex items-center justify-between px-space-md lg:px-space-xl">
      <div className="flex items-center gap-space-sm lg:gap-space-md flex-1 max-w-lg">
        {/* Mobile menu trigger */}
        <button
          className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-container-low"
          type="button"
          onClick={onToggleMobileMenu}
          title="Menú"
          aria-label="Abrir menú"
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
            type="search"
            role="combobox"
            aria-label="Buscar clientes y documentos"
            aria-expanded={open}
            aria-controls="global-search-results"
            aria-activedescendant={open && searchResults[active] ? `search-${searchResults[active].key}` : undefined}
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setActive(0);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
          />
          {open && (
            <ul
              id="global-search-results"
              role="listbox"
              className="absolute left-0 right-0 top-12 bg-canvas-white border border-border-subtle rounded-[3px] shadow-xl py-1 max-h-[70vh] overflow-y-auto"
            >
              {searchResults.length === 0 && (
                <li className="px-3 py-2.5 font-body-sm text-body-sm text-text-subtlest">Sin resultados para "{searchQuery.trim()}"</li>
              )}
              {searchResults.map((r, i) => (
                <li
                  key={r.key}
                  id={`search-${r.key}`}
                  role="option"
                  aria-selected={i === active}
                  className={`px-3 py-2 flex items-center gap-3 cursor-pointer ${i === active ? 'bg-status-enviada-bg' : 'hover:bg-surface-container-low'}`}
                  // mousedown fires before the input blurs, so the click is not lost when the list closes
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(r);
                  }}
                  onMouseEnter={() => setActive(i)}
                >
                  <span className="material-symbols-outlined text-[18px] text-text-subtlest">{r.icon}</span>
                  <span className="flex flex-col min-w-0">
                    <span className="font-body-sm text-body-sm font-semibold text-text-primary truncate">{r.label}</span>
                    <span className="font-caption text-caption text-text-subtlest truncate">{r.sublabel}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="flex items-center gap-space-md">
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-[10000px] text-body-sm font-body-sm text-text-secondary border border-border-subtle">
          <span className="material-symbols-outlined text-[16px] text-status-pagada">monetization_on</span>
          <span className="font-semibold text-text-primary">COP</span>
          <span className="text-text-subtlest">(Pesos Colombianos)</span>
        </div>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-container-low transition-colors relative"
          type="button"
          title={overdueCount > 0 ? `${overdueCount} documentos vencidos` : 'Sin documentos vencidos'}
          aria-label={overdueCount > 0 ? `${overdueCount} documentos vencidos` : 'Sin documentos vencidos'}
          onClick={onOpenOverdue}
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {overdueCount > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 rounded-full bg-status-vencida text-canvas-white text-[10px] font-semibold leading-4 text-center">
              {overdueCount > 9 ? '9+' : overdueCount}
            </span>
          )}
        </button>
        <button
          className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary-container/30 transition-all"
          type="button"
          title="Mi perfil"
          aria-label="Mi perfil"
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
