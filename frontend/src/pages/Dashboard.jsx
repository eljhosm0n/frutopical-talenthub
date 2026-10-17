import React, { useEffect, useState } from 'react';
import '../dashboard.css';
import Diagnostico from './Diagnostico';
import SSTGestion from './SSTGestion';

const api = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

const REQUEST_STATES = ['RECIBIDA', 'EN PROCESO', 'ATENDIDA', 'CERRADA'];

const CCD_SERIES = [
  { codigo: '100.1', serie: '100 - HISTORIAS LABORALES', nombre: '100.1 Documento de Identificación y Hoja de Vida', categoria: 'CV' },
  { codigo: '100.2', serie: '100 - HISTORIAS LABORALES', nombre: '100.2 Contrato Laboral y Afiliaciones (Seguridad Social)', categoria: 'Contrato' },
  { codigo: '100.3', serie: '100 - HISTORIAS LABORALES', nombre: '100.3 Certificados Académicos y de Formación Técnica', categoria: 'Vinculación' },
  { codigo: '100.4', serie: '100 - HISTORIAS LABORALES', nombre: '100.4 Evaluaciones de Desempeño y Certificaciones', categoria: 'Otros' },
  { codigo: '200.1', serie: '200 - SEGURIDAD Y SALUD EN EL TRABAJO', nombre: '200.1 Conceptos Médicos Ocupacionales (Ingreso/Periódico)', categoria: 'SST' },
  { codigo: '200.2', serie: '200 - SEGURIDAD Y SALUD EN EL TRABAJO', nombre: '200.2 Actas de Entrega de Dotación y EPP', categoria: 'EPP' },
  { codigo: '200.3', serie: '200 - SEGURIDAD Y SALUD EN EL TRABAJO', nombre: '200.3 Constancias y Evaluaciones de Inducción SST', categoria: 'SST' }
];

