-- ============================================================
-- SmartCampus UTA - Script 01: Creacion de Tablas
-- Ejecutar en: Supabase SQL Editor
-- Proyecto: uizabeaqthcsxuimclji
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SEQUENCE IF NOT EXISTS turno_seq START 1;

CREATE TABLE IF NOT EXISTS usuarios (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre        TEXT NOT NULL,
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    rol           TEXT NOT NULL DEFAULT 'estudiante' CHECK (rol IN ('estudiante', 'admin')),
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS turnos (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id   UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    numero_turno INTEGER NOT NULL DEFAULT nextval('turno_seq'),
    servicio     TEXT NOT NULL CHECK (servicio IN ('secretaria', 'bienestar', 'biblioteca', 'financiero')),
    estado       TEXT NOT NULL DEFAULT 'esperando' CHECK (estado IN ('esperando', 'atendiendo', 'finalizado')),
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documentos (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre         TEXT NOT NULL,
    tipo           TEXT NOT NULL CHECK (tipo IN ('carpeta', 'archivo')),
    parent_id      UUID REFERENCES documentos(id) ON DELETE CASCADE,
    propietario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    url_archivo    TEXT,
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tramites (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id   UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo         TEXT NOT NULL CHECK (tipo IN ('matricula', 'beca', 'certificado', 'retiro', 'otro')),
    descripcion  TEXT,
    estado       TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_proceso', 'completado', 'rechazado')),
    siguiente_id UUID REFERENCES tramites(id),
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nodos_campus (
    id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    tipo   TEXT NOT NULL CHECK (tipo IN ('edificio', 'entrada', 'parqueadero', 'area_verde', 'cafeteria')),
    pos_x  FLOAT NOT NULL,
    pos_y  FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS rutas_campus (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nodo_origen_id  UUID NOT NULL REFERENCES nodos_campus(id) ON DELETE CASCADE,
    nodo_destino_id UUID NOT NULL REFERENCES nodos_campus(id) ON DELETE CASCADE,
    distancia       FLOAT NOT NULL,
    bidireccional   BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_turnos_estado ON turnos(estado, created_at);
CREATE INDEX IF NOT EXISTS idx_turnos_usuario ON turnos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_docs_parent ON documentos(parent_id);
CREATE INDEX IF NOT EXISTS idx_docs_propietario ON documentos(propietario_id);
CREATE INDEX IF NOT EXISTS idx_tramites_usuario ON tramites(usuario_id);
CREATE INDEX IF NOT EXISTS idx_rutas_origen ON rutas_campus(nodo_origen_id);
