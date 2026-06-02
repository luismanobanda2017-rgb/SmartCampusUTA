// ============================================================
// SmartCampus UTA — supabaseClient.js
// Capa de Persistencia: conexión a Supabase
// ============================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL     = 'https://uizabeaqthcsxuimclji.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpemFiZWFxdGhjc3h1aW1jbGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MzE4MjUsImV4cCI6MjA5NDAwNzgyNX0.H4vQ555fMICjG3c7qwY8n6dc_hYKcDZcaOMS-a4H9H4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── helpers de sesión ────────────────────────────────────────────────────────
function hashPass(p) { return btoa(`${p}_uta_salt`); }

export function guardarSesion(usuario) {
    localStorage.setItem('sc_usuario', JSON.stringify(usuario));
}
export function obtenerSesion() {
    const raw = localStorage.getItem('sc_usuario');
    return raw ? JSON.parse(raw) : null;
}
export function cerrarSesion() {
    localStorage.removeItem('sc_usuario');
    window.location.href = getRaiz() + 'login.html';
}

export function getRaiz() {
    const p = window.location.pathname;
    const depth = (p.match(/\/roles\/|\/tramites\/|\/turnos\/|\/documentos\/|\/rutas\//));
    if (!depth) return '';
    if (p.includes('/roles/administrador/') || p.includes('/roles/empleado/') || p.includes('/roles/estudiante/')) return '../../';
    return '../';
}

export function requireSession() {
    const s = obtenerSesion();
    if (!s) window.location.href = getRaiz() + 'index.html';
    return s;
}

// ─── AUTH ────────────────────────────────────────────────────────────────────
export async function registrarUsuario(nombre, email, password) {
    const mail = email.trim().toLowerCase();

    const { data: existe } = await supabase.from('usuarios').select('id').eq('email', mail).maybeSingle();
    if (existe) throw new Error('Ese correo ya está registrado.');

    const { data, error } = await supabase
        .from('usuarios')
        .insert([{ nombre: nombre.trim(), email: mail, password_hash: hashPass(password), rol: 'estudiante' }])
        .select().single();
    if (error) throw new Error('Error al registrar: ' + error.message);
    guardarSesion(data);
    return data;
}

export async function iniciarSesion(email, password) {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .eq('password_hash', hashPass(password))
        .maybeSingle();
    if (error || !data) throw new Error('Correo o contraseña incorrectos.');
    guardarSesion(data);
    return data;
}

// ─── TURNOS ──────────────────────────────────────────────────────────────────
export async function crearTurno(usuario_id, servicio) {
    const { data, error } = await supabase
        .from('turnos').insert([{ usuario_id, servicio, estado: 'esperando' }]).select().single();
    if (error) throw new Error(error.message);
    return data;
}

export async function obtenerTurnosPorEstado(estado = 'esperando') {
    const { data, error } = await supabase
        .from('turnos').select('*, usuarios(nombre, email)')
        .eq('estado', estado).order('created_at');
    if (error) throw new Error(error.message);
    return data;
}

export async function obtenerTurnosUsuario(usuario_id) {
    const { data, error } = await supabase
        .from('turnos').select('*').eq('usuario_id', usuario_id).order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function atenderSiguienteTurno(servicio) {
    const { data: turnos, error } = await supabase
        .from('turnos').select('*').eq('servicio', servicio).eq('estado', 'esperando').order('created_at').limit(1);
    if (error || !turnos?.length) throw new Error('No hay turnos en espera para este servicio.');
    const turno = turnos[0];
    const { error: e2 } = await supabase.from('turnos').update({ estado: 'atendiendo' }).eq('id', turno.id);
    if (e2) throw new Error(e2.message);
    return turno;
}

export async function finalizarTurno(id) {
    const { error } = await supabase.from('turnos').update({ estado: 'finalizado' }).eq('id', id);
    if (error) throw new Error(error.message);
}

// ─── TRÁMITES ────────────────────────────────────────────────────────────────
export async function crearTramite(usuario_id, tipo, descripcion) {
    const { data, error } = await supabase
        .from('tramites').insert([{ usuario_id, tipo, descripcion, estado: 'pendiente' }]).select().single();
    if (error) throw new Error(error.message);
    // Registrar acción en historial_acciones
    await registrarAccion(usuario_id, 'tramite_creado', `Trámite ${tipo} creado`);
    return data;
}

export async function obtenerTramitesUsuario(usuario_id) {
    const { data, error } = await supabase
        .from('tramites').select('*').eq('usuario_id', usuario_id).order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function obtenerTodosTramites() {
    const { data, error } = await supabase
        .from('tramites').select('*, usuarios(nombre, email)').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function actualizarEstadoTramite(id, estado, usuario_id) {
    const { error } = await supabase.from('tramites').update({ estado }).eq('id', id);
    if (error) throw new Error(error.message);
    await registrarAccion(usuario_id, 'tramite_actualizado', `Estado cambiado a ${estado}`);
}

export async function cancelarTramite(id, usuario_id) {
    await actualizarEstadoTramite(id, 'rechazado', usuario_id);
}

// ─── DOCUMENTOS ──────────────────────────────────────────────────────────────
export async function obtenerDocumentosUsuario(propietario_id) {
    const { data, error } = await supabase
        .from('documentos').select('*').eq('propietario_id', propietario_id).order('nombre');
    if (error) throw new Error(error.message);
    return data;
}

export async function crearDocumento(nombre, tipo, parent_id, propietario_id, url_archivo = null) {
    const { data, error } = await supabase
        .from('documentos').insert([{ nombre, tipo, parent_id, propietario_id, url_archivo }]).select().single();
    if (error) throw new Error(error.message);
    return data;
}

export async function eliminarDocumento(id) {
    const { error } = await supabase.from('documentos').delete().eq('id', id);
    if (error) throw new Error(error.message);
}

// ─── DEPENDENCIAS INSTITUCIONALES (Árbol) ───────────────────────────────────
export async function obtenerDependencias() {
    try {
        const { data, error } = await supabase.from('dependencias').select('*').order('id');
        if (error) throw new Error(error.message);
        return data || [];
    } catch (_) {
        return [];
    }
}

export async function obtenerDependenciasInstitucionales() {
    try {
        const { data, error } = await supabase.from('dependencias').select('*').order('id');
        if (error) throw new Error(error.message);
        return data || [];
    } catch (_) {
        return [];
    }
}

export async function crearDependencia(params) {
    // params: { nombre, tipo, padre_id }
    const { nombre, tipo, padre_id } = params;
    const { data, error } = await supabase.from('dependencias').insert([{ nombre, tipo, parent_id: padre_id }]).select().single();
    if (error) throw new Error(error.message);
    return data;
}

export async function actualizarDependencia(id, fields) {
    const { error } = await supabase.from('dependencias').update(fields).eq('id', id);
    if (error) throw new Error(error.message);
}

export async function eliminarDependencia(id) {
    const { error } = await supabase.from('dependencias').delete().eq('id', id);
    if (error) throw new Error(error.message);
}

// ─── RUTAS DEL CAMPUS ────────────────────────────────────────────────────────
export async function obtenerNodosCampus() {
    const { data, error } = await supabase.from('nodos_campus').select('*');
    if (error) throw new Error(error.message);
    return data;
}

export async function obtenerRutasCampus() {
    const { data, error } = await supabase.from('rutas_campus').select('*');
    if (error) throw new Error(error.message);
    return data;
}

export async function crearNodo(nombre, tipo, pos_x, pos_y) {
    const { data, error } = await supabase
        .from('nodos_campus').insert([{ nombre, tipo, pos_x, pos_y }]).select().single();
    if (error) throw new Error(error.message);
    return data;
}

export async function eliminarNodo(id) {
    // Primero eliminar rutas que usen este nodo
    await supabase.from('rutas_campus')
        .delete().or(`nodo_origen_id.eq.${id},nodo_destino_id.eq.${id}`);
    const { error } = await supabase.from('nodos_campus').delete().eq('id', id);
    if (error) throw new Error(error.message);
}

export async function crearRuta(nodo_origen_id, nodo_destino_id, distancia, bidireccional = true) {
    const { data, error } = await supabase
        .from('rutas_campus').insert([{ nodo_origen_id, nodo_destino_id, distancia, bidireccional }]).select().single();
    if (error) throw new Error(error.message);
    return data;
}

export async function eliminarRuta(id) {
    const { error } = await supabase.from('rutas_campus').delete().eq('id', id);
    if (error) throw new Error(error.message);
}

// ─── USUARIOS (ADMIN) ─────────────────────────────────────────────────────────
export async function obtenerTodosUsuarios() {
    const { data, error } = await supabase.from('usuarios').select('id, nombre, email, rol, created_at').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function actualizarRolUsuario(id, rol) {
    const rolesValidos = ['estudiante', 'empleado', 'admin'];
    if (!rolesValidos.includes(rol)) {
        throw new Error(`Rol inválido. Debe ser uno de: ${rolesValidos.join(', ')}`);
    }
    const { error } = await supabase.from('usuarios').update({ rol }).eq('id', id);
    if (error) throw new Error(error.message);
}

export async function eliminarUsuario(id) {
    const { error } = await supabase.from('usuarios').delete().eq('id', id);
    if (error) throw new Error(error.message);
}

// ─── HISTORIAL DE ACCIONES ───────────────────────────────────────────────────
export async function registrarAccion(usuario_id, tipo_accion, descripcion) {
    // Solo si existe la tabla historial_acciones (opcional)
    try {
        await supabase.from('historial_acciones').insert([{ usuario_id, tipo_accion, descripcion }]);
    } catch (_) { /* silencioso si la tabla no existe */ }
}

export async function obtenerHistorialAcciones(limite = 50) {
    const { data, error } = await supabase
        .from('historial_acciones').select('*, usuarios(nombre, email)')
        .order('created_at', { ascending: false }).limit(limite);
    if (error) throw new Error(error.message);
    return data || [];
}
