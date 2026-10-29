-- Seed data from mockData.ts
-- Run after schema.sql

-- clients
insert into public.clients (id,name,legal_name,nit,sector,city,address,contact_name,contact_role,email,phone,pending_balance,total_billed,status,avatar_initials,avatar_bg,avatar_color,tax_regime,ica_rate,rete_fuente_rate)
values
('cli-0089','Nu Colombia S.A.','Nu Colombia Compañía de Financiamiento S.A.','901.345.890-1','Fintech • Bogotá D.C.','Bogotá D.C.','Cra. 11 #79-52, Oficina 801','Laura Restrepo','Lead Product Designer • Aprobador','lrestrepo@nu.com.co','+57 310 456 7890',0,42500000,'Activo','NC','rgba(130, 10, 209, 0.1)','#820ad1','Gran Contribuyente - Res. DIAN No. 012220 / Autorretenedor','9.66 por mil (0.966%) - Cód 6201','4.0% - Servicios Generales / Honorarios'),
('cli-0090','Rappi SAS','Rappi Colombia S.A.S.','900.874.123-4','Tecnología • Logística','Bogotá D.C.','Cl. 93 # 19-55','Andrés Gómez','Engineering Manager','agomez@rappi.com','+57 320 890 1234',3800000,22800000,'Activo','RP','rgba(255, 68, 31, 0.1)','#ff441f',null,null,null),
('cli-0091','Habi Technologies','Habi Tech S.A.S.','901.223.456-7','Proptech • Real Estate','Bogotá D.C.','Calle 100 # 8A-49','Carolina Mejía','Head of Product','cmejia@habi.co','+57 301 234 5678',5200000,16100000,'Pendiente','HB','rgba(24, 104, 219, 0.1)','#1868db',null,null,null),
('cli-0092','Bold Pagos SAS','Bold Pagos Colombia S.A.S.','901.554.321-9','Pasarelas de Pago • Bogotá','Bogotá D.C.','Cra 7 # 71-21','Felipe Jaramillo','VP Operations','fjaramillo@bold.co','+57 315 678 9012',0,9400000,'Activo','BP','#eeeef0','#505f78',null,null,null),
('cli-0093','LaHaus Proptech','La Haus Servicios Inmobiliarios S.A.S.','900.998.776-5','Inmobiliaria Digital • Medellín','Medellín','El Poblado Cra 43A','Sebastián Ruiz','Product Director','sruiz@lahaus.com','+57 312 345 6789',0,12500000,'Inactivo','LH','#e8e8ea','#63666b',null,null,null),
('cli-0094','Bancolombia S.A.','Bancolombia S.A. Compañía de Financiamiento','890.903.938-8','Banca & Servicios Financieros','Medellín / Bogotá','Cra. 48 # 26-85, Medellín','Maria Camila Ospina','Design Ops Lead','mospina@bancolombia.com.co','+57 311 987 6543',2800000,38000000,'Activo','BA','#fff0b3','#c75300',null,null,null)
on conflict (id) do nothing;

-- services
insert into public.services (id,title,code,category,unit,price,iva_text,description,tags)
values
('serv-1','Diseño y Arquitectura de Producto UX/UI','UX-01','uiux','Hora',150000,'IVA 19% Incluido','Investigación de usuarios, mapas de flujo, prototipado interactivo de alta fidelidad en Figma y validaciones de heurística con stakeholders','{"Figma Files","User Flows","Clickable Prototype"}'),
('serv-2','Implementación Front-end React & Tailwind','DEV-04','dev','Proyecto',4500000,'IVA 19% Adicional','Maquetación y lógica de componentes modulares en Next.js/React con styling en Tailwind CSS. Integración completa de APIs RESTful y tests unitarios','{"Repo GitHub","CI/CD Setup","Responsive QA"}'),
('serv-3','Auditoría de Usabilidad y Accesibilidad WCAG','Art. 476-8 ET','consulting','Proyecto',2800000,'Exento (0% IVA)','Diagnóstico exhaustivo de conformidad AA según pautas WCAG 2.2 con lectores de pantalla (NVDA/VoiceOver) y plan de remediación en código','{"Informe Ejecutivo","Checklist WCAG","Guía de Parches"}'),
('serv-4','Mantenimiento y Design Ops Continuo','RET-02','uiux','Mes',3200000,'IVA 19%','Bolsa de 30 horas mensuales para iteración de funcionalidades, soporte a células ágiles de ingeniería y gobierno del kit de Figma','{"30h Asignadas","Slack Connect","Reporte Semanal"}'),
('serv-5','Diseño de Sistema de Diseño y Tokens','SYS-09','uiux','Proyecto',6000000,'IVA 19%','Taxonomía semántica de variables de color, tipografía, espaciado e iconografía. Documentación en Storybook y biblioteca centralizada Figma','{"Design Tokens JSON","Storybook Kit","Gobernanza"}'),
('serv-6','Consultoría Técnica y Mentoría 1:1','ADVISE-01','consulting','Hora',200000,'IVA 19%','Sesión personalizada para revisión de arquitectura de software, validación de presupuestos y acompañamiento directivo a equipos de producto','{"Minuta Ejecutiva","Grabación HD","Q&A Async"}')
on conflict (id) do nothing;

