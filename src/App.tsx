import React, { useState, useEffect } from 'react';
import { ScreenId } from './types';
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
import {
  INITIAL_CLIENTS,
  INITIAL_INVOICES,
  INITIAL_CUENTAS_COBRO,
  INITIAL_SERVICES,
  INITIAL_CONTRACT,
} from './data/mockData';
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
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [cuentasCobro, setCuentasCobro] = useState(INITIAL_CUENTAS_COBRO);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [contract, setContract] = useState(INITIAL_CONTRACT);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [c, inv, cc, serv, ctr] = await Promise.all([
          getClients(),
          getInvoices(),
          getCuentasCobro(),
          getServices(),
          getContract(),
        ]);
        if (!mounted) return;
        if (Array.isArray(c) && c.length) setClients(c);
        if (Array.isArray(inv) && inv.length) setInvoices(inv);
        if (Array.isArray(cc) && cc.length) setCuentasCobro(cc);
        if (Array.isArray(serv) && serv.length) setServices(serv);
        if (ctr) setContract(ctr);
      } catch (e) {
        console.warn('Error cargando datos desde Supabase, usando mocks', e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    document.title = SCREEN_TITLES[currentScreen] || 'FreelanceOS';
  }, [currentScreen]);

  const handleNavigate = (screen: ScreenId) => {
    setCurrentScreen(screen);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        />

        {/* Dynamic Screen View */}
        <main className="relative pt-16 bg-surface-container-lowest min-h-screen">
          {currentScreen === 'dashboard' && (
            <DashboardScreen
              onNavigate={handleNavigate}
              invoices={invoices}
              cuentasCobro={cuentasCobro}
            />
          )}

          {currentScreen === 'clientes' && (
            <ClientesScreen onNavigate={handleNavigate} clients={clients} />
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
