// ============================================================
// SmartCampus UTA — ListaCircular.js
// Capa de Dominio: Estructura de Datos — Lista Circular
// Usada en: rotación Round-Robin de ventanillas/responsables
// ============================================================

class NodoCircular {
    constructor(dato) {
        this.dato = dato;
        this.siguiente = null;
    }
}

export class ListaCircular {
    constructor() {
        this.ultimo = null;   // apunta al último nodo; último.siguiente = cabeza
        this.tamano = 0;
        this._actual = null;
    }

    insertar(dato) {
        const nodo = new NodoCircular(dato);
        if (!this.ultimo) {
            nodo.siguiente = nodo;
            this.ultimo = nodo;
        } else {
            nodo.siguiente = this.ultimo.siguiente; // nuevo.sig = cabeza
            this.ultimo.siguiente = nodo;
            this.ultimo = nodo;
        }
        this.tamano++;
    }

    eliminar(fn) {
        if (!this.ultimo) return false;
        let cabeza = this.ultimo.siguiente;
        // Caso: solo un nodo
        if (this.tamano === 1) {
            if (fn(cabeza.dato)) { this.ultimo = null; this.tamano--; return true; }
            return false;
        }
        let anterior = this.ultimo;
        let actual = cabeza;
        for (let i = 0; i < this.tamano; i++) {
            if (fn(actual.dato)) {
                anterior.siguiente = actual.siguiente;
                if (actual === this.ultimo) this.ultimo = anterior;
                this.tamano--;
                return true;
            }
            anterior = actual;
            actual = actual.siguiente;
        }
        return false;
    }

    /** Siguiente turno Round-Robin */
    siguiente() {
        if (!this.ultimo) return null;
        if (!this._actual) this._actual = this.ultimo.siguiente;
        else this._actual = this._actual.siguiente;
        return this._actual.dato;
    }

    actual() {
        return this._actual?.dato ?? (this.ultimo ? this.ultimo.siguiente.dato : null);
    }

    toArray() {
        if (!this.ultimo) return [];
        const r = [];
        let nodo = this.ultimo.siguiente;
        for (let i = 0; i < this.tamano; i++) {
            r.push(nodo.dato);
            nodo = nodo.siguiente;
        }
        return r;
    }

    estaVacia() { return this.tamano === 0; }
    obtenerTamano() { return this.tamano; }
}
