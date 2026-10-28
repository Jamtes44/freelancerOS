import React from 'react';
import { ScreenId, Invoice, CuentaCobro } from '../types';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenId, params?: Record<string, unknown>) => void;
  invoices: Invoice[];
  cuentasCobro: CuentaCobro[];
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  invoices,
  cuentasCobro,
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="max-w-[1200px] w-full mx-auto px-space-md md:px-margin py-space-xl flex flex-col gap-space-xl">
        {/* Header de Página */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-[10000px] font-caption text-caption uppercase tracking-wider bg-surface-container text-text-secondary font-semibold">
                FreelanceOS v2.4
              </span>
              <span className="text-text-subtlest font-caption text-caption">•</span>
              <span className="font-caption text-caption text-text-subtlest font-medium">
                Zona Horaria: America/Bogota (COT)
              </span>
            </div>
            <h1 className="font-headline-md text-headline-md text-text-primary font-medium tracking-tight">
              Panel de Control
            </h1>
            <p className="font-body-md text-body-md text-text-secondary">
              Resumen operativo, balance impositivo y flujo de cobros actualizado al 24 de Octubre de 2024.
            </p>
          </div>

          {/* ÚNICO Botón Primario de Píldora Azul en la Pantalla */}
          <div className="shrink-0">
            <button
              className="inline-flex items-center gap-space-sm h-11 px-6 rounded-[10000px] bg-primary-container text-on-primary font-button-label text-button-label hover:bg-primary-hover active:bg-[#09326c] transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container/20 cursor-pointer shadow-sm"
              type="button"
              onClick={() => onNavigate('facturas')}
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Crear nuevo documento</span>
            </button>
          </div>
        </header>

        {/* Banner Destacado Atlassian */}
        <section className="bg-[#1c2b42] text-surface-container-lowest rounded-[20px] p-space-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg relative overflow-hidden">
          <div className="flex items-start gap-space-md max-w-3xl">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[#d8e2ff] text-[22px]">
                account_balance
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-space-sm">
                <span className="font-badge-label text-badge-label uppercase tracking-widest text-[#bec7d3] font-semibold">
                  Alerta DIAN &amp; Retenciones
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffbdad]"></span>
              </div>
              <p className="font-body-md text-body-md text-white font-normal leading-relaxed">
                <strong className="font-semibold text-white">Cierre tributario Q2:</strong> Tienes 3
                cuentas de cobro pendientes por radicar. Genera tu certificado de retención en la
                fuente en un solo clic para conciliar tu contabilidad.
              </p>
            </div>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            {/* Botón Secundario Blanco On-Dark */}
            <button
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 h-11 px-5 rounded-[10000px] bg-white text-text-primary font-button-label text-button-label hover:bg-[#f4f5f7] transition-colors focus:outline-none cursor-pointer"
              type="button"
              onClick={() => onNavigate('cuentas-cobro')}
            >
              <span>Ver pendientes</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* Fila de 4 Tarjetas de Métricas Clave */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {/* Métrica 1: Ingresos del Mes */}
          <div
            className="bg-surface-container-lowest rounded-[20px] p-space-xl flex flex-col justify-between gap-space-lg"
            style={{ outline: '1px solid #dddee1' }}
          >
            <div className="flex items-center justify-between">
              <span className="font-body-sm text-body-sm text-text-secondary font-medium">
                Ingresos del mes
              </span>
              <span className="material-symbols-outlined text-text-subtlest text-[20px]">
                trending_up
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-currency-display text-currency-display text-text-primary tracking-tight">
                $14.850.000{' '}
                <span className="font-caption text-caption text-text-subtlest uppercase">COP</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[10000px] font-badge-label text-badge-label bg-[#e3fcef] text-[#22a06b]"
                  style={{ outline: '1px solid #abf5d1' }}
                >
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  +18.4%
                </span>
                <span className="font-caption text-caption text-text-subtlest">vs. Septiembre</span>
              </div>
            </div>
          </div>

          {/* Métrica 2: Facturas Pendientes */}
          <div
            className="bg-surface-container-lowest rounded-[20px] p-space-xl flex flex-col justify-between gap-space-lg"
            style={{ outline: '1px solid #dddee1' }}
          >
            <div className="flex items-center justify-between">
              <span className="font-body-sm text-body-sm text-text-secondary font-medium">
                Facturas pendientes
              </span>
              <span className="material-symbols-outlined text-text-subtlest text-[20px]">
                pending_actions
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-currency-display text-currency-display text-text-primary tracking-tight">
                $5.200.000{' '}
                <span className="font-caption text-caption text-text-subtlest uppercase">COP</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-[10000px] font-badge-label text-badge-label bg-[#fff0b3] text-[#c75300]"
                  style={{ outline: '1px solid #ffe380' }}
                >
                  3 por cobrar
                </span>
                <span className="font-caption text-caption text-text-subtlest">Plazo promedio 12d</span>
              </div>
            </div>
          </div>

          {/* Métrica 3: Contratos por Vencer */}
          <div
            className="bg-surface-container-lowest rounded-[20px] p-space-xl flex flex-col justify-between gap-space-lg"
            style={{ outline: '1px solid #dddee1' }}
          >
            <div className="flex items-center justify-between">
              <span className="font-body-sm text-body-sm text-text-secondary font-medium">
                Contratos por vencer
              </span>
              <span className="material-symbols-outlined text-[#c75300] text-[20px]">warning</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-currency-display text-currency-display text-text-primary tracking-tight">
                2 contratos
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-[10000px] font-badge-label text-badge-label bg-[#fff0b3] text-[#c75300]"
                  style={{ outline: '1px solid #ffe380' }}
                >
                  Próx. 15 días
                </span>
                <span className="font-caption text-caption text-text-subtlest truncate">
                  Bancolombia, Platzi
                </span>
              </div>
            </div>
          </div>

          {/* Métrica 4: Clientes Activos */}
          <div
            className="bg-surface-container-lowest rounded-[20px] p-space-xl flex flex-col justify-between gap-space-lg"
            style={{ outline: '1px solid #dddee1' }}
          >
            <div className="flex items-center justify-between">
              <span className="font-body-sm text-body-sm text-text-secondary font-medium">
                Clientes activos
              </span>
              <span className="material-symbols-outlined text-text-subtlest text-[20px]">
                corporate_fare
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-currency-display text-currency-display text-text-primary tracking-tight">
                12 empresas
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-[10000px] font-badge-label text-badge-label bg-status-enviada-bg text-status-enviada-text"
                  style={{ outline: '1px solid #b3d4ff' }}
                >
                  +2 este trimestre
                </span>
                <span className="font-caption text-caption text-text-subtlest">Tasa retención 94%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Inferior Asimétrica: 7 Columnas + 5 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Columna Izquierda (7/12): Facturas Recientes */}
          <section
            className="lg:col-span-7 bg-surface-container-lowest rounded-[20px] overflow-hidden flex flex-col"
            style={{ outline: '1px solid #dddee1' }}
          >
            {/* Cabecera */}
            <div className="p-space-lg md:p-space-xl flex items-center justify-between bg-surface-container-lowest">
              <div className="flex flex-col gap-0.5">
                <h2 className="font-headline-sm text-headline-sm text-text-primary font-medium">
                  Facturas Recientes
                </h2>
                <p className="font-body-sm text-body-sm text-text-subtlest">
                  Seguimiento contable en Pesos Colombianos con retenciones aplicadas
                </p>
              </div>
              <a
                className="font-button-label text-button-label text-primary-container hover:text-primary-hover flex items-center gap-1 cursor-pointer"
                href="#facturas"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('facturas');
                }}
              >
                <span>Ver todas</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </a>
            </div>

            {/* Tabla Estructurada Atlassian */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-text-secondary font-caption text-caption uppercase tracking-wider">
                    <th className="py-3 px-space-md font-semibold">N° Factura</th>
                    <th className="py-3 px-space-md font-semibold">Cliente</th>
                    <th className="py-3 px-space-md font-semibold">Emisión</th>
                    <th className="py-3 px-space-md font-semibold text-right">Valor COP</th>
                    <th className="py-3 px-space-md font-semibold text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="text-body-sm font-body-sm text-text-primary divide-y divide-[#dddee1]">
                  {/* Fila 1: Rappi S.A.S. */}
                  <tr className="hover:bg-[#f7f8f9] transition-colors">
                    <td className="py-3.5 px-space-md font-medium text-text-primary whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-text-subtlest text-[18px]">
                          receipt
                        </span>
                        <span>FAC-2025-042</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md">
                      <div className="flex flex-col">
                        <span className="font-semibold text-text-primary">Rappi S.A.S.</span>
                        <span className="font-caption text-caption text-text-subtlest">
                          NIT: 900.843.898-1
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md text-text-secondary whitespace-nowrap">
                      22 Oct 2024
                    </td>
                    <td className="py-3.5 px-space-md text-right font-semibold text-text-primary whitespace-nowrap">
                      $4.500.000
                    </td>
                    <td className="py-3.5 px-space-md text-center whitespace-nowrap">
                      <span
                        className="inline-flex items-center justify-center h-6 px-2.5 rounded-[10000px] font-badge-label text-badge-label bg-[#e3fcef] text-[#22a06b]"
                        style={{ outline: '1px solid #abf5d1' }}
                      >
                        Pagada
                      </span>
                    </td>
                  </tr>

                  {/* Fila 2: Nu Colombia Compañía de Financiamiento -> Navigates to Perfil de Cliente */}
                  <tr
                    className="hover:bg-[#f7f8f9] transition-colors cursor-pointer group"
                    onClick={() => onNavigate('perfil-cliente')}
                  >
                    <td className="py-3.5 px-space-md font-medium text-text-primary whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-text-subtlest text-[18px]">
                          receipt
                        </span>
                        <span className="group-hover:text-primary-container">FAC-2025-041</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md">
                      <div className="flex flex-col">
                        <span className="font-semibold text-text-primary group-hover:text-primary-container">
                          Nu Colombia Compañía de Financiamiento
                        </span>
                        <span className="font-caption text-caption text-text-subtlest">
                          NIT: 901.442.238-3
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md text-text-secondary whitespace-nowrap">
                      18 Oct 2024
                    </td>
                    <td className="py-3.5 px-space-md text-right font-semibold text-text-primary whitespace-nowrap">
                      $3.200.000
                    </td>
                    <td className="py-3.5 px-space-md text-center whitespace-nowrap">
                      <span
                        className="inline-flex items-center justify-center h-6 px-2.5 rounded-[10000px] font-badge-label text-badge-label bg-status-enviada-bg text-status-enviada-text"
                        style={{ outline: '1px solid #b3d4ff' }}
                      >
                        Enviada
                      </span>
                    </td>
                  </tr>

                  {/* Fila 3: Mercadolibre */}
                  <tr className="hover:bg-[#f7f8f9] transition-colors">
                    <td className="py-3.5 px-space-md font-medium text-text-primary whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-text-subtlest text-[18px]">
                          receipt
                        </span>
                        <span>FAC-2025-040</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md">
                      <div className="flex flex-col">
                        <span className="font-semibold text-text-primary">
                          Mercadolibre Colombia Ltda.
                        </span>
                        <span className="font-caption text-caption text-text-subtlest">
                          NIT: 830.067.412-2
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md text-text-secondary whitespace-nowrap">
                      10 Oct 2024
                    </td>
                    <td className="py-3.5 px-space-md text-right font-semibold text-text-primary whitespace-nowrap">
                      $2.000.000
                    </td>
                    <td className="py-3.5 px-space-md text-center whitespace-nowrap">
                      <span
                        className="inline-flex items-center justify-center h-6 px-2.5 rounded-[10000px] font-badge-label text-badge-label bg-[#fff0b3] text-[#c75300]"
                        style={{ outline: '1px solid #ffe380' }}
                      >
                        Pendiente
                      </span>
                    </td>
                  </tr>

                  {/* Fila 4: Bold Pagos */}
                  <tr className="hover:bg-[#f7f8f9] transition-colors">
                    <td className="py-3.5 px-space-md font-medium text-text-primary whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-text-subtlest text-[18px]">
                          receipt
                        </span>
                        <span>FAC-2025-039</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md">
                      <div className="flex flex-col">
                        <span className="font-semibold text-text-primary">
                          Bold Pagos Colombia
                        </span>
                        <span className="font-caption text-caption text-text-subtlest">
                          NIT: 901.277.632-4
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md text-text-secondary whitespace-nowrap">
                      28 Sep 2024
                    </td>
                    <td className="py-3.5 px-space-md text-right font-semibold text-text-primary whitespace-nowrap">
                      $1.850.000
                    </td>
                    <td className="py-3.5 px-space-md text-center whitespace-nowrap">
                      <span
                        className="inline-flex items-center justify-center h-6 px-2.5 rounded-[10000px] font-badge-label text-badge-label bg-[#ffebe6] text-[#ae2e24]"
                        style={{ outline: '1px solid #ffbdad' }}
                      >
                        Vencida
                      </span>
                    </td>
                  </tr>

                  {/* Fila 5: Platzi */}
                  <tr className="hover:bg-[#f7f8f9] transition-colors">
                    <td className="py-3.5 px-space-md font-medium text-text-primary whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-text-subtlest text-[18px]">
                          receipt
                        </span>
                        <span>FAC-2025-038</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md">
                      <div className="flex flex-col">
                        <span className="font-semibold text-text-primary">
                          Platzi Inc. Sucursal Colombia
                        </span>
                        <span className="font-caption text-caption text-text-subtlest">
                          NIT: 900.751.291-0
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md text-text-secondary whitespace-nowrap">
                      25 Sep 2024
                    </td>
                    <td className="py-3.5 px-space-md text-right font-semibold text-text-primary whitespace-nowrap">
                      $3.300.000
                    </td>
                    <td className="py-3.5 px-space-md text-center whitespace-nowrap">
                      <span
                        className="inline-flex items-center justify-center h-6 px-2.5 rounded-[10000px] font-badge-label text-badge-label bg-[#f4f5f7] text-[#63666b]"
                        style={{ outline: '1px solid #dddee1' }}
                      >
                        Borrador
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="p-space-md bg-surface-container-low/60 flex items-center justify-between text-caption font-caption text-text-subtlest">
              <span>Mostrando 5 de 28 documentos emitidos este año</span>
              <span className="font-medium text-text-secondary">
                Totales con retención en la fuente (ICA / ReteFuente)
              </span>
            </div>
          </section>

          {/* Columna Derecha (5/12): Próximos Vencimientos y Cuentas de Cobro */}
          <section
            className="lg:col-span-5 bg-surface-container-lowest rounded-[20px] p-space-xl flex flex-col gap-space-lg"
            style={{ outline: '1px solid #dddee1' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <h2 className="font-headline-sm text-headline-sm text-text-primary font-medium">
                  Vencimientos &amp; Cuentas
                </h2>
                <p className="font-body-sm text-body-sm text-text-subtlest">
                  Cuentas de cobro con radicación urgente
                </p>
              </div>
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-surface-container-high font-badge-label text-badge-label text-text-secondary font-semibold">
                3
              </span>
            </div>

            {/* Lista de Cuentas */}
            <div className="flex flex-col gap-space-md">
              {/* Item 1: Bancolombia */}
              <div
                className="p-space-md rounded-[12px] bg-surface-container-lowest flex flex-col gap-space-sm"
                style={{ outline: '1px solid #dddee1' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm font-semibold text-text-primary">
                      Bancolombia S.A.
                    </span>
                    <span className="font-caption text-caption text-text-secondary">
                      Consultoría UX &amp; Design Ops Sprint #4
                    </span>
                  </div>
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-[10000px] font-badge-label text-[11px] bg-[#ffebe6] text-[#ae2e24] font-medium"
                    style={{ outline: '1px solid #ffbdad' }}
                  >
                    Vence en 2 días
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col">
                    <span className="font-caption text-caption text-text-subtlest">Monto neto</span>
                    <span className="font-body-sm text-body-sm font-semibold text-text-primary">
                      $2.800.000 COP
                    </span>
                  </div>
                  <button
                    className="h-9 px-4 rounded-[10000px] bg-white text-text-primary font-button-label text-body-sm hover:bg-[#f4f5f7] transition-colors cursor-pointer"
                    style={{ outline: '1px solid #b7b9be' }}
                    type="button"
                    onClick={() => onNavigate('cuentas-cobro')}
                  >
                    Cobrar cuenta
                  </button>
                </div>
              </div>

              {/* Item 2: Platzi */}
              <div
                className="p-space-md rounded-[12px] bg-surface-container-lowest flex flex-col gap-space-sm"
                style={{ outline: '1px solid #dddee1' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm font-semibold text-text-primary">
                      Platzi Inc.
                    </span>
                    <span className="font-caption text-caption text-text-secondary">
                      Producción de Contenido Técnico Curso Go
                    </span>
                  </div>
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-[10000px] font-badge-label text-[11px] bg-[#fff0b3] text-[#c75300] font-medium"
                    style={{ outline: '1px solid #ffe380' }}
                  >
                    Vence en 6 días
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col">
                    <span className="font-caption text-caption text-text-subtlest">Monto neto</span>
                    <span className="font-body-sm text-body-sm font-semibold text-text-primary">
                      $1.500.000 COP
                    </span>
                  </div>
                  <button
                    className="h-9 px-4 rounded-[10000px] bg-white text-text-primary font-button-label text-body-sm hover:bg-[#f4f5f7] transition-colors cursor-pointer"
                    style={{ outline: '1px solid #b7b9be' }}
                    type="button"
                    onClick={() => onNavigate('cuentas-cobro')}
                  >
                    Cobrar cuenta
                  </button>
                </div>
              </div>

              {/* Item 3: Habi */}
              <div
                className="p-space-md rounded-[12px] bg-surface-container-lowest flex flex-col gap-space-sm"
                style={{ outline: '1px solid #dddee1' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm font-semibold text-text-primary">
                      Habi Colombia
                    </span>
                    <span className="font-caption text-caption text-text-secondary">
                      Auditoría Frontend y Accesibilidad WCAG
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-[10000px] font-badge-label text-[11px] bg-surface-container-high text-text-secondary font-medium">
                    Vence en 14 días
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col">
                    <span className="font-caption text-caption text-text-subtlest">Monto neto</span>
                    <span className="font-body-sm text-body-sm font-semibold text-text-primary">
                      $900.000 COP
                    </span>
                  </div>
                  <button
                    className="h-9 px-4 rounded-[10000px] bg-white text-text-primary font-button-label text-body-sm hover:bg-[#f4f5f7] transition-colors cursor-pointer"
                    style={{ outline: '1px solid #b7b9be' }}
                    type="button"
                    onClick={() => onNavigate('cuentas-cobro')}
                  >
                    Cobrar cuenta
                  </button>
                </div>
              </div>
            </div>

            {/* Módulo de Seguridad Jurídica & Plantillas */}
            <div className="mt-space-xs p-space-md rounded-[12px] bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-text-secondary text-[20px]">
                  verified_user
                </span>
                <span className="font-body-sm text-body-sm text-text-secondary">
                  Cumplimiento según Ley 2277 / DIAN
                </span>
              </div>
              <a
                className="font-caption text-caption font-semibold text-primary hover:underline cursor-pointer"
                href="#contratos"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('contratos');
                }}
              >
                Ver plantillas
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
