import React, { useState } from 'react';
import { ScreenId, Client } from '../types';

interface PerfilClienteScreenProps {
  onNavigate: (screen: ScreenId, params?: Record<string, unknown>) => void;
  client?: Client;
}

export const PerfilClienteScreen: React.FC<PerfilClienteScreenProps> = ({
  onNavigate,
  client,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'services' | 'contracts' | 'invoices' | 'cuentas' | 'notes'>('info');
  const [docSearch, setDocSearch] = useState('');

  const documents = [
    {
      id: 'doc-1',
      type: 'CC',
      number: 'CC-2024-003',
      concept: 'Rediseño Flujo de Onboarding Tarjeta de Crédito (Sprint 4 & 5)',
      emissionDate: '02 Oct, 2024',
      dueDate: '17 Oct, 2024',
      amount: '$9.500.000',
      status: 'Pagada',
      statusColor: 'bg-[#e3fcef] text-status-pagada border-[#abf5d1]',
    },
    {
      id: 'doc-2',
      type: 'FE',
      number: 'FE-0042',
      concept: 'Consultoría en Sistema de Diseño y Tokens UI Multiplataforma',
      emissionDate: '01 Sep, 2024',
      dueDate: '16 Sep, 2024',
      amount: '$14.000.000',
      status: 'Pagada',
      statusColor: 'bg-[#e3fcef] text-status-pagada border-[#abf5d1]',
    },
    {
      id: 'doc-3',
      type: 'CTR',
      number: 'CTR-2024-NU',
      concept: 'Contrato de Prestación de Servicios de Diseño de Producto 2024',
      emissionDate: '15 Ene, 2024',
      dueDate: '31 Dic, 2024',
      amount: '$76.000.000',
      status: 'En ejecución',
      statusColor: 'bg-[#e9f2fe] text-status-enviada-text border-[#b3d4ff]',
    },
    {
      id: 'doc-4',
      type: 'CC',
      number: 'CC-2024-002',
      concept: 'Validación de Accesibilidad WCAG 2.1 AA en App Mobile',
      emissionDate: '10 Jul, 2024',
      dueDate: '25 Jul, 2024',
      amount: '$11.000.000',
      status: 'Pagada',
      statusColor: 'bg-[#e3fcef] text-status-pagada border-[#abf5d1]',
    },
    {
      id: 'doc-5',
      type: 'FE',
      number: 'FE-0038',
      concept: 'Arquitectura de Información para Portafolio de Cuentas de Ahorro',
      emissionDate: '14 May, 2024',
      dueDate: '29 May, 2024',
      amount: '$8.000.000',
      status: 'Pagada',
      statusColor: 'bg-[#e3fcef] text-status-pagada border-[#abf5d1]',
    },
  ];

  const filteredDocs = documents.filter(
    (d) =>
      !docSearch ||
      d.number.toLowerCase().includes(docSearch.toLowerCase()) ||
      d.concept.toLowerCase().includes(docSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1200px] mx-auto px-space-md md:px-space-xl py-space-xl space-y-space-xl">
        {/* Top Action Breadcrumb Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          {/* Target for: //a[contains(., 'Clientes') and .//span[text()='arrow_back']] */}
          <div className="flex items-center gap-space-sm text-text-subtlest font-caption text-caption">
            <a
              className="hover:text-text-primary transition-colors flex items-center gap-1 font-body-sm text-body-sm text-text-secondary cursor-pointer"
              href="#clientes"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('clientes');
              }}
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Clientes</span>
            </a>
            <span>/</span>
            <span className="font-body-sm text-body-sm font-semibold text-text-primary">
              Nu Colombia S.A.
            </span>
            <span className="px-2 py-0.5 rounded-[10000px] bg-surface-container-high text-text-secondary font-caption text-[11px] font-semibold border border-border-subtle">
              ID: CLI-0089
            </span>
          </div>

          {/* Action Buttons Suite */}
          <div className="flex flex-wrap items-center gap-space-sm">
            {/* Target for: //button[contains(., '  Nuevo contrato')] */}
            <button
              className="h-10 px-4 rounded-[10000px] bg-canvas-white border border-border-strong text-text-primary font-button-label text-button-label hover:bg-surface-container-low hover:border-text-primary transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              type="button"
              onClick={() => onNavigate('contratos')}
            >
              <span className="material-symbols-outlined text-[18px] text-text-secondary">
                description
              </span>
              <span>  Nuevo contrato</span>
            </button>

            {/* Target for: //button[contains(., '  Nueva factura')] */}
            <button
              className="h-10 px-4 rounded-[10000px] bg-canvas-white border border-border-strong text-text-primary font-button-label text-button-label hover:bg-surface-container-low hover:border-text-primary transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              type="button"
              onClick={() => onNavigate('facturas')}
            >
              <span className="material-symbols-outlined text-[18px] text-text-secondary">
                receipt_long
              </span>
              <span>  Nueva factura</span>
            </button>

            {/* Target for: //button[contains(., '  Nueva cuenta de cobro')] */}
            <button
              className="h-10 px-4 rounded-[10000px] bg-canvas-white border border-border-strong text-text-primary font-button-label text-button-label hover:bg-surface-container-low hover:border-text-primary transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              type="button"
              onClick={() => onNavigate('cuentas-cobro')}
            >
              <span className="material-symbols-outlined text-[18px] text-text-secondary">
                payments
              </span>
              <span>  Nueva cuenta de cobro</span>
            </button>

            {/* Single Primary Pill Button */}
            <button
              className="h-10 px-6 rounded-[10000px] bg-primary-container hover:bg-primary-hover active:bg-[#09326c] text-on-primary font-button-label text-button-label transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              type="button"
              onClick={() => onNavigate('configuracion')}
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              <span>Editar perfil</span>
            </button>
          </div>
        </div>

        {/* Header / Client Identity Hero Card */}
        <div className="bg-canvas-white border border-border-subtle rounded-[20px] p-6 md:p-space-xl flex flex-col lg:flex-row lg:items-center justify-between gap-space-xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-space-lg">
            <div className="w-20 h-20 rounded-[16px] bg-[#531253] text-canvas-white flex items-center justify-center font-headline-md text-headline-md font-bold shadow-sm shrink-0">
              Nu
            </div>
            <div className="flex flex-col space-y-1.5">
              <div className="flex flex-wrap items-center gap-space-sm">
                <h1 className="font-headline-md text-headline-md text-text-primary font-semibold tracking-tight">
                  Nu Colombia S.A.
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-[10000px] text-[12px] font-semibold bg-[#e3fcef] text-status-pagada border border-[#abf5d1]">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-pagada mr-1.5"></span>
                  Activo
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-[10000px] text-[12px] font-semibold bg-surface-container-low text-text-secondary border border-border-subtle">
                  Fintech
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-text-secondary font-body-sm text-body-sm">
                <span className="flex items-center gap-1 font-semibold text-text-primary">
                  <span className="text-text-subtlest font-normal">NIT:</span> 901.345.890-1
                </span>
                <span className="text-border-strong">•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-text-subtlest">
                    person
                  </span>
                  Laura Restrepo (Lead Product Designer)
                </span>
                <span className="text-border-strong">•</span>
                <a
                  className="flex items-center gap-1 hover:text-primary-container text-text-secondary transition-colors"
                  href="mailto:lrestrepo@nu.com.co"
                >
                  <span className="material-symbols-outlined text-[16px] text-text-subtlest">
                    mail
                  </span>
                  lrestrepo@nu.com.co
                </a>
                <span className="text-border-strong">•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-text-subtlest">
                    call
                  </span>
                  +57 310 456 7890
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-space-md border-t lg:border-t-0 lg:border-l border-border-subtle pt-4 lg:pt-0 lg:pl-space-xl shrink-0">
            <div className="flex flex-col">
              <span className="font-caption text-caption text-text-subtlest uppercase tracking-wider">
                Moneda Principal
              </span>
              <span className="font-headline-sm text-body-lg font-semibold text-text-primary flex items-center gap-1">
                COP ($) <span className="text-text-subtlest font-normal text-body-sm">Pesos</span>
              </span>
            </div>
            <div className="h-8 w-[1px] bg-border-subtle"></div>
            <div className="flex flex-col">
              <span className="font-caption text-caption text-text-subtlest uppercase tracking-wider">
                Ciclo Comercial
              </span>
              <span className="font-headline-sm text-body-lg font-semibold text-status-pagada flex items-center gap-1">
                Al día
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Pill Pattern) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border-subtle select-none">
          <button
            className={`h-9 px-4 rounded-[10000px] font-badge-label text-badge-label flex items-center whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'info'
                ? 'bg-text-primary text-canvas-white'
                : 'bg-canvas-white text-text-secondary hover:text-text-primary hover:bg-surface-container-low'
            }`}
            type="button"
            onClick={() => setActiveTab('info')}
          >
            Información
          </button>
          <button
            className={`h-9 px-4 rounded-[10000px] font-badge-label text-badge-label flex items-center whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'services'
                ? 'bg-text-primary text-canvas-white'
                : 'bg-canvas-white text-text-secondary hover:text-text-primary hover:bg-surface-container-low'
            }`}
            type="button"
            onClick={() => onNavigate('servicios')}
          >
            Servicios
          </button>
          <button
            className={`h-9 px-4 rounded-[10000px] font-badge-label text-badge-label flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'contracts'
                ? 'bg-text-primary text-canvas-white'
                : 'bg-canvas-white text-text-secondary hover:text-text-primary hover:bg-surface-container-low'
            }`}
            type="button"
            onClick={() => onNavigate('contratos')}
          >
            <span>Contratos</span>
            <span className="px-1.5 py-0.2 rounded-full bg-surface-container text-text-secondary text-[11px]">
              2
            </span>
          </button>
          <button
            className={`h-9 px-4 rounded-[10000px] font-badge-label text-badge-label flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'invoices'
                ? 'bg-text-primary text-canvas-white'
                : 'bg-canvas-white text-text-secondary hover:text-text-primary hover:bg-surface-container-low'
            }`}
            type="button"
            onClick={() => onNavigate('facturas')}
          >
            <span>Facturas</span>
            <span className="px-1.5 py-0.2 rounded-full bg-surface-container text-text-secondary text-[11px]">
              4
            </span>
          </button>
          <button
            className={`h-9 px-4 rounded-[10000px] font-badge-label text-badge-label flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'cuentas'
                ? 'bg-text-primary text-canvas-white'
                : 'bg-canvas-white text-text-secondary hover:text-text-primary hover:bg-surface-container-low'
            }`}
            type="button"
            onClick={() => onNavigate('cuentas-cobro')}
          >
            <span>Cuentas de cobro</span>
            <span className="px-1.5 py-0.2 rounded-full bg-surface-container text-text-secondary text-[11px]">
              3
            </span>
          </button>
          <button
            className={`h-9 px-4 rounded-[10000px] font-badge-label text-badge-label flex items-center whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'notes'
                ? 'bg-text-primary text-canvas-white'
                : 'bg-canvas-white text-text-secondary hover:text-text-primary hover:bg-surface-container-low'
            }`}
            type="button"
            onClick={() => setActiveTab('notes')}
          >
            Notas
          </button>
        </div>

        {/* Financial Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {/* Card: Facturado Histórico */}
          <div className="bg-canvas-white border border-border-subtle rounded-[20px] p-6 md:p-space-xl flex flex-col justify-between shadow-none">
            <div className="flex items-center justify-between">
              <span className="font-caption text-caption uppercase tracking-wider font-semibold text-text-subtlest">
                Facturado Histórico
              </span>
              <span className="w-8 h-8 rounded-full bg-status-enviada-bg text-status-enviada-text flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">
                  account_balance_wallet
                </span>
              </span>
            </div>
            <div className="my-4">
              <div className="font-currency-display text-currency-display font-semibold text-text-primary tracking-tight">
                $42.500.000{' '}
                <span className="font-body-sm text-body-sm text-text-subtlest font-normal">
                  COP
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-text-secondary mt-1">
                4 facturas y 3 cuentas de cobro liquidadas
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-status-pagada">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>100% de cumplimiento en pagos</span>
            </div>
          </div>

          {/* Card: Saldo Pendiente */}
          <div className="bg-canvas-white border border-border-subtle rounded-[20px] p-6 md:p-space-xl flex flex-col justify-between shadow-none">
            <div className="flex items-center justify-between">
              <span className="font-caption text-caption uppercase tracking-wider font-semibold text-text-subtlest">
                Saldo Pendiente
              </span>
              <span className="w-8 h-8 rounded-full bg-[#e3fcef] text-status-pagada flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
              </span>
            </div>
            <div className="my-4">
              <div className="font-currency-display text-currency-display font-semibold text-text-primary tracking-tight">
                $0{' '}
                <span className="font-body-sm text-body-sm text-text-subtlest font-normal">
                  COP
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-text-secondary mt-1">
                No hay cobros exigibles ni en mora
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-subtlest">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Cartera totalmente saneada</span>
            </div>
          </div>

          {/* Card: Último Pago Recibido */}
          <div className="bg-[#1c2b42] border border-[#1c2b42] rounded-[20px] p-6 md:p-space-xl text-canvas-white flex flex-col justify-between shadow-none">
            <div className="flex items-center justify-between text-[#b7b9be]">
              <span className="font-caption text-caption uppercase tracking-wider font-semibold text-canvas-white">
                Último Pago Recibido
              </span>
              <span className="w-8 h-8 rounded-full bg-white/10 text-canvas-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">credit_score</span>
              </span>
            </div>
            <div className="my-4">
              <div className="font-currency-display text-currency-display font-semibold text-canvas-white tracking-tight">
                Hace 5 días
              </div>
              <p className="font-body-sm text-body-sm text-[#bec7d3] mt-1">
                $9.500.000 COP acreditados vía PSE
              </p>
            </div>
            <div className="flex items-center justify-between text-[12px] text-[#bec7d3] border-t border-white/10 pt-3">
              <span>Ref: CC-2024-003</span>
              <span className="text-canvas-white font-medium">Bancolombia Empresarial</span>
            </div>
          </div>
        </div>

        {/* Fiscal Data & Operational Parameters Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
          {/* Fiscal Profile Box */}
          <div className="lg:col-span-2 bg-canvas-white border border-border-subtle rounded-[20px] p-6 md:p-space-xl shadow-none">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-text-secondary text-[22px]">
                  domain
                </span>
                <h2 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                  Datos Fiscales y Comerciales
                </h2>
              </div>
              <span className="font-caption text-caption px-2 py-0.5 rounded-[10000px] bg-surface-container text-text-secondary border border-border-subtle">
                RUT Vigente 2024
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-space-lg gap-x-space-xl mt-space-lg">
              <div className="flex flex-col">
                <span className="font-caption text-caption text-text-subtlest uppercase tracking-wider mb-1">
                  Razón Social Legal
                </span>
                <span className="font-body-md text-body-md font-semibold text-text-primary">
                  Nu Colombia Compañía de Financiamiento S.A.
                </span>
                <span className="font-body-sm text-body-sm text-text-secondary mt-0.5">
                  Personería Jurídica Nacional
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-caption text-caption text-text-subtlest uppercase tracking-wider mb-1">
                  Régimen Tributario
                </span>
                <span className="font-body-md text-body-md font-semibold text-text-primary">
                  Gran Contribuyente
                </span>
                <span className="font-body-sm text-body-sm text-text-secondary mt-0.5">
                  Resolución DIAN No. 012220 / Autorretenedor
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-caption text-caption text-text-subtlest uppercase tracking-wider mb-1">
                  Tarifa ICA (Bogotá)
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-body-md text-body-md font-semibold text-text-primary">
                    9.66 por mil (0.966%)
                  </span>
                  <span className="px-2 py-0.2 rounded-full bg-surface-container text-[11px] font-semibold text-text-secondary">
                    Cód 6201
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-text-secondary mt-0.5">
                  Actividades de desarrollo de sistemas y diseño UI/UX
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-caption text-caption text-text-subtlest uppercase tracking-wider mb-1">
                  Retención en la Fuente Aplicable
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-body-md text-body-md font-semibold text-text-primary">
                    4.0%
                  </span>
                  <span className="px-2 py-0.2 rounded-full bg-surface-container text-[11px] font-semibold text-text-secondary">
                    Servicios Generales / Honorarios
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-text-secondary mt-0.5">
                  Declaración directa de persona natural no responsable de IVA
                </span>
              </div>
              <div className="flex flex-col md:col-span-2">
                <span className="font-caption text-caption text-text-subtlest uppercase tracking-wider mb-1">
                  Dirección Fiscal Notificaciones
                </span>
                <span className="font-body-md text-body-md font-semibold text-text-primary">
                  Cra. 11 #79-52, Oficina 801
                </span>
                <span className="font-body-sm text-body-sm text-text-secondary mt-0.5">
                  Bogotá D.C., Colombia — Código Postal 110221
                </span>
              </div>
            </div>
          </div>

          {/* Stakeholders & Key Contacts Info */}
          <div className="bg-canvas-white border border-border-subtle rounded-[20px] p-6 md:p-space-xl flex flex-col justify-between shadow-none">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                <h3 className="font-headline-sm text-body-lg font-semibold text-text-primary">
                  Contactos Clave
                </h3>
                <span className="material-symbols-outlined text-text-subtlest text-[20px]">
                  contacts
                </span>
              </div>
              <div className="mt-space-md space-y-4">
                <div className="flex items-start gap-space-sm p-3 rounded-[12px] bg-surface-container-low border border-border-subtle">
                  <div className="w-9 h-9 rounded-full bg-[#531253] text-canvas-white font-semibold flex items-center justify-center text-[12px] shrink-0">
                    LR
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-sm text-body-sm font-semibold text-text-primary truncate">
                      Laura Restrepo
                    </span>
                    <span className="font-caption text-caption text-text-secondary">
                      Lead Product Designer • Aprobador
                    </span>
                    <a
                      className="font-caption text-caption text-primary-container truncate hover:underline mt-1"
                      href="mailto:lrestrepo@nu.com.co"
                    >
                      lrestrepo@nu.com.co
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-space-sm p-3 rounded-[12px] bg-surface-container-low border border-border-subtle">
                  <div className="w-9 h-9 rounded-full bg-secondary text-canvas-white font-semibold flex items-center justify-center text-[12px] shrink-0">
                    FM
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-sm text-body-sm font-semibold text-text-primary truncate">
                      Felipe Morales
                    </span>
                    <span className="font-caption text-caption text-text-secondary">
                      Procurement &amp; Pagos a Proveedores
                    </span>
                    <a
                      className="font-caption text-caption text-primary-container truncate hover:underline mt-1"
                      href="mailto:fmorales@nu.com.co"
                    >
                      fmorales@nu.com.co
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-border-subtle mt-4">
              <div className="flex items-center justify-between text-body-sm font-body-sm">
                <span className="text-text-subtlest">Términos de pago acordados:</span>
                <span className="font-semibold text-text-primary">Neto 15 días</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity & Linked Documents Table Card */}
        <div className="bg-canvas-white border border-border-subtle rounded-[20px] p-6 md:p-space-xl shadow-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-lg border-b border-border-subtle">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-text-secondary text-[22px]">
                history_edu
              </span>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                  Documentos e Historial Vinculado
                </h2>
                <p className="font-body-sm text-body-sm text-text-secondary">
                  Facturas electrónicas, contratos marco y cuentas de cobro emitidas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  className="h-9 pl-8 pr-3 bg-canvas-white border border-border-strong rounded-[3px] text-body-sm font-body-sm text-text-primary placeholder:text-text-subtlest focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container w-64"
                  placeholder="Filtrar por consecutivo o concepto..."
                  type="text"
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                />
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-text-subtlest">
                  search
                </span>
              </div>
              <button
                className="h-9 px-3 rounded-[3px] bg-canvas-white border border-border-strong text-text-secondary hover:text-text-primary flex items-center gap-1 font-body-sm text-body-sm cursor-pointer"
                type="button"
                onClick={() => onNavigate('configuracion')}
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Filtros</span>
              </button>
            </div>
          </div>

          {/* Clean Data Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-border-subtle text-text-subtlest font-caption text-caption uppercase tracking-wider bg-surface-container-low">
                  <th className="py-3 px-4 font-semibold">Tipo &amp; Documento</th>
                  <th className="py-3 px-4 font-semibold">Concepto / Servicio</th>
                  <th className="py-3 px-4 font-semibold">Fecha Emisión</th>
                  <th className="py-3 px-4 font-semibold">Vencimiento</th>
                  <th className="py-3 px-4 font-semibold text-right">Valor Total (COP)</th>
                  <th className="py-3 px-4 font-semibold text-center">Estado</th>
                  <th className="py-3 px-4 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-body-sm font-body-sm">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#f7f8f9] transition-colors">
                    <td className="py-4 px-4 font-medium text-text-primary">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-text-subtlest text-[18px]">
                          {doc.type === 'CC'
                            ? 'payments'
                            : doc.type === 'FE'
                            ? 'receipt_long'
                            : 'description'}
                        </span>
                        <span className="font-semibold">{doc.number}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-text-secondary max-w-xs truncate">
                      {doc.concept}
                    </td>
                    <td className="py-4 px-4 text-text-secondary whitespace-nowrap">
                      {doc.emissionDate}
                    </td>
                    <td className="py-4 px-4 text-text-secondary whitespace-nowrap">
                      {doc.dueDate}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-text-primary whitespace-nowrap">
                      {doc.amount}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-[10000px] text-[12px] font-semibold border ${doc.statusColor}`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-text-secondary hover:text-text-primary inline-flex cursor-pointer"
                        type="button"
                        onClick={() => {
                          if (doc.type === 'CC') onNavigate('cuentas-cobro');
                          else if (doc.type === 'FE') onNavigate('facturas');
                          else onNavigate('contratos');
                        }}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {doc.type === 'CTR' ? 'visibility' : 'download'}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-md border-t border-border-subtle text-caption font-caption text-text-secondary">
            <div>Mostrando 5 de 9 documentos emitidos a Nu Colombia S.A.</div>
            <div className="flex items-center gap-1">
              <button
                className="px-2.5 py-1 rounded-[3px] border border-border-strong text-text-secondary hover:text-text-primary disabled:opacity-40"
                disabled
                type="button"
              >
                Anterior
              </button>
              <button
                className="px-2.5 py-1 rounded-[3px] bg-primary text-on-primary font-semibold"
                type="button"
              >
                1
              </button>
              <button
                className="px-2.5 py-1 rounded-[3px] border border-border-strong text-text-secondary hover:text-text-primary cursor-pointer"
                type="button"
              >
                2
              </button>
              <button
                className="px-2.5 py-1 rounded-[3px] border border-border-strong text-text-secondary hover:text-text-primary cursor-pointer"
                type="button"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
