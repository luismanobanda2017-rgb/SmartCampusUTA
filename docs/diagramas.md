# SmartCampus UTA — Arquitectura y Diagramas

## 1. Modelo Entidad-Relación (ER)

```
┌─────────────────────────────────────────────────────────────┐
│                     SmartCampus Database                     │
└─────────────────────────────────────────────────────────────┘

┌────────────────┐          ┌──────────────────┐
│   usuarios     │          │   tramites       │
├────────────────┤          ├──────────────────┤
│ id (PK)        │◇─────────│ id (PK)          │
│ nombre         │   1:N    │ usuario_id (FK)  │
│ email (UNIQUE) │          │ tipo             │
│ password_hash  │          │ estado           │
│ rol            │          │ created_at       │
│ created_at     │          │ updated_at       │
└────────────────┘          └──────────────────┘
       △
       │ 1:N
       │
  ┌────┴────────────┐
  │
┌──────────────┐    ┌──────────────────┐
│   turnos     │    │  documentos      │
├──────────────┤    ├──────────────────┤
│ id (PK)      │    │ id (PK)          │
│ usuario_id   │    │ usuario_id (FK)  │
│ servicio     │    │ tipo             │
│ estado       │    │ nombre           │
│ created_at   │    │ url_archivo      │
└──────────────┘    │ created_at       │
                    └──────────────────┘

┌──────────────────────┐    ┌──────────────────────┐
│   nodos_campus       │    │  rutas_campus        │
├──────────────────────┤    ├──────────────────────┤
│ id (PK)              │◇───│ id (PK)              │
│ nombre               │1:N │ nodo_origen_id (FK)  │
│ tipo                 │    │ nodo_destino_id (FK) │
│ pos_x, pos_y         │    │ distancia            │
│ created_at           │    │ bidireccional        │
└──────────────────────┘    └──────────────────────┘

┌─────────────────────┐
│  dependencias       │
├─────────────────────┤
│ id (PK)             │
│ nombre              │
│ tipo                │
│ parent_id (FK self) │
│ created_at          │
└─────────────────────┘

┌──────────────────────┐
│  historial_acciones  │
├──────────────────────┤
│ id (PK)              │
│ usuario_id (FK)      │
│ tipo_accion          │
│ descripcion          │
│ created_at           │
└──────────────────────┘
```

---

## 2. Arquitectura de 3 Capas

```
┌───────────────────────────────────────────────────────────────┐
│              CAPA DE PRESENTACIÓN (Web_Visual/)               │
├───────────────────────────────────────────────────────────────┤
│  index.html, login.html, registro.html                        │
│  roles/administrador/: dashboard, gestion_usuarios,           │
│                       gestion_rutas, gestion_tramites,        │
│                       gestion_turnos, reportes, dependencias   │
│  roles/empleado/: dashboard, gestion_turnos, gestion_tramites │
│  roles/estudiante/: dashboard, solicitar_tramite, mis_turnos, │
│                    perfil, documentos, mapa_campus             │
│  assets/js/: auth.js (navbar, sesion), componentes/, roles/   │
│  assets/css/: style.css (Bootstrap + custom vars)             │
└──────────────────┬──────────────────────────────────────────┘
                   │ import/fetch
┌──────────────────┴──────────────────────────────────────────┐
│            CAPA DE DOMINIO (src/Domain/)                    │
├──────────────────────────────────────────────────────────────┤
│  DataStructures/:                                            │
│  • Arbol.js: N-ary tree con BFS/DFS/renderHTML              │
│  • Grafo.js: Graph con Dijkstra pathfinding                 │
│  • Pila.js: LIFO stack capacity=50 (push/pop/peek)          │
│  • Cola.js: FIFO queue                                      │
│  • ListaSimple.js, ListaDoble.js, ListaCircular.js          │
│  • ListaSecuencial.js                                       │
│                                                              │
│  Lógica de negocio (normalizacion, transformación)          │
└──────────────────┬───────────────────────────────────────┘
                   │ CRUD calls
┌──────────────────┴───────────────────────────────────────┐
│      CAPA DE PERSISTENCIA (src/Persistence/)             │
├─────────────────────────────────────────────────────────┤
│  supabaseClient.js: API wrapper                          │
│  • Supabase SDK (JS v2)                                  │
│  • Session helpers: guardarSesion, obtenerSesion, etc.   │
│  • Auth: registrarUsuario, iniciarSesion                │
│  • CRUD: crear*, obtener*, actualizar*, eliminar*        │
│  • Tablas: usuarios, tramites, turnos, documentos, etc.  │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/REST
        ┌──────────┴───────────┐
        │  PostgreSQL DB       │
        │  (Supabase Cloud)    │
        └──────────────────────┘
```

---

## 3. Diagramas de Clases - Estructuras de Datos

### 3.1 Arbol (N-ary Tree)

```javascript
class Arbol {
  nodos: Map<id, NodoArbol>
  
  agregar(id, valor, parent_id?): void
  obtenerPadre(id): NodoArbol | null
  obtenerHijos(id): NodoArbol[]
  
  bfs(): NodoArbol[]  // BFS traversal
  dfs(id?): NodoArbol[] // DFS traversal
  renderHTML(): string // <ul><li> tree markup
  estaVacio(): boolean
}

interface NodoArbol {
  id: any
  valor: any
  padre?: any
  hijos: any[]
}
```

**Uso:** dependencias.html (departamentos institucionales)

---

### 3.2 Grafo (Directed Graph + Dijkstra)

```javascript
class Grafo {
  nodos: Map<id, any>
  adyacencias: Map<id, Array<{destino, distancia}>>
  
  agregar(id, datos): void
  conectar(origen, destino, distancia): void
  construirDesdeSupabase(nodos[], rutas[]): void
  
  dijkstra(origen, destino): {distancia, ruta: id[]}
  obtenerVecinos(id): {destino, distancia}[]
  obtenerAristas(): {origen, destino}[]
  
  estaVacio(): boolean
  tieneNodo(id): boolean
}
```

**Uso:** gestion_rutas.html (crear rutas campus), mapa_campus.html (calcular ruta Dijkstra)

---

### 3.3 Pila (Stack, LIFO)

```javascript
class Pila {
  capacidad: number = 50
  elementos: any[]
  
  apilar(elemento): void         // push
  desapilar(): any               // pop
  verTope(): any                 // peek
  estaVacia(): boolean
  
  toArray(): any[]  // [top...bottom]
}
```

**Uso:** reportes.html (últimas 5 acciones con pila)

---

### 3.4 Cola (Queue, FIFO)

```javascript
class Cola {
  capacidad: number = 50
  elementos: any[]
  
  encolar(elemento): void        // enqueue
  desencolar(): any              // dequeue
  verFrente(): any               // peek
  estaVacia(): boolean
  
  toArray(): any[]
}
```

**Uso:** [Disponible para turnos en espera]

---

### 3.5 ListaSimple (Singly Linked List)

```javascript
class ListaSimple {
  cabeza: Nodo | null
  
  insertar(indice, dato): void
  obtener(indice): any
  eliminar(indice): any
  recorrer(): any[]
}

class Nodo {
  dato: any
  siguiente: Nodo | null
}
```

---

### 3.6 ListaDoble (Doubly Linked List)

```javascript
class ListaDoble {
  cabeza: NodoDoble | null
  cola: NodoDoble | null
  
  insertarInicio(dato): void
  insertarFinal(dato): void
  obtener(indice): any
  recorrer(): any[]
  recorrerInverso(): any[]
}

class NodoDoble {
  dato: any
  siguiente: NodoDoble | null
  anterior: NodoDoble | null
}
```

---

### 3.7 ListaCircular (Circular Linked List)