-- invoices
insert into public.invoices (id,number,client_id,client_name,nit,date,due_date,amount,status)
values
('fac-042','FAC-2025-042','cli-0090','Rappi S.A.S.','900.843.898-1','22 Oct 2024','21 Nov 2024',4500000,'Pagada'),
('fac-041','FAC-2025-041','cli-0089','Nu Colombia Compañía de Financiamiento','901.442.238-3','18 Oct 2024','17 Nov 2024',3200000,'Enviada'),
('fac-040','FAC-2025-040','cli-0095','Mercadolibre Colombia Ltda.','830.067.412-2','10 Oct 2024','09 Nov 2024',2000000,'Pendiente'),
('fac-039','FAC-2025-039','cli-0092','Bold Pagos Colombia','901.277.632-4','28 Sep 2024','28 Oct 2024',1850000,'Vencida'),
('fac-038','FAC-2025-038','cli-0096','Platzi Inc. Sucursal Colombia','900.751.291-0','25 Sep 2024','25 Oct 2024',3300000,'Borrador')
on conflict (id) do nothing;

-- cuentas_cobro
insert into public.cuentas_cobro (id,number,client_id,client_name,nit,contract_ref,date,due_date,amount,concept,status)
values
('cc-018','CC-2025-018','cli-0094','Bancolombia S.A.','890.903.938-8','FOS-2025-089','2025-05-28','2025-06-05',2800000,'Por concepto de honorarios profesionales correspondientes al Hito 2: Consultoría en Arquitectura UX y Sistema de Diseño para Banca Móvil durante el mes de Mayo 2025 según Contrato FOS-2025-089.','Pendiente'),
('cc-019','CC-2025-019','cli-0096','Platzi Inc.','900.751.291-0','FOS-2025-044','2025-05-20','2025-05-26',1500000,'Producción de Contenido Técnico Curso Go','Pendiente'),
('cc-020','CC-2025-020','cli-0091','Habi Colombia','901.223.456-7','FOS-2025-012','2025-05-15','2025-05-29',900000,'Auditoría Frontend y Accesibilidad WCAG','Pendiente')
on conflict (id) do nothing;

-- contracts
insert into public.contracts (id,number,client_id,client_name,nit,object,scope,duration,total_value,payment_schedule,status)
values
('ctr-089','FOS-2025-089-RAP','cli-0090','Rappi SAS — NIT 900.874.123-4 (Bogotá D.C.)','900.874.123-4','Prestación de servicios profesionales independientes de consultoría en diseño de experiencia de usuario y desarrollo frontend','Diseño del flujo checkout, prototipado interactivo y entrega de tokens de diseño','3 meses (01 Jun 2025 - 31 Ago 2025)',18000000,'Tres (3) desembolsos mensuales de $6.000.000 COP contra entrega de informe y cuenta de cobro','Borrador')
on conflict (id) do nothing;

-- contract_clauses
insert into public.contract_clauses (id,contract_id,title,icon,content,is_open,sort_order)
values
('c1','ctr-089','Cláusula 1: Confidencialidad y Reserva (NDA)','lock','Las partes convienen guardar estricta confidencialidad sobre la información técnica, financiera, comercial y operativa que mutuamente se suministren o conozcan con ocasión del desarrollo de este contrato por un término de cinco (5) años tras su expiración.',true,1),
('c2','ctr-089','Cláusula 2: Propiedad Intelectual de Entregables','copyright','Los derechos patrimoniales sobre los diseños, esquemas y código frontend desarrollados pertenecerán exclusivamente a EL CONTRATANTE una vez se haya efectuado la totalidad del pago pactado. EL CONTRATISTA conserva los derechos morales irrenunciables.',false,2),
('c3','ctr-089','Cláusula 3: Causales de Terminación Anticipada','cancel','El contrato podrá terminarse anticipadamente por mutuo acuerdo entre las partes, por fuerza mayor insuperable o por incumplimiento imputable a cualquiera de las partes mediante preaviso escrito motivado not inferior a quince (15) días calendario.',false,3),
('c4','ctr-089','Cláusula 4: Ley Aplicable y Solución de Controversias','gavel','El presente contrato se rige íntegramente por la legislación civil y comercial de la República de Colombia. Cualquier diferendo será sometido a un Centro de Conciliación y Arbitraje de la Cámara de Comercio de Bogotá.',false,4)
on conflict (id) do nothing;

-- freelancer_profile
insert into public.freelancer_profile (id,name,legal_name,doc_type_and_number,nit,regime,ciiu,address,city,phone,email,bank_name,bank_account,masked_account,transfiya_phone)
values
(1,'Carlos Mendoza','Carlos Alberto Mendoza Silva','C.C. 1.032.456.789 de Bogotá','1.032.456.789-0','Régimen Simple de Tributación (RST)','6201 - Desarrollo de software y consultoría','Calle 93 # 14-20, Of. 402, Chicó Norte','Bogotá D.C. - Colombia (110221)','','','','','','')
on conflict (id) do nothing;
