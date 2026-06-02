# SmartCampus UTA — Casos de Prueba

## Caso 1: Registrarse y cambiar rol

**Pasos:**
1. Accede a `/SmartCampusUTA/registro.html`
2. Ingresa nombre: "Carlos García", email: `carlos@uta.edu.ec`, contraseña: "Test123"
3. Haz clic en "Registrarse"
4. Verifica redirección al dashboard de estudiante

**Resultado esperado:** Usuario registrado con rol `estudiante`, acceso a dashboard de estudiante

**Resultado obtenido:** [Completa después de ejecutar]

---

## Caso 2: Panel Administrador - Cambiar rol de usuario

**Pasos:**
1. Inicia sesión como admin (si existe: `admin@uta.edu.ec`)
2. Ve a `Gestión de Usuarios`
3. Selecciona un usuario y abre el dropdown de rol
4. Cambia de `estudiante` → `empleado` → `admin`
5. Verifica que la tabla se actualiza

**Resultado esperado:** Los cambios se persisten en Supabase y el select refleja el nuevo rol

**Resultado obtenido:** [Completa después de ejecutar]

---

## Caso 3: Panel Empleado - Atender turnos

**Pasos:**
1. Crea un turno como estudiante desde `solicitar_tramite.html`
2. Inicia sesión como empleado (`carlos@uta.edu.ec`)
3. Ve a `Gestion de Turnos`
4. Selecciona servicio y haz clic "Atender siguiente"
5. Verifica que el turno desaparece de la lista

**Resultado esperado:** Turno cambia a estado `atendiendo`, se elimina de la cola

**Resultado obtenido:** [Completa después de ejecutar]

---

## Caso 4: Arbol de Dependencias - CRUD

**Pasos:**
1. Inicia sesión como admin
2. Ve a `Dependencias Institucionales`
3. Crea 3 nodos: "Rectorado" (raíz), "Facultad Ingeniería" (padre: Rectorado), "Carrera Sistemas" (padre: Facultad)
4. Haz clic en un nodo para editar
5. Doble-clic para eliminar
6. Ejecuta BFS y verifica el recorrido

**Resultado esperado:** Árbol se renderiza correctamente, CRUD funciona, BFS muestra orden correcto

**Resultado obtenido:** [Completa después de ejecutar]

---

## Caso 5: Mapa Campus - Dijkstra

**Pasos:**
1. Crea 4 nodos en `Gestión de Rutas`: "Entrada", "Lab A", "Lab B", "Cafeteria"
2. Crea 4 rutas: Entrada→LabA (100m), LabA→LabB (50m), LabB→Cafeteria (75m), Entrada→Cafeteria (200m)
3. Ve a `Mapa del Campus` como estudiante
4. Selecciona origen: Entrada, destino: Cafeteria
5. Haz clic "Calcular ruta (Dijkstra)"
6. Verifica que muestra ruta óptima: "Entrada → Lab A → Lab B → Cafeteria (225m)"

**Resultado esperado:** Ruta óptima calculada, mostrada en texto y línea naranja en canvas

**Resultado obtenido:** [Completa después de ejecutar]

---

## Notas:
- Ejecutar casos en orden: 1 → 2 → 3 → 4 → 5
- Si hay datos previos, limpiar antes de cada caso
- Documentar cualquier error con captura de pantalla
