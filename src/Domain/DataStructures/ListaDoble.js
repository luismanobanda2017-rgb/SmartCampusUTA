// ============================================================
// SmartCampus UTA — ListaDoble.js
// Capa de Dominio: Estructura de Datos — Lista Doblemente Enlazada
// Usada en: navegación hacia adelante/atrás en expedientes de trámites
// ============================================================

class NodoDoble {
    constructor(dato) {
        this.dato = dato;
        this.siguiente = null;
        this.anterior = null;
    }
}

export class ListaDoble {
    constructor() {
        this.cabeza = null;
        this.cola = null;
        this.tamano = 0;
        this._cursor = null;
    }

    insertar(dato) {
        const nodo = new NodoDoble(dato);
        if (!this.cabeza) {
            this.cabeza = this.cola = nodo;
        } else {
            nodo.anterior = this.cola;
            this.cola.siguiente = nodo;
            this.cola = nodo;
        }
        this.tamano++;
    }

    /** Ir al siguiente elemento (navegación hacia adelante) */
    siguiente() {
        if (!this._cursor) this._cursor = this.cabeza;
        else if (this._cursor.siguiente) this._cursor = this._cursor.siguiente;
        return this._cursor?.dato ?? null;
    }

    /** Ir al anterior (navegación hacia atrás) */
    anterior() {
        if (!this._cursor) this._cursor = this.cola;
        else if (this._cursor.anterior) this._cursor = this._cursor.anterior;
        return this._cursor?.dato ?? null;
    }

    irAlInicio() { this._cursor = this.cabeza; return this._cursor?.dato ?? null; }
    irAlFinal() { this._cursor = this.cola; return this._cursor?.dato ?? null; }

    toArray() {
        const r = [];
        let a = this.cabeza;
        while (a) { r.push(a.dato); a = a.siguiente; }
        return r;
    }

    toArrayReverso() {
        const r = [];
        let a = this.cola;
        while (a) { r.push(a.dato); a = a.anterior; }
        return r;
    }

    estaVacia() { return this.tamano === 0; }
    obtenerTamano() { return this.tamano; }
}
