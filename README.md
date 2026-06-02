# SmartCampus UTA

**Proyecto Integrador — Estructura de Datos · Ingeniería de Software · UTA 2025**

---

## 📑 Informe Técnico del Proyecto

| Campo              | Datos                                                    |
|--------------------|----------------------------------------------------------|
| Institución        | Universidad Técnica de Ambato (UTA)                      |
| Facultad           | Ingeniería en Sistemas, Electrónica e Industrial (FISEI) |
| Carrera            | Ingeniería en Software                                   |
| Asignatura         | Estructura de Datos                                      |
| Fecha              | 2026                                                     |

---

## 1. Introducción

SmartCampus UTA es un sistema web de gestión universitaria que centraliza la atención de turnos, trámites académicos, documentos y navegación en el campus. La plataforma fue diseñada para mejorar la experiencia de estudiantes, empleados y administradores de la UTA, integrando estructuras de datos clásicas como listas, pilas, colas, árboles y grafos con una base de datos en la nube (Supabase PostgreSQL) y una interfaz responsiva en Bootstrap 5.

El módulo de mapa interactivo resuelve el problema del camino más corto entre dependencias físicas del Campus Huachi mediante teoría de grafos y el algoritmo de Dijkstra, con visualización real sobre OpenStreetMap a través de Leaflet.js.

---

## 2. Objetivos

### 2.1 Objetivo General
Diseñar e implementar un sistema de gestión universitaria web con estructuras de datos propias, persistencia en la nube y enrutamiento dinámico del campus.

### 2.2 Objetivos Específicos
- Modelar la topología del Campus Huachi UTA como un Grafo No Dirigido Ponderado.
- Desarrollar una implementación propia del algoritmo de Dijkstra en JavaScript para calcular rutas óptimas en tiempo real.
- Renderizar visualmente los nodos, aristas y rutas calculadas sobre un mapa real con Leaflet + OpenStreetMap.
- Sincronizar de forma asíncrona la arquitectura del grafo con Supabase PostgreSQL.
- Implementar las 8 estructuras de datos requeridas (lista secuencial, lista simple, lista doble, lista circular, pila, cola, árbol N-ario y grafo) en módulos propios reutilizables.
- Gestionar roles de acceso (estudiante, empleado, administrador) con autenticación por sesión.

---

## 3. Marco Teórico

- **Teoría de Grafos:** Un grafo G = (V, A) se compone de vértices (V) que representan dependencias físicas y aristas (A) que modelan los senderos peatonales. El campus se modeló como grafo no dirigido ponderado, donde los pesos son distancias en metros.
- **Algoritmo de Dijkstra:** Algoritmo de búsqueda de caminos que determina la ruta con menor ponderación acumulada desde un nodo origen. Complejidad O(V²) con implementación por lista de adyacencia.
- **Leaflet.js:** Librería JavaScript de mapas interactivos que renderiza tiles de OpenStreetMap y permite superponer marcadores, polylines y controles personalizados.
- **Supabase:** Backend-as-a-Service basado en PostgreSQL con SDK JavaScript para operaciones CRUD, políticas Row Level Security (RLS) y autenticación.

---

## 4. Tecnologías

| Capa          | Tecnología                                  |
|---------------|---------------------------------------------|
| Frontend      | HTML5, CSS3, Bootstrap 5.3, JavaScript ES Modules |
| Mapa          | Leaflet.js 1.9.4 + OpenStreetMap            |
| Base de datos | Supabase (PostgreSQL)                       |
| Persistencia  | Supabase JS SDK v2                          |
| Autenticación | Sesión custom vía supabaseClient.js         |
| Control de versiones | Git / GitHub                         |

---

## 5. Arquitectura por Capas

```
Presentación  →  Web_Visual/           (HTML + CSS + Bootstrap)
Aplicación    →  assets/js/auth.js     (sesión, navbar, redirección por rol)
Dominio       →  src/Domain/           (estructuras de datos propias)
Persistencia  →  src/Persistence/      (Supabase client)
Datos         →  Supabase PostgreSQL   (tablas + políticas RLS)
```

---

## 6. Estructura de Carpetas

