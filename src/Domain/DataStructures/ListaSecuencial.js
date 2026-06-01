// ============================================================
// SmartCampus UTA — ListaSecuencial.js
// Capa de Dominio: Estructura de Datos — Lista Secuencial (Array)
// Usada en: catálogos de tipos de trámite, edificios, usuarios
// ============================================================

export class ListaSecuencial {
    constructor(capacidad = 1000) {
        this.datos = new Array(capacidad);
        this._tamano = 0;
        this.capacidad = capacidad;
    }

    insertar(elemento, indice = this._tamano) {
        if (this._tamano >= this.capacidad) throw new Error('Lista llena');
        if (indice < 0 || indice > this._tamano) throw new Error('Índice fuera de rango');
        for (let i = this._tamano; i > indice; i--) {
            this.datos[i] = this.datos[i - 1];
        }
        this.datos[indice] = elemento;
        this._tamano++;
    }

    eliminar(indice) {
        if (indice < 0 || indice >= this._tamano) throw new Error('Índice fuera de rango');
        const elem = this.datos[indice];
        for (let i = indice; i < this._tamano - 1; i++) {
            this.datos[i] = this.datos[i + 1];
        }
        this.datos[this._tamano - 1] = undefined;
        this._tamano--;
        return elem;
    }

    obtener(indice) {
        if (indice < 0 || indice >= this._tamano) throw new Error('Índice fuera de rango');
        return this.datos[indice];
    }

    buscarIndice(fn) {
        for (let i = 0; i < this._tamano; i++) {
            if (fn(this.datos[i])) return i;
        }
        return -1;
    }

    buscar(fn) {
        const idx = this.buscarIndice(fn);
        return idx !== -1 ? this.datos[idx] : null;
    }

    filtrar(fn) {
        const r = [];
        for (let i = 0; i < this._tamano; i++) {
            if (fn(this.datos[i])) r.push(this.datos[i]);
        }
        return r;
    }

    /** Cargar desde array JS */
    cargarDesdeArray(arr) {
        this._tamano = 0;
        arr.forEach(e => this.insertar(e));
    }

    toArray() {
        return Array.from({ length: this._tamano }, (_, i) => this.datos[i]);
    }

    tamano() { return this._tamano; }
    estaVacia() { return this._tamano === 0; }
}
