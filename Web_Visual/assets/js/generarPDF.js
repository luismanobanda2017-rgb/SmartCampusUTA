// ============================================================
// SmartCampus UTA - generarPDF.js
// Generacion de reportes PDF usando jsPDF (CDN)
// ============================================================

/** Carga jsPDF desde CDN si no esta disponible */
async function cargarJsPDF() {
  if (window.jspdf) return window.jspdf.jsPDF;
  await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    s.onload  = resolve;
    s.onerror = () => reject(new Error('No se pudo cargar jsPDF'));
    document.head.appendChild(s);
  });
  return window.jspdf.jsPDF;
}

/** Limpia caracteres que jsPDF no puede renderizar con helvetica */
function limpiar(str) {
  if (str === null || str === undefined) return '-';
  return String(str)
    .replace(/[—–]/g, '-')
    .replace(/[…]/g, '...')
    .replace(/[·•]/g, '.')
    .replace(/[áàä]/g, 'a')
    .replace(/[éèë]/g, 'e')
    .replace(/[íìï]/g, 'i')
    .replace(/[óòö]/g, 'o')
    .replace(/[úùü]/g, 'u')
    .replace(/[Á]/g, 'A')
    .replace(/[É]/g, 'E')
    .replace(/[Í]/g, 'I')
    .replace(/[Ó]/g, 'O')
    .replace(/[Ú]/g, 'U')
    .replace(/[ñ]/g, 'n')
    .replace(/[Ñ]/g, 'N')
    .replace(/[^a-zA-Z0-9\s\-_.,;:()/\\@#%&+=?!'"\[\]{}]/g, '');
}

function fechaHoy() {
  const d = new Date();
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
}

// ── Encabezado de pagina ────────────────────────────────────
function encabezado(doc, titulo, subtitulo, usuario) {
  doc.setFillColor(11, 59, 95);
  doc.rect(0, 0, 210, 22, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('SmartCampus UTA', 14, 9);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Universidad Tecnica de Ambato - FISEI', 14, 15);
  doc.text(fechaHoy(), 196, 9, { align: 'right' });

  doc.setTextColor(17, 33, 43);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(limpiar(titulo), 14, 32);

  if (subtitulo) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(102, 112, 133);
    doc.text(limpiar(subtitulo), 14, 38);
  }

  if (usuario) {
    doc.setFontSize(8);
    doc.setTextColor(102, 112, 133);
    doc.text('Usuario: ' + limpiar(usuario.nombre) + '  |  Rol: ' + limpiar(usuario.rol), 14, 44);
  }

  doc.setDrawColor(232, 122, 42);
  doc.setLineWidth(0.8);
  doc.line(14, 47, 196, 47);

  return 52;
}

// ── Pie de pagina ───────────────────────────────────────────
function piePagina(doc) {
  const total = doc.internal.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFillColor(11, 59, 95);
    doc.rect(0, 285, 210, 12, 'F');
    doc.setFontSize(7);
    doc.setTextColor(219, 230, 239);
    doc.setFont('helvetica', 'normal');
    doc.text('SmartCampus UTA - Universidad Tecnica de Ambato - 2025', 14, 291);
    doc.text('Pagina ' + i + ' de ' + total, 196, 291, { align: 'right' });
  }
}

// ── Titulo de seccion ───────────────────────────────────────
function seccion(doc, y, texto) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(11, 59, 95);
  doc.text(limpiar(texto), 14, y);
  doc.setDrawColor(232, 122, 42);
  doc.setLineWidth(0.4);
  doc.line(14, y + 1.5, 196, y + 1.5);
  return y + 7;
}

