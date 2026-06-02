-- ============================================================
-- SmartCampus UTA — 05_nodos_campus_completo.sql
-- Nodos reales del Campus Huachi UTA con nombres completos
-- ============================================================

DELETE FROM rutas_campus;
DELETE FROM nodos_campus;

-- ── Nodos ──────────────────────────────────────────────────
INSERT INTO nodos_campus (nombre, tipo, pos_x, pos_y) VALUES
  -- Administración
  ('Universidad Técnica de Ambato',                      'edificio',    5, 5),
  ('Rectorado',                                          'edificio',    5, 7),
  ('Secretaría General',                                 'edificio',    4, 5),
  ('Bienestar Universitario',                            'edificio',    3, 5),
  ('CADME - Evaluación de Conformidad',                  'edificio',    6, 7),
  ('Biblioteca General',                                 'edificio',    5, 6),

  -- Facultades
  ('Facultad de Ingeniería en Sistemas',                 'edificio',    7, 6),
  ('Facultad de Ciencias Administrativas',               'edificio',    6, 8),
  ('Facultad de Contabilidad y Auditoría',               'edificio',    6, 9),
  ('Facultad de Ciencias Humanas y de la Educación',     'edificio',    5, 9),
  ('Facultad de Diseño, Arquitectura y Artes',           'edificio',    5,10),
  ('Facultad de Ingeniería Civil y Mecánica',            'edificio',    8, 5),
  ('Facultad de Ciencia e Ingeniería en Alimentos',      'edificio',    8, 4),
  ('Facultad de Jurisprudencia y Ciencias Sociales',     'edificio',    6, 8),
  ('Centro de Idiomas',                                  'edificio',    7, 8),
  ('Edificio de Ciencias Básicas',                       'edificio',    7, 6),
  ('Carrera de Mercadotecnia',                           'edificio',    6, 6),
  ('IEEE DAY UTA',                                       'edificio',    6, 5),

  -- Deportes
  ('Coliseo Universitario',                              'area_verde',  3, 3),
  ('Estadio Universitario',                              'area_verde',  3, 2),
  ('Complejo Acuático',                                  'area_verde',  4, 2),

  -- Servicios
  ('Patio de Comidas',                                   'cafeteria',   4, 5),
  ('Parqueadero Norte',                                  'parqueadero', 6, 9),
  ('Parqueadero Sur',                                    'parqueadero', 8, 4),
  ('Entrada Principal',                                  'entrada',     4, 6);

-- ── Rutas (bidireccionales) ────────────────────────────────
INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 120, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Entrada Principal' AND d.nombre = 'Secretaría General';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 80, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Secretaría General' AND d.nombre = 'Rectorado';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 90, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Rectorado' AND d.nombre = 'Biblioteca General';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 100, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Biblioteca General' AND d.nombre = 'Facultad de Ingeniería en Sistemas';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 110, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Biblioteca General' AND d.nombre = 'Facultad de Ciencias Administrativas';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 60, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Biblioteca General' AND d.nombre = 'Patio de Comidas';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 70, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Facultad de Ciencias Administrativas' AND d.nombre = 'Facultad de Contabilidad y Auditoría';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 80, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Facultad de Contabilidad y Auditoría' AND d.nombre = 'Facultad de Ciencias Humanas y de la Educación';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 90, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Facultad de Ciencias Humanas y de la Educación' AND d.nombre = 'Facultad de Diseño, Arquitectura y Artes';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 130, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Facultad de Ingeniería en Sistemas' AND d.nombre = 'Facultad de Ingeniería Civil y Mecánica';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 140, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Facultad de Ingeniería Civil y Mecánica' AND d.nombre = 'Facultad de Ciencia e Ingeniería en Alimentos';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 95, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Biblioteca General' AND d.nombre = 'Facultad de Jurisprudencia y Ciencias Sociales';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 85, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Facultad de Jurisprudencia y Ciencias Sociales' AND d.nombre = 'Centro de Idiomas';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 70, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Centro de Idiomas' AND d.nombre = 'Edificio de Ciencias Básicas';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 100, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Patio de Comidas' AND d.nombre = 'Coliseo Universitario';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 150, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Coliseo Universitario' AND d.nombre = 'Estadio Universitario';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 90, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Estadio Universitario' AND d.nombre = 'Complejo Acuático';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 110, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Biblioteca General' AND d.nombre = 'Bienestar Universitario';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 70, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Bienestar Universitario' AND d.nombre = 'CADME - Evaluación de Conformidad';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 180, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Parqueadero Norte' AND d.nombre = 'Rectorado';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 160, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Parqueadero Sur' AND d.nombre = 'Facultad de Ingeniería Civil y Mecánica';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 75, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Biblioteca General' AND d.nombre = 'Carrera de Mercadotecnia';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 65, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Biblioteca General' AND d.nombre = 'IEEE DAY UTA';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 55, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Universidad Técnica de Ambato' AND d.nombre = 'Biblioteca General';

INSERT INTO rutas_campus (nodo_origen_id, nodo_destino_id, distancia, bidireccional)
SELECT o.id, d.id, 60, true FROM nodos_campus o, nodos_campus d
  WHERE o.nombre = 'Universidad Técnica de Ambato' AND d.nombre = 'Rectorado';