```
SmartCampusUTA/
├── index.html                              ← Landing page pública
├── PRUEBAS.md                              ← Casos de prueba del sistema
├── database/
│   ├── 01_tablas.sql                       ← Crear todas las tablas
│   ├── 02_politicas_rls.sql                ← Políticas Row Level Security
│   ├── 03_datos_prueba.sql                 ← Datos semilla para pruebas
│   ├── 04_historial_acciones.sql           ← Tabla de bitácora de acciones
│   └── 05_nodos_campus_completo.sql        ← Nodos y rutas del campus Huachi
├── docs/
│   └── diagramas.md                        ← Diagramas de arquitectura
├── src/
│   ├── Application/
│   │   └── Services/                       ← Capa de servicios (extensible)
│   ├── Domain/
│   │   └── DataStructures/
│   │       ├── ListaSecuencial.js          → Catálogos de usuarios/trámites
│   │       ├── ListaSimple.js              → Historial dinámico de solicitudes
│   │       ├── ListaDoble.js               → Navegación bidireccional en expedientes
│   │       ├── ListaCircular.js            → Rotación Round-Robin de ventanillas
│   │       ├── Pila.js                     → Historial LIFO de acciones (deshacer)
│   │       ├── Cola.js                     → Fila FIFO de atención de turnos
│   │       ├── Arbol.js                    → Árbol N-ario para documentos
│   │       └── Grafo.js                    → Grafo del campus + Dijkstra
│   └── Persistence/
│       └── supabaseClient.js               ← Acceso a Supabase (CRUD + auth)
└── Web_Visual/
    ├── login.html                          ← Inicio de sesión
    ├── registro.html                       ← Registro de nuevos usuarios
    ├── assets/
    │   ├── css/
    │   │   └── style.css                   ← Estilos globales del sistema
    │   └── js/
    │       ├── auth.js                     ← Sesión, navbar dinámico, redirección
    │       ├── componentes/                ← Componentes reutilizables (legacy)
    │       ├── estructuras/                ← Wrappers JS de estructuras (legacy)
    │       └── roles/                      ← Scripts específicos por rol (legacy)
    └── roles/
        ├── estudiante/
        │   ├── dashboard.html              ← Panel principal del estudiante
        │   ├── solicitar_tramite.html      ← Lista simple enlazada (trámites)
        │   ├── mis_turnos.html             ← Cola FIFO (turnos del estudiante)
        │   ├── documentos.html             ← Árbol N-ario (documentos)
        │   ├── mapa_campus.html            ← Grafo + Dijkstra + Leaflet
        │   ├── historial_tramites.html     ← Lista doble (nav. expedientes)
        │   ├── pila_historial.html         ← Pila LIFO (historial de acciones)
        │   └── perfil.html                 ← Perfil del estudiante
        ├── empleado/
        │   ├── dashboard.html              ← Panel principal del empleado
        │   ├── gestion_turnos.html         ← Cola FIFO (atención de turnos)
        │   ├── gestion_tramites.html       ← Gestión y aprobación de trámites
        │   ├── atender_turno.html          ← Atención de turno actual (FIFO)
        │   ├── mis_tramites_asignados.html ← Trámites asignados al empleado
        │   ├── documentos_pendientes.html  ← Árbol de documentos pendientes
        │   ├── horario_atencion.html       ← Gestión de franjas horarias
        │   └── mapa_campus.html            ← Mapa de campus (solo lectura)
        └── administrador/
            ├── dashboard.html              ← Panel principal del administrador
            ├── gestion_usuarios.html       ← Lista secuencial (CRUD usuarios)
            ├── gestion_tramites.html       ← Lista doble (nav. expedientes)
            ├── gestion_turnos.html         ← Cola FIFO + Lista circular (ventanillas)
            ├── gestion_rutas.html          ← Grafo editable + Dijkstra + Leaflet
            ├── dependencias.html           ← Árbol de dependencias institucionales
            ├── gestion_documentos.html     ← Gestión de documentos institucionales
            ├── reportes.html               ← Reportes con gráficos y export CSV
            └── auditoria.html              ← Bitácora completa (Pila LIFO)
```

---

## 7. Estructuras de Datos Implementadas

| Estructura       | Módulo                  | Uso en el sistema                                       | Complejidad |
|------------------|-------------------------|---------------------------------------------------------|-------------|
| Lista Secuencial | `ListaSecuencial.js`    | Catálogo de usuarios con acceso indexado                | O(1) acceso |
| Lista Simple     | `ListaSimple.js`        | Historial dinámico de solicitudes del estudiante        | O(1) inserción |
| Lista Doble      | `ListaDoble.js`         | Navegación ← → en expedientes de trámites              | O(1) ambos extremos |
| Lista Circular   | `ListaCircular.js`      | Rotación Round-Robin de ventanillas de atención         | O(1) siguiente |
| Pila (LIFO)      | `Pila.js`               | Historial de acciones del sistema y auditoría           | O(1) apilar/desapilar |
| Cola (FIFO)      | `Cola.js`               | Fila de atención estudiantil por servicio               | O(1) encolar/desencolar |
| Árbol N-ario     | `Arbol.js`              | Clasificación jerárquica de documentos institucionales  | O(n) recorrido |
| Grafo + Dijkstra | `Grafo.js`              | Mapa del campus y cálculo de rutas óptimas             | O(V²) Dijkstra |

