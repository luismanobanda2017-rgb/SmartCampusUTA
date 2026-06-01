// ============================================================
// SmartCampus UTA — Grafo.js
// Capa de Dominio: Estructura de Datos — Grafo + Dijkstra
// Usada en: mapa del campus y búsqueda de rutas óptimas
// ============================================================

export class Grafo {
    constructor() {
        this.nodos = new Map();        // id → { nombre, tipo, pos_x, pos_y }
        this.adyacencias = new Map();  // id → [{ destino, distancia }]
    }

    agregarNodo(id, datos) {
        this.nodos.set(id, datos);
        if (!this.adyacencias.has(id)) this.adyacencias.set(id, []);
    }

    agregarArista(origenId, destinoId, distancia, bidireccional = true) {
        this.adyacencias.get(origenId)?.push({ destino: destinoId, distancia });
        if (bidireccional) {
            this.adyacencias.get(destinoId)?.push({ destino: origenId, distancia });
        }
    }

    /** Construir grafo desde arrays de Supabase */
    construirDesdeSupabase(nodos, rutas) {
        for (const n of nodos) {
            this.agregarNodo(n.id, { nombre: n.nombre, tipo: n.tipo, pos_x: n.pos_x, pos_y: n.pos_y });
        }
        for (const r of rutas) {
            this.agregarArista(r.nodo_origen_id, r.nodo_destino_id, r.distancia, r.bidireccional);
        }
    }

    /**
     * Dijkstra: ruta más corta entre dos nodos
     * @returns {{ distancia: number, ruta: string[] }}
     */
    dijkstra(origenId, destinoId) {
        const dist = new Map();
        const prev = new Map();
        const visitados = new Set();
        const pendientes = new Set(this.nodos.keys());

        for (const id of this.nodos.keys()) dist.set(id, Infinity);
        dist.set(origenId, 0);

        while (pendientes.size > 0) {
            // Nodo no visitado con menor distancia
            let u = null;
            for (const id of pendientes) {
                if (!visitados.has(id) && (u === null || dist.get(id) < dist.get(u))) u = id;
            }
            if (u === null || dist.get(u) === Infinity) break;
            if (u === destinoId) break;

            visitados.add(u);
            pendientes.delete(u);

            for (const { destino, distancia } of (this.adyacencias.get(u) || [])) {
                const alt = dist.get(u) + distancia;
                if (alt < dist.get(destino)) {
                    dist.set(destino, alt);
                    prev.set(destino, u);
                }
            }
        }

        // Reconstruir ruta
        const ruta = [];
        let actual = destinoId;
        while (actual !== undefined) {
            ruta.unshift(actual);
            actual = prev.get(actual);
        }

        if (ruta[0] !== origenId) return { distancia: Infinity, ruta: [] };
        return { distancia: dist.get(destinoId), ruta };
    }

    obtenerNodos() { return Array.from(this.nodos.entries()).map(([id, d]) => ({ id, ...d })); }
    obtenerAristas() {
        const r = [];
        for (const [origen, lista] of this.adyacencias) {
            for (const { destino, distancia } of lista) r.push({ origen, destino, distancia });
        }
        return r;
    }
}
