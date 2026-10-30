import React, { useState, useEffect } from 'react';
import { ScreenId, Client, Invoice, InvoiceItem, CuentaCobro, ServiceItem, Contract, FreelancerProfile } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardScreen } from './screens/DashboardScreen';
import { ClientesScreen } from './screens/ClientesScreen';
import { DocumentosScreen } from './screens/DocumentosScreen';
import { GeneradorContratoScreen } from './screens/GeneradorContratoScreen';
import { GeneradorFacturaScreen } from './screens/GeneradorFacturaScreen';
import { PerfilClienteScreen } from './screens/PerfilClienteScreen';
import { CatalogoServiciosScreen } from './screens/CatalogoServiciosScreen';
import { GeneradorCuentaCobroScreen } from './screens/GeneradorCuentaCobroScreen';
import { ConfiguracionScreen } from './screens/ConfiguracionScreen';
import { LoginScreen } from './screens/LoginScreen';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import { INITIAL_CONTRACT } from './data/mockData';
import {
  getClients,
  getInvoices,
  getCuentasCobro,
  getServices,
  getContracts,
  getFreelancerProfile,
  getInvoiceItems,
} from './services/supabaseService';
import { withDocumentTotals, withOverdueStatus } from './utils/calculations';

const EMPTY_PROFILE: FreelancerProfile = {
  name: '',
  legalName: '',
  docTypeAndNumber: '',
  nit: '',
  regime: '',
  ciiu: '',
  address: '',
  city: '',
  phone: '',
  email: '',
  bankName: '',
  bankAccount: '',
  maskedAccount: '',
  transfiyaPhone: '',
};

