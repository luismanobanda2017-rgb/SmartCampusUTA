// ============================================================
// SmartCampus UTA — ListaSimple.js
// Capa de Dominio: Estructura de Datos — Lista Simplemente Enlazada
// Usada en: historial dinámico de solicitudes/trámites
// ============================================================

class NodoSimple {
    constructor(dato) {
        this.dato = dato;
        this.siguiente = null;
    }
}

export class ListaSimple {
    constructor() {
        this.cabeza = null;
        this.tamano = 0;
    }

    /** Insertar al inicio */
    insertarAlInicio(dato) {
        const nodo = new NodoSimple(dato);
        nodo.siguiente = this.cabeza;
        this.cabeza = nodo;
        this.tamano++;
    }

    /** Insertar al final */
    insertarAlFinal(dato) {
        const nodo = new NodoSimple(dato);
        if (!this.cabeza) {
            this.cabeza = nodo;
        } else {
            let actual = this.cabeza;
            while (actual.siguiente) actual = actual.siguiente;
            actual.siguiente = nodo;
        }
        this.tamano++;
    }

    /** Eliminar por valor usando función comparadora */
    eliminar(fn) {
        if (!this.cabeza) return false;
        if (fn(this.cabeza.dato)) {
            this.cabeza = this.cabeza.siguiente;
            this.tamano--;
            return true;
        }
        let actual = this.cabeza;
        while (actual.siguiente) {
            if (fn(actual.siguiente.dato)) {
                actual.siguiente = actual.siguiente.siguiente;
                this.tamano--;
                return true;
            }
            actual = actual.siguiente;
        }
        return false;
    }

    /** Buscar primer elemento que cumple condición */
    buscar(fn) {
        let actual = this.cabeza;
        while (actual) {
            if (fn(actual.dato)) return actual.dato;
            actual = actual.siguiente;
        }
        return null;
    }

    /** Convertir a array */
    toArray() {
        const resultado = [];
        let actual = this.cabeza;
        while (actual) {
            resultado.push(actual.dato);
            actual = actual.siguiente;
        }
        return resultado;
    }

    estaVacia() { return this.tamano === 0; }
    obtenerTamano() { return this.tamano; }
}
