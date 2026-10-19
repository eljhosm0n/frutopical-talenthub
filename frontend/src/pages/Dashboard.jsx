import React, { useEffect, useState } from 'react';
import '../dashboard.css';
import Diagnostico from './Diagnostico';
import SSTGestion from './SSTGestion';

const api = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

const REQUEST_STATES = ['RECIBIDA', 'EN PROCESO', 'ATENDIDA', 'CERRADA'];

// BASE DE DATOS MAESTRA INSTITUCIONAL DE TRABAJADORES (FRUTAS DEL ATLÁNTICO S.A.S.)
const BASE_DATOS_TRABAJADORES = [
  {
    documento: '1042890123',
    nombre: 'Carlos Fontalvo Amaya',
    cargo: 'Operario de Producción',
    salario: '$2.000.000 COP',
    salarioLetras: 'DOS MILLONES DE PESOS M/CTE',
    tipoContrato: 'Término Indefinido',
    fechaIngreso: '01 de febrero de 2026',
    fechaRetiro: 'Vigente (Activo)',
    estadoLaboral: 'ACTIVO',
    correo: 'carlos.fontalvo@gmail.com',
    telefono: '301 234 5678',
    ciudad: 'Sabanagrande, Atlántico',
    direccion: 'Calle 18 # 14-25, Sabanagrande'
  },
  {
    documento: '1043567890',
    nombre: 'María Conrado Jiménez',
    cargo: 'Jefe de Calidad',
    salario: '$3.000.000 COP',
    salarioLetras: 'TRES MILLONES DE PESOS M/CTE',
    tipoContrato: 'Término Indefinido',
    fechaIngreso: '15 de febrero de 2026',
    fechaRetiro: 'Vigente (Activo)',
    estadoLaboral: 'ACTIVO',
    correo: 'maria.conrado@gmail.com',
    telefono: '310 987 6543',
    ciudad: 'Sabanagrande, Atlántico',
    direccion: 'Carrera 4 # 21-10, Sabanagrande'
  },
  {
    documento: '1044123456',
    nombre: 'David Riquett Villalobos',
    cargo: 'Jefe de Producción',
    salario: '$3.000.000 COP',
    salarioLetras: 'TRES MILLONES DE PESOS M/CTE',
    tipoContrato: 'Término Indefinido',
    fechaIngreso: '01 de marzo de 2026',
    fechaRetiro: 'Vigente (Activo)',
    estadoLaboral: 'ACTIVO',
    correo: 'david.riquett@gmail.com',
    telefono: '302 345 6789',
    ciudad: 'Barranquilla, Atlántico',
    direccion: 'Calle 22 # 15-40, Sabanagrande'
  },
  {
    documento: '1045987654',
    nombre: 'Laura Mendoza Peñaranda',
    cargo: 'Jefe de Talento Humano',
    salario: '$2.550.500 COP',
    salarioLetras: 'DOS MILLONES QUINIENTOS CINCUENTA MIL QUINIENTOS PESOS M/CTE',
    tipoContrato: 'Término Indefinido',
    fechaIngreso: '10 de marzo de 2026',
    fechaRetiro: 'Vigente (Activo)',
    estadoLaboral: 'ACTIVO',
    correo: 'laura.mendoza@frutopical.com',
    telefono: '300 456 7890',
    ciudad: 'Barranquilla, Atlántico',
    direccion: 'Calle 76 # 54-11, Barranquilla'
  },
  {
    documento: '1048765432',
    nombre: 'Sandra Milena Morán Henríquez',
    cargo: 'Analista de Gestión Humana',
    salario: '$2.400.000 COP',
    salarioLetras: 'DOS MILLONES CUATROCIENTOS MIL PESOS M/CTE',
    tipoContrato: 'Término Indefinido',
    fechaIngreso: '10 de febrero de 2026',
    fechaRetiro: 'Vigente (Activo)',
    estadoLaboral: 'ACTIVO',
    correo: 'sandra.moran@gmail.com',
    telefono: '315 889 9001',
    ciudad: 'Sabanagrande, Atlántico',
    direccion: 'Calle 12 # 8-30, Sabanagrande'
  },
  {
    documento: '10234532121',
    nombre: 'Min Yongi',
    cargo: 'Supervisor de Planta y Despachos',
    salario: '$2.600.000 COP',
    salarioLetras: 'DOS MILLONES SEISCIENTOS MIL PESOS M/CTE',
    tipoContrato: 'Término Indefinido',
    fechaIngreso: '15 de enero de 2026',
    fechaRetiro: 'Vigente (Activo)',
    estadoLaboral: 'ACTIVO',
    correo: 'min.yongi@frutopical.com',
    telefono: '320 654 3210',
    ciudad: 'Sabanagrande, Atlántico',
    direccion: 'Carrera 6 # 14-12, Sabanagrande'
  },
  {
    documento: '1047123987',
    nombre: 'Alejandro Shar',
    cargo: 'Auxiliar Administrativo y Logística',
    salario: '$2.200.000 COP',
    salarioLetras: 'DOS MILLONES DOSCIENTOS MIL PESOS M/CTE',
    tipoContrato: 'Término Fijo',
    fechaIngreso: '01 de marzo de 2026',
    fechaRetiro: '30 de septiembre de 2026',
    estadoLaboral: 'EXTRABAJADOR',
    correo: 'alejandro.shar@gmail.com',
    telefono: '300 776 5432',
    ciudad: 'Sabanagrande, Atlántico',
    direccion: 'Calle 10 # 5-20, Sabanagrande'
  }
];

// LISTADO ESTÁNDAR DE CODIFICACIÓN Y SUBSERIES DEL CCD EXIGIDO POR LA PROFESORA
const SUBSERIES_CCD_OFICIALES = [
  { codigo: '100.10.18.01', nombre: '100.10.18.01 Hoja de Vida', categoria: 'Hoja de Vida' },
  { codigo: '100.10.18.02', nombre: '100.10.18.02 Proceso de Selección', categoria: 'Selección' },
  { codigo: '100.10.18.03', nombre: '100.10.18.03 Exámenes Médicos', categoria: 'Salud Ocupacional' },
  { codigo: '100.10.18.04', nombre: '100.10.18.04 Contratación', categoria: 'Contrato Laboral' },
  { codigo: '100.10.18.05', nombre: '100.10.18.05 Afiliaciones', categoria: 'Seguridad Social' },
  { codigo: '100.10.18.06', nombre: '100.10.18.06 Inducción y Capacitación', categoria: 'SST e Inducción' },
  { codigo: '100.10.18.07', nombre: '100.10.18.07 Historial Laboral', categoria: 'Desempeño y Novedades' },
  { codigo: '100.10.18.08', nombre: '100.10.18.08 Desprendibles / Nómina', categoria: 'Pagos y Comprobantes' },
  { codigo: '100.10.18.09', nombre: '100.10.18.09 Procesos Disciplinarios', categoria: 'Régimen Disciplinario' },
  { codigo: '100.10.18.10', nombre: '100.10.18.10 Desvinculación', categoria: 'Retiro y Liquidación' }
];

