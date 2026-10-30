import React from 'react';
import { ScreenId } from '../types';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ScreenId,
      path: 'dashboard',
      label: 'Dashboard',
      icon: 'space_dashboard',
    },
    {
      id: 'clientes' as ScreenId,
      path: 'clientes',
      label: 'Clientes',
      icon: 'group',
    },
    {
      id: 'servicios' as ScreenId,
      path: 'servicios',
      label: 'Servicios',
      icon: 'design_services',
    },
    {
      id: 'facturas' as ScreenId,
      path: 'facturas',
      label: 'Facturas',
      icon: 'receipt_long',
    },
    {
      id: 'cuentas-cobro' as ScreenId,
      path: 'cuentas-cobro',
      label: 'Cuentas de Cobro',
      icon: 'payments',
    },
    {
      id: 'contratos' as ScreenId,
      path: 'contratos',
      label: 'Contratos',
      icon: 'description',
    },
    {
      id: 'configuracion' as ScreenId,
      path: 'configuracion',
      label: 'Configuración',
      icon: 'settings',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#091e42]/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-[260px] bg-canvas-white border-r border-border-subtle z-50 flex flex-col justify-between select-none transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand header */}
          <div className="h-16 px-space-md border-b border-border-subtle flex items-center justify-between">
            <div
              className="flex items-center gap-space-sm cursor-pointer"
              onClick={() => {
                onNavigate('dashboard');
                onCloseMobile?.();
              }}
            >
              <div className="w-8 h-8 rounded-lg bg-primary-container text-canvas-white flex items-center justify-center font-bold text-[18px]">
                <span className="material-symbols-outlined text-[20px]">
                  account_balance_wallet
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline-sm text-body-md font-semibold text-text-primary leading-tight truncate">
                  FreelanceOS
                </span>
                <span className="font-caption text-caption text-text-subtlest truncate">
                  Gestión &amp; Facturación
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary"
              onClick={onCloseMobile}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

        {/* Navigation */}
        <div className="px-space-md py-space-sm">
          <div className="text-[11px] font-semibold text-text-subtlest uppercase tracking-wider px-space-xs mb-space-xs">
            Menú Principal
          </div>
          <nav className="flex flex-col gap-1" data-active-classes="bg-status-enviada-bg text-status-enviada-text font-semibold rounded-[10000px]">
            {navItems.map((item) => {
              const isActive =
                currentScreen === item.id ||
                (item.id === 'clientes' && currentScreen === 'perfil-cliente');
              return (
                <a
                  key={item.id}
                  data-path={item.path}
                  href={`#${item.path}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e) => {
                    console.log('[SIDEBAR] Click:', item.id);
                    e.preventDefault();
                    onNavigate(item.id);
                    onCloseMobile?.();
                  }}
                  className={`flex items-center gap-space-sm px-space-md py-2 transition-colors rounded-[10000px] text-body-sm font-body-sm ${
                    isActive
                      ? 'bg-status-enviada-bg text-status-enviada-text font-semibold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-container-low'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User profile footer */}
      <div className="p-space-md border-t border-border-subtle bg-surface-container-lowest">
        <div
          className="flex items-center gap-space-sm cursor-pointer hover:opacity-85 transition-opacity"
          onClick={() => onNavigate('configuracion')}
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="font-body-sm text-body-sm font-semibold text-text-primary truncate">
              Carlos Mendoza
            </div>
            <div className="font-caption text-caption text-text-subtlest truncate">
              carlos@mendoza.co
            </div>
          </div>
        </div>
        <div className="mt-space-sm flex items-center justify-between">
          <span className="inline-flex items-center px-2 py-0.5 rounded-[10000px] font-badge-label text-[10px] uppercase tracking-wide bg-status-enviada-bg text-status-enviada-text border border-[#b3d4ff]">
            Plan Pro
          </span>
          <span className="font-caption text-caption text-text-subtlest">COP $</span>
        </div>
      </div>
    </aside>
  </>
);
};