const SCREEN_TITLES: Record<ScreenId, string> = {
  'dashboard': 'Dashboard - FreelanceOS',
  'clientes': 'Clientes - FreelanceOS',
  'documentos': 'Documentos - FreelanceOS',
  'contratos': 'Generador de Contrato - FreelanceOS',
  'facturas': 'Generador de Factura - FreelanceOS',
  'perfil-cliente': 'Perfil de Cliente - FreelanceOS',
  'servicios': 'Catálogo de Servicios - FreelanceOS',
  'cuentas-cobro': 'Generador de Cuenta de Cobro - FreelanceOS',
  'configuracion': 'Configuración - FreelanceOS',
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [cuentasCobro, setCuentasCobro] = useState<CuentaCobro[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [profile, setProfile] = useState<FreelancerProfile>(EMPTY_PROFILE);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>();
  const [documentsClientFilter, setDocumentsClientFilter] = useState<string | undefined>();
  // First invoice line chosen with "Usar en Factura" in the services catalog.
  const [invoiceStartItem, setInvoiceStartItem] = useState<InvoiceItem | undefined>();
  // A saved document opened read-only in its generator (to review it or download its PDF again).
  const [viewing, setViewing] = useState<
    | { kind: 'invoice'; invoice: Invoice; items: InvoiceItem[] }
    | { kind: 'cuenta'; cuenta: CuentaCobro }
    | { kind: 'contrato'; contract: Contract }
    | undefined
  >();
  // Screens mount only after the first load, so forms never start from empty data.
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured);
  const userId = session?.user.id;

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured && !userId) return;
    let mounted = true;
    (async () => {
      setLoadError('');
      try {
        const [c, inv, cc, serv, ctr, prof] = await Promise.all([
          getClients(),
          getInvoices(),
          getCuentasCobro(),
          getServices(),
          getContracts(),
          getFreelancerProfile(),
        ]);
        if (!mounted) return;
        setClients(c);
        setInvoices(inv.map((d) => withOverdueStatus(d)));
        setCuentasCobro(cc.map((d) => withOverdueStatus(d)));
        setServices(serv);
        setContracts(ctr);
        setProfile(prof ?? EMPTY_PROFILE);
        setDataLoaded(true);
      } catch (e) {
        console.error('[APP] Error cargando datos:', e);
        if (mounted) setLoadError(e instanceof Error ? e.message : String((e as any)?.message ?? e));
      }
    })();
    return () => {
      mounted = false;
    };
  }, [userId]);

  useEffect(() => {
    document.title = SCREEN_TITLES[currentScreen] || 'FreelanceOS';
  }, [currentScreen]);

  const handleNavigate = (screen: ScreenId) => {
    setDocumentsClientFilter(undefined); // only openDocuments() sets a client filter
    setViewing(undefined); // only openDocument() opens a saved document
    setInvoiceStartItem(undefined);
    setCurrentScreen(screen);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openClient = (clientId: string) => {
    setSelectedClientId(clientId);
    handleNavigate('perfil-cliente');
  };

  const openDocument = async (kind: 'invoice' | 'cuenta' | 'contrato', id: string) => {
    if (kind === 'contrato') {
      const contract = contracts.find((c) => c.id === id);
      if (!contract) return;
      handleNavigate('contratos');
      setViewing({ kind, contract });
      return;
    }
    if (kind === 'cuenta') {
      const cuenta = cuentasCobro.find((c) => c.id === id);
      if (!cuenta) return;
      handleNavigate('cuentas-cobro');
      setViewing({ kind, cuenta });
      return;
    }
    const invoice = invoices.find((i) => i.id === id);
    if (!invoice) return;
    try {
      const items = await getInvoiceItems(id);
      handleNavigate('facturas');
      setViewing({ kind, invoice, items });
    } catch (e) {
      window.alert(`No se pudo abrir la factura: ${(e as any)?.message ?? e}`);
    }
  };

  const addServiceToInvoice = (service: ServiceItem) => {
    handleNavigate('facturas');
    setInvoiceStartItem({
      id: crypto.randomUUID(),
      description: service.title,
      quantity: '1',
      unitPrice: service.price,
      ivaRate: service.ivaText.includes('Exento') ? 0 : 0.19,
      subtotal: service.price,
    });
  };

  const openDocuments = (clientId?: string) => {
    handleNavigate('documentos');
    setDocumentsClientFilter(clientId);
  };

  const handleStatusChanged = (kind: 'invoice' | 'cuenta' | 'contrato', id: string, status: string) => {
    const update = <T extends { id: string; status: string; dueDate: string }>(d: T): T =>
      d.id === id ? withOverdueStatus({ ...d, status }) : d;
    if (kind === 'invoice') setInvoices((prev) => prev.map(update));
    else if (kind === 'cuenta') setCuentasCobro((prev) => prev.map(update));
    else setContracts((prev) => prev.map((c) => (c.id === id ? { ...c, status: status as Contract['status'] } : c)));
  };

  const handleClientUpdated = (c: Client) => setClients((prev) => prev.map((p) => (p.id === c.id ? c : p)));

  const handleClientDeleted = (id: string) => {
    // The database keeps the documents with client_id = null; mirror that here.
    const unlink = <T extends { clientId: string }>(d: T): T => (d.clientId === id ? { ...d, clientId: '' } : d);
    setInvoices((prev) => prev.map(unlink));
    setCuentasCobro((prev) => prev.map(unlink));
    setClients((prev) => prev.filter((p) => p.id !== id));
    if (selectedClientId === id) setSelectedClientId(undefined);
    handleNavigate('clientes');
  };

  const clientsWithTotals = withDocumentTotals(clients, [...invoices, ...cuentasCobro]);

  if (!authReady) return null;
  if (isSupabaseConfigured && !session) return <LoginScreen />;

  return (
    <div className="min-h-screen bg-surface-container-lowest text-text-primary antialiased">
      {/* Global Sidebar with exact data-path links */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        userName={profile.name}
        userEmail={profile.email || session?.user.email || ''}
      />

      {/* Main Container with responsive offset for Sidebar */}
      <div className="pl-0 lg:pl-[260px]">
        {/* Global Header */}
        <Header
          onNavigate={handleNavigate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onLogout={isSupabaseConfigured ? () => supabase.auth.signOut() : undefined}
        />

        {/* Dynamic Screen View */}
        <main key={currentScreen} className="relative pt-16 bg-surface-container-lowest min-h-screen">
          {loadError && (
            <div role="alert" className="mx-space-md mt-space-md p-space-md rounded-[12px] border border-status-vencida text-status-vencida text-body-sm">
              No se pudieron cargar los datos desde Supabase: {loadError}. Lo que ves puede estar incompleto.
            </div>
          )}
          {!dataLoaded && !loadError && (
            <p className="p-space-xl text-body-md text-text-subtlest">Cargando datos...</p>
          )}

          {dataLoaded && currentScreen === 'dashboard' && (
            <DashboardScreen
              onNavigate={handleNavigate}
              onOpenClient={openClient}
              onOpenDocuments={openDocuments}
              invoices={invoices}
              cuentasCobro={cuentasCobro}
              clients={clientsWithTotals}
            />
          )}

          {dataLoaded && currentScreen === 'documentos' && (
            <DocumentosScreen
              onNavigate={handleNavigate}
              onOpenClient={openClient}
              invoices={invoices}
              cuentasCobro={cuentasCobro}
              contracts={contracts}
              clients={clientsWithTotals}
              clientFilter={documentsClientFilter}
              onClearClientFilter={() => setDocumentsClientFilter(undefined)}
              onStatusChanged={handleStatusChanged}
              onOpenDocument={openDocument}
            />
          )}

          {dataLoaded && currentScreen === 'clientes' && (
            <ClientesScreen
              onNavigate={handleNavigate}
              clients={clientsWithTotals}
              onClientCreated={(c) => setClients((prev) => [...prev, c])}
              onOpenClient={openClient}
              onCreateInvoice={(id) => {
                setSelectedClientId(id);
                handleNavigate('facturas');
              }}
              onClientUpdated={handleClientUpdated}
              onClientDeleted={handleClientDeleted}
            />
          )}

          {dataLoaded && currentScreen === 'contratos' && (
            <GeneradorContratoScreen
              key={viewing?.kind === 'contrato' ? viewing.contract.id : 'new'}
              existing={viewing?.kind === 'contrato' ? viewing.contract : undefined}
              onNavigate={handleNavigate}
              template={INITIAL_CONTRACT}
              contracts={contracts}
              clients={clientsWithTotals}
              profile={profile}
              initialClientId={selectedClientId}
              onSaved={(c) => {
                setContracts((prev) => [c, ...prev]);
                openClient(c.clientId);
              }}
            />
          )}

          {dataLoaded && currentScreen === 'facturas' && (
            <GeneradorFacturaScreen
              key={viewing?.kind === 'invoice' ? viewing.invoice.id : invoiceStartItem?.id ?? 'new'}
              existing={viewing?.kind === 'invoice' ? viewing : undefined}
              initialItem={invoiceStartItem}
              onNavigate={handleNavigate}
              clients={clientsWithTotals}
              invoices={invoices}
              profile={profile}
              initialClientId={selectedClientId}
              onSaved={(inv) => {
                setInvoices((prev) => [withOverdueStatus(inv), ...prev]);
                openClient(inv.clientId);
              }}
            />
          )}

          {dataLoaded && currentScreen === 'perfil-cliente' && (
            <PerfilClienteScreen
              onNavigate={handleNavigate}
              client={clientsWithTotals.find((c) => c.id === selectedClientId)}
              invoices={invoices}
              cuentasCobro={cuentasCobro}
              contracts={contracts}
              onClientUpdated={handleClientUpdated}
              onClientDeleted={handleClientDeleted}
              onOpenDocument={openDocument}
              onOpenDocuments={openDocuments}
            />
          )}

          {dataLoaded && currentScreen === 'servicios' && (
            <CatalogoServiciosScreen
              onNavigate={handleNavigate}
              services={services}
              onServiceSaved={(svc) =>
                setServices((prev) => (prev.some((p) => p.id === svc.id) ? prev.map((p) => (p.id === svc.id ? svc : p)) : [...prev, svc]))
              }
              onServiceDeleted={(id) => setServices((prev) => prev.filter((p) => p.id !== id))}
              onUseInInvoice={addServiceToInvoice}
            />
          )}

          {dataLoaded && currentScreen === 'cuentas-cobro' && (
            <GeneradorCuentaCobroScreen
              key={viewing?.kind === 'cuenta' ? viewing.cuenta.id : 'new'}
              existing={viewing?.kind === 'cuenta' ? viewing.cuenta : undefined}
              onNavigate={handleNavigate}
              clients={clientsWithTotals}
              cuentasCobro={cuentasCobro}
              profile={profile}
              initialClientId={selectedClientId}
              onSaved={(cc) => {
                setCuentasCobro((prev) => [withOverdueStatus(cc), ...prev]);
                openClient(cc.clientId);
              }}
            />
          )}

          {dataLoaded && currentScreen === 'configuracion' && (
            <ConfiguracionScreen onNavigate={handleNavigate} profile={profile} onProfileSaved={setProfile} />
          )}
        </main>
      </div>
    </div>
  );
}
