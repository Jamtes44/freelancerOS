export type ScreenId =
  | 'dashboard'
  | 'clientes'
  | 'servicios'
  | 'facturas'
  | 'cuentas-cobro'
  | 'contratos'
  | 'configuracion'
  | 'perfil-cliente';

export interface Client {
  id: string;
  name: string;
  legalName?: string;
  nit: string;
  sector: string;
  city: string;
  address: string;
  contactName: string;
  contactRole?: string;
  email: string;
  phone: string;
  pendingBalance: number;
  totalBilled: number;
  status: 'Activo' | 'Pendiente' | 'Inactivo';
  avatarInitials: string;
  avatarBg?: string;
  avatarColor?: string;
  taxRegime?: string;
  icaRate?: string;
  reteFuenteRate?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: string;
  unitPrice: number;
  ivaRate: number; // e.g. 0.19 or 0
  subtotal: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  nit: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'Pagada' | 'Enviada' | 'Pendiente' | 'Vencida' | 'Borrador';
  items?: InvoiceItem[];
}

export interface CuentaCobro {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  nit: string;
  contractRef: string;
  date: string;
  dueDate: string;
  amount: number;
  concept: string;
  status: 'Pagada' | 'Pendiente' | 'Vencida' | 'Borrador';
}

export interface ServiceItem {
  id: string;
  title: string;
  code: string;
  category: 'uiux' | 'dev' | 'consulting';
  unit: 'Hora' | 'Proyecto' | 'Mes';
  price: number;
  ivaText: string;
  description: string;
  tags: string[];
}

export interface ContractClause {
  id: string;
  title: string;
  icon: string;
  content: string;
  isOpen?: boolean;
}

export interface Contract {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  nit: string;
  object: string;
  scope: string;
  duration: string;
  totalValue: number;
  paymentSchedule: string;
  clauses: ContractClause[];
  status: 'Borrador' | 'En ejecución' | 'Firmado';
}

export interface FreelancerProfile {
  name: string;
  legalName: string;
  docTypeAndNumber: string;
  nit: string;
  regime: string;
  ciiu: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  bankName: string;
  bankAccount: string;
  maskedAccount: string;
  transfiyaPhone: string;
}
