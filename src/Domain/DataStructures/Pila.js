// ============================================================
// SmartCampus UTA — Pila.js
// Capa de Dominio: Estructura de Datos — Pila (LIFO)
// Usada en: deshacer acciones e historial de cambios de trámites
// ============================================================

class NodoPila {
    constructor(dato) {
        this.dato = dato;
        this.anterior = null;
    }
}

export class Pila {
    constructor(capacidadMaxima = 50) {
        this.tope = null;
        this._tamano = 0;
        this.capacidad = capacidadMaxima;
    }

    /** Agregar al tope */
    apilar(elemento) {
        if (this._tamano >= this.capacidad) {
            // Eliminar el elemento más antiguo (base)
            this._eliminarBase();
        }
        const nodo = new NodoPila(elemento);
        nodo.anterior = this.tope;
        this.tope = nodo;
        this._tamano++;
    }

    /** Eliminar y retornar el tope (LIFO) */
    desapilar() {
        if (this.estaVacia()) throw new Error('La pila está vacía');
        const dato = this.tope.dato;
        this.tope = this.tope.anterior;
        this._tamano--;
        return dato;
    }

    /** Ver tope sin eliminar */
    verTope() {
        return this.tope?.dato ?? null;
    }

    _eliminarBase() {
        if (!this.tope) return;
        if (!this.tope.anterior) { this.tope = null; this._tamano = 0; return; }
        let actual = this.tope;
        while (actual.anterior?.anterior) actual = actual.anterior;
        actual.anterior = null;
        this._tamano--;
    }

    estaVacia() { return this._tamano === 0; }
    tamano() { return this._tamano; }

    /** Retorna elementos de más reciente a más antiguo */
    toArray() {
        const r = [];
        let a = this.tope;
        while (a) { r.push(a.dato); a = a.anterior; }
        return r;
    }
}
