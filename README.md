# SmartCampus UTA Web
**Proyecto Integrador — Estructura de Datos · Ingeniería de Software · UTA 2025**

## Tecnologías
- **Frontend:** HTML5, CSS3 (Bootstrap 5.3), JavaScript ES Modules
- **Base de datos:** Supabase (PostgreSQL)
- **Persistencia:** Supabase JS SDK v2
- **Control de versiones:** Git / GitHub

## Estructura de carpetas
```
SmartCampusUTA/
├── index.html                        ← Landing page
├── database/
│   ├── 01_tablas.sql                 ← Crear tablas
│   ├── 02_politicas_rls.sql          ← Políticas RLS
│   ├── 03_datos_prueba.sql           ← Seed data
│   └── 04_historial_acciones.sql     ← Tabla de bitácora (ejecutar también)
├── src/
│   ├── Domain/DataStructures/        ← Estructuras propias implementadas
│   │   ├── ListaSecuencial.js        → Catálogos de trámites/edificios
│   │   ├── ListaSimple.js            → Historial dinámico de solicitudes
│   │   ├── ListaDoble.js             → Navegación en expedientes
│   │   ├── ListaCircular.js          → Rotación Round-Robin de ventanillas
│   │   ├── Pila.js                   → Historial LIFO de acciones
│   │   ├── Cola.js                   → Fila FIFO de atención
│   │   ├── Arbol.js                  → Clasificación jerárquica de documentos
│   │   └── Grafo.js                  → Mapa del campus + Dijkstra
│   └── Persistence/
│       └── supabaseClient.js         ← Acceso a Supabase (ya configurado)
└── Web_Visual/
    ├── login.html
    ├── registro.html
    ├── assets/css/style.css
    ├── assets/js/auth.js
    └── roles/
        ├── estudiante/
        │   ├── dashboard.html
        │   ├── solicitar_tramite.html  ← Lista simple enlazada
        │   ├── mis_turnos.html         ← Cola FIFO
        │   ├── documentos.html         ← Árbol N-ario
        │   ├── mapa_campus.html        ← Grafo + Dijkstra
        │   ├── historial_tramites.html ← Lista doble
        │   └── perfil.html
        └── administrador/
            ├── dashboard.html
            ├── gestion_usuarios.html   ← Lista secuencial
            ├── gestion_tramites.html   ← Lista doble (nav. expedientes)
            ├── gestion_turnos.html     ← Cola FIFO + Lista circular
            ├── gestion_rutas.html      ← Grafo editable + Dijkstra
            └── reportes.html           ← Reportes con export CSV
```

## Cómo ejecutar
1. **Supabase ya configurado** — El proyecto usa `https://uizabeaqthcsxuimclji.supabase.co`
2. Ejecuta los 4 scripts SQL en orden en el SQL Editor de Supabase
3. Abre `index.html` en un servidor local (ej. VS Code Live Server o `npx serve .`)
4. Usuarios de prueba (contraseña: `123456`):
   - `juan.perez@uta.edu.ec` — Estudiante
   - `admin@uta.edu.ec` — Admin

## Estructuras de datos implementadas

| Estructura         | Ubicación en el sistema                          | Justificación                          |
|--------------------|--------------------------------------------------|----------------------------------------|
| Lista secuencial   | Catálogo de usuarios, tipos de trámite           | Acceso indexado O(1)                   |
| Lista simple       | Historial dinámico de solicitudes del estudiante | Inserción O(1) al inicio/final         |
| Lista doble        | Navegación hacia adelante/atrás en expedientes   | Recorrido bidireccional                |
| Lista circular     | Rotación de ventanillas (Round-Robin)            | Ciclos de asignación sin fin           |
| Pila (LIFO)        | Historial de acciones del sistema (deshacer)     | Reversión del último evento            |
| Cola (FIFO)        | Fila de atención estudiantil por servicio        | Orden justo de atención                |
| Árbol N-ario       | Clasificación jerárquica de documentos           | Relaciones padre-hijo entre carpetas   |
| Grafo + Dijkstra   | Mapa del campus y rutas óptimas                  | Conexiones complejas entre ubicaciones |

## Arquitectura por capas

```
Presentación  →  Web_Visual/  (HTML + CSS + JS de UI)
Aplicación    →  assets/js/auth.js  (casos de uso)
Dominio       →  src/Domain/DataStructures/  (estructuras propias)
Persistencia  →  src/Persistence/supabaseClient.js  (Supabase)
Datos         →  Supabase PostgreSQL (tablas + RLS)
```