---

## 8. Módulo de Mapa Interactivo (Grafo + Dijkstra)

### Nodos del Campus Huachi UTA
El campus se modela con **26 nodos** distribuidos en 4 categorías:

| Categoría      | Color     | Nodos                                                    |
|----------------|-----------|----------------------------------------------------------|
| Administración | 🔵 Azul   | UTA, Rectorado, Secretaría, Bienestar, Biblioteca        |
| Facultades     | 🔴 Rojo   | FISEI, FCA, FCAUD, FCHE, FDAA, FICM, FCIAB, FJCS, Idiomas, Ciencias Básicas, Mercadotecnia |
| Deportes       | 🟢 Verde  | Coliseo, Estadio, Complejo Acuático, Estadio UTA         |
| Servicios      | 🟠 Naranja| Patio de Comidas, Ambulancia, Parqueadero Norte, Parqueadero Sur, Entrada Principal |

### Algoritmo de Dijkstra
- Implementación propia en JavaScript puro (sin librerías externas)
- Grafo no dirigido ponderado con 32 aristas bidireccionales
- Pesos en metros (distancias reales entre edificios)
- Muestra distancia total y distancia de cada tramo sobre el mapa
- Coordenadas GPS reales del Campus Huachi (-1.2685, -78.6245)

### Visualización
- Nodos: marcadores `L.divIcon` con emoji por categoría
- Conexiones: polylines azules con opacidad 0.6
- Ruta calculada: polylines naranjas (#e87a2a) con etiquetas de distancia por tramo
- Leyenda interactiva en esquina inferior derecha
- Tarjetas de nodos clickeables con `flyTo` al punto en el mapa

---

## 9. Roles y Accesos

| Rol          | Acceso                                              | Email de prueba          |
|--------------|-----------------------------------------------------|--------------------------|
| Estudiante   | Trámites, turnos, documentos, mapa, perfil          | `juan.perez@uta.edu.ec`  |
| Empleado     | Atender turnos, tramitar documentos, mapa           | *(crear desde admin)*    |
| Administrador| CRUD completo, reportes, rutas, auditoría           | `admin@uta.edu.ec`       |

Contraseña de prueba para todos: `123456`

---

## 10. Configuración e Instalación

### Requisitos
- Navegador moderno con soporte a ES Modules
- Servidor local (VS Code Live Server, `npx serve .`, etc.)
- Cuenta en Supabase (ya configurada en el proyecto)

### Pasos
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/SmartCampusUTA.git
   cd SmartCampusUTA
   ```

2. Ejecutar los scripts SQL en el SQL Editor de Supabase, en orden:
   ```
   01_tablas.sql
   02_politicas_rls.sql
   03_datos_prueba.sql
   04_historial_acciones.sql
   05_nodos_campus_completo.sql
   ```

3. Iniciar un servidor local:
   ```bash
   npx serve .
   # o usar Live Server de VS Code
   ```

4. Abrir `index.html` en el navegador.

> **Nota:** El proyecto ya tiene Supabase configurado en `src/Persistence/supabaseClient.js` con el proyecto `uizabeaqthcsxuimclji.supabase.co`. No requiere configuración adicional.

---

## 11. Informe de Correcciones al Módulo de Rutas

| Problema detectado | Corrección aplicada |
|---|---|
| Conexión `['n04','n05']` referenciaba nodo eliminado (CADME) | Eliminada la arista, reestructurado el grafo |
| Nodo n08 (FCA) desconectado del grafo principal | Restaurada conexión `n06↔n08` y agregada `n08↔n14` |
| Dijkstra terminaba en nodo incorrecto cuando el destino no tenía predecesor en `prev` | Corregida reconstrucción de ruta: se verifica `ruta[0] === origen` antes de validar |
| Sin etiquetas de distancia por tramo en la visualización | Agregadas etiquetas `L.divIcon` en el punto medio de cada segmento de la ruta |
| Nodos n05, n18 referenciados en CONEXIONES tras ser eliminados | Eliminadas todas las aristas huérfanas del array CONEXIONES |
| Ruta visual (polyline) no mostraba los tramos individuales | Refactorizado para dibujar tramos uno a uno con su etiqueta correspondiente |
