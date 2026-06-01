// ============================================================
// SmartCampus UTA — Cola.js
// Capa de Dominio: Estructura de Datos — Cola (FIFO)
// Usada en: fila de atención estudiantil (módulo de Turnos)
// ============================================================

class NodoCola {
    constructor(dato) {
        this.dato = dato;
        this.siguiente = null;
    }
}

export class Cola {
    constructor() {
        this.frente = null;
        this.fin = null;
        this._tamano = 0;
    }

    /** Agregar elemento al final */
    encolar(elemento) {
        const nodo = new NodoCola(elemento);
        if (!this.frente) {
            this.frente = this.fin = nodo;
        } else {
            this.fin.siguiente = nodo;
            this.fin = nodo;
        }
        this._tamano++;
    }

    /** Eliminar y retornar el primero (FIFO) */
    desencolar() {
        if (this.estaVacia()) throw new Error('La cola está vacía');
        const dato = this.frente.dato;
        this.frente = this.frente.siguiente;
        if (!this.frente) this.fin = null;
        this._tamano--;
        return dato;
    }

    /** Ver el frente sin eliminar */
    verFrente() {
        return this.frente?.dato ?? null;
    }

    estaVacia() { return this._tamano === 0; }
    tamano() { return this._tamano; }

    toArray() {
        const r = [];
        let a = this.frente;
        while (a) { r.push(a.dato); a = a.siguiente; }
        return r;
    }
}
