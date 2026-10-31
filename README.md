# FreelanceOS

Gestión de clientes, facturas, cuentas de cobro y contratos para freelancers en Colombia (COP). React + Vite, con Supabase como base de datos.

## Correr en local

**Requisitos:** Node.js

1. Instala dependencias: `npm install`
2. Copia `.env.example` a `.env.local` y pon la URL y la anon key de tu proyecto de Supabase. Sin estas variables la app usa datos de prueba y no pide login.
3. Arranca la app: `npm run dev` (abre http://localhost:3000)

## Configurar Supabase

1. En el SQL Editor ejecuta `supabase/schema.sql` y, si quieres datos de ejemplo, `supabase/seed.sql`. Si tu base se creó antes de estos cambios, ejecuta una sola vez `supabase/migrate_dates.sql` (fechas tipo `date`) y `supabase/migrate_signature.sql` (columna de la firma).
2. En Authentication > Sign In / Providers desactiva **"Allow new users to sign up"**. Las tablas solo dejan leer y escribir a usuarios con sesión, así que si el registro queda abierto cualquiera podría crear una cuenta y ver tus datos.
3. En Authentication > Users crea tu usuario con **Auto Confirm User** marcado.

## Comprobaciones

- Tipos: `npm run lint`
- Tests: `npm test`