// ── Fila de KPIs ────────────────────────────────────────────
function kpiFila(doc, y, kpis) {
  const boxW = Math.floor(182 / kpis.length);
  let x = 14;
  kpis.forEach(k => {
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(x, y, boxW - 2, 16, 2, 2, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(102, 112, 133);
    doc.text(limpiar(k.label), x + 3, y + 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(11, 59, 95);
    doc.text(String(k.value), x + 3, y + 14);
    x += boxW;
  });
  return y + 22;
}

// ── Tabla ───────────────────────────────────────────────────
function tabla(doc, y, cols, rows, widths) {
  const rowH   = 7;
  const margin = 14;
  const totalW = widths.reduce((a, b) => a + b, 0);

  // Cabecera
  doc.setFillColor(11, 59, 95);
  doc.rect(margin, y, totalW, rowH, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);

  let x = margin;
  cols.forEach((col, i) => {
    doc.text(limpiar(col), x + 2, y + 5);
    x += widths[i];
  });
  y += rowH;

  // Filas
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  rows.forEach((row, ri) => {
    if (ri % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, y, totalW, rowH, 'F');
    }
    doc.setTextColor(23, 33, 43);

    x = margin;
    row.forEach((cell, ci) => {
      const txt      = limpiar(cell);
      const maxChars = Math.floor(widths[ci] / 2.2);
      const cortado  = txt.length > maxChars ? txt.slice(0, maxChars - 1) + '.' : txt;
      doc.text(cortado, x + 2, y + 5);
      x += widths[ci];
    });

    doc.setDrawColor(217, 226, 236);
    doc.setLineWidth(0.2);
    doc.line(margin, y + rowH, margin + totalW, y + rowH);
    y += rowH;

    if (y > 272) {
      doc.addPage();
      y = encabezado(doc, '', '', null) - 10;
    }
  });

  return y + 4;
}

// ══════════════════════════════════════════════════════════════
// PDF ADMINISTRADOR
// ══════════════════════════════════════════════════════════════
export async function pdfAdmin({ usuario, usuarios, tramites, turnos, nodos, acciones }) {
  const jsPDF = await cargarJsPDF();
  const doc   = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

  let y = encabezado(doc, 'Reporte del Sistema', 'Resumen completo de metricas y actividad', usuario);

  y = seccion(doc, y, 'Indicadores clave');
  y = kpiFila(doc, y, [
    { label: 'Usuarios totales', value: usuarios.length },
    { label: 'Tramites',         value: tramites.length },
    { label: 'Pendientes',       value: tramites.filter(t => t.estado === 'pendiente').length },
    { label: 'Turnos totales',   value: turnos.length },
    { label: 'Nodos campus',     value: nodos.length },
  ]);
  y += 4;

  y = seccion(doc, y, 'Usuarios registrados');
  y = tabla(doc, y,
    ['Nombre', 'Email', 'Rol', 'Registrado'],
    usuarios.map(u => [u.nombre, u.email, u.rol, new Date(u.created_at).toLocaleDateString('es-EC')]),
    [52, 62, 28, 40]
  );
  y += 2;

  if (tramites.length) {
    y = seccion(doc, y, 'Tramites del sistema');
    y = tabla(doc, y,
      ['Tipo', 'Descripcion', 'Estado', 'Usuario', 'Fecha'],
      tramites.slice(0, 40).map(t => [
        t.tipo, t.descripcion || '-', t.estado,
        t.usuarios?.nombre || '-',
        new Date(t.created_at).toLocaleDateString('es-EC'),
      ]),
      [35, 50, 28, 42, 27]
    );
    y += 2;
  }

  if (turnos.length) {
    y = seccion(doc, y, 'Turnos recientes');
    y = tabla(doc, y,
      ['Servicio', 'Estado', 'Usuario', 'Fecha'],
      turnos.slice(0, 30).map(t => [
        t.servicio || '-', t.estado,
        t.usuarios?.nombre || '-',
        new Date(t.created_at).toLocaleDateString('es-EC'),
      ]),
      [45, 35, 60, 42]
    );
    y += 2;
  }

  if (acciones.length) {
    y = seccion(doc, y, 'Bitacora de acciones recientes');
    y = tabla(doc, y,
      ['Accion', 'Descripcion', 'Usuario', 'Fecha'],
      acciones.slice(0, 25).map(a => [
        a.tipo_accion || '-', a.descripcion || '-',
        a.usuarios?.nombre || '-',
        new Date(a.created_at).toLocaleString('es-EC'),
      ]),
      [38, 65, 45, 34]
    );
  }

  piePagina(doc);
  doc.save('reporte_admin_' + Date.now() + '.pdf');
}

// ══════════════════════════════════════════════════════════════
// PDF ESTUDIANTE
// ══════════════════════════════════════════════════════════════
export async function pdfEstudiante({ usuario, tramites, turnos }) {
  const jsPDF = await cargarJsPDF();
  const doc   = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

  let y = encabezado(doc, 'Mi Reporte Personal', 'Historial de tramites y turnos', usuario);

  y = seccion(doc, y, 'Resumen de actividad');
  y = kpiFila(doc, y, [
    { label: 'Tramites totales',   value: tramites.length },
    { label: 'Pendientes',         value: tramites.filter(t => t.estado === 'pendiente').length },
    { label: 'Completados',        value: tramites.filter(t => t.estado === 'completado').length },
    { label: 'Turnos solicitados', value: turnos.length },
  ]);
  y += 4;

  y = seccion(doc, y, 'Mis tramites');
  if (tramites.length) {
    y = tabla(doc, y,
      ['Tipo', 'Descripcion', 'Estado', 'Fecha'],
      tramites.map(t => [
        t.tipo, t.descripcion || '-', t.estado,
        new Date(t.created_at).toLocaleDateString('es-EC'),
      ]),
      [40, 75, 35, 32]
    );
  } else {
    doc.setFontSize(9); doc.setTextColor(102, 112, 133);
    doc.text('No tienes tramites registrados.', 14, y); y += 8;
  }
  y += 2;

  y = seccion(doc, y, 'Mis turnos');
  if (turnos.length) {
    y = tabla(doc, y,
      ['Servicio', 'Estado', 'Fecha'],
      turnos.map(t => [
        t.servicio || '-', t.estado,
        new Date(t.created_at).toLocaleDateString('es-EC'),
      ]),
      [65, 45, 72]
    );
  } else {
    doc.setFontSize(9); doc.setTextColor(102, 112, 133);
    doc.text('No tienes turnos registrados.', 14, y); y += 8;
  }

  piePagina(doc);
  doc.save('mi_reporte_' + limpiar(usuario.nombre).replace(/\s+/g, '_') + '_' + Date.now() + '.pdf');
}

// ══════════════════════════════════════════════════════════════
// PDF EMPLEADO
// ══════════════════════════════════════════════════════════════
export async function pdfEmpleado({ usuario, tramites, turnos }) {
  const jsPDF = await cargarJsPDF();
  const doc   = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

  let y = encabezado(doc, 'Reporte de Gestion', 'Tramites procesados y turnos atendidos', usuario);

  y = seccion(doc, y, 'Resumen operativo');
  y = kpiFila(doc, y, [
    { label: 'Tramites en sistema', value: tramites.length },
    { label: 'Pendientes',          value: tramites.filter(t => t.estado === 'pendiente').length },
    { label: 'Aprobados',           value: tramites.filter(t => t.estado === 'aprobado').length },
    { label: 'Turnos en espera',    value: turnos.filter(t => t.estado === 'esperando').length },
    { label: 'Finalizados',         value: turnos.filter(t => t.estado === 'finalizado').length },
  ]);
  y += 4;

  y = seccion(doc, y, 'Tramites pendientes y procesados');
  if (tramites.length) {
    y = tabla(doc, y,
      ['Tipo', 'Estado', 'Solicitante', 'Fecha'],
      tramites.map(t => [
        t.tipo, t.estado,
        t.usuarios?.nombre || '-',
        new Date(t.created_at).toLocaleDateString('es-EC'),
      ]),
      [48, 35, 65, 34]
    );
  } else {
    doc.setFontSize(9); doc.setTextColor(102, 112, 133);
    doc.text('No hay tramites registrados.', 14, y); y += 8;
  }
  y += 2;

  y = seccion(doc, y, 'Cola de turnos');
  if (turnos.length) {
    y = tabla(doc, y,
      ['Servicio', 'Estado', 'Usuario', 'Fecha'],
      turnos.map(t => [
        t.servicio || '-', t.estado,
        t.usuarios?.nombre || '-',
        new Date(t.created_at).toLocaleDateString('es-EC'),
      ]),
      [45, 35, 62, 40]
    );
  } else {
    doc.setFontSize(9); doc.setTextColor(102, 112, 133);
    doc.text('No hay turnos registrados.', 14, y); y += 8;
  }

  piePagina(doc);
  doc.save('reporte_empleado_' + limpiar(usuario.nombre).replace(/\s+/g, '_') + '_' + Date.now() + '.pdf');
}
