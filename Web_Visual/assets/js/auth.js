// ============================================================
// SmartCampus UTA — auth.js
// Gestión de sesión (Supabase custom auth)
// ============================================================

import { iniciarSesion, registrarUsuario, obtenerSesion, cerrarSesion, getRaiz } from '../../../src/Persistence/supabaseClient.js';

const ROL_RUTAS = {
    admin:      'roles/administrador/dashboard.html',
    estudiante: 'roles/estudiante/dashboard.html',
    empleado:   'roles/empleado/dashboard.html'
};

export function requireSession() {
    const s = obtenerSesion();
    if (!s) { window.location.href = getRaiz() + 'index.html'; return null; }
    return s;
}

export function redirectByRole(usuario) {
    const ruta = ROL_RUTAS[usuario.rol] || ROL_RUTAS.estudiante;
    window.location.replace(getRaiz() + ruta);
}

// ─── Render navbar dinámico ─────────────────────────────────────────────────
export function renderNavbar() {
    const target = document.getElementById('sc-navbar');
    if (!target) return;
    const raiz = getRaiz();
    const usuario = obtenerSesion();

    const linksPublicos = `
        <li class="nav-item"><a class="nav-link" href="${raiz}index.html">Inicio</a></li>
        <li class="nav-item"><a class="nav-link" href="${raiz}login.html">Iniciar sesión</a></li>
        <li class="nav-item"><a class="nav-link" href="${raiz}registro.html">Registrarse</a></li>`;

    let linksPrivados = '';
    if (usuario) {
        if (usuario.rol === 'admin') {
            linksPrivados = `
                <li class="nav-item"><a class="nav-link" href="${raiz}roles/administrador/dashboard.html">Panel</a></li>
                <li class="nav-item"><a class="nav-link" href="${raiz}roles/administrador/gestion_usuarios.html">Usuarios</a></li>
                <li class="nav-item"><a class="nav-link" href="${raiz}roles/administrador/gestion_tramites.html">Trámites</a></li>
                <li class="nav-item"><a class="nav-link" href="${raiz}roles/administrador/gestion_rutas.html">Rutas</a></li>
                <li class="nav-item"><a class="nav-link" href="${raiz}roles/administrador/reportes.html">Reportes</a></li>`;
        } else if (usuario.rol === 'estudiante') {
            linksPrivados = `
                <li class="nav-item"><a class="nav-link" href="${raiz}roles/estudiante/dashboard.html">Panel</a></li>
                <li class="nav-item"><a class="nav-link" href="${raiz}roles/estudiante/solicitar_tramite.html">Trámite</a></li>
                <li class="nav-item"><a class="nav-link" href="${raiz}roles/estudiante/mis_turnos.html">Turnos</a></li>
                <li class="nav-item"><a class="nav-link" href="${raiz}roles/estudiante/documentos.html">Documentos</a></li>
                <li class="nav-item"><a class="nav-link" href="${raiz}roles/estudiante/mapa_campus.html">Mapa</a></li>`;
        } else if (usuario.rol === 'empleado') {
            linksPrivados = `
                <li class="nav-item"><a class="nav-link" href="${raiz}roles/empleado/dashboard.html">Panel</a></li>
                <li class="nav-item"><a class="nav-link" href="${raiz}roles/empleado/gestion_turnos.html">Turnos</a></li>
                <li class="nav-item"><a class="nav-link" href="${raiz}roles/empleado/gestion_tramites.html">Trámites</a></li>`;
        }
    }

    target.innerHTML = `
    <nav class="navbar navbar-expand-lg bg-white">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" href="${raiz}index.html">
          <span class="brand-mark">SC</span><span>SmartCampusUTA</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMenu">
          <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            ${usuario ? linksPrivados : linksPublicos}
            ${usuario ? `
              <li class="nav-item ms-lg-2">
                <span class="nav-link text-muted small">${usuario.nombre}</span>
              </li>
              <li class="nav-item">
                <button class="btn btn-outline-danger btn-sm" id="btn-logout">Salir</button>
              </li>` : ''}
          </ul>
        </div>
      </div>
    </nav>`;

    document.getElementById('btn-logout')?.addEventListener('click', () => cerrarSesion());
}

// ─── Formulario Login ────────────────────────────────────────────────────────
const loginForm = document.getElementById('form-login');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const err = document.getElementById('login-error');
        const btn = loginForm.querySelector('button[type=submit]');
        btn.disabled = true; btn.textContent = 'Ingresando...';
        try {
            const usuario = await iniciarSesion(email, password);
            redirectByRole(usuario);
        } catch (error) {
            err.textContent = error.message; err.hidden = false;
            btn.disabled = false; btn.textContent = 'Ingresar';
        }
    });
}

// ─── Formulario Registro ─────────────────────────────────────────────────────
const regForm = document.getElementById('form-registro');
if (regForm) {
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirm').value;
        const err = document.getElementById('reg-error');
        const ok = document.getElementById('reg-ok');
        const btn = regForm.querySelector('button[type=submit]');

        err.hidden = true; ok.hidden = true;
        if (password !== confirm) { err.textContent = 'Las contraseñas no coinciden.'; err.hidden = false; return; }
        btn.disabled = true; btn.textContent = 'Registrando...';
        try {
            await registrarUsuario(nombre, email, password);
            ok.textContent = 'Registro exitoso. Redirigiendo...'; ok.hidden = false;
            setTimeout(() => window.location.href = 'roles/estudiante/dashboard.html', 1200);
        } catch (error) {
            err.textContent = error.message; err.hidden = false;
            btn.disabled = false; btn.textContent = 'Registrarse';
        }
    });
}

// Navbar auto-render
document.addEventListener('DOMContentLoaded', () => renderNavbar());
