import React, { useState, useEffect } from 'react';
import { ScreenId, Client, Invoice, CuentaCobro, ServiceItem, Contract } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardScreen } from './screens/DashboardScreen';
import { ClientesScreen } from './screens/ClientesScreen';
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
  getContract,
} from './services/supabaseService';

const SCREEN_TITLES: Record<ScreenId, string> = {
  'dashboard': 'Dashboard - FreelanceOS',
  'clientes': 'Clientes - FreelanceOS',
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
  // Contract generator starts from the template until a contract is stored.
  const [contract, setContract] = useState<Contract>(INITIAL_CONTRACT);
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
      console.log('[APP] Iniciando carga de datos...');
      setLoadError('');
      try {
        const [c, inv, cc, serv, ctr] = await Promise.all([
          getClients(),
          getInvoices(),
          getCuentasCobro(),
          getServices(),
          getContract(),
        ]);
        console.log('[APP] Datos cargados:', { clients: c?.length, invoices: inv?.length, cuentas: cc?.length, services: serv?.length });
        if (!mounted) return;
        setClients(c);
        setInvoices(inv);
        setCuentasCobro(cc);
        setServices(serv);
        if (ctr) setContract(ctr);
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
    console.log('[APP] currentScreen ->', currentScreen);
    document.title = SCREEN_TITLES[currentScreen] || 'FreelanceOS';
  }, [currentScreen]);

  const handleNavigate = (screen: ScreenId) => {
    console.log('[APP] Navegando a:', screen);
    setCurrentScreen(screen);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          {currentScreen === 'dashboard' && (
            <DashboardScreen
              onNavigate={handleNavigate}
              invoices={invoices}
              cuentasCobro={cuentasCobro}
            />
          )}

          {currentScreen === 'clientes' && (
            <ClientesScreen
              onNavigate={handleNavigate}
              clients={clients}
              onClientCreated={(c) => setClients((prev) => [...prev, c])}
            />
          )}

          {currentScreen === 'contratos' && (
            <GeneradorContratoScreen onNavigate={handleNavigate} contract={contract} />
          )}

          {currentScreen === 'facturas' && (
            <GeneradorFacturaScreen onNavigate={handleNavigate} />
          )}

          {currentScreen === 'perfil-cliente' && (
            <PerfilClienteScreen onNavigate={handleNavigate} client={clients[0]} />
          )}

          {currentScreen === 'servicios' && (
            <CatalogoServiciosScreen onNavigate={handleNavigate} services={services} />
          )}

          {currentScreen === 'cuentas-cobro' && (
            <GeneradorCuentaCobroScreen onNavigate={handleNavigate} />
          )}

          {currentScreen === 'configuracion' && (
            <ConfiguracionScreen onNavigate={handleNavigate} />
          )}
        </main>
      </div>
    </div>
  );
}
