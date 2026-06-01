-- ============================================================
-- SmartCampus UTA - Script 02: Politicas de Seguridad (RLS)
-- Ejecutar despues de 01_tablas.sql
-- ============================================================

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE turnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tramites ENABLE ROW LEVEL SECURITY;
ALTER TABLE nodos_campus ENABLE ROW LEVEL SECURITY;
ALTER TABLE rutas_campus ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS usuarios_select_own ON usuarios;
DROP POLICY IF EXISTS usuarios_insert_own ON usuarios;
DROP POLICY IF EXISTS turnos_all ON turnos;
DROP POLICY IF EXISTS documentos_all ON documentos;
DROP POLICY IF EXISTS tramites_all ON tramites;
DROP POLICY IF EXISTS nodos_select ON nodos_campus;
DROP POLICY IF EXISTS nodos_insert ON nodos_campus;
DROP POLICY IF EXISTS rutas_select ON rutas_campus;
DROP POLICY IF EXISTS rutas_insert ON rutas_campus;

-- Lectura publica para validar login y registro simple desde frontend.
CREATE POLICY usuarios_select_own ON usuarios
    FOR SELECT USING (true);

CREATE POLICY usuarios_insert_own ON usuarios
    FOR INSERT WITH CHECK (true);

CREATE POLICY turnos_all ON turnos
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY documentos_all ON documentos
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY tramites_all ON tramites
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY nodos_select ON nodos_campus
    FOR SELECT USING (true);

CREATE POLICY nodos_insert ON nodos_campus
    FOR INSERT WITH CHECK (true);

CREATE POLICY rutas_select ON rutas_campus
    FOR SELECT USING (true);

CREATE POLICY rutas_insert ON rutas_campus
    FOR INSERT WITH CHECK (true);
