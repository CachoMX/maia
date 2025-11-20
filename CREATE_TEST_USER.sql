-- Script para crear usuario de prueba para Wendy
-- Ejecutar esto en Supabase SQL Editor

-- Paso 1: Crear usuario en auth.users (Supabase Auth)
-- Nota: Esto es solo para desarrollo. En producción usarías signup normal.

-- Opción A: Usando Supabase Dashboard (RECOMENDADO)
-- 1. Ve a: https://app.supabase.com/project/bexudrmrspbyhkcqrtse/auth/users
-- 2. Clic en "Add user" → "Create new user"
-- 3. Email: wendy.aragon@atlas.es
-- 4. Password: Maia2025! (temporal)
-- 5. Auto Confirm User: YES
-- 6. Clic "Create user"
-- 7. COPIA el UUID del usuario que se creó

-- Opción B: Usando SQL (si la Opción A no funciona)
-- IMPORTANTE: Primero ve al Dashboard y crea el usuario manualmente
-- Luego ejecuta esto para agregar el perfil:

-- Paso 2: Agregar perfil de usuario (REEMPLAZA el UUID con el de tu usuario)
-- Ejecuta esto DESPUÉS de crear el usuario en el Dashboard

INSERT INTO users (
  id,  -- REEMPLAZA ESTE UUID con el que copiaste del Dashboard
  email,
  first_name,
  last_name,
  role,
  sss_position,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',  -- ⚠️ REEMPLAZA ESTE UUID
  'wendy.aragon@atlas.es',
  'Wendy',
  'Aragón',
  'SSS_STAFF',
  'LEAD',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  sss_position = EXCLUDED.sss_position;

-- Verificar que el usuario fue creado correctamente
SELECT
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  u.role,
  u.sss_position
FROM users u
WHERE u.email = 'wendy.aragon@atlas.es';
