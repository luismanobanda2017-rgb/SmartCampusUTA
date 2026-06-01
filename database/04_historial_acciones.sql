-- ============================================================
-- SmartCampus UTA - Script 04: Tabla historial_acciones
-- Ejecutar DESPUÉS de 01_tablas.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS historial_acciones (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id    UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    tipo_accion   TEXT NOT NULL,
    descripcion   TEXT,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_historial_usuario ON historial_acciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_historial_fecha   ON historial_acciones(created_at DESC);

-- Datos de prueba para historial
INSERT INTO historial_acciones (usuario_id, tipo_accion, descripcion)
SELECT id, 'tramite_creado', 'Trámite de matrícula creado'
FROM usuarios WHERE email = 'juan.perez@uta.edu.ec'
ON CONFLICT DO NOTHING;

INSERT INTO historial_acciones (usuario_id, tipo_accion, descripcion)
SELECT id, 'turno_solicitado', 'Turno de secretaría solicitado'
FROM usuarios WHERE email = 'maria.garcia@uta.edu.ec'
ON CONFLICT DO NOTHING;