export default function Dashboard({ user, onLogout }) {
  const [activeModule, setActiveModule] = useState('inicio');
  const [tabSeleccion, setTabSeleccion] = useState('convocatorias');
  const [imprimirTipo, setImprimirTipo] = useState(null);

  // Convocatorias
  const [convocatorias, setConvocatorias] = useState([]);
  const [showModalConvocatoria, setShowModalConvocatoria] = useState(false);
  const [nuevaConvocatoria, setNuevaConvocatoria] = useState({
    titulo: '', cargo: '', descripcion: '', requisitos: '', salario: '', fecha_cierre: ''
  });
  const [savingConvocatoria, setSavingConvocatoria] = useState(false);

  // Postulaciones y Selección Técnica
  const [postulaciones, setPostulaciones] = useState([]);
  const [selectedPostulation, setSelectedPostulation] = useState(null);
  const [modalHvAspirante, setModalHvAspirante] = useState(null);
  const [vistaPreviaActa, setVistaPreviaActa] = useState(false);
  const [puntajeTecnico, setPuntajeTecnico] = useState(80);
  const [puntajeEntrevista, setPuntajeEntrevista] = useState(85);
  const [puntajeHv, setPuntajeHv] = useState(90);

  const notaCalculada = Math.round(
    (Number(puntajeTecnico) * 0.40) +
    (Number(puntajeEntrevista) * 0.35) +
    (Number(puntajeHv) * 0.25)
  );

  // Expedientes CCD
  const [expedientes, setExpedientes] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [selectedExpediente, setSelectedExpediente] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [selectedCcd, setSelectedCcd] = useState(CCD_SERIES[0].codigo);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadNotice, setUploadNotice] = useState('');
  const [visorDoc, setVisorDoc] = useState(null);

  // PQRSF y Certificaciones
  const [solicitudes, setSolicitudes] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [newSolicitudState, setNewSolicitudState] = useState('RECIBIDA');
  const [solicitudResponse, setSolicitudResponse] = useState('');
  const [modeloCertificado, setModeloCertificado] = useState('modelo1');
  const [solicitudNotice, setSolicitudNotice] = useState('');

  useEffect(() => {
    loadConvocatorias();
    loadExpedientes();
    loadPostulaciones();
    loadSolicitudes();
  }, []);

  async function loadConvocatorias() {
    try {
      const response = await fetch(`${api}/convocatorias`);
      const body = await response.json();
      if (body.ok && Array.isArray(body.data) && body.data.length > 0) {
        setConvocatorias(body.data);
        return;
      }
    } catch {}

    const stored = localStorage.getItem('frutopical_convocatorias');
    if (stored) setConvocatorias(JSON.parse(stored));
  }

  async function handleCrearConvocatoria(e) {
    e.preventDefault();
    setSavingConvocatoria(true);

    const nueva = {
      id_convocatoria: Date.now(),
      titulo: nuevaConvocatoria.titulo,
      cargo: nuevaConvocatoria.cargo,
      descripcion: nuevaConvocatoria.descripcion,
      requisitos: nuevaConvocatoria.requisitos,
      salario: nuevaConvocatoria.salario || 'A convenir según escala salarial',
      fecha_cierre: nuevaConvocatoria.fecha_cierre || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estado: 'ABIERTA'
    };

    const actualizadas = [nueva, ...convocatorias];
    setConvocatorias(actualizadas);
    localStorage.setItem('frutopical_convocatorias', JSON.stringify(actualizadas));

    setSavingConvocatoria(false);
    setShowModalConvocatoria(false);
    setNuevaConvocatoria({ titulo: '', cargo: '', descripcion: '', requisitos: '', salario: '', fecha_cierre: '' });
  }

  function handleToggleEstadoConvocatoria(id) {
    const actualizadas = convocatorias.map((c) => {
      if (c.id_convocatoria === id) {
        return { ...c, estado: c.estado === 'ABIERTA' ? 'CERRADA' : 'ABIERTA' };
      }
      return c;
    });
    setConvocatorias(actualizadas);
    localStorage.setItem('frutopical_convocatorias', JSON.stringify(actualizadas));
  }

  function handleEliminarConvocatoria(id, titulo) {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la convocatoria "${titulo}"?`)) return;
    const actualizadas = convocatorias.filter((c) => c.id_convocatoria !== id);
    setConvocatorias(actualizadas);
    localStorage.setItem('frutopical_convocatorias', JSON.stringify(actualizadas));
  }

  function loadPostulaciones() {
    const local = localStorage.getItem('frutopical_postulaciones');
    if (local) {
      setPostulaciones(JSON.parse(local));
    } else {
      const base = [
        {
          id_postulacion: 1,
          candidato: 'Carlos Fontalvo Amaya',
          numero_documento: '1042890123',
          convocatoria: 'Operario de Producción',
          correo: 'carlos.fontalvo@gmail.com',
          telefono: '301 234 5678',
          ciudad: 'Sabanagrande, Atlántico',
          estado: 'CONTRATADO',
          hoja_vida: 'HV_Carlos_Fontalvo.pdf'
        },
        {
          id_postulacion: 2,
          candidato: 'María Conrado Jiménez',
          numero_documento: '1043567890',
          convocatoria: 'Jefe de Calidad',
          correo: 'maria.conrado@gmail.com',
          telefono: '310 987 6543',
          ciudad: 'Sabanagrande, Atlántico',
          estado: 'PRESELECCIONADA',
          hoja_vida: 'HV_Maria_Conrado.pdf'
        },
        {
          id_postulacion: 3,
          candidato: 'David Riquett Villalobos',
          numero_documento: '1044123456',
          convocatoria: 'Jefe de Producción',
          correo: 'david.riquett@gmail.com',
          telefono: '302 345 6789',
          ciudad: 'Barranquilla, Atlántico',
          estado: 'EN EVALUACIÓN',
          hoja_vida: 'HV_David_Riquett.pdf'
        }
      ];
      setPostulaciones(base);
      localStorage.setItem('frutopical_postulaciones', JSON.stringify(base));
    }
  }

  function loadExpedientes() {
    const stored = localStorage.getItem('frutopical_expedientes');
    if (stored) {
      setExpedientes(JSON.parse(stored));
    } else {
      const base = [
        { id_expediente: 1, nombres: 'Carlos', apellidos: 'Fontalvo Amaya', tipo_documento: 'CC', numero_documento: '1042890123', cargo: 'Operario de Planta', estado: 'ACTIVO' },
        { id_expediente: 2, nombres: 'María', apellidos: 'Conrado Jiménez', tipo_documento: 'CC', numero_documento: '1043567890', cargo: 'Auxiliar de Calidad', estado: 'ACTIVO' }
      ];
      setExpedientes(base);
      localStorage.setItem('frutopical_expedientes', JSON.stringify(base));
    }
  }

  function loadSolicitudes() {
    const stored = localStorage.getItem('frutopical_solicitudes');
    if (stored) {
      setSolicitudes(JSON.parse(stored));
    } else {
      const base = [
        {
          id_solicitud: 1,
          numero_solicitud: 'SOL-2026-0001',
          nombre_remitente: 'Carlos Fontalvo Amaya',
          tipo_remitente: 'COLABORADOR_ACTIVO',
          tipo_solicitud: 'PETICION',
          descripcion: 'Solicitud de certificado laboral institucional con detalle de salario básico para trámite.',
          fecha: new Date().toISOString(),
          estado: 'RECIBIDA'
        }
      ];
      setSolicitudes(base);
      localStorage.setItem('frutopical_solicitudes', JSON.stringify(base));
    }
  }

  function descargarHojaDeVida(candidato) {
    const nombreCompleto = candidato.candidato || `${candidato.nombres || ''} ${candidato.apellidos || ''}`.trim() || 'Aspirante';
    const nombreArchivo = candidato.hoja_vida || candidato.hoja_vida_nombre || `HV_${nombreCompleto.replace(/\s+/g, '_')}.pdf`;

    if (candidato.archivo_objeto instanceof File) {
      const url = URL.createObjectURL(candidato.archivo_objeto);
      const link = document.createElement('a');
      link.href = url;
      link.download = candidato.archivo_objeto.name || nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }

    if (candidato.archivo_url) {
      const link = document.createElement('a');
      link.href = candidato.archivo_url;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const contenidoPdfSimulado = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n` +
      `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n` +
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n` +
      `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n` +
      `5 0 obj\n<< /Length 120 >>\nstream\n` +
      `BT\n/F1 16 Tf\n50 720 Td\n(FRUTOPICAL S.A.S. - HOJA DE VIDA INSTITUCIONAL) Tj\n` +
      `/F1 12 Tf\n50 680 Td\n(Aspirante: ${nombreCompleto}) Tj\n` +
      `50 655 Td\n(Documento: ${candidato.numero_documento || 'No registrado'}) Tj\n` +
      `50 630 Td\n(Convocatoria: ${candidato.convocatoria || candidato.cargo || 'General'}) Tj\n` +
      `50 605 Td\n(Correo: ${candidato.correo || 'aspirante@gmail.com'}) Tj\n` +
      `ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000234 00000 n \n0000000291 00000 n \n` +
      `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n%%EOF`;

    const blob = new Blob([contenidoPdfSimulado], { type: 'application/pdf;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo.endsWith('.pdf') ? nombreArchivo : `${nombreArchivo}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function vincularCandidato(candidatoAprobado) {
    const nombreCompleto = candidatoAprobado.candidato || `${candidatoAprobado.nombres || ''} ${candidatoAprobado.apellidos || ''}`.trim() || 'Aspirante';
    const doc = candidatoAprobado.numero_documento || '104' + Math.floor(Math.random() * 900000);
    const cargo = candidatoAprobado.convocatoria || candidatoAprobado.cargo || 'Operario de Producción';

    let salario = '$2.000.000 COP';
    if (cargo.toLowerCase().includes('talento humano')) salario = '$2.550.500 COP';
    if (cargo.toLowerCase().includes('producción') && cargo.toLowerCase().includes('jefe')) salario = '$3.000.000 COP';
    if (cargo.toLowerCase().includes('calidad') && cargo.toLowerCase().includes('jefe')) salario = '$3.000.000 COP';

    const empleados = JSON.parse(localStorage.getItem('frutopical_empleados') || '[]');
    if (!empleados.some(e => String(e.documento) === String(doc))) {
      const nuevo = {
        id: Date.now(),
        nombre: nombreCompleto,
        documento: doc,
        cargo: cargo,
        salario: salario,
        fechaIngreso: new Date().toISOString().split('T')[0]
      };
      localStorage.setItem('frutopical_empleados', JSON.stringify([nuevo, ...empleados]));
    }

    const exps = JSON.parse(localStorage.getItem('frutopical_expedientes') || '[]');
    if (!exps.some(e => String(e.numero_documento) === String(doc))) {
      const partes = nombreCompleto.split(' ');
      const nombres = partes[0] || nombreCompleto;
      const apellidos = partes.slice(1).join(' ') || '';
      const nuevoExp = {
        id_expediente: Date.now(),
        nombres: nombres,
        apellidos: apellidos,
        tipo_documento: 'CC',
        numero_documento: doc,
        cargo: cargo,
        estado: 'ACTIVO',
        carpetasFoliadas: 7,
        ubicacionFisica: 'Caja Archivo Central 04 - Estante B2'
      };
      const actualizados = [nuevoExp, ...exps];
      localStorage.setItem('frutopical_expedientes', JSON.stringify(actualizados));
      setExpedientes(actualizados);
    }

    const actualizadosPost = postulaciones.map(p =>
      (p.id_postulacion === candidatoAprobado.id_postulacion || String(p.numero_documento) === String(doc))
        ? { ...p, estado: 'CONTRATADO' }
        : p
    );
    setPostulaciones(actualizadosPost);
    localStorage.setItem('frutopical_postulaciones', JSON.stringify(actualizadosPost));

    alert(`¡Candidato ${nombreCompleto} contratado y vinculado exitosamente a los módulos de SST y CCD!`);
    setSelectedPostulation(null);
    setVistaPreviaActa(false);
    loadExpedientes();
  }

  async function updateSolicitud(e) {
    e.preventDefault();
    if (!selectedSolicitud) return;

    setSolicitudes((prev) => {
      const updated = prev.map((s) =>
        s.id_solicitud === selectedSolicitud.id_solicitud || s.numero_solicitud === selectedSolicitud.numero_solicitud
          ? { ...s, estado: newSolicitudState, respuesta_observacion: solicitudResponse }
          : s
      );
      localStorage.setItem('frutopical_solicitudes', JSON.stringify(updated));
      return updated;
    });

    setSolicitudNotice('Requerimiento tramitado con éxito.');
    setTimeout(() => {
      setSelectedSolicitud(null);
      setSolicitudResponse('');
      setSolicitudNotice('');
    }, 900);
  }

  function triggerImpresion(tipo) {
    setImprimirTipo(tipo);
    setTimeout(() => {
      window.print();
    }, 250);
  }

  function changeModule(module) {
    setActiveModule(module);
    if (module === 'seleccion') {
      loadConvocatorias();
      loadPostulaciones();
    }
    if (module === 'documentos') {
      loadExpedientes();
    }
    if (module === 'solicitudes') {
      setSelectedSolicitud(null);
      loadSolicitudes();
    }
  }

  const fechaHoy = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <style>{`
        .print-only { display: none; }
        @media print {
          body * { visibility: hidden !important; }
          .print-only, .print-only * { visibility: visible !important; display: block !important; }
          .print-only { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; margin: 0 !important; padding: 20mm 15mm !important; background: #ffffff !important; color: #1e293b !important; box-sizing: border-box !important; }
        }
      `}</style>

      <div className="th-dashboard">
        <aside className="th-sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '1.2rem 1.4rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '6px 8px', borderRadius: '10px' }}>
              <svg width="34" height="34" viewBox="0 0 100 100" fill="none">
                <path d="M38 18C44 26 48 38 42 54C36 70 20 74 14 62C8 50 14 30 26 20C30 16 34 14 38 18Z" stroke="#2E7D32" strokeWidth="6" fill="#f0fdf4" />
                <path d="M62 26C72 32 82 46 76 66C70 86 48 88 40 74C32 60 40 38 52 28C56 24 60 22 62 26Z" stroke="#EF6C00" strokeWidth="7" fill="#fff7ed" />
              </svg>
            </div>
            <div>
              <strong style={{ display: 'block', color: '#ffffff', fontSize: '1.05rem', letterSpacing: '1px' }}>FRUTOPICAL</strong>
              <span style={{ color: '#EF6C00', fontSize: '0.75rem', fontWeight: '700' }}>TalentHub</span>
            </div>
          </div>

          <nav className="th-nav">
            <button type="button" className={activeModule === 'inicio' ? 'th-nav-item active' : 'th-nav-item'} onClick={() => changeModule('inicio')}>
              <span className="th-nav-icon">⌂</span> Inicio
            </button>
            <button type="button" className={activeModule === 'diagnostico' ? 'th-nav-item active' : 'th-nav-item'} onClick={() => changeModule('diagnostico')}>
              <span className="th-nav-icon">🏢</span> 1. Diagnóstico Organizacional
            </button>
            <button type="button" className={activeModule === 'seleccion' ? 'th-nav-item active' : 'th-nav-item'} onClick={() => changeModule('seleccion')}>
              <span className="th-nav-icon">👥</span> 2. Selección de Personal
            </button>
            <button type="button" className={activeModule === 'vinculaciones' ? 'th-nav-item active' : 'th-nav-item'} onClick={() => changeModule('vinculaciones')}>
              <span className="th-nav-icon">📋</span> 3. Vinculación y SG-SST
            </button>
            <button type="button" className={activeModule === 'documentos' ? 'th-nav-item active' : 'th-nav-item'} onClick={() => changeModule('documentos')}>
              <span className="th-nav-icon">📁</span> 4. Gestión Documental (CCD)
            </button>
            <button type="button" className={activeModule === 'solicitudes' ? 'th-nav-item active' : 'th-nav-item'} onClick={() => changeModule('solicitudes')}>
              <span className="th-nav-icon">💬</span> 5. Servicio al Cliente (PQRS)
            </button>
          </nav>

          <div className="th-sidebar-bottom">
            <div className="th-user-mini">
              <div className="th-avatar">{user?.nombre?.charAt(0) || 'A'}</div>
              <div>
                <strong>{user?.nombre}</strong>
                <span>{user?.rol || 'Administrador'}</span>
              </div>
            </div>
            <button type="button" className="th-logout" onClick={onLogout}>
              <span>↪</span> Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="th-main">
          <header className="th-header">
            <div>
              <span className="th-breadcrumb">TalentHub / Gestión Interna</span>
              <h1>Ecosistema de Talento Humano · Frutopical S.A.S.</h1>
            </div>
            <div className="th-header-user">
              <div className="th-header-avatar">{user?.nombre?.charAt(0) || 'A'}</div>
              <div>
                <strong>{user?.nombre}</strong>
                <span>{user?.rol || 'Administrador'}</span>
              </div>
            </div>
          </header>

          <div className="th-content">
            {activeModule === 'inicio' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                <section className="th-welcome" style={{ margin: 0, padding: '2rem 2.5rem', borderRadius: '16px', background: 'linear-gradient(135deg, #143c1d 0%, #1b5328 100%)' }}>
                  <span className="th-label" style={{ color: '#fed7aa', fontWeight: '800' }}>PANEL DE CONTROL GENERAL</span>
                  <h2 style={{ fontSize: '1.8rem', color: '#ffffff', margin: '0.4rem 0' }}>Bienvenido a TalentHub, {user?.nombre || 'Administrador'}.</h2>
                  <p style={{ color: '#dcfce7', margin: 0, fontSize: '0.95rem' }}>Ecosistema digital de gestión humana, seguridad laboral y atención institucional · Sabanagrande, Atlántico.</p>
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '1.4rem', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#166534' }}>▣</div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>CONVOCATORIAS</span>
                      <strong style={{ display: 'block', fontSize: '1.5rem', color: '#1e293b' }}>{convocatorias.filter(c => c.estado === 'ABIERTA').length}</strong>
                      <small style={{ color: '#166534', fontWeight: '700' }}>Activas en portal web</small>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '1.4rem', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#c2410c' }}>👥</div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>CANDIDATOS</span>
                      <strong style={{ display: 'block', fontSize: '1.5rem', color: '#1e293b' }}>{postulaciones.length}</strong>
                      <small style={{ color: '#c2410c', fontWeight: '700' }}>Hojas de vida radicadas</small>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '1.4rem', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#1d4ed8' }}>📁</div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>HISTORIAS CCD</span>
                      <strong style={{ display: 'block', fontSize: '1.5rem', color: '#1e293b' }}>{expedientes.length}</strong>
                      <small style={{ color: '#1d4ed8', fontWeight: '700' }}>Expedientes Serie 100/200</small>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '1.4rem', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#7e22ce' }}>💬</div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>PQRSF ACTIVAS</span>
                      <strong style={{ display: 'block', fontSize: '1.5rem', color: '#1e293b' }}>{solicitudes.length}</strong>
                      <small style={{ color: '#7e22ce', fontWeight: '700' }}>Atención en tiempo real</small>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.8rem', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', letterSpacing: '1px' }}>ACCESO RÁPIDO A MÓDULOS</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={() => changeModule('diagnostico')} style={{ textAlign: 'left', padding: '1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', display: 'flex', gap: '0.8rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>🏢</span>
                      <div>
                        <strong style={{ color: '#166534', fontSize: '0.95rem', display: 'block' }}>1. Diagnóstico Organizacional</strong>
                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Estrategia, organigrama, DOFA, árbol de problemas y manuales DPC[cite: 7].</p>
                      </div>
                    </button>

                    <button type="button" onClick={() => changeModule('seleccion')} style={{ textAlign: 'left', padding: '1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', display: 'flex', gap: '0.8rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>👥</span>
                      <div>
                        <strong style={{ color: '#c2410c', fontSize: '0.95rem', display: 'block' }}>2. Selección de Personal</strong>
                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Evalúa candidatos con la matriz ponderada y vincúlalos a nómina.</p>
                      </div>
                    </button>

                    <button type="button" onClick={() => changeModule('vinculaciones')} style={{ textAlign: 'left', padding: '1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', display: 'flex', gap: '0.8rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>📋</span>
                      <div>
                        <strong style={{ color: '#1d4ed8', fontSize: '0.95rem', display: 'block' }}>3. Vinculación y SG-SST</strong>
                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Acta de Entrega de Dotación (Res. 2400) y Minuta de Contrato.</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeModule === 'diagnostico' && <Diagnostico onVolver={() => changeModule('inicio')} />}

            {/* MÓDULO 2: SELECCIÓN */}
            {activeModule === 'seleccion' && (
              <section className="th-page-section">
                <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e0e0e0', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setTabSeleccion('convocatorias')}
                    style={{
                      padding: '0.6rem 1.2rem', background: 'none', border: 'none',
                      borderBottom: tabSeleccion === 'convocatorias' ? '3px solid #2E7D32' : 'none',
                      fontWeight: tabSeleccion === 'convocatorias' ? 'bold' : 'normal',
                      color: tabSeleccion === 'convocatorias' ? '#2E7D32' : '#555', cursor: 'pointer'
                    }}
                  >
                    ▣ Convocatorias Laborales
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTabSeleccion('postulaciones');
                      loadPostulaciones();
                    }}
                    style={{
                      padding: '0.6rem 1.2rem', background: 'none', border: 'none',
                      borderBottom: tabSeleccion === 'postulaciones' ? '3px solid #EF6C00' : 'none',
                      fontWeight: tabSeleccion === 'postulaciones' ? 'bold' : 'normal',
                      color: tabSeleccion === 'postulaciones' ? '#EF6C00' : '#555', cursor: 'pointer'
                    }}
                  >
                    ♙ Candidatos y Matriz Ponderada (40%-35%-25%)
                  </button>
                </div>

                {tabSeleccion === 'convocatorias' ? (
                  <>
                    <div className="th-page-intro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span className="th-label">CONVOCATORIAS ACTIVAS</span>
                        <h2>Ofertas de empleo de Frutopical S.A.S.</h2>
                        <p>Las vacantes publicadas aquí se sincronizan de inmediato con el portal web.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowModalConvocatoria(true)}
                        style={{ backgroundColor: '#2e7d32', color: '#ffffff', border: 'none', padding: '0.65rem 1.2rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                      >
                        + Nueva Convocatoria
                      </button>
                    </div>

                    <div className="th-list">
                      {convocatorias.map((item) => (
                        <article className="th-list-card" key={item.id_convocatoria} style={{ borderLeft: item.estado === 'ABIERTA' ? '5px solid #2e7d32' : '5px solid #94a3b8' }}>
                          <div className="th-list-icon">▣</div>
                          <div className="th-list-main">
                            <div className="th-list-top" style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span className={`th-status ${item.estado === 'ABIERTA' ? 'active' : ''}`}>
                                {item.estado || 'ABIERTA'} · Cierre: {item.fecha_cierre}
                              </span>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button type="button" onClick={() => handleToggleEstadoConvocatoria(item.id_convocatoria)} style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                  {item.estado === 'ABIERTA' ? 'Cerrar Vacante' : 'Reabrir'}
                                </button>
                                <button type="button" onClick={() => handleEliminarConvocatoria(item.id_convocatoria, item.titulo)} style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid #fca5a5', color: '#dc2626', background: '#fef2f2', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                  Eliminar
                                </button>
                              </div>
                            </div>
                            <h3 style={{ margin: '0.3rem 0' }}>{item.titulo}</h3>
                            <strong style={{ color: '#166534', fontSize: '0.88rem' }}>Salario: {item.salario}</strong>
                            <p style={{ margin: '0.3rem 0', fontSize: '0.85rem' }}>{item.descripcion}</p>
                            <small style={{ color: '#64748b' }}>Requisitos: {item.requisitos}</small>
                          </div>
                        </article>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="th-page-intro">
                      <div>
                        <span className="th-label">EQUIPO 2 · SELECCIÓN TÉCNICA</span>
                        <h2>Postulaciones y Calificación de Candidatos</h2>
                        <p>Los aspirantes que se postulan desde la web aparecen aquí automáticamente en tiempo real.</p>
                      </div>
                    </div>

                    <div className="th-table-wrapper">
                      <table className="th-table">
                        <thead>
                          <tr>
                            <th>Candidato</th>
                            <th>Documento</th>
                            <th>Convocatoria</th>
                            <th>Hoja de Vida</th>
                            <th>Estado</th>
                            <th>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {postulaciones.map((item, index) => {
                            const nombre = item.candidato || `${item.nombres || ''} ${item.apellidos || ''}`.trim() || 'Aspirante';
                            return (
                              <tr key={item.id_postulacion ?? index}>
                                <td><strong>{nombre}</strong></td>
                                <td>{item.numero_documento || '—'}</td>
                                <td>{item.convocatoria || item.cargo || 'Operario de Producción'}</td>
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => setModalHvAspirante(item)}
                                    style={{ backgroundColor: '#f0fdf4', border: '1.5px solid #86efac', color: '#166534', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    📄 {item.hoja_vida || item.hoja_vida_nombre || 'HV_Candidato.pdf'}
                                  </button>
                                </td>
                                <td>
                                  <span className={`th-status ${item.estado === 'CONTRATADO' ? 'active' : ''}`} style={{ backgroundColor: item.estado === 'CONTRATADO' ? '#dcfce7' : '#f1f5f9', color: item.estado === 'CONTRATADO' ? '#166534' : '#475569' }}>
                                    {item.estado || 'RECIBIDA'}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="th-table-action"
                                    onClick={() => {
                                      setSelectedPostulation(item);
                                      setVistaPreviaActa(false);
                                    }}
                                  >
                                    📝 Evaluar con Matriz
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </section>
            )}

            {activeModule === 'vinculaciones' && (
              <SSTGestion onVolver={() => changeModule('inicio')} />
            )}

            {/* MÓDULO 4: GESTIÓN DOCUMENTAL (CCD) */}
            {activeModule === 'documentos' && (
              <section className="th-page-section">
                {!selectedExpediente ? (
                  <>
                    <div className="th-page-intro">
                      <div>
                        <span className="th-label">EQUIPO 4 · GESTIÓN DOCUMENTAL</span>
                        <h2>Cuadro de Clasificación Documental (CCD)</h2>
                        <p>Los candidatos contratados abren expediente automáticamente en las Series 100 y 200.</p>
                      </div>
                    </div>

                    <div className="th-table-wrapper">
                      <table className="th-table">
                        <thead>
                          <tr>
                            <th>Colaborador</th>
                            <th>Documento</th>
                            <th>Cargo</th>
                            <th>Estado</th>
                            <th>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expedientes.map((item) => (
                            <tr key={item.id_expediente}>
                              <td><strong>{item.nombres} {item.apellidos}</strong></td>
                              <td>{item.tipo_documento} {item.numero_documento}</td>
                              <td>{item.cargo}</td>
                              <td><span className="th-status active">{item.estado}</span></td>
                              <td>
                                <button type="button" className="th-table-action" onClick={() => setSelectedExpediente(item)}>
                                  Abrir Expediente CCD
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="th-page-intro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h2>{selectedExpediente.nombres} {selectedExpediente.apellidos}</h2>
                        <p>Cargo: <strong>{selectedExpediente.cargo}</strong> · C.C. <strong>{selectedExpediente.numero_documento}</strong></p>
                      </div>
                      <button type="button" className="th-secondary-button" onClick={() => setSelectedExpediente(null)}>← Volver a Expedientes</button>
                    </div>

                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', maxWidth: '650px', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: '0 0 1rem 0' }}>Radicar Documento en Historia Laboral</h3>
                      <div style={{ marginBottom: '0.8rem' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>1. Subserie Documental (CCD)</label>
                        <select value={selectedCcd} onChange={(e) => setSelectedCcd(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                          {CCD_SERIES.map((c) => (
                            <option key={c.codigo} value={c.codigo}>[{c.codigo}] {c.nombre}</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ marginBottom: '0.8rem' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>2. Descripción del Soporte</label>
                        <input
                          type="text"
                          placeholder="Ej: Acta de Entrega de Dotación y EPP"
                          value={documentType}
                          onChange={(e) => setDocumentType(e.target.value)}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>3. Archivo Digital (PDF o Imagen)</label>
                        <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} style={{ width: '100%' }} />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!documentType.trim()) return alert('Escribe la descripción del documento.');
                          const nom = `HL-${selectedExpediente.numero_documento}-${selectedCcd}-${documentType.trim().toUpperCase().replace(/\s+/g, '_')}.pdf`;
                          setDocumentos((prev) => [{ id_archivo: Date.now(), nombre_original: nom, tipo_documento: `[${selectedCcd}] ${documentType}`, fecha_carga: new Date().toISOString() }, ...prev]);
                          setDocumentType('');
                          setSelectedFile(null);
                          setUploadNotice('Documento archivado en expediente.');
                          setTimeout(() => setUploadNotice(''), 2000);
                        }}
                        className="th-primary-button"
                        style={{ width: '100%' }}
                      >
                        Archivar en Carpeta Digital CCD
                      </button>
                      {uploadNotice && <p style={{ color: '#166534', fontWeight: 'bold', fontSize: '0.82rem', marginTop: '0.5rem' }}>✓ {uploadNotice}</p>}
                    </div>

                    <div className="th-table-wrapper">
                      <h3>Documentos en Historia Laboral ({documentos.length})</h3>
                      <table className="th-table">
                        <thead>
                          <tr>
                            <th>Nomenclatura Archivo</th>
                            <th>Clasificación AGN</th>
                            <th>Fecha</th>
                            <th>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {documentos.map((doc) => (
                            <tr key={doc.id_archivo}>
                              <td><strong>{doc.nombre_original}</strong></td>
                              <td>{doc.tipo_documento}</td>
                              <td>{new Date(doc.fecha_carga).toLocaleDateString('es-CO')}</td>
                              <td>
                                <button
                                  type="button"
                                  onClick={() => setVisorDoc(doc)}
                                  style={{ padding: '0.25rem 0.6rem', backgroundColor: '#f0fdf4', border: '1px solid #86efac', color: '#166534', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                  👁️ Ver Ficha
                                </button>
                              </td>
                            </tr>
                          ))}
                          {!documentos.length && (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>Expediente aperturado. Listo para radicar contratos, actas o afiliaciones.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </section>
            )}

            {/* MÓDULO 5: SERVICIO AL CLIENTE */}
            {activeModule === 'solicitudes' && (
              <section className="th-page-section">
                {!selectedSolicitud ? (
                  <>
                    <div className="th-page-intro">
                      <div>
                        <span className="th-label">EQUIPO 5 · SERVICIO AL CLIENTE INTERNO</span>
                        <h2>Gestión de PQRSF y Certificaciones</h2>
                        <p>Atiende solicitudes radicadas por la web y expide certificados laborales oficiales.</p>
                      </div>
                    </div>

                    <div className="th-table-wrapper">
                      <table className="th-table">
                        <thead>
                          <tr>
                            <th>Radicado</th>
                            <th>Remitente</th>
                            <th>Tipo Solicitud</th>
                            <th>Estado</th>
                            <th>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {solicitudes.map((item, index) => (
                            <tr key={item.id_solicitud ?? index}>
                              <td><strong>{item.numero_solicitud || `SOL-2026-000${index + 1}`}</strong></td>
                              <td>{item.nombre_remitente}</td>
                              <td>{item.tipo_solicitud}</td>
                              <td><span className="th-status">{item.estado || 'RECIBIDA'}</span></td>
                              <td>
                                <button
                                  type="button"
                                  className="th-table-action"
                                  onClick={() => {
                                    setSelectedSolicitud(item);
                                    setNewSolicitudState(item.estado || 'RECIBIDA');
                                  }}
                                >
                                  Atender Caso
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
                    <form onSubmit={updateSolicitud} style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0 }}>Radicado: {selectedSolicitud.numero_solicitud}</h3>
                        <button type="button" onClick={() => setSelectedSolicitud(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', fontWeight: 'bold' }}>✕ Volver</button>
                      </div>

                      <div style={{ backgroundColor: '#f8fafc', padding: '0.9rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem', fontSize: '0.85rem' }}>
                        <p style={{ margin: '0 0 0.3rem 0' }}><strong>Remitente:</strong> {selectedSolicitud.nombre_remitente}</p>
                        <p style={{ margin: 0 }}><strong>Detalle:</strong> {selectedSolicitud.descripcion}</p>
                      </div>

                      <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Estado</label>
                      <select value={newSolicitudState} onChange={(e) => setNewSolicitudState(e.target.value)} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '1rem' }}>
                        {REQUEST_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>

                      <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Respuesta de Talento Humano</label>
                      <textarea rows="4" value={solicitudResponse} onChange={(e) => setSolicitudResponse(e.target.value)} placeholder="Redacta la respuesta..." style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '1rem' }} required />

                      <button type="submit" className="th-primary-button" style={{ width: '100%' }}>Guardar y Publicar en Web</button>
                      {solicitudNotice && <p style={{ color: '#166534', fontWeight: 'bold', fontSize: '0.85rem', marginTop: '0.6rem' }}>✓ {solicitudNotice}</p>}
                    </form>

                    <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '1.5rem' }}>
                      <h4 style={{ margin: '0 0 0.8rem 0', color: '#166534' }}>Certificado Institucional</h4>
                      <select value={modeloCertificado} onChange={(e) => setModeloCertificado(e.target.value)} style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1.5px solid #86efac', marginBottom: '1rem', fontSize: '0.82rem', fontWeight: 'bold' }}>
                        <option value="modelo1">Modelo 1: Con Salario y Cargo</option>
                        <option value="modelo2">Modelo 2: Con Funciones</option>
                        <option value="modelo3">Modelo 3: Extrabajador</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => triggerImpresion('certificado')}
                        style={{ width: '100%', padding: '0.75rem', backgroundColor: '#166534', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        🖨️ Imprimir Certificado en PDF
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </main>

        {/* MODAL CREAR CONVOCATORIA */}
        {showModalConvocatoria && (
          <div className="th-modal-backdrop" onMouseDown={() => setShowModalConvocatoria(false)}>
            <section className="th-postulation-modal" style={{ maxWidth: '580px', width: '90%' }} onMouseDown={(e) => e.stopPropagation()}>
              <div className="th-modal-header">
                <div>
                  <span className="th-label">CREAR NUEVA OFERTA LABORAL</span>
                  <h3 style={{ margin: '0.2rem 0' }}>Publicar Vacante en Landing Institucional</h3>
                </div>
                <button type="button" className="th-modal-close" onClick={() => setShowModalConvocatoria(false)}>×</button>
              </div>

              <form onSubmit={handleCrearConvocatoria} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>Título de la Convocatoria *</label>
                  <input type="text" required placeholder="Ej: Jefe de Talento Humano" value={nuevaConvocatoria.titulo} onChange={(e) => setNuevaConvocatoria({ ...nuevaConvocatoria, titulo: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>Cargo / Rol Operativo *</label>
                  <input type="text" required placeholder="Ej: Jefe de Talento Humano" value={nuevaConvocatoria.cargo} onChange={(e) => setNuevaConvocatoria({ ...nuevaConvocatoria, cargo: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>Descripción de Funciones *</label>
                  <textarea rows="2" required placeholder="Liderar procesos de selección..." value={nuevaConvocatoria.descripcion} onChange={(e) => setNuevaConvocatoria({ ...nuevaConvocatoria, descripcion: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>Requisitos Mínimos Exigidos *</label>
                  <textarea rows="2" required placeholder="Profesional con 3 años..." value={nuevaConvocatoria.requisitos} onChange={(e) => setNuevaConvocatoria({ ...nuevaConvocatoria, requisitos: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>Asignación Salarial</label>
                    <input type="text" placeholder="Ej: $2.550.500" value={nuevaConvocatoria.salario} onChange={(e) => setNuevaConvocatoria({ ...nuevaConvocatoria, salario: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>Fecha Límite *</label>
                    <input type="date" required value={nuevaConvocatoria.fecha_cierre} onChange={(e) => setNuevaConvocatoria({ ...nuevaConvocatoria, fecha_cierre: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>
                </div>
                <button type="submit" disabled={savingConvocatoria} style={{ marginTop: '0.6rem', padding: '0.75rem', backgroundColor: '#2e7d32', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {savingConvocatoria ? 'Publicando...' : 'Publicar Convocatoria en la Web'}
                </button>
              </form>
            </section>
          </div>
        )}

        {/* MODAL VISOR HOJA DE VIDA */}
        {modalHvAspirante && (
          <div className="th-modal-backdrop" onMouseDown={() => setModalHvAspirante(null)}>
            <section
              className="th-postulation-modal"
              style={{
                maxWidth: '820px',
                width: '95%',
                maxHeight: '92vh',
                overflowY: 'auto',
                padding: '1.8rem',
                backgroundColor: '#0f172a'
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', color: '#f8fafc', flexWrap: 'wrap', gap: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ backgroundColor: '#166534', color: '#fff', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '800' }}>
                    DOCUMENTO DIGITAL
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    {modalHvAspirante.hoja_vida || modalHvAspirante.hoja_vida_nombre || 'HV_Candidato.pdf'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => descargarHojaDeVida(modalHvAspirante)}
                    style={{
                      backgroundColor: '#2e7d32',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.45rem 0.9rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 2px 8px rgba(46,125,50,0.3)'
                    }}
                  >
                    📥 Descargar Archivo Externo
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.12)',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.2)',
                      padding: '0.45rem 0.8rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    🖨️ Imprimir Vista
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalHvAspirante(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '1.4rem',
                      cursor: 'pointer',
                      padding: '0 0.4rem',
                      lineHeight: '1'
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateColumns: '260px 1fr',
                  color: '#1e293b',
                  minHeight: '620px'
                }}
              >
                <div style={{ backgroundColor: '#143c1d', color: '#ffffff', padding: '2rem 1.4rem' }}>
                  <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
                    <div
                      style={{
                        width: '84px',
                        height: '84px',
                        borderRadius: '50%',
                        backgroundColor: '#2e7d32',
                        border: '3px solid #86efac',
                        margin: '0 auto 0.8rem auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.2rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {modalHvAspirante.candidato?.charAt(0) || modalHvAspirante.nombres?.charAt(0) || 'C'}
                    </div>
                    <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.15rem', color: '#ffffff', lineHeight: '1.2' }}>
                      {modalHvAspirante.candidato || `${modalHvAspirante.nombres || ''} ${modalHvAspirante.apellidos || ''}`.trim() || 'Aspirante'}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: '#86efac', fontWeight: 'bold' }}>
                      {modalHvAspirante.convocatoria || modalHvAspirante.cargo || 'Operario de Producción'}
                    </span>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.2rem', marginBottom: '1.4rem', fontSize: '0.78rem' }}>
                    <span style={{ fontSize: '0.72rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#fed7aa', fontWeight: '800', display: 'block', marginBottom: '0.6rem' }}>
                      DATOS DE CONTACTO
                    </span>
                    <p style={{ margin: '0 0 0.4rem 0', color: '#e2e8f0' }}><strong>C.C.:</strong> {modalHvAspirante.numero_documento || '1042890123'}</p>
                    <p style={{ margin: '0 0 0.4rem 0', color: '#e2e8f0' }}><strong>Email:</strong> {modalHvAspirante.correo || 'candidato.agro@gmail.com'}</p>
                    <p style={{ margin: '0 0 0.4rem 0', color: '#e2e8f0' }}><strong>Tel:</strong> {modalHvAspirante.telefono || '300 123 4567'}</p>
                    <p style={{ margin: 0, color: '#e2e8f0' }}><strong>Ciudad:</strong> {modalHvAspirante.ciudad || 'Sabanagrande, Atlántico'}</p>
                  </div>
                </div>

                <div style={{ padding: '2.2rem 2rem', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.8rem', marginBottom: '1.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#166534', letterSpacing: '1px', textTransform: 'uppercase' }}>
                          CURRICULUM VITAE INSTITUCIONAL
                        </span>
                        <h4 style={{ margin: '0.1rem 0 0 0', color: '#0f172a', fontSize: '1.1rem' }}>
                          Perfil Laboral y Hoja de Vida
                        </h4>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', backgroundColor: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                        FRUTOPICAL S.A.S.
                      </span>
                    </div>

                    <div style={{ marginBottom: '1.3rem' }}>
                      <strong style={{ display: 'block', fontSize: '0.85rem', color: '#166534', textTransform: 'uppercase', marginBottom: '0.3rem', borderBottom: '1px solid #bbf7d0', paddingBottom: '0.2rem' }}>
                        1. Perfil Ocupacional
                      </strong>
                      <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.6', margin: 0, textAlign: 'justify' }}>
                        Técnico con formación integral y experiencia práctica en procesos agroindustriales, aplicación de Buenas Prácticas de Manufactura (BPM), normas de inocuidad alimentaria y prevención de riesgos laborales bajo el SG-SST.
                      </p>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.8rem', fontSize: '0.72rem', color: '#64748b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Autorización de Habeas Data validada (Ley 1581 de 2012)</span>
                      <strong style={{ color: '#166534' }}>Documento Auténtico · TalentHub</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.2rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    const asp = modalHvAspirante;
                    setModalHvAspirante(null);
                    setSelectedPostulation(asp);
                  }}
                  className="th-primary-button"
                  style={{ flex: 1, padding: '0.8rem', fontWeight: 'bold' }}
                >
                  Proceder a Calificar con Matriz Ponderada ➔
                </button>
                <button
                  type="button"
                  onClick={() => setModalHvAspirante(null)}
                  style={{ padding: '0.8rem 1.4rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Cerrar Visor
                </button>
              </div>
            </section>
          </div>
        )}

        {/* MODAL MATRIZ */}
        {selectedPostulation && (
          <div className="th-modal-backdrop" onMouseDown={() => setSelectedPostulation(null)}>
            <section className="th-postulation-modal" style={{ maxWidth: '640px', width: '92%' }} onMouseDown={(e) => e.stopPropagation()}>
              <div className="th-modal-header">
                <div>
                  <span className="th-label">EVALUACIÓN TÉCNICA PONDERADA</span>
                  <h3 style={{ margin: '0.2rem 0' }}>Matriz de Calificación de Aspirantes</h3>
                </div>
                <button type="button" className="th-modal-close" onClick={() => setSelectedPostulation(null)}>×</button>
              </div>

              <div style={{ backgroundColor: '#f0fdf4', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem' }}>
                <div>
                  <strong style={{ color: '#166534', fontSize: '0.95rem' }}>
                    {selectedPostulation.candidato || `${selectedPostulation.nombres || ''} ${selectedPostulation.apellidos || ''}`.trim() || 'Aspirante'}
                  </strong>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>Doc: {selectedPostulation.numero_documento || '1042890123'} · Vacante: {selectedPostulation.convocatoria || 'Operario'}</span>
                </div>
                <button type="button" onClick={() => setModalHvAspirante(selectedPostulation)} style={{ backgroundColor: '#166534', color: '#fff', border: 'none', padding: '0.4rem 0.85rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  📄 Ver HV
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginTop: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 'bold' }}>
                    <span>1. Prueba Técnica Operativa (40%)</span>
                    <span style={{ color: '#166534' }}>{puntajeTecnico} pts</span>
                  </div>
                  <input type="range" min="0" max="100" value={puntajeTecnico} onChange={(e) => setPuntajeTecnico(e.target.value)} style={{ width: '100%', accentColor: '#166534' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 'bold' }}>
                    <span>2. Entrevista por Competencias (35%)</span>
                    <span style={{ color: '#166534' }}>{puntajeEntrevista} pts</span>
                  </div>
                  <input type="range" min="0" max="100" value={puntajeEntrevista} onChange={(e) => setPuntajeEntrevista(e.target.value)} style={{ width: '100%', accentColor: '#166534' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 'bold' }}>
                    <span>3. Verificación de Hoja de Vida (25%)</span>
                    <span style={{ color: '#166534' }}>{puntajeHv} pts</span>
                  </div>
                  <input type="range" min="0" max="100" value={puntajeHv} onChange={(e) => setPuntajeHv(e.target.value)} style={{ width: '100%', accentColor: '#166534' }} />
                </div>
              </div>

              <div style={{ backgroundColor: notaCalculada >= 70 ? '#dcfce7' : '#fee2e2', padding: '0.9rem', borderRadius: '8px', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1.5px solid ${notaCalculada >= 70 ? '#86efac' : '#fecaca'}` }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>CALIFICACIÓN PONDERADA</span>
                  <strong style={{ fontSize: '1.25rem', color: notaCalculada >= 70 ? '#166534' : '#991b1b' }}>{notaCalculada} / 100</strong>
                </div>
                <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: notaCalculada >= 70 ? '#166534' : '#991b1b' }}>
                  {notaCalculada >= 70 ? '✓ APTO PARA ELEGIBILIDAD' : '✕ NO SELECCIONADO'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setVistaPreviaActa(true)}
                  style={{ flex: '1 1 180px', padding: '0.75rem', backgroundColor: '#ffffff', border: '1.5px solid #166534', color: '#166534', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  👁️ Ver Acta (PDF)
                </button>

                {notaCalculada >= 70 && (
                  <button
                    type="button"
                    onClick={() => vincularCandidato(selectedPostulation)}
                    style={{ flex: '1 1 240px', padding: '0.75rem', backgroundColor: '#166534', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(22, 101, 52, 0.25)' }}
                  >
                    🤝 Contratar y Vincular a SST / CCD ➔
                  </button>
                )}
              </div>
            </section>
          </div>
        )}

        {/* MODAL VISTA PREVIA ACTA */}
        {vistaPreviaActa && selectedPostulation && (
          <div className="th-modal-backdrop" onMouseDown={() => setVistaPreviaActa(false)}>
            <section className="th-postulation-modal" style={{ maxWidth: '680px', width: '94%', maxHeight: '90vh', overflowY: 'auto' }} onMouseDown={(e) => e.stopPropagation()}>
              <div className="th-modal-header">
                <div>
                  <span className="th-label">VISTA PREVIA INSTITUCIONAL</span>
                  <h3 style={{ margin: '0.2rem 0' }}>Acta Formal de Selección Técnica</h3>
                </div>
                <button type="button" className="th-modal-close" onClick={() => setVistaPreviaActa(false)}>×</button>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.5rem', marginTop: '1rem', fontSize: '0.85rem', lineHeight: '1.6' }}>
                <div style={{ borderBottom: '2.5px solid #166534', paddingBottom: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong style={{ fontSize: '1.1rem', color: '#166534' }}>FRUTAS DEL ATLÁNTICO S.A.S.</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>NIT: 900.999.999-1 · Sabanagrande, Atlántico</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.75rem', fontWeight: 'bold', color: '#166534' }}>GESTIÓN DEL TALENTO HUMANO</div>
                </div>

                <h4 style={{ textAlign: 'center', margin: '0 0 1rem 0', textTransform: 'uppercase' }}>ACTA DE VALORACIÓN OBJETIVA</h4>
                <p style={{ margin: '0 0 0.3rem 0' }}><strong>Aspirante:</strong> {selectedPostulation.candidato || selectedPostulation.nombres}</p>
                <p style={{ margin: '0 0 0.3rem 0' }}><strong>Documento:</strong> {selectedPostulation.numero_documento || '1042890123'}</p>
                <p style={{ margin: '0 0 0.8rem 0' }}><strong>Convocatoria:</strong> {selectedPostulation.convocatoria || 'General'}</p>

                <table style={{ width: '100%', borderCollapse: 'collapse', margin: '0.8rem 0', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9' }}>
                      <th style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Criterio</th>
                      <th style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Peso</th>
                      <th style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Puntaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Prueba Técnica Operativa</td><td style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'center' }}>40%</td><td style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{puntajeTecnico} pts</td></tr>
                    <tr><td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Entrevista por Competencias</td><td style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'center' }}>35%</td><td style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{puntajeEntrevista} pts</td></tr>
                    <tr><td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Análisis de Hoja de Vida</td><td style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'center' }}>25%</td><td style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{puntajeHv} pts</td></tr>
                    <tr style={{ background: '#f8fafc', fontWeight: 'bold' }}>
                      <td colSpan="2" style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'right' }}>TOTAL:</td>
                      <td style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#166534' }}>{notaCalculada} / 100</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem' }}>
                <button type="button" onClick={() => triggerImpresion('evaluacion')} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#166534', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  🖨️ Imprimir / Guardar en PDF
                </button>
                <button type="button" onClick={() => setVistaPreviaActa(false)} style={{ padding: '0.75rem 1.2rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Cerrar
                </button>
              </div>
            </section>
          </div>
        )}

        {/* MODAL VISOR CCD */}
        {visorDoc && (
          <div className="th-modal-backdrop" onMouseDown={() => setVisorDoc(null)}>
            <section className="th-postulation-modal" style={{ maxWidth: '520px', width: '90%' }} onMouseDown={(e) => e.stopPropagation()}>
              <div className="th-modal-header">
                <div>
                  <span className="th-label">SOPORTE DE ARCHIVO CENTRAL</span>
                  <h3 style={{ margin: '0.2rem 0' }}>Expediente Laboral Digital</h3>
                </div>
                <button type="button" className="th-modal-close" onClick={() => setVisorDoc(null)}>×</button>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '1.2rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '1rem', fontSize: '0.85rem' }}>
                <p><strong>Nomenclatura:</strong><br /><code>{visorDoc.nombre_original}</code></p>
                <p><strong>Clasificación:</strong> {visorDoc.tipo_documento}</p>
                <p><strong>Fecha:</strong> {new Date(visorDoc.fecha_carga).toLocaleDateString('es-CO')}</p>
              </div>
              <button type="button" onClick={() => setVisorDoc(null)} className="th-primary-button" style={{ width: '100%', marginTop: '1rem' }}>Cerrar</button>
            </section>
          </div>
        )}
      </div>

      {/* ÁREA DE IMPRESIÓN */}
      <div className="print-only">
        {imprimirTipo === 'certificado' && selectedSolicitud && (
          <div>
            <div style={{ borderBottom: '3px solid #166534', paddingBottom: '12px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#166534' }}>FRUTAS DEL ATLÁNTICO S.A.S.</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>NIT: 900.999.999-1 · Sabanagrande, Atlántico</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '11px', fontWeight: 'bold', color: '#166534' }}>GESTIÓN DEL TALENTO HUMANO</div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: '800', margin: '30px 0' }}>CERTIFICACIÓN LABORAL</div>
            <p style={{ fontSize: '13px', lineHeight: '1.8' }}>
              La suscrita Representante Legal de FRUTAS DEL ATLÁNTICO S.A.S. hace constar que <strong>{selectedSolicitud.nombre_remitente}</strong> labora en nuestra organización mediante contrato individual de trabajo.
            </p>
            <div style={{ marginTop: '70px', textAlign: 'center' }}>
              <div style={{ width: '240px', borderTop: '1.5px solid #0f172a', margin: '0 auto 8px auto' }}></div>
              <strong style={{ fontSize: '13px' }}>SAMY DARIANY RODRÍGUEZ SEÑA</strong><br />
              <span style={{ fontSize: '11.5px', color: '#475569' }}>Representante Legal · Frutas Del Atlántico S.A.S.</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}