import React, { useState } from 'react';
import { ScreenId, Client } from '../types';
import { formatCOP } from '../utils/calculations';

interface ClientesScreenProps {
  onNavigate: (screen: ScreenId, params?: Record<string, unknown>) => void;
  clients: Client[];
}

export const ClientesScreen: React.FC<ClientesScreenProps> = ({ onNavigate, clients }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'withBalance' | 'inactive'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientNit, setNewClientNit] = useState('');
  const [newClientContact, setNewClientContact] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');

  const filteredClients = clients.filter((c) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'active'
        ? c.status === 'Activo'
        : filter === 'withBalance'
        ? c.pendingBalance > 0
        : c.status === 'Inactivo';

    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.nit.includes(search) ||
      c.contactName.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1200px] mx-auto px-space-md py-space-xl sm:px-space-xl flex flex-col gap-space-lg">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-sm border-b border-border-subtle">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-space-sm">
              <h1 className="font-currency-display text-currency-display text-text-primary tracking-tight font-medium">
                Clientes
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-[10000px] bg-surface-container-low text-text-subtlest font-caption text-caption">
                18 registrados
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-text-secondary">
              Directorio corporativo, datos tributarios y balance comercial consolidado.
            </p>
          </div>

          {/* ÚNICO Botón Primario de la Pantalla */}
          <button
            className="h-10 px-6 rounded-[10000px] bg-primary-container hover:bg-primary-hover active:bg-[#09326c] text-surface-container-lowest font-button-label text-button-label inline-flex items-center justify-center gap-1.5 transition-colors self-start sm:self-auto shrink-0 shadow-sm cursor-pointer"
            type="button"
            onClick={() => setShowAddModal(true)}
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Nuevo cliente</span>
          </button>
        </div>

        {/* Quick Stats Metric Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
          <div className="bg-surface-container-lowest p-space-md rounded-[20px] border border-border-subtle flex flex-col gap-1">
            <span className="font-caption text-caption text-text-subtlest uppercase tracking-wider">
              Total Clientes
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                18
              </span>
              <span className="font-caption text-caption text-status-pagada flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> +3 este mes
              </span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded-[20px] border border-border-subtle flex flex-col gap-1">
            <span className="font-caption text-caption text-text-subtlest uppercase tracking-wider">
              Activos en Facturación
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-headline-sm text-headline-sm text-status-pagada font-semibold">
                14
              </span>
              <span className="font-caption text-caption text-text-secondary">
                78% de la cartera
              </span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded-[20px] border border-border-subtle flex flex-col gap-1">
            <span className="font-caption text-caption text-text-subtlest uppercase tracking-wider">
              Cartera Pendiente COP
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-headline-sm text-headline-sm text-status-pendiente font-semibold">
                $9.000.000
              </span>
              <span className="font-caption text-caption text-status-pendiente">2 clientes</span>
            </div>
          </div>
          <div className="bg-[#1c2b42] p-space-md rounded-[20px] border border-[#1c2b42] flex flex-col gap-1 text-surface-container-lowest">
            <span className="font-caption text-caption text-border-strong uppercase tracking-wider">
              Facturado 2024
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-headline-sm text-headline-sm text-surface-container-lowest font-semibold">
                $148.5M
              </span>
              <span className="font-caption text-caption text-secondary-fixed">COP</span>
            </div>
          </div>
        </div>

        {/* Filters & Action Toolbar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-subtlest text-[18px]">
              search
            </span>
            <input
              className="w-full h-10 pl-9 pr-space-md bg-surface-container-lowest border border-border-strong rounded-[3px] text-body-md font-body-md text-text-primary placeholder:text-text-subtlest focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder="Buscar por razón social, NIT o contacto..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Tabs & Secondary Actions */}
          <div className="flex flex-wrap items-center gap-space-sm justify-between lg:justify-end">
            <div className="flex items-center p-1 bg-surface-container-low rounded-[10000px] border border-border-subtle overflow-x-auto">
              <button
                className={`px-3 py-1.5 rounded-[10000px] font-body-sm text-body-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  filter === 'all'
                    ? 'bg-surface-container-lowest text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                type="button"
                onClick={() => setFilter('all')}
              >
                Todos (18)
              </button>
              <button
                className={`px-3 py-1.5 rounded-[10000px] font-body-sm text-body-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  filter === 'active'
                    ? 'bg-surface-container-lowest text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                type="button"
                onClick={() => setFilter('active')}
              >
                Activos (14)
              </button>
              <button
                className={`px-3 py-1.5 rounded-[10000px] font-body-sm text-body-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  filter === 'withBalance'
                    ? 'bg-surface-container-lowest text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                type="button"
                onClick={() => setFilter('withBalance')}
              >
                Con saldo (2)
              </button>
              <button
                className={`px-3 py-1.5 rounded-[10000px] font-body-sm text-body-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  filter === 'inactive'
                    ? 'bg-surface-container-lowest text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                type="button"
                onClick={() => setFilter('inactive')}
              >
                Inactivos (4)
              </button>
            </div>

            <div className="flex items-center gap-space-xs">
              <button
                className="h-10 px-4 rounded-[10000px] bg-surface-container-lowest border border-border-strong hover:bg-surface-container-low hover:border-text-primary text-text-primary font-body-sm text-body-sm font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                type="button"
                onClick={() => {
                  alert('Exportación de archivo CSV generada con éxito según formato DIAN.');
                }}
              >
                <span className="material-symbols-outlined text-[16px] text-text-secondary">
                  file_download
                </span>
                <span>Exportar CSV</span>
              </button>
              <button
                className="w-10 h-10 rounded-[10000px] bg-surface-container-lowest border border-border-strong hover:bg-surface-container-low hover:border-text-primary text-text-secondary hover:text-text-primary inline-flex items-center justify-center transition-colors cursor-pointer"
                title="Filtros avanzados"
                type="button"
                onClick={() => onNavigate('configuracion')}
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Client Directory Card Container */}
        <div className="bg-surface-container-lowest rounded-[20px] border border-border-subtle overflow-hidden flex flex-col">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[920px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-border-subtle">
                  <th className="py-3 px-space-md text-[11px] font-semibold text-text-subtlest uppercase tracking-wider">
                    Cliente / Empresa
                  </th>
                  <th className="py-3 px-space-md text-[11px] font-semibold text-text-subtlest uppercase tracking-wider">
                    NIT / Documento
                  </th>
                  <th className="py-3 px-space-md text-[11px] font-semibold text-text-subtlest uppercase tracking-wider">
                    Contacto Principal
                  </th>
                  <th className="py-3 px-space-md text-[11px] font-semibold text-text-subtlest uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="py-3 px-space-md text-[11px] font-semibold text-text-subtlest uppercase tracking-wider text-right">
                    Saldo Pendiente
                  </th>
                  <th className="py-3 px-space-md text-[11px] font-semibold text-text-subtlest uppercase tracking-wider text-center">
                    Estado
                  </th>
                  <th className="py-3 px-space-md text-[11px] font-semibold text-text-subtlest uppercase tracking-wider text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredClients.slice(0, 5).map((client) => {
                  const isNu = client.name.includes('Nu Colombia');
                  return (
                    <tr
                      key={client.id}
                      className="hover:bg-[#f7f8f9] transition-colors group"
                    >
                      <td className="py-space-md px-space-md">
                        <div className="flex items-center gap-space-sm">
                          <div
                            className="w-9 h-9 rounded-full font-semibold flex items-center justify-center shrink-0 text-body-sm"
                            style={{
                              backgroundColor: client.avatarBg || '#e8e8ea',
                              color: client.avatarColor || '#101214',
                            }}
                          >
                            {client.avatarInitials}
                          </div>
                          <div className="flex flex-col min-w-0">
                            {/* Target for: //tr[.//span[contains(text(), 'Nu Colombia S.A.')]]//span[contains(text(), 'Nu Colombia S.A.')] */}
                            <span
                              className="font-body-sm text-body-sm font-semibold text-text-primary hover:text-primary-container cursor-pointer truncate"
                              onClick={() => {
                                if (isNu) onNavigate('perfil-cliente');
                              }}
                            >
                              {client.name}
                            </span>
                            <span className="font-caption text-caption text-text-subtlest truncate">
                              {client.sector}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md font-body-sm text-body-sm text-text-secondary whitespace-nowrap">
                        {client.nit}
                      </td>
                      <td className="py-space-md px-space-md">
                        <div className="flex flex-col min-w-0">
                          <span className="font-body-sm text-body-sm text-text-primary font-medium truncate">
                            {client.contactName}
                          </span>
                          <a
                            className="font-caption text-caption text-text-subtlest hover:text-primary-container truncate"
                            href={`mailto:${client.email}`}
                          >
                            {client.email}
                          </a>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md font-body-sm text-body-sm text-text-secondary whitespace-nowrap">
                        {client.phone}
                      </td>
                      <td className="py-space-md px-space-md text-right font-body-sm text-body-sm font-semibold whitespace-nowrap">
                        <span
                          className={
                            client.pendingBalance > 0
                              ? client.status === 'Pendiente'
                                ? 'text-status-vencida'
                                : 'text-status-pendiente'
                              : 'text-text-primary'
                          }
                        >
                          {formatCOP(client.pendingBalance)}
                        </span>{' '}
                        <span className="font-caption text-caption text-text-subtlest font-normal">
                          COP
                        </span>
                      </td>
                      <td className="py-space-md px-space-md text-center whitespace-nowrap">
                        {client.status === 'Activo' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-[10000px] font-badge-label text-badge-label bg-[#e3fcef] text-status-pagada border border-[#abf5d1]">
                            Activo
                          </span>
                        )}
                        {client.status === 'Pendiente' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-[10000px] font-badge-label text-badge-label bg-[#fff0b3] text-status-pendiente border border-[#ffe380]">
                            Pendiente
                          </span>
                        )}
                        {client.status === 'Inactivo' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-[10000px] font-badge-label text-badge-label bg-[#f4f5f7] text-status-borrador border border-border-subtle">
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="py-space-md px-space-md text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1">
                          {/* Target for: //tr[.//span[contains(text(), 'Nu Colombia S.A.')]]//button[@title='Ver perfil'] */}
                          <button
                            className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-primary-container hover:bg-surface-container-low transition-colors cursor-pointer"
                            title="Ver perfil"
                            type="button"
                            onClick={() => {
                              onNavigate('perfil-cliente');
                            }}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              visibility
                            </span>
                          </button>
                          {/* Target for: //tr[.//span[contains(text(), 'Nu Colombia S.A.')]]//button[@title='Crear factura'] */}
                          <button
                            className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-primary-container hover:bg-surface-container-low transition-colors cursor-pointer"
                            title="Crear factura"
                            type="button"
                            onClick={() => {
                              onNavigate('facturas');
                            }}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              post_add
                            </span>
                          </button>
                          <button
                            className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
                            title="Más opciones"
                            type="button"
                            onClick={() => {
                              onNavigate('contratos');
                            }}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              more_vert
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Atlassian Pagination Footer */}
          <div className="px-space-md py-space-sm bg-surface-container-lowest border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-space-sm">
            <div className="font-body-sm text-body-sm text-text-subtlest">
              Mostrando <span className="font-medium text-text-primary">1-5</span> de{' '}
              <span className="font-medium text-text-primary">18</span> clientes
            </div>
            <div className="flex items-center gap-1 select-none">
              <button
                className={`w-8 h-8 rounded-[3px] flex items-center justify-center text-text-subtlest ${
                  page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-container-low'
                }`}
                disabled={page === 1}
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              {[1, 2, 3, 4].map((p) => (
                <button
                  key={p}
                  className={`w-8 h-8 rounded-[3px] font-body-sm text-body-sm font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                    page === p
                      ? 'bg-status-enviada-bg text-status-enviada-text'
                      : 'hover:bg-surface-container-low text-text-secondary'
                  }`}
                  type="button"
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="w-8 h-8 rounded-[3px] hover:bg-surface-container-low text-text-secondary flex items-center justify-center transition-colors cursor-pointer"
                type="button"
                onClick={() => setPage(Math.min(4, page + 1))}
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Colombian Tax Alert */}
        <div className="bg-surface-container-low p-space-md rounded-[20px] border border-border-subtle flex items-start gap-space-md">
          <div className="w-8 h-8 rounded-full bg-status-enviada-bg text-status-enviada-text flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-body-sm text-body-sm font-semibold text-text-primary">
              Validación de RUT y Representación Legal
            </span>
            <p className="font-body-sm text-body-sm text-text-secondary">
              Todos los clientes listados cuentan con NIT validado frente al registro RUES / DIAN.
              Recuerda que para la emisión de Cuentas de Cobro con retención en la fuente a título
              de ICA o Renta, debes verificar la clasificación de contribuyente en la ficha de cada
              empresa.
            </p>
          </div>
        </div>
      </div>

      {/* Modal for adding client */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#091e42]/50 flex items-center justify-center p-4">
          <div className="bg-canvas-white rounded-[20px] border border-border-subtle p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <h3 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                Registrar Nuevo Cliente
              </h3>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center text-text-subtlest hover:text-text-primary"
                onClick={() => setShowAddModal(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="font-caption text-caption text-text-subtlest uppercase">
                  Razón Social / Empresa
                </label>
                <input
                  className="w-full mt-1 h-10 px-3 border border-border-strong rounded-[3px] text-body-sm"
                  placeholder="ej. Mercadolibre Colombia Ltda."
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                />
              </div>
              <div>
                <label className="font-caption text-caption text-text-subtlest uppercase">
                  NIT o Documento
                </label>
                <input
                  className="w-full mt-1 h-10 px-3 border border-border-strong rounded-[3px] text-body-sm"
                  placeholder="ej. 901.345.890-1"
                  value={newClientNit}
                  onChange={(e) => setNewClientNit(e.target.value)}
                />
              </div>
              <div>
                <label className="font-caption text-caption text-text-subtlest uppercase">
                  Contacto Principal
                </label>
                <input
                  className="w-full mt-1 h-10 px-3 border border-border-strong rounded-[3px] text-body-sm"
                  placeholder="ej. Laura Restrepo"
                  value={newClientContact}
                  onChange={(e) => setNewClientContact(e.target.value)}
                />
              </div>
              <div>
                <label className="font-caption text-caption text-text-subtlest uppercase">
                  Correo Electrónico
                </label>
                <input
                  className="w-full mt-1 h-10 px-3 border border-border-strong rounded-[3px] text-body-sm"
                  placeholder="ej. contacto@empresa.com.co"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
              <button
                className="h-10 px-4 rounded-[10000px] border border-border-strong text-text-primary font-button-label"
                onClick={() => setShowAddModal(false)}
              >
                Cancelar
              </button>
              <button
                className="h-10 px-6 rounded-[10000px] bg-primary-container text-white font-button-label"
                onClick={() => {
                  setShowAddModal(false);
                  onNavigate('perfil-cliente');
                }}
              >
                Guardar Cliente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
