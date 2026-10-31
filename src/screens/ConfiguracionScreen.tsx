import React, { useState } from 'react';
import { ScreenId, FreelancerProfile } from '../types';
import { saveFreelancerProfile } from '../services/supabaseService';
import { nextDocumentNumber } from '../utils/calculations';

interface ConfiguracionScreenProps {
  onNavigate: (screen: ScreenId, params?: Record<string, unknown>) => void;
  profile: FreelancerProfile;
  onProfileSaved: (profile: FreelancerProfile) => void;
  documentNumbers: { invoices: string[]; cuentas: string[]; contracts: string[] };
}

export const ConfiguracionScreen: React.FC<ConfiguracionScreenProps> = ({
  onNavigate,
  profile: savedProfile,
  onProfileSaved,
  documentNumbers,
}) => {
  const [profile, setProfile] = useState(savedProfile);
  const [saveState, setSaveState] = useState<{ status: 'idle' | 'saving' | 'saved' | 'error'; message?: string }>({
    status: 'idle',
  });
  const isDirty = JSON.stringify(profile) !== JSON.stringify(savedProfile);
  const [signatureError, setSignatureError] = useState('');

  // Stored inline as a data URL in freelancer_profile; the size cap keeps the row small.
  const handleSignatureFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // lets the same file be chosen again after "Quitar"
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type)) return setSignatureError('Usa una imagen PNG o JPG.');
    if (file.size > 300 * 1024) return setSignatureError('La imagen pesa más de 300 KB. Recórtala o redúcela.');
    setSignatureError('');
    const reader = new FileReader();
    reader.onload = () => setProfile((p) => ({ ...p, signature: String(reader.result) }));
    reader.onerror = () => setSignatureError('No se pudo leer la imagen.');
    reader.readAsDataURL(file);
  };

  const lastNumber = (prefix: string, numbers: string[]) =>
    numbers
      .map((n) => ({ n, seq: parseInt(new RegExp(`^${prefix}-\\d{4}-(\\d+)$`).exec(n)?.[1] ?? '', 10) }))
      .filter((x) => !isNaN(x.seq))
      .sort((a, b) => b.seq - a.seq)[0]?.n;
  const numbering = [
    { prefix: 'FAC', label: 'Facturas', numbers: documentNumbers.invoices },
    { prefix: 'CC', label: 'Cuentas de cobro', numbers: documentNumbers.cuentas },
    { prefix: 'CTR', label: 'Contratos', numbers: documentNumbers.contracts },
  ].map((n) => ({
    ...n,
    count: n.numbers.length,
    last: lastNumber(n.prefix, n.numbers),
    next: nextDocumentNumber(n.prefix, n.numbers),
  }));

  const handleSave = async () => {
    setSaveState({ status: 'saving' });
    try {
      await saveFreelancerProfile(profile);
      onProfileSaved(profile);
      setSaveState({ status: 'saved' });
    } catch (e) {
      // Edits stay in the form so nothing typed is lost.
      setSaveState({ status: 'error', message: (e as any)?.message ?? String(e) });
    }
  };
  const [activeTab, setActiveTab] = useState('config-emisor');

  return (
    <div className="flex flex-col w-full pb-32">
      <div className="max-w-[1200px] w-full mx-auto px-space-xl py-space-xl flex flex-col gap-space-xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-sm border-b border-border-subtle">
          <div className="flex flex-col gap-space-xs max-w-2xl">
            <h1 className="font-headline-md text-headline-md text-text-primary font-semibold tracking-tight">
              Configuración General y Perfil Profesional
            </h1>
            <p className="font-body-md text-body-md text-text-secondary">
              Tus datos de emisor, cuenta bancaria, firma y la numeración de tus documentos.
            </p>
          </div>
        </div>

        {/* Shortcuts to each section of this page */}
        <nav aria-label="Secciones" className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 select-none">
          {[
            ['config-emisor', 'Datos del emisor'],
            ['config-banco', 'Cuenta bancaria'],
            ['config-firma', 'Firma'],
            ['config-consecutivos', 'Consecutivos'],
          ].map(([id, label]) => (
            <button
              key={id}
              className={`px-5 py-2 rounded-[10000px] font-button-label text-body-sm font-medium shrink-0 transition-colors cursor-pointer ${
                activeTab === id
                  ? 'bg-text-primary text-canvas-white'
                  : 'bg-canvas-white text-text-secondary hover:text-text-primary hover:bg-surface-container-low border border-border-subtle'
              }`}
              type="button"
              onClick={() => {
                setActiveTab(id);
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Card 1: Identificación del Freelancer / Emisor */}
        <section id="config-emisor" className="scroll-mt-24 bg-canvas-white rounded-[20px] border border-border-subtle p-8 flex flex-col gap-space-lg">
          <div className="flex items-start justify-between gap-space-md pb-space-sm border-b border-border-subtle">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-full bg-status-enviada-bg flex items-center justify-center text-status-enviada-text shrink-0">
                <span className="material-symbols-outlined text-[22px]">badge</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                  Identificación del Freelancer / Emisor
                </h2>
                <p className="font-body-sm text-body-sm text-text-secondary">
                  Información tributaria reflejada automáticamente en Facturas Electrónicas y
                  Cuentas de Cobro.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-[10000px] bg-surface-container-low text-text-secondary font-badge-label text-caption border border-border-subtle">
              RUT Verificado
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            <div className="flex flex-col gap-1.5">
              <label className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                Nombre Completo o Razón Social
              </label>
              <input
                className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                Tipo y Número de Documento
              </label>
              <input
                className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                type="text"
                value={profile.docTypeAndNumber}
                onChange={(e) => setProfile({ ...profile, docTypeAndNumber: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                Régimen Tributario
              </label>
              <div className="relative">
                <select
                  className="w-full h-10 px-3 pr-8 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary appearance-none focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container cursor-pointer transition-all"
                  value={profile.regime}
                  onChange={(e) => setProfile({ ...profile, regime: e.target.value })}
                >
                  <option value="Régimen Simple de Tributación (RST)">
                    Régimen Simple de Tributación (RST)
                  </option>
                  <option value="No Responsable de IVA">No Responsable de IVA</option>
                  <option value="Responsable de IVA (Régimen Común)">
                    Responsable de IVA (Régimen Común)
                  </option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-subtlest text-[20px]">
                  expand_more
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-1">
              <label className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                Actividad Económica Principal (CIIU)
              </label>
              <input
                className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                type="text"
                value={profile.ciiu}
                onChange={(e) => setProfile({ ...profile, ciiu: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                Dirección Fiscal
              </label>
              <input
                className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                Municipio / Departamento
              </label>
              <input
                className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                Teléfono Móvil de Contacto
              </label>
              <input
                className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                Correo Electrónico para Facturación &amp; Recepción DIAN
              </label>
              <div className="relative">
                <input
                  className="w-full h-10 pl-10 pr-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-subtlest text-[18px]">
                  mail
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Split Grid: Datos Bancarios & Certificado de Firma */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
          {/* Card 2: Datos Bancarios (7 Cols) */}
          <section id="config-banco" className="scroll-mt-24 lg:col-span-7 bg-canvas-white rounded-[20px] border border-border-subtle p-8 flex flex-col justify-between gap-space-lg">
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-status-pagada/10 flex items-center justify-center text-status-pagada shrink-0">
                    <span className="material-symbols-outlined text-[22px]">account_balance</span>
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                      Datos Bancarios para Recaudos
                    </h2>
                    <p className="font-body-sm text-body-sm text-text-secondary">
                      Destino predeterminado de pagos vía transferencias y pagos instantáneos Bre-B.
                    </p>
                  </div>
                </div>
              </div>

              {/* Shown on invoices and cuentas de cobro as the payment destination. */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1.5">
                  <label className="font-badge-label text-caption text-text-secondary uppercase tracking-wider" htmlFor="bank-bankName">
                    Banco
                  </label>
                  <input
                    id="bank-bankName"
                    className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                    type="text"
                    placeholder="ej. Bancolombia"
                    value={profile.bankName}
                    onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-badge-label text-caption text-text-secondary uppercase tracking-wider" htmlFor="bank-bankAccount">
                    Tipo y número de cuenta
                  </label>
                  <input
                    id="bank-bankAccount"
                    className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                    type="text"
                    placeholder="ej. Cuenta de Ahorros No. 245-098765-12"
                    value={profile.bankAccount}
                    onChange={(e) => setProfile({ ...profile, bankAccount: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-badge-label text-caption text-text-secondary uppercase tracking-wider" htmlFor="bank-transfiyaPhone">
                    Llave Transfiya / Bre-B (celular)
                  </label>
                  <input
                    id="bank-transfiyaPhone"
                    className="w-full h-10 px-3 bg-canvas-white border border-border-strong rounded-[3px] font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                    type="tel"
                    placeholder="ej. +57 312 458 9920"
                    value={profile.transfiyaPhone}
                    onChange={(e) => setProfile({ ...profile, transfiyaPhone: e.target.value })}
                  />
                </div>
              </div>
              <p className="font-caption text-caption text-text-subtlest">
                Estos datos aparecen como forma de pago en tus facturas y cuentas de cobro. Guárdalos con "Guardar cambios".
              </p>
            </div>
          </section>

          {/* Card 3: Certificado de Firma y Logotipo (5 Cols) */}
          <section id="config-firma" className="scroll-mt-24 lg:col-span-5 bg-canvas-white rounded-[20px] border border-border-subtle p-8 flex flex-col justify-between gap-space-lg">
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center gap-space-sm pb-space-sm border-b border-border-subtle">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-text-primary shrink-0">
                  <span className="material-symbols-outlined text-[22px]">draw</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                    Firma
                  </h2>
                  <p className="font-body-sm text-body-sm text-text-secondary">
                    Se guarda con "Guardar cambios".
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">
                  Firma digitalizada
                </span>
                <div className="h-28 w-full rounded-[20px] bg-surface-container-low border border-dashed border-border-strong flex items-center justify-center p-3">
                  {profile.signature ? (
                    <img src={profile.signature} alt="Tu firma" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="font-body-sm text-body-sm text-text-subtlest">Aún no has subido tu firma</span>
                  )}
                </div>
                <p className="font-caption text-caption text-text-subtlest">
                  Se imprime en tus cuentas de cobro y contratos. PNG o JPG de hasta 300 KB, idealmente con fondo transparente.
                </p>
                {signatureError && (
                  <p role="alert" className="font-caption text-caption text-status-vencida">
                    {signatureError}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <label className="flex-1 h-11 px-5 rounded-[10000px] bg-canvas-white border border-border-strong text-text-primary font-button-label text-body-sm font-medium hover:bg-surface-container-low hover:border-text-primary transition-colors flex items-center justify-center gap-2 cursor-pointer focus-within:ring-2 focus-within:ring-primary-container">
                <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                {profile.signature ? 'Reemplazar firma' : 'Subir firma'}
                <input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={handleSignatureFile} />
              </label>
              {profile.signature && (
                <button
                  className="h-11 px-5 rounded-[10000px] bg-canvas-white border border-[#ffbdad] text-[#ae2e24] font-button-label text-body-sm font-medium hover:bg-[#ffebe6] transition-colors cursor-pointer"
                  type="button"
                  onClick={() => setProfile({ ...profile, signature: '' })}
                >
                  Quitar
                </button>
              )}
            </div>
          </section>
        </div>

        {/* Card 4: numbering taken from the documents you have saved */}
        <section id="config-consecutivos" className="scroll-mt-24 bg-canvas-white rounded-[20px] border border-border-subtle p-8 flex flex-col gap-space-lg">
          <div className="flex items-center gap-space-sm pb-space-sm border-b border-border-subtle">
            <div className="w-10 h-10 rounded-full bg-status-enviada-bg flex items-center justify-center text-status-enviada-text shrink-0">
              <span className="material-symbols-outlined text-[22px]">format_list_numbered</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-text-primary font-semibold">Consecutivos</h2>
              <p className="font-body-sm text-body-sm text-text-secondary">
                Numeración automática de tus documentos. El año cambia solo y el número sigue del último emitido.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {numbering.map((n) => (
              <div key={n.prefix} className="p-space-md rounded-[20px] border border-border-subtle bg-canvas-white flex flex-col gap-2">
                <span className="font-badge-label text-caption text-text-secondary uppercase tracking-wider">{n.label}</span>
                <span className="font-body-md text-body-md font-semibold text-text-primary">Siguiente: {n.next}</span>
                <div className="flex items-center justify-between pt-2 border-t border-border-subtle font-caption text-caption text-text-subtlest">
                  <span>Último: {n.last ?? '—'}</span>
                  <span>
                    {n.count} {n.count === 1 ? 'emitido' : 'emitidos'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Barra inferior fija con Único Botón Primario Azul (Alto 58px) */}
      <aside className="fixed bottom-0 left-0 lg:left-[260px] right-0 bg-canvas-white border-t border-border-subtle px-space-md lg:px-space-xl py-3 z-40 flex items-center justify-between select-none shadow-xl">
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-2 text-text-subtlest font-caption text-caption">
            <span className="w-2 h-2 rounded-full bg-status-pagada"></span>
            <span>Los datos del emisor se usan en tus facturas, cuentas de cobro y contratos.</span>
          </div>
        </div>
        <div className="flex items-center gap-space-md">
          <span
            role="status"
            className={`hidden sm:inline-block font-body-sm text-body-sm ${
              saveState.status === 'error' ? 'text-status-vencida' : 'text-text-subtlest'
            }`}
          >
            {saveState.status === 'saving'
              ? 'Guardando...'
              : saveState.status === 'error'
              ? `No se pudo guardar: ${saveState.message}`
              : isDirty
              ? 'Tienes cambios sin guardar'
              : saveState.status === 'saved'
              ? 'Cambios guardados'
              : ''}
          </span>

          {/* Target for: //button[contains(., 'Guardar cambios')] */}
          <button
            className="h-[58px] px-8 rounded-[10000px] bg-primary-container hover:bg-primary-hover active:bg-[#09326c] text-canvas-white font-button-label text-body-md font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-default"
            type="button"
            disabled={!isDirty || saveState.status === 'saving'}
            onClick={handleSave}
          >
            <span className="material-symbols-outlined text-[20px]">check</span>
            <span>Guardar cambios</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
