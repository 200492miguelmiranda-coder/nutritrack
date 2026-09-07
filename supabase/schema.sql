-- Esquema de NutriTrack para Supabase.
-- Ejecuta este SQL en tu proyecto: menú "SQL Editor" → "New query" → pega esto → "Run".

-- Una fila por usuario. Guardamos todo el estado de la app (perfil, registros,
-- historial) como un objeto JSON, identificado por el usuario autenticado.
create table if not exists public.estado_usuario (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Seguridad a nivel de fila: cada quien solo puede ver y cambiar lo suyo.
alter table public.estado_usuario enable row level security;

drop policy if exists "leer_lo_propio" on public.estado_usuario;
create policy "leer_lo_propio"
  on public.estado_usuario for select
  using (auth.uid() = user_id);

drop policy if exists "insertar_lo_propio" on public.estado_usuario;
create policy "insertar_lo_propio"
  on public.estado_usuario for insert
  with check (auth.uid() = user_id);

drop policy if exists "actualizar_lo_propio" on public.estado_usuario;
create policy "actualizar_lo_propio"
  on public.estado_usuario for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