```javascript
class ListaCircular {
  cabeza: NodoCircular | null
  
  insertar(dato): void
  obtener(indice): any
  siguiente(nodoActual): NodoCircular  // rotates
  recorrer(): any[]
}

class NodoCircular {
  dato: any
  siguiente: NodoCircular  // siempre apunta (nunca null)
}
```

---

### 3.8 ListaSecuencial (Array-based List)

```javascript
class ListaSecuencial {
  elementos: any[]
  
  insertar(indice, dato): void
  obtener(indice): any
  actualizar(indice, dato): void
  eliminar(indice): any
  
  tamanio(): number
  estaVacia(): boolean
}
```

---

## 4. Flujos de Integración

### Flujo A: Estudiante solicita trámite

```
Estudiante (solicitar_tramite.html)
    ↓ crearTramite()
supabaseClient.js (INSERT tramites)
    ↓
Base de datos (tramites.estado = 'pendiente')
    ↓
Admin (gestion_tramites.html) actualiza estado
    ↓
historial_acciones.registrarAccion()
    ↓
reportes.html (Pila: muestra últimas 5 acciones)
```

### Flujo B: Admin gestiona campus

```
Admin (gestion_rutas.html)
    ↓ crearNodo(), crearRuta()
supabaseClient.js (INSERT nodos_campus, rutas_campus)
    ↓
Grafo.construirDesdeSupabase()
    ↓
Canvas: dibujar() + Dijkstra visualization
    ↓
Estudiante (mapa_campus.html)
    ↓ dijkstra(origen, destino)
Grafo.dijkstra() → {distancia, ruta}
    ↓
Mostrar ruta en texto + línea naranja
```

### Flujo C: Empleado atiende turnos

```
Turno creado (estado: 'esperando')
    ↓
Empleado (gestion_turnos.html)
    ↓ atenderSiguienteTurno(servicio)
supabaseClient.js (UPDATE estado → 'atendiendo')
    ↓
Turno: finalizarTurno(id)
    ↓
UPDATE estado → 'finalizado'
    ↓
registrarAccion() → historial_acciones
```

---

## 5. Variables de Entorno (Supabase)

```
SUPABASE_URL = https://uizabeaqthcsxuimclji.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 6. Estilos CSS Personalizados

```css
:root {
  --uta-blue: #0b3b5f;      /* Primary navbar, buttons */
  --fisei-orange: #e87a2a;   /* Secondary (routes, highlights) */
  --line: #d9e2ec;           /* Borders, dividers */
  --muted: #667085;          /* Text secondary */
}

.content-panel { 
  background: white; 
  border-radius: 8px; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.page-header {
  padding: 1rem 0;
  border-bottom: 2px solid var(--line);
}
```

---

## 7. Tabla Resumen de Componentes

| Componente | Ubicación | Rol | Función |
|-----------|-----------|-----|---------|
| `index.html` | Root | Público | Landing + redirección |
| `auth.js` | assets/js | Todos | Sesión, navbar, validación |
| `supabaseClient.js` | src/Persistence | Todos | API wrapper |
| `Grafo.js` | src/Domain | Admin, Estudiante | Rutas y Dijkstra |
| `Arbol.js` | src/Domain | Admin | Dependencias |
| `Pila.js` | src/Domain | Admin | Historial (últimas 5) |
| `gestion_usuarios.html` | admin | Admin | CRUD usuarios |
| `gestion_rutas.html` | admin | Admin | CRUD nodos y rutas |
| `reportes.html` | admin | Admin | KPIs + export CSV |
| `dependencias.html` | admin | Admin | Árbol institucional |
| `solicitar_tramite.html` | estudiante | Estudiante | Crear trámites |
| `mapa_campus.html` | estudiante | Estudiante | Visualizar rutas |
| `gestion_turnos.html` | empleado | Empleado | Atender cola |
| `gestion_tramites.html` | empleado | Empleado | Aprobar/rechazar |

---

**Generado:** 2025-01-07  
**Versión:** 1.0  
**Estado:** Documentación activa para desarrollo
