// ============================================================
// SmartCampus UTA — Arbol.js
// Capa de Dominio: Estructura de Datos — Árbol N-ario
// Usada en: clasificación jerárquica de documentos y dependencias
// ============================================================

export class NodoArbol {
    constructor(dato) {
        this.dato = dato;
        this.hijos = [];
    }

    agregarHijo(nodo) {
        this.hijos.push(nodo);
    }

    eliminarHijo(fn) {
        const idx = this.hijos.findIndex(h => fn(h.dato));
        if (idx !== -1) { this.hijos.splice(idx, 1); return true; }
        return false;
    }

    esHoja() { return this.hijos.length === 0; }
}

export class Arbol {
    constructor() {
        this.raiz = null;
    }

    /** Insertar raíz */
    setRaiz(dato) {
        this.raiz = new NodoArbol(dato);
        return this.raiz;
    }

    /** Buscar nodo por función comparadora (BFS) */
    buscar(fn, desde = this.raiz) {
        if (!desde) return null;
        if (fn(desde.dato)) return desde;
        for (const hijo of desde.hijos) {
            const res = this.buscar(fn, hijo);
            if (res) return res;
        }
        return null;
    }

    /** Insertar hijo bajo el padre que cumple fn */
    insertarBajo(fnPadre, dato) {
        const padre = this.buscar(fnPadre);
        if (!padre) return null;
        const nodo = new NodoArbol(dato);
        padre.agregarHijo(nodo);
        return nodo;
    }

    /** Recorrido en anchura (BFS) → array plano */
    bfs() {
        if (!this.raiz) return [];
        const cola = [this.raiz];
        const resultado = [];
        while (cola.length) {
            const nodo = cola.shift();
            resultado.push(nodo.dato);
            cola.push(...nodo.hijos);
        }
        return resultado;
    }

    /** Recorrido en profundidad preorden */
    dfs(nodo = this.raiz, resultado = []) {
        if (!nodo) return resultado;
        resultado.push(nodo.dato);
        for (const hijo of nodo.hijos) this.dfs(hijo, resultado);
        return resultado;
    }

    /** Construir árbol desde array plano de Supabase (parent_id) */
    construirDesdeArray(items, idKey = 'id', parentKey = 'parent_id') {
        const mapa = new Map();
        const huerfanos = [];

        for (const item of items) {
            mapa.set(item[idKey], new NodoArbol(item));
        }

        for (const item of items) {
            const nodo = mapa.get(item[idKey]);
            if (!item[parentKey]) {
                huerfanos.push(nodo);
            } else {
                const padre = mapa.get(item[parentKey]);
                if (padre) padre.agregarHijo(nodo);
                else huerfanos.push(nodo);
            }
        }

        // Si hay una sola raíz real, usarla; si no, crear nodo virtual
        if (huerfanos.length === 1) {
            this.raiz = huerfanos[0];
        } else {
            this.raiz = new NodoArbol({ id: 'root', nombre: 'Documentos', tipo: 'carpeta' });
            for (const h of huerfanos) this.raiz.agregarHijo(h);
        }
        return this.raiz;
    }

    /** Renderizar árbol como HTML ul/li anidado */
    renderHTML(nodo = this.raiz, nivel = 0) {
        if (!nodo) return '';
        const d = nodo.dato;
        const icon = d.tipo === 'carpeta' ? '📁' : '📄';
        const nombre = d.nombre || d.label || 'Sin nombre';
        const esHoja = nodo.esHoja();

        const hijos = nodo.hijos.map(h => this.renderHTML(h, nivel + 1)).join('');
        return `
            <li class="tree-node${esHoja ? ' tree-leaf' : ''}">
                <span class="tree-label" data-id="${d.id}" data-tipo="${d.tipo}">
                    ${icon} ${nombre}
                </span>
                ${hijos ? `<ul class="tree-children">${hijos}</ul>` : ''}
            </li>`;
    }
}