function numeroALetrasDia(num) {
  const dias = [
    '', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
    'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte',
    'veintiún', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve', 'treinta', 'treinta y un'
  ];
  return dias[num] || `${num}`;
}

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

  // Postulaciones
  const [postulaciones, setPostulaciones] = useState([]);
  const [selectedPostulation, setSelectedPostulation] = useState(null);
  const [modalHvAspirante, setModalHvAspirante] = useState(null);

  // Matriz Ponderada
  const [puntajeTecnico, setPuntajeTecnico] = useState(85);
  const [puntajePsicologico, setPuntajePsicologico] = useState(80);
  const [puntajeEntrevista, setPuntajeEntrevista] = useState(85);
  const [puntajeHv, setPuntajeHv] = useState(90);
  const [puntajeMedicos, setPuntajeMedicos] = useState(100);

  const notaCalculada = Math.round(
    (Number(puntajeTecnico) * 0.30) +
    (Number(puntajePsicologico) * 0.15) +
    (Number(puntajeEntrevista) * 0.30) +
    (Number(puntajeHv) * 0.15) +
    (Number(puntajeMedicos) * 0.10)
  );

  // MÓDULO 4: GESTIÓN DOCUMENTAL (CCD)
  const [expedientes, setExpedientes] = useState([]);
  const [selectedExpediente, setSelectedExpediente] = useState(null);
  const [documentosExpediente, setDocumentosExpediente] = useState([]);
  const [selectedSubserie, setSelectedSubserie] = useState(SUBSERIES_CCD_OFICIALES[0].codigo);
  const [descripcionDocumento, setDescripcionDocumento] = useState('');
  const [archivoBase64, setArchivoBase64] = useState(null);
  const [nombreArchivoSubido, setNombreArchivoSubido] = useState('');
  const [uploadNotice, setUploadNotice] = useState('');
  const [visorDoc, setVisorDoc] = useState(null);

  // PQRS
  const [solicitudes, setSolicitudes] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [newSolicitudState, setNewSolicitudState] = useState('RECIBIDA');
  const [solicitudResponse, setSolicitudResponse] = useState('');
  const [modeloCertificado, setModeloCertificado] = useState('modelo1');
  const [solicitudNotice, setSolicitudNotice] = useState('');
  const [certDatos, setCertDatos] = useState(BASE_DATOS_TRABAJADORES[0]);

  useEffect(() => {
    sincronizarBaseTrabajadores();
    loadConvocatorias();
    loadPostulaciones();
    loadExpedientes();
    loadSolicitudes();
  }, []);

  function sincronizarBaseTrabajadores() {
    const guardados = localStorage.getItem('frutopical_empleados');
    if (!guardados) {
      localStorage.setItem('frutopical_empleados', JSON.stringify(BASE_DATOS_TRABAJADORES));
    }
  }

  function getListaEmpleados() {
    try {
      const guardados = localStorage.getItem('frutopical_empleados');
      if (guardados) {
        const parsed = JSON.parse(guardados);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return BASE_DATOS_TRABAJADORES;
  }

  // CARGA COMPLETA DE EXPEDIENTES (INCLUYE TODOS LOS TRABAJADORES + NUEVOS CONTRATADOS)
  function loadExpedientes() {
    const listaMaestra = getListaEmpleados();
    const postulados = JSON.parse(localStorage.getItem('frutopical_postulaciones') || '[]');

    const listaUnificada = [...listaMaestra];

    postulados.filter(p => p.estado === 'CONTRATADO').forEach(p => {
      const doc = p.numero_documento || '104' + Math.floor(Math.random() * 900000);
      if (!listaUnificada.some(e => String(e.documento) === String(doc))) {
        listaUnificada.push({
          documento: doc,
          nombre: p.candidato || `${p.nombres || ''} ${p.apellidos || ''}`.trim() || 'Nuevo Colaborador',
          cargo: p.convocatoria || p.cargo || 'Operario de Producción',
          estadoLaboral: 'ACTIVO',
          salario: '$2.000.000 COP',
          tipoContrato: 'Término Indefinido',
          fechaIngreso: fechaHoy
        });
      }
    });

    setExpedientes(listaUnificada);
  }

  // AL ABRIR UN EXPEDIENTE, SE CARGAN SUS DOCUMENTOS PERSISTENTES DESDE LOCALSTORAGE
  function abrirExpedienteCCD(colaborador) {
    setSelectedExpediente(colaborador);
    setDescripcionDocumento('');
    setArchivoBase64(null);
    setNombreArchivoSubido('');

    const todosDocs = JSON.parse(localStorage.getItem('frutopical_docs_expedientes') || '{}');
    const docsColaborador = todosDocs[colaborador.documento] || [
      {
        id_archivo: 1,
        nombre_original: `EXP-${colaborador.documento}-100.10.18.01-HOJA_DE_VIDA.pdf`,
        subserie_codigo: '100.10.18.01',
        tipo_documento: '100.10.18.01 Hoja de Vida',
        descripcion: 'Hoja de Vida institucional radicada con soportes',
        fecha_carga: '2026-02-01',
        archivo_data: null
      },
      {
        id_archivo: 2,
        nombre_original: `EXP-${colaborador.documento}-100.10.18.04-CONTRATO_LABORAL.pdf`,
        subserie_codigo: '100.10.18.04',
        tipo_documento: '100.10.18.04 Contratación',
        descripcion: 'Contrato Individual de Trabajo a Término Indefinido firmado',
        fecha_carga: '2026-02-01',
        archivo_data: null
      }
    ];

    setDocumentosExpediente(docsColaborador);
  }

  // RADICACIÓN DE DOCUMENTO CON PERSISTENCIA SEGURA EN LOCALSTORAGE
  function handleRadicarDocumentoCCD(e) {
    e.preventDefault();
    if (!selectedExpediente) return;
    if (!descripcionDocumento.trim()) {
      alert('Debes ingresar la descripción del soporte.');
      return;
    }

    const subserieObj = SUBSERIES_CCD_OFICIALES.find(s => s.codigo === selectedSubserie);
    const nombreLimpio = descripcionDocumento.trim().toUpperCase().replace(/\s+/g, '_');
    const nomenclaturaGenerada = `EXP-${selectedExpediente.documento}-${selectedSubserie}-${nombreLimpio}.pdf`;

    const nuevoDoc = {
      id_archivo: Date.now(),
      nombre_original: nomenclaturaGenerada,
      subserie_codigo: selectedSubserie,
      tipo_documento: subserieObj?.nombre || selectedSubserie,
      descripcion: descripcionDocumento.trim(),
      fecha_carga: new Date().toISOString(),
      archivo_data: archivoBase64 || null
    };

    const actualizados = [nuevoDoc, ...documentosExpediente];
    setDocumentosExpediente(actualizados);

    // Guardar en localStorage bajo la cédula del colaborador
    const todosDocs = JSON.parse(localStorage.getItem('frutopical_docs_expedientes') || '{}');
    todosDocs[selectedExpediente.documento] = actualizados;
    localStorage.setItem('frutopical_docs_expedientes', JSON.stringify(todosDocs));

    setDescripcionDocumento('');
    setArchivoBase64(null);
    setNombreArchivoSubido('');
    setUploadNotice('Documento radicado y custodiado exitosamente en el expediente laboral.');
    setTimeout(() => setUploadNotice(''), 2500);
  }

  // DESCARGA DEL DOCUMENTO CODIFICADO (DESCARGA EL ARCHIVO REAL SUBIDO O GENERA COPIA FORMAL)
  function descargarDocumentoCodificado(doc) {
    const nombreArchivo = doc.nombre_original.endsWith('.pdf') ? doc.nombre_original : `${doc.nombre_original}.pdf`;

    if (doc.archivo_data) {
      const link = document.createElement('a');
      link.href = doc.archivo_data;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // PDF formal de soporte foliado/codificado según estándares del AGN
    const contenidoPdf = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n` +
      `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n` +
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n` +
      `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n` +
      `5 0 obj\n<< /Length 260 >>\nstream\n` +
      `BT\n/F1 14 Tf\n50 730 Td\n(FRUTAS DEL ATLANTICO S.A.S. - ARCHIVO CENTRAL) Tj\n` +
      `/F1 10 Tf\n50 705 Td\n(CUADRO DE CLASIFICACION DOCUMENTAL - SERIE 100.10.18) Tj\n` +
      `50 670 Td\n(Titular del Expediente: ${selectedExpediente?.nombre || 'Colaborador'}) Tj\n` +
      `50 650 Td\n(Documento de Identidad: ${selectedExpediente?.documento || 'Sin ID'}) Tj\n` +
      `50 630 Td\n(Subserie Clasificacion: ${doc.tipo_documento}) Tj\n` +
      `50 610 Td\n(Nomenclatura AGN: ${doc.nombre_original}) Tj\n` +
      `50 590 Td\n(Descripcion: ${doc.descripcion || 'Documento archivado en expediente'}) Tj\n` +
      `50 570 Td\n(Fecha de Radicacion: ${new Date(doc.fecha_carga).toLocaleDateString('es-CO')}) Tj\n` +
      `50 530 Td\n(ESTADO: DOCUMENTO CODIFICADO Y CUSTODIADO EN EXPEDIENTE LABORAL DIGITAL) Tj\n` +
      `ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000234 00000 n \n0000000296 00000 n \n` +
      `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n%%EOF`;

    const blob = new Blob([contenidoPdf], { type: 'application/pdf;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function descargarExcelNomina() {
    const lista = getListaEmpleados();
    const encabezados = "Cedula;Nombres y Apellidos;Cargo;Tipo Contrato;Salario Mensual;Salario en Letras;Fecha Ingreso;Fecha Retiro;Estado Laboral\n";
    const filas = lista.map(e => 
      `"${e.documento}";"${e.nombre}";"${e.cargo}";"${e.tipoContrato || 'Término Indefinido'}";"${e.salario}";"${e.salarioLetras || ''}";"${e.fechaIngreso}";"${e.fechaRetiro || 'Vigente'}";"${e.estadoLaboral || 'ACTIVO'}"`
    ).join("\n");

    const contenidoBlob = "\uFEFF" + encabezados + filas;
    const blob = new Blob([contenidoBlob], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "MATRIZ_MAESTRA_NOMINA_FRUTOPICAL_SAS.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function loadConvocatorias() {
    const stored = localStorage.getItem('frutopical_convocatorias');
    if (stored) {
      setConvocatorias(JSON.parse(stored));
      return;
    }
    try {
      const response = await fetch(`${api}/convocatorias`);
      const body = await response.json();
      if (body.ok && Array.isArray(body.data) && body.data.length > 0) {
        setConvocatorias(body.data);
        localStorage.setItem('frutopical_convocatorias', JSON.stringify(body.data));
      }
    } catch {}
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

    const prev = JSON.parse(localStorage.getItem('frutopical_convocatorias') || '[]');
    const actualizadas = [nueva, ...prev];
    setConvocatorias(actualizadas);
    localStorage.setItem('frutopical_convocatorias', JSON.stringify(actualizadas));

    try {
      await fetch(`${api}/convocatorias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nueva)
      });
    } catch {}

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

    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPostulaciones(parsed);
          return;
        }
      } catch {}
    }

    setPostulaciones(base);
    localStorage.setItem('frutopical_postulaciones', JSON.stringify(base));
  }

  function loadSolicitudes() {
    const stored = localStorage.getItem('frutopical_solicitudes');
    const base = [
      {
        id_solicitud: 1,
        numero_solicitud: 'SOL-2026-0001',
        nombre_remitente: 'Carlos Fontalvo Amaya',
        numero_documento: '1042890123',
        tipo_remitente: 'TRABAJADOR_ACTIVO',
        correo: 'carlos.fontalvo@gmail.com',
        telefono: '301 234 5678',
        tipo_solicitud: 'PETICION',
        descripcion: 'Solicitud de certificado laboral institucional con detalle de salario básico para trámite bancario.',
        fecha: new Date().toISOString(),
        estado: 'ATENDIDA',
        respuesta_observacion: 'Se expide la certificación laboral solicitada conforme al registro contractual vigente.'
      },
      {
        id_solicitud: 2,
        numero_solicitud: 'SOL-2026-000692',
        nombre_remitente: 'Sandra Milena Morán Henríquez',
        numero_documento: '1048765432',
        tipo_remitente: 'TRABAJADOR_ACTIVO',
        correo: 'sandra.moran@gmail.com',
        telefono: '315 889 9001',
        tipo_solicitud: 'PETICION',
        descripcion: 'Solicito certificación de funciones y salario para crédito de vivienda.',
        fecha: new Date().toISOString(),
        estado: 'EN PROCESO',
        respuesta_observacion: 'Su solicitud está siendo tramitada por la Jefatura de Talento Humano.'
      },
      {
        id_solicitud: 3,
        numero_solicitud: 'SOL-2026-000468',
        nombre_remitente: 'Alejandro Shar',
        numero_documento: '1047123987',
        tipo_remitente: 'EXTRABAJADOR',
        correo: 'alejandro.shar@gmail.com',
        telefono: '300 776 5432',
        tipo_solicitud: 'PETICION',
        descripcion: 'Constancia laboral de extrabajador para vinculación en nuevo empleo.',
        fecha: new Date().toISOString(),
        estado: 'RECIBIDA',
        respuesta_observacion: 'En verificación de archivo de historias laborales Serie 100.'
      }
    ];

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSolicitudes(parsed);
          return;
        }
      } catch {}
    }

    setSolicitudes(base);
    localStorage.setItem('frutopical_solicitudes', JSON.stringify(base));
  }

  function descargarHojaDeVida(candidato) {
    const nombreCompleto = candidato.candidato || `${candidato.nombres || ''} ${candidato.apellidos || ''}`.trim() || 'Aspirante';
    const nombreArchivo = candidato.hoja_vida || candidato.hoja_vida_nombre || `HV_${nombreCompleto.replace(/\s+/g, '_')}.pdf`;

    if (candidato.hoja_vida_archivo) {
      const link = document.createElement('a');
      link.href = candidato.hoja_vida_archivo;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const contenidoPdfSimulado = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n` +
      `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n` +
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n` +
      `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n` +
      `5 0 obj\n<< /Length 200 >>\nstream\n` +
      `BT\n/F1 16 Tf\n50 720 Td\n(FRUTOPICAL S.A.S. - HOJA DE VIDA RADICADA) Tj\n` +
      `/F1 11 Tf\n50 680 Td\n(Aspirante: ${nombreCompleto}) Tj\n` +
      `50 655 Td\n(Documento de Identidad: ${candidato.numero_documento || '1042890123'}) Tj\n` +
      `50 630 Td\n(Convocatoria: ${candidato.convocatoria || candidato.cargo || 'General'}) Tj\n` +
      `50 605 Td\n(Correo: ${candidato.correo || 'aspirante@gmail.com'}) Tj\n` +
      `50 580 Td\n(Telefono: ${candidato.telefono || '300 123 4567'}) Tj\n` +
      `50 555 Td\n(Ciudad: ${candidato.ciudad || 'Sabanagrande, Atlantico'}) Tj\n` +
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
    let salarioLetras = 'DOS MILLONES DE PESOS M/CTE';
    if (cargo.toLowerCase().includes('talento humano')) {
      salario = '$2.550.500 COP';
      salarioLetras = 'DOS MILLONES QUINIENTOS CINCUENTA MIL QUINIENTOS PESOS M/CTE';
    }
    if (cargo.toLowerCase().includes('calidad') && cargo.toLowerCase().includes('jefe')) {
      salario = '$3.000.000 COP';
      salarioLetras = 'TRES MILLONES DE PESOS M/CTE';
    }
    if (cargo.toLowerCase().includes('producción') && cargo.toLowerCase().includes('jefe')) {
      salario = '$3.000.000 COP';
      salarioLetras = 'TRES MILLONES DE PESOS M/CTE';
    }

    const nuevoColaborador = {
      documento: doc,
      nombre: nombreCompleto,
      cargo: cargo,
      salario: salario,
      salarioLetras: salarioLetras,
      tipoContrato: 'Término Indefinido',
      fechaIngreso: fechaHoy,
      fechaRetiro: 'Vigente (Activo)',
      estadoLaboral: 'ACTIVO',
      correo: candidatoAprobado.correo || 'colaborador@frutopical.com',
      telefono: candidatoAprobado.telefono || '300 123 4567',
      ciudad: candidatoAprobado.ciudad || 'Sabanagrande, Atlántico',
      direccion: 'Sabanagrande, Atlántico'
    };

    const emps = getListaEmpleados();
    if (!emps.some(e => String(e.documento) === String(doc))) {
      emps.unshift(nuevoColaborador);
      localStorage.setItem('frutopical_empleados', JSON.stringify(emps));
    }

    const actualizadosPost = postulaciones.map(p =>
      (p.id_postulacion === candidatoAprobado.id_postulacion || String(p.numero_documento) === String(doc))
        ? { ...p, estado: 'CONTRATADO' }
        : p
    );
    setPostulaciones(actualizadosPost);
    localStorage.setItem('frutopical_postulaciones', JSON.stringify(actualizadosPost));

    // Refrescar expedientes CCD automáticamente
    loadExpedientes();

    alert(`¡Candidato ${nombreCompleto} vinculado exitosamente a Nómina, SST y Archivo Central CCD!`);
    setSelectedPostulation(null);
  }

  async function updateSolicitud(e) {
    e.preventDefault();
    if (!selectedSolicitud) return;

    const radicadoBuscado = (selectedSolicitud.numero_solicitud || '').trim().toUpperCase();

    const listaActualizada = solicitudes.map((s) => {
      const radicadoActual = (s.numero_solicitud || '').trim().toUpperCase();
      if (s.id_solicitud === selectedSolicitud.id_solicitud || radicadoActual === radicadoBuscado) {
        return {
          ...s,
          estado: newSolicitudState,
          respuesta_observacion: solicitudResponse
        };
      }
      return s;
    });

    setSolicitudes(listaActualizada);
    localStorage.setItem('frutopical_solicitudes', JSON.stringify(listaActualizada));

    try {
      await fetch(`${api}/solicitudes/${selectedSolicitud.id_solicitud || selectedSolicitud.numero_solicitud}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: newSolicitudState, respuesta_observacion: solicitudResponse })
      });
    } catch {}

    setSolicitudNotice(`¡Radicado ${selectedSolicitud.numero_solicitud} actualizado a "${newSolicitudState}" y sincronizado con la web!`);
    setTimeout(() => {
      setSelectedSolicitud(null);
      setSolicitudResponse('');
      setSolicitudNotice('');
    }, 1200);
  }

  function abrirCasoPQRS(item) {
    setSelectedSolicitud(item);
    setNewSolicitudState(item.estado || 'RECIBIDA');
    setSolicitudResponse(item.respuesta_observacion || '');

    const emps = getListaEmpleados();
    const docBuscado = (item.numero_documento || '').replace(/\D/g, '');
    const nombreLimpio = (item.nombre_remitente || '').toLowerCase();

    let encontrado = emps.find(e => docBuscado && String(e.documento).replace(/\D/g, '') === docBuscado);
    if (!encontrado) {
      encontrado = emps.find(e => 
        nombreLimpio.includes(e.nombre.toLowerCase()) || 
        e.nombre.toLowerCase().includes(nombreLimpio)
      );
    }

    if (encontrado) {
      setCertDatos(encontrado);
    } else {
      setCertDatos({
        documento: item.numero_documento || '1042890123',
        nombre: item.nombre_remitente || 'Colaborador',
        cargo: 'Operario de Producción',
        salario: '$2.000.000 COP',
        salarioLetras: 'DOS MILLONES DE PESOS M/CTE',
        tipoContrato: 'Término Indefinido',
        fechaIngreso: '15 de enero de 2026',
        fechaRetiro: '31 de agosto de 2026',
        estadoLaboral: item.tipo_remitente === 'EXTRABAJADOR' ? 'EXTRABAJADOR' : 'ACTIVO'
      });
    }
  }

  function seleccionarTrabajadorManual(doc) {
    const emps = getListaEmpleados();
    const match = emps.find(e => String(e.documento) === String(doc));
    if (match) {
      setCertDatos(match);
    }
  }

  function triggerImpresion(tipo) {
    setImprimirTipo(tipo);
    setTimeout(() => {
      window.print();
    }, 300);
  }

  function changeModule(module) {
    setActiveModule(module);
    if (module === 'seleccion') {
      loadConvocatorias();
      loadPostulaciones();
    }
    if (module === 'documentos') {
      loadExpedientes();
      setSelectedExpediente(null);
    }
    if (module === 'solicitudes') {
      setSelectedSolicitud(null);
      loadSolicitudes();
    }
  }

  const hoy = new Date();
  const diaNumero = hoy.getDate();
  const diaLetras = numeroALetrasDia(diaNumero);
  const mesNombre = hoy.toLocaleDateString('es-CO', { month: 'long' });
  const anioNumero = hoy.getFullYear();
  const fechaHoy = hoy.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const listaMaestraEmpleados = getListaEmpleados();

  return (
    <>
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
              <span className="th-nav-icon">🏢</span> 1. Caracterización Org.
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
              <span className="th-nav-icon">💬</span> 5. Atención al Cliente (PQRS)
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
            {/* INICIO */}
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
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>EXPEDIENTES CCD</span>
                      <strong style={{ display: 'block', fontSize: '1.5rem', color: '#1e293b' }}>{expedientes.length}</strong>
                      <small style={{ color: '#1d4ed8', fontWeight: '700' }}>Expedientes Serie 100.10.18</small>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '1.4rem', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#7e22ce' }}>💬</div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>PQRS ACTIVAS</span>
                      <strong style={{ display: 'block', fontSize: '1.5rem', color: '#1e293b' }}>{solicitudes.length}</strong>
                      <small style={{ color: '#7e22ce', fontWeight: '700' }}>Atención en tiempo real</small>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.8rem', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', letterSpacing: '1px' }}>ACCESO RÁPIDO A MÓDULOS</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={() => changeModule('diagnostico')} style={{ textAlign: 'left', padding: '1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', display: 'flex', gap: '0.8rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>🏢</span>
                      <div>
                        <strong style={{ color: '#166534', fontSize: '0.95rem', display: 'block' }}>1. Caracterización Organizacional</strong>
                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Estrategia, organigrama y los 13 perfiles DPC.</p>
                      </div>
                    </button>

                    <button type="button" onClick={() => changeModule('seleccion')} style={{ textAlign: 'left', padding: '1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', display: 'flex', gap: '0.8rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>👥</span>
                      <div>
                        <strong style={{ color: '#c2410c', fontSize: '0.95rem', display: 'block' }}>2. Selección de Personal</strong>
                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Matriz técnica ponderada y actas de evaluación.</p>
                      </div>
                    </button>

                    <button type="button" onClick={() => changeModule('vinculaciones')} style={{ textAlign: 'left', padding: '1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', display: 'flex', gap: '0.8rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>📋</span>
                      <div>
                        <strong style={{ color: '#1d4ed8', fontSize: '0.95rem', display: 'block' }}>3. Vinculación y SG-SST</strong>
                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Lista de chequeo documental y constancias de inducción.</p>
                      </div>
                    </button>

                    <button type="button" onClick={() => changeModule('documentos')} style={{ textAlign: 'left', padding: '1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', display: 'flex', gap: '0.8rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>📁</span>
                      <div>
                        <strong style={{ color: '#b45309', fontSize: '0.95rem', display: 'block' }}>4. Gestión Documental (CCD)</strong>
                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Cuadro de clasificación Serie 100.10.18 y expedientes laborales.</p>
                      </div>
                    </button>

                    <button type="button" onClick={() => changeModule('solicitudes')} style={{ textAlign: 'left', padding: '1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', display: 'flex', gap: '0.8rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>💬</span>
                      <div>
                        <strong style={{ color: '#7e22ce', fontSize: '0.95rem', display: 'block' }}>5. Atención al Cliente (PQRS)</strong>
                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Trámite de radicados y expedición de certificados laborales.</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MÓDULO 1: DIAGNÓSTICO */}
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
                    ♙ Candidatos y Matriz Ponderada Oficial
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
                    <div className="th-page-intro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <span className="th-label">EQUIPO 2 · SELECCIÓN TÉCNICA</span>
                        <h2>Postulaciones y Calificación de Candidatos</h2>
                        <p>Los aspirantes que se postulan desde la web aparecen aquí con sus datos de contacto y hoja de vida.</p>
                      </div>
                      <button
                        type="button"
                        onClick={loadPostulaciones}
                        style={{ backgroundColor: '#ffffff', border: '1.5px solid #166534', color: '#166534', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        🔄 Actualizar Postulaciones en Vivo
                      </button>
                    </div>

                    <div className="th-table-wrapper">
                      <table className="th-table">
                        <thead>
                          <tr>
                            <th>Candidato</th>
                            <th>Documento</th>
                            <th>Contacto (Tel / Email)</th>
                            <th>Ubicación</th>
                            <th>Convocatoria</th>
                            <th>Hoja de Vida</th>
                            <th>Estado</th>
                            <th>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {postulaciones.map((item, index) => {
                            const nombre = item.candidato || `${item.nombres || ''} ${item.apellidos || ''}`.trim() || 'Aspirante';
                            const estaContratado = item.estado === 'CONTRATADO';
                            return (
                              <tr key={item.id_postulacion ?? index}>
                                <td><strong>{nombre}</strong></td>
                                <td>{item.numero_documento || '—'}</td>
                                <td>
                                  <div style={{ fontSize: '0.78rem' }}>
                                    <strong>📞 {item.telefono || 'Sin tel.'}</strong><br />
                                    <span style={{ color: '#64748b' }}>✉️ {item.correo || 'Sin correo'}</span>
                                  </div>
                                </td>
                                <td><small>{item.ciudad || 'Sabanagrande'}</small></td>
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
                                  <span className={`th-status ${estaContratado ? 'active' : ''}`} style={{ backgroundColor: estaContratado ? '#dcfce7' : '#f1f5f9', color: estaContratado ? '#166534' : '#475569' }}>
                                    {item.estado || 'RECIBIDA'}
                                  </span>
                                </td>
                                <td>
                                  {estaContratado ? (
                                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#166534', backgroundColor: '#e2f4e8', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>
                                      ✓ Contratado
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      className="th-table-action"
                                      onClick={() => setSelectedPostulation(item)}
                                    >
                                      📝 Evaluar con Matriz
                                    </button>
                                  )}
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

            {/* MÓDULO 3: VINCULACIÓN Y SG-SST */}
            {activeModule === 'vinculaciones' && (
              <SSTGestion onVolver={() => changeModule('inicio')} />
            )}

            {/* MÓDULO 4: GESTIÓN DOCUMENTAL (CCD) - COMPLETAMENTE ACTUALIZADO */}
            {activeModule === 'documentos' && (
              <section className="th-page-section">
                {!selectedExpediente ? (
                  <>
                    <div className="th-page-intro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <span className="th-label">EQUIPO 4 · GESTIÓN DOCUMENTAL</span>
                        <h2>Cuadro de Clasificación Documental (CCD)</h2>
                        <p>Los colaboradores activos y nuevas contrataciones cuentan con expediente aperturado en la Serie 100.10.18.</p>
                      </div>
                      <button
                        type="button"
                        onClick={loadExpedientes}
                        style={{ backgroundColor: '#ffffff', border: '1.5px solid #166534', color: '#166534', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.82rem', cursor: 'pointer' }}
                      >
                        🔄 Sincronizar Expedientes
                      </button>
                    </div>

                    {/* ESTRUCTURA JERÁRQUICA EXIGIDA POR LA PROFESORA */}
                    <div style={{ backgroundColor: '#f0fdf4', padding: '1.2rem 1.5rem', borderRadius: '12px', border: '1.5px solid #86efac', marginBottom: '1.6rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', letterSpacing: '0.5px' }}>
                        ESTRUCTURA JERÁRQUICA DEL CCD PARA TALENTO HUMANO (AGN)
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.8rem', marginTop: '0.6rem', fontSize: '0.85rem' }}>
                        <div><strong>Fondo (100):</strong> Frutas Del Atlántico S.A.S.</div>
                        <div><strong>Sección (100.10):</strong> Gestión Humana / Talento Humano</div>
                        <div><strong>Serie (100.10.18):</strong> Expedientes Laborales</div>
                      </div>
                    </div>

                    {/* TABLA DE TODOS LOS TRABAJADORES ACTIVOS Y NUEVAS CONTRATACIONES */}
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
                          {expedientes.map((item, idx) => (
                            <tr key={item.documento ?? idx}>
                              <td><strong>{item.nombre}</strong></td>
                              <td>CC {item.documento}</td>
                              <td>{item.cargo}</td>
                              <td><span className="th-status active">{item.estadoLaboral || 'ACTIVO'}</span></td>
                              <td>
                                <button
                                  type="button"
                                  className="th-table-action"
                                  onClick={() => abrirExpedienteCCD(item)}
                                >
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
                    <div className="th-page-intro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <span className="th-label">EXPEDIENTE LABORAL DIGITAL</span>
                        <h2>{selectedExpediente.nombre}</h2>
                        <p>Cargo: <strong>{selectedExpediente.cargo}</strong> · C.C. <strong>{selectedExpediente.documento}</strong> · Serie: <strong>100.10.18 (Expedientes Laborales)</strong></p>
                      </div>
                      <button type="button" className="th-secondary-button" onClick={() => setSelectedExpediente(null)}>
                        ← Volver a Expedientes
                      </button>
                    </div>

                    {/* FORMULARIO: RADICAR DOCUMENTO EN EXPEDIENTE LABORAL (CON ESTRUCTURA AGN) */}
                    <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '1.8rem', maxWidth: '720px', marginBottom: '2rem' }}>
                      <h3 style={{ margin: '0 0 0.4rem 0', color: '#166534', fontSize: '1.2rem' }}>
                        Radicar Documento en Expediente Laboral
                      </h3>
                      
                      {/* INFORMACIÓN JERÁRQUICA DEBAJO DEL TÍTULO EXIGIDA */}
                      <div style={{ backgroundColor: '#f8fafc', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.2rem', fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                        <strong>Estructura Jerárquica del CCD para Talento Humano:</strong><br />
                        Fondo: <strong>100</strong> (Frutas Del Atlántico S.A.S.) · Sección: <strong>100.10</strong> (Gestión Humana) · Serie: <strong>100.10.18</strong> (Expedientes Laborales)
                      </div>

                      <form onSubmit={handleRadicarDocumentoCCD} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>
                            1. Subserie Documental (CCD) *
                          </label>
                          <select
                            value={selectedSubserie}
                            onChange={(e) => setSelectedSubserie(e.target.value)}
                            style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 'bold' }}
                          >
                            {SUBSERIES_CCD_OFICIALES.map((s) => (
                              <option key={s.codigo} value={s.codigo}>
                                [{s.codigo}] {s.nombre.replace(`${s.codigo} `, '')}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>
                            2. Descripción del Soporte *
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: Acta de Notificación del Reglamento Interno (RIT)"
                            value={descripcionDocumento}
                            onChange={(e) => setDescripcionDocumento(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>
                            3. Archivo Digital (Soporte PDF o Imagen)
                          </label>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                setNombreArchivoSubido(f.name);
                                const reader = new FileReader();
                                reader.onload = () => setArchivoBase64(reader.result);
                                reader.readAsDataURL(f);
                              } else {
                                setArchivoBase64(null);
                                setNombreArchivoSubido('');
                              }
                            }}
                            style={{ width: '100%', fontSize: '0.82rem' }}
                          />
                          {nombreArchivoSubido && (
                            <small style={{ color: '#166534', fontWeight: 'bold', display: 'block', marginTop: '0.2rem' }}>
                              ✓ Archivo cargado: {nombreArchivoSubido}
                            </small>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="th-primary-button"
                          style={{ width: '100%', padding: '0.75rem', fontWeight: 'bold', marginTop: '0.4rem' }}
                        >
                          Archivar y Codificar en Expediente Laboral
                        </button>
                      </form>
                      {uploadNotice && <p style={{ color: '#166534', fontWeight: 'bold', fontSize: '0.85rem', marginTop: '0.6rem' }}>✓ {uploadNotice}</p>}
                    </div>

                    {/* TABLA DE DOCUMENTOS EN EXPEDIENTE LABORAL */}
                    <div className="th-table-wrapper">
                      <h3 style={{ margin: '0 0 0.8rem 0', color: '#1e293b' }}>
                        Documentos en Expediente Laboral ({documentosExpediente.length})
                      </h3>
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
                          {documentosExpediente.map((doc) => (
                            <tr key={doc.id_archivo}>
                              <td>
                                <strong style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#0f172a' }}>
                                  {doc.nombre_original}
                                </strong>
                              </td>
                              <td>{doc.tipo_documento}</td>
                              <td>{new Date(doc.fecha_carga).toLocaleDateString('es-CO')}</td>
                              <td style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                  type="button"
                                  onClick={() => setVisorDoc(doc)}
                                  style={{ padding: '0.35rem 0.65rem', backgroundColor: '#f0fdf4', border: '1px solid #86efac', color: '#166534', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                  👁️ Ver Ficha
                                </button>
                                <button
                                  type="button"
                                  onClick={() => descargarDocumentoCodificado(doc)}
                                  style={{ padding: '0.35rem 0.65rem', backgroundColor: '#166534', border: 'none', color: '#ffffff', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                  📥 Descargar PDF
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </section>
            )}

            {/* MÓDULO 5: ATENCIÓN AL CLIENTE (PQRS) */}
            {activeModule === 'solicitudes' && (
              <section className="th-page-section">
                {!selectedSolicitud ? (
                  <>
                    <div className="th-page-intro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <span className="th-label">EQUIPO 5 · SERVICIO AL CLIENTE INTERNO</span>
                        <h2>Gestión de PQRS y Certificaciones Laborales</h2>
                        <p>Atiende radicados y genera certificados con cruce automático de nómina oficial.</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={descargarExcelNomina}
                          style={{ backgroundColor: '#ffffff', border: '1.5px solid #166534', color: '#166534', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                          📊 Descargar Matriz de Nómina (Excel)
                        </button>
                        <button
                          type="button"
                          onClick={loadSolicitudes}
                          style={{ backgroundColor: '#166534', border: 'none', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.82rem', cursor: 'pointer' }}
                        >
                          🔄 Refrescar Radicados
                        </button>
                      </div>
                    </div>

                    <div className="th-table-wrapper">
                      <table className="th-table">
                        <thead>
                          <tr>
                            <th>Radicado</th>
                            <th>Remitente</th>
                            <th>Cédula / Documento</th>
                            <th>Contacto (Tel / Email)</th>
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
                              <td><strong style={{ color: '#166534' }}>{item.numero_documento || '1042890123'}</strong></td>
                              <td>
                                <div style={{ fontSize: '0.78rem' }}>
                                  <span>✉ {item.correo || 'correo@ejemplo.com'}</span><br />
                                  <small style={{ color: '#64748b' }}>📞 {item.telefono || 'Sin teléfono'}</small>
                                </div>
                              </td>
                              <td>{item.tipo_solicitud}</td>
                              <td>
                                <span className={`th-status ${item.estado === 'ATENDIDA' ? 'active' : ''}`} style={{ backgroundColor: item.estado === 'EN PROCESO' ? '#fef3c7' : item.estado === 'ATENDIDA' ? '#dcfce7' : '#f1f5f9', color: item.estado === 'EN PROCESO' ? '#92400e' : item.estado === 'ATENDIDA' ? '#166534' : '#475569' }}>
                                  {item.estado || 'RECIBIDA'}
                                </span>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="th-table-action"
                                  onClick={() => abrirCasoPQRS(item)}
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

                      <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1rem', fontSize: '0.85rem' }}>
                        <p style={{ margin: '0 0 0.3rem 0' }}><strong>Remitente:</strong> {selectedSolicitud.nombre_remitente}</p>
                        <p style={{ margin: '0 0 0.3rem 0' }}><strong>Cédula / Identificación:</strong> <strong style={{ color: '#166534' }}>{selectedSolicitud.numero_documento || certDatos.documento}</strong></p>
                        <p style={{ margin: '0 0 0.3rem 0' }}><strong>Tipo de Usuario:</strong> {selectedSolicitud.tipo_remitente || 'Trabajador Activo'}</p>
                        <p style={{ margin: '0 0 0.3rem 0', color: '#166534' }}>
                          <strong>✉ Correo:</strong> {selectedSolicitud.correo || certDatos.correo || 'correo@ejemplo.com'}
                        </p>
                        <p style={{ margin: '0 0 0.4rem 0', color: '#166534' }}>
                          <strong>📞 Celular:</strong> {selectedSolicitud.telefono || certDatos.telefono || '300 000 0000'}
                        </p>
                        <p style={{ margin: '0.4rem 0 0 0', borderTop: '1px dashed #cbd5e1', paddingTop: '0.4rem' }}>
                          <strong>Requerimiento:</strong> {selectedSolicitud.descripcion}
                        </p>
                      </div>

                      <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Actualizar Estado (Sincronización Web)</label>
                      <select value={newSolicitudState} onChange={(e) => setNewSolicitudState(e.target.value)} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '1rem', fontWeight: 'bold' }}>
                        {REQUEST_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>

                      <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Respuesta Oficial de Talento Humano</label>
                      <textarea rows="4" value={solicitudResponse} onChange={(e) => setSolicitudResponse(e.target.value)} placeholder="Redacta la respuesta formal para el usuario..." style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '1rem' }} required />

                      <button type="submit" className="th-primary-button" style={{ width: '100%', fontWeight: 'bold' }}>Guardar y Sincronizar en Portal Web</button>
                      {solicitudNotice && <p style={{ color: '#166534', fontWeight: 'bold', fontSize: '0.85rem', marginTop: '0.6rem' }}>✓ {solicitudNotice}</p>}
                    </form>

                    <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '1.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', letterSpacing: '0.5px' }}>FORMATOS LABORALES</span>
                      <h4 style={{ margin: '0.2rem 0 0.8rem 0', color: '#166534', fontSize: '1.1rem' }}>Expedición de Certificado</h4>

                      <div style={{ marginBottom: '1rem', backgroundColor: '#f0fdf4', padding: '0.8rem', borderRadius: '8px', border: '1.5px solid #86efac' }}>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 'bold', color: '#166534', marginBottom: '0.3rem' }}>
                          🏢 Registro de Nómina / Colaborador Vinculado:
                        </label>
                        <select
                          value={certDatos.documento}
                          onChange={(e) => seleccionarTrabajadorManual(e.target.value)}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1.5px solid #166534', fontWeight: 'bold', fontSize: '0.82rem', backgroundColor: '#ffffff', cursor: 'pointer' }}
                        >
                          {listaMaestraEmpleados.map((emp) => (
                            <option key={emp.documento} value={emp.documento}>
                              {emp.nombre} (C.C. {emp.documento}) - {emp.cargo}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>Selecciona el Modelo:</label>
                      <select value={modeloCertificado} onChange={(e) => setModeloCertificado(e.target.value)} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '1rem', fontSize: '0.82rem', fontWeight: 'bold' }}>
                        <option value="modelo1">Modelo 1: Básico con Salario</option>
                        <option value="modelo2">Modelo 2: Básico con Funciones (Anexo DPC)</option>
                        <option value="modelo3" disabled>Modelo 3: Extrabajador (En Desarrollo / Muestra Física)</option>
                      </select>

                      <div style={{ backgroundColor: '#f8fafc', padding: '0.9rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', lineHeight: '1.6', marginBottom: '1.2rem' }}>
                        <p style={{ margin: '0 0 0.2rem 0' }}><strong>Titular:</strong> {certDatos.nombre}</p>
                        <p style={{ margin: '0 0 0.2rem 0' }}><strong>C.C.:</strong> {certDatos.documento}</p>
                        <p style={{ margin: '0 0 0.2rem 0' }}><strong>Cargo Oficial:</strong> {certDatos.cargo}</p>
                        <p style={{ margin: '0 0 0.2rem 0' }}><strong>Asignación Mensual:</strong> <strong style={{ color: '#166534' }}>{certDatos.salario}</strong></p>
                        <p style={{ margin: '0 0 0.2rem 0' }}><strong>Fecha de Vinculación:</strong> {certDatos.fechaIngreso}</p>
                        <p style={{ margin: 0, color: '#64748b' }}><strong>Firma Oficial:</strong> MARÍA ISABELA SOTO BOTERO (Gerente General)</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => triggerImpresion('certificado')}
                        style={{ width: '100%', padding: '0.85rem', backgroundColor: '#166534', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(22, 101, 52, 0.2)' }}
                      >
                        🖨️ Generar / Imprimir Certificado PDF
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
                  <input type="text" required placeholder="Ej: Mensajero" value={nuevaConvocatoria.titulo} onChange={(e) => setNuevaConvocatoria({ ...nuevaConvocatoria, titulo: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>Cargo / Rol Operativo *</label>
                  <input type="text" required placeholder="Ej: Mensajero" value={nuevaConvocatoria.cargo} onChange={(e) => setNuevaConvocatoria({ ...nuevaConvocatoria, cargo: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>Descripción de Funciones *</label>
                  <textarea rows="2" required placeholder="Entrega y radicación de correspondencia..." value={nuevaConvocatoria.descripcion} onChange={(e) => setNuevaConvocatoria({ ...nuevaConvocatoria, descripcion: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>Requisitos Mínimos Exigidos *</label>
                  <textarea rows="2" required placeholder="Bachiller con licencia A2..." value={nuevaConvocatoria.requisitos} onChange={(e) => setNuevaConvocatoria({ ...nuevaConvocatoria, requisitos: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>Asignación Salarial</label>
                    <input type="text" placeholder="Ej: $1.423.500" value={nuevaConvocatoria.salario} onChange={(e) => setNuevaConvocatoria({ ...nuevaConvocatoria, salario: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
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

        {/* MODAL HOJA DE VIDA CANDIDATO */}
        {modalHvAspirante && (
          <div className="th-modal-backdrop" onMouseDown={() => setModalHvAspirante(null)}>
            <section
              className="th-postulation-modal"
              style={{
                maxWidth: '520px',
                width: '92%',
                padding: '1.8rem',
                backgroundColor: '#143c1d',
                color: '#ffffff',
                borderRadius: '16px'
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '0.8rem' }}>
                <span style={{ backgroundColor: '#2e7d32', color: '#fff', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '800' }}>
                  DOCUMENTO DIGITAL
                </span>
                <button
                  type="button"
                  onClick={() => setModalHvAspirante(null)}
                  style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1.4rem', cursor: 'pointer', lineHeight: '1' }}
                >
                  ×
                </button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: '75px',
                    height: '75px',
                    borderRadius: '50%',
                    backgroundColor: '#2e7d32',
                    border: '3px solid #86efac',
                    margin: '0 auto 0.8rem auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 'bold'
                  }}
                >
                  {modalHvAspirante.candidato?.charAt(0) || modalHvAspirante.nombres?.charAt(0) || 'A'}
                </div>
                <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.2rem', color: '#ffffff' }}>
                  {modalHvAspirante.candidato || `${modalHvAspirante.nombres || ''} ${modalHvAspirante.apellidos || ''}`.trim() || 'Aspirante'}
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#86efac', fontWeight: 'bold' }}>
                  Vacante: {modalHvAspirante.convocatoria || modalHvAspirante.cargo || 'General'}
                </span>
              </div>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '10px', fontSize: '0.82rem', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.2rem' }}>
                <p style={{ margin: '0 0 0.4rem 0' }}><strong>C.C.:</strong> {modalHvAspirante.numero_documento || '1046701221'}</p>
                <p style={{ margin: '0 0 0.4rem 0' }}><strong>Email:</strong> {modalHvAspirante.correo || 'aspirante@gmail.com'}</p>
                <p style={{ margin: '0 0 0.4rem 0' }}><strong>Teléfono:</strong> {modalHvAspirante.telefono || '300 123 4567'}</p>
                <p style={{ margin: '0 0 0.4rem 0' }}><strong>Ciudad:</strong> {modalHvAspirante.ciudad || 'Sabanagrande, Atlántico'}</p>
                <p style={{ margin: 0 }}><strong>Archivo Soporte:</strong> <code style={{ color: '#fed7aa' }}>{modalHvAspirante.hoja_vida || modalHvAspirante.hoja_vida_nombre || 'HV_Aspirante.pdf'}</code></p>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', flexDirection: 'column' }}>
                <button
                  type="button"
                  onClick={() => descargarHojaDeVida(modalHvAspirante)}
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#166534',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  📥 Descargar Soporte de Hoja de Vida
                </button>

                {modalHvAspirante.estado !== 'CONTRATADO' && (
                  <button
                    type="button"
                    onClick={() => {
                      const asp = modalHvAspirante;
                      setModalHvAspirante(null);
                      setSelectedPostulation(asp);
                    }}
                    style={{
                      backgroundColor: '#2e7d32',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Proceder a Calificar con Matriz Ponderada ➔
                  </button>
                )}
              </div>
            </section>
          </div>
        )}

        {/* MODAL MATRIZ DE EVALUACIÓN OFICIAL */}
        {selectedPostulation && (
          <div className="th-modal-backdrop" onMouseDown={() => setSelectedPostulation(null)}>
            <section className="th-postulation-modal" style={{ maxWidth: '640px', width: '92%' }} onMouseDown={(e) => e.stopPropagation()}>
              <div className="th-modal-header">
                <div>
                  <span className="th-label">EVALUACIÓN TÉCNICA OFICIAL</span>
                  <h3 style={{ margin: '0.2rem 0' }}>Matriz de Calificación Ponderada</h3>
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 'bold' }}>
                    <span>1. Prueba técnica y de conocimiento (30%)</span>
                    <span style={{ color: '#166534' }}>{puntajeTecnico} pts</span>
                  </div>
                  <input type="range" min="0" max="100" value={puntajeTecnico} onChange={(e) => setPuntajeTecnico(e.target.value)} style={{ width: '100%', accentColor: '#166534' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 'bold' }}>
                    <span>2. Pruebas psicológicas (15%)</span>
                    <span style={{ color: '#166534' }}>{puntajePsicologico} pts</span>
                  </div>
                  <input type="range" min="0" max="100" value={puntajePsicologico} onChange={(e) => setPuntajePsicologico(e.target.value)} style={{ width: '100%', accentColor: '#166534' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 'bold' }}>
                    <span>3. Entrevista por competencias (30%)</span>
                    <span style={{ color: '#166534' }}>{puntajeEntrevista} pts</span>
                  </div>
                  <input type="range" min="0" max="100" value={puntajeEntrevista} onChange={(e) => setPuntajeEntrevista(e.target.value)} style={{ width: '100%', accentColor: '#166534' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 'bold' }}>
                    <span>4. Verificación de hoja de vida (15%)</span>
                    <span style={{ color: '#166534' }}>{puntajeHv} pts</span>
                  </div>
                  <input type="range" min="0" max="100" value={puntajeHv} onChange={(e) => setPuntajeHv(e.target.value)} style={{ width: '100%', accentColor: '#166534' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 'bold' }}>
                    <span>5. Exámenes médicos ocupacionales de ingreso (10%)</span>
                    <span style={{ color: '#166534' }}>{puntajeMedicos} pts</span>
                  </div>
                  <input type="range" min="0" max="100" value={puntajeMedicos} onChange={(e) => setPuntajeMedicos(e.target.value)} style={{ width: '100%', accentColor: '#166534' }} />
                </div>
              </div>

              <div style={{ backgroundColor: notaCalculada >= 80 ? '#dcfce7' : notaCalculada >= 75 ? '#fef3c7' : '#fee2e2', padding: '0.9rem', borderRadius: '8px', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1.5px solid ${notaCalculada >= 80 ? '#86efac' : notaCalculada >= 75 ? '#fde047' : '#fecaca'}` }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>CALIFICACIÓN PONDERADA TOTAL</span>
                  <strong style={{ fontSize: '1.25rem', color: notaCalculada >= 80 ? '#166534' : notaCalculada >= 75 ? '#92400e' : '#991b1b' }}>{notaCalculada} / 100</strong>
                </div>
                <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: notaCalculada >= 80 ? '#166534' : notaCalculada >= 75 ? '#92400e' : '#991b1b' }}>
                  {notaCalculada >= 80 ? '✓ APTO PARA ELEGIBILIDAD' : notaCalculada >= 75 ? '⚡ PRESELECCIONADO(A) RESERVA' : '✕ NO SELECCIONADO(A)'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedPostulation(null)}
                  style={{ flex: 1, padding: '0.75rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Cerrar
                </button>

                {notaCalculada >= 75 && (
                  <button
                    type="button"
                    onClick={() => vincularCandidato(selectedPostulation)}
                    style={{ flex: 2, padding: '0.75rem', backgroundColor: '#166534', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    🤝 Contratar y Vincular a Nómina / CCD ➔
                  </button>
                )}
              </div>
            </section>
          </div>
        )}

        {/* MODAL VISOR CCD (ACTUALIZADO A EXPEDIENTE LABORAL Y DOCUMENTO CODIFICADO) */}
        {visorDoc && (
          <div className="th-modal-backdrop" onMouseDown={() => setVisorDoc(null)}>
            <section className="th-postulation-modal" style={{ maxWidth: '620px', width: '92%' }} onMouseDown={(e) => e.stopPropagation()}>
              <div className="th-modal-header">
                <div>
                  <span className="th-label">SOPORTE DE ARCHIVO CENTRAL (AGN)</span>
                  <h3 style={{ margin: '0.2rem 0' }}>Expediente Laboral Digital</h3>
                </div>
                <button type="button" className="th-modal-close" onClick={() => setVisorDoc(null)}>×</button>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '1.4rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', marginTop: '1rem', fontSize: '0.85rem' }}>
                <div style={{ borderBottom: '2px solid #166534', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                  <strong style={{ color: '#166534', fontSize: '1rem' }}>FRUTAS DEL ATLÁNTICO S.A.S.</strong>
                  <span style={{ display: 'block', color: '#64748b', fontSize: '0.75rem' }}>
                    Sistema de Gestión Documental y Archivo Central (Serie 100.10.18)
                  </span>
                </div>
                <p style={{ margin: '0 0 0.4rem 0' }}>
                  <strong>Nomenclatura AGN:</strong><br />
                  <code style={{ backgroundColor: '#e2e8f0', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.82rem' }}>
                    {visorDoc.nombre_original}
                  </code>
                </p>
                <p style={{ margin: '0 0 0.4rem 0' }}><strong>Subserie / Clasificación:</strong> {visorDoc.tipo_documento}</p>
                <p style={{ margin: '0 0 0.4rem 0' }}><strong>Fecha de Radicación:</strong> {new Date(visorDoc.fecha_carga).toLocaleDateString('es-CO')}</p>
                <p style={{ margin: '0 0 0.4rem 0' }}><strong>Titular:</strong> {selectedExpediente?.nombre || 'Colaborador'}</p>
                <p style={{ margin: 0, color: '#166534', fontWeight: 'bold' }}>
                  ✓ Estado: Documento indexado y custodiado en el expediente digital del colaborador.
                </p>
              </div>

              {/* TÉRMINO EXACTO EXIGIDO: "DESCARGAR COPIA DEL DOCUMENTO CODIFICADO (PDF)" */}
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem' }}>
                <button
                  type="button"
                  onClick={() => descargarDocumentoCodificado(visorDoc)}
                  style={{ flex: 1, padding: '0.75rem', backgroundColor: '#166534', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  📥 Descargar Copia del Documento Codificado (PDF)
                </button>
                <button type="button" onClick={() => setVisorDoc(null)} style={{ padding: '0.75rem 1.2rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Cerrar
                </button>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* ÁREA OFICIAL DE IMPRESIÓN DEL CERTIFICADO LABORAL */}
      <div className="print-document-area">
        {imprimirTipo === 'certificado' && certDatos && (
          <div style={{ padding: '20mm 20mm', fontFamily: 'Arial, sans-serif', color: '#000000', lineHeight: '1.6' }}>
            <div style={{ borderBottom: '2px solid #2e7d32', paddingBottom: '12px', marginBottom: '35px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '13pt', fontWeight: 'bold', color: '#166534' }}>Frutas Del Atlántico S.A.S.</div>
                <div style={{ fontSize: '9pt', color: '#64748b' }}>FRUTOPICAL · NIT: 900.999.999-1</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '8.5pt', color: '#475569' }}>
                Carrera 2A 20-35, Sabanagrande – Atlántico<br />
                frutopical.sas25@gmail.com · 3246064388
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '11pt', fontWeight: 'bold', margin: '30px 0 25px 0' }}>
              La suscrita Gerente General de FRUTOPICAL S.A.S
            </div>

            <div style={{ textAlign: 'center', fontSize: '12pt', fontWeight: 'bold', marginBottom: '30px', letterSpacing: '1px' }}>
              CERTIFICA QUE:
            </div>

            {/* MODELO 1: BÁSICO CON SALARIO */}
            {modeloCertificado === 'modelo1' && (
              <>
                <p style={{ fontSize: '11pt', textAlign: 'justify', textIndent: '25px', marginBottom: '20px' }}>
                  Que el(a) señor(a) <strong>{certDatos.nombre.toUpperCase()}</strong>, identificado(a) con cédula de ciudadanía No. <strong>{certDatos.documento}</strong>, labora en nuestra organización desde el <strong>{certDatos.fechaIngreso}</strong>, desempeñando el cargo de <strong>{certDatos.cargo}</strong> bajo un contrato de trabajo a <strong>{certDatos.tipoContrato || 'Término Indefinido'}</strong>.
                </p>

                <p style={{ fontSize: '11pt', textAlign: 'justify', textIndent: '25px', marginBottom: '25px' }}>
                  A la fecha, el(a) colaborador(a) devenga un salario mensual bruto de <strong>{certDatos.salarioLetras || certDatos.salario} PESOS P/COL ({certDatos.salario})</strong>.
                </p>
              </>
            )}

            {/* MODELO 2: BÁSICO CON FUNCIONES */}
            {modeloCertificado === 'modelo2' && (
              <p style={{ fontSize: '11pt', textAlign: 'justify', textIndent: '25px', marginBottom: '25px' }}>
                Que el(a) señor(a) <strong>{certDatos.nombre.toUpperCase()}</strong>, identificado(a) con cédula de ciudadanía No. <strong>{certDatos.documento}</strong>, labora en nuestra organización desde el <strong>{certDatos.fechaIngreso}</strong>, bajo un contrato de trabajo a <strong>{certDatos.tipoContrato || 'Término Indefinido'}</strong>, desempeñando el cargo de <strong>{certDatos.cargo}</strong>, cumpliendo las siguientes funciones indicadas en el anexo <strong>DESCRIPCIÓN DE PERFIL DE CARGO</strong>.
              </p>
            )}

            <p style={{ fontSize: '11pt', textAlign: 'justify', textIndent: '25px', marginBottom: '45px' }}>
              Se expide la presente certificación a solicitud de la parte interesada en el municipio de Sabanagrande a los <strong>{diaLetras} ({diaNumero})</strong> días del mes de <strong>{mesNombre}</strong> del año <strong>{anioNumero}</strong>.
            </p>

            <p style={{ fontSize: '11pt', marginBottom: '60px' }}>
              Cordialmente,
            </p>

            <div>
              <div style={{ width: '240px', borderTop: '1.5px solid #000000', marginBottom: '6px' }}></div>
              <strong style={{ fontSize: '11pt', display: 'block' }}>MARIA ISABELA SOTO BOTERO</strong>
              <span style={{ fontSize: '10pt', color: '#334155' }}>Gerente General</span><br />
              <span style={{ fontSize: '9pt', color: '#64748b' }}>FRUTOPICAL S.A.S.</span>
            </div>

            <div style={{ position: 'fixed', bottom: '15mm', left: '20mm', right: '20mm', borderTop: '1px solid #cbd5e1', paddingTop: '8px', fontSize: '8pt', color: '#64748b', textAlign: 'center' }}>
              Dirección: Carrera 2A 20-35, Sabanagrande – Atlántico | Correo Electrónico: frutopical.sas25@gmail.com | Teléfono de Contacto: 3246064388
            </div>
          </div>
        )}
      </div>
    </>
  );
}