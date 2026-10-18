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
    funciones: [
      'Ejecución de actividades operativas de recepción, lavado, despulpado y pasteurización de frutas tropicales.',
      'Cumplimiento estricto del Manual de Buenas Prácticas de Manufactura (BPM) e Inocuidad.',
      'Operación y sanitización de maquinaria de envasado y sellado al vacío.',
      'Verificación y control de estándares del SG-SST bajo Resolución 2400 de 1979.'
    ]
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
    funciones: [
      'Planificación, implementación y aseguramiento del Sistema de Gestión de Calidad e Inocuidad.',
      'Supervisión y auditoría interna de Buenas Prácticas de Manufactura (BPM) y sistema HACCP.',
      'Control analítico de materias primas, mermas, acidez y grados Brix en pulpas congeladas.',
      'Capacitación continua al personal de planta en estándares sanitarios y normatividad vigente.'
    ]
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
    funciones: [
      'Planificación, programación y supervisión de las líneas de producción de pulpas y jugos.',
      'Control de rendimientos, balance de materia prima y eficiencia técnica de maquinaria.',
      'Coordinación de los turnos de trabajo del personal operativo de planta.',
      'Garantía de cumplimiento de las metas de producción conforme a las órdenes de despacho.'
    ]
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
    funciones: [
      'Dirección y coordinación de los procesos de selección, contratación e inducción del personal.',
      'Administración de historias laborales conforme a las Series CCD 100 y 200 del AGN.',
      'Gestión de novedades de nómina, seguridad social integral y bienestar laboral.',
      'Atención, trámite y resolución de peticiones, quejas y reclamos (PQRS) bajo Ley 1755.'
    ]
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
    funciones: [
      'Apoyo en la gestión documental y foliación de expedientes de personal.',
      'Verificación de listas de chequeo de ingreso, afiliaciones al SGSSS y dotación.',
      'Atención de solicitudes de certificados laborales y desprendibles de pago.',
      'Consolidación de reportes de ausentismo y matriz de capacitación continua.'
    ]
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
    funciones: [
      'Recepción y despacho de pedidos de pulpas para clientes del canal institucional.',
      'Control de inventario de producto terminado en cuartos fríos y almacenamiento.',
      'Radicación de facturas y archivo de remisiones de transporte.',
      'Soporte administrativo en compras de insumos operativos y empaques.'
    ]
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
    funciones: [
      'Supervisión de la línea de despulpado y verificación de temperaturas en cuartos fríos.',
      'Control de entrega de elementos de protección personal (EPP) bajo Res. 2400.',
      'Seguimiento a los cronogramas de mantenimiento preventivo de maquinaria.',
      'Coordinación de despacho con conductores y logística de distribución refrigerada.'
    ]
  }
];

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
  
  // Matriz Ponderada Oficial: 30% Técnica, 15% Psicológica, 30% Entrevista, 15% HV, 10% Médicos
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

  // Expedientes CCD
  const [expedientes, setExpedientes] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [selectedExpediente, setSelectedExpediente] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [selectedCcd, setSelectedCcd] = useState(CCD_SERIES[0].codigo);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadNotice, setUploadNotice] = useState('');
  const [visorDoc, setVisorDoc] = useState(null);

  // PQRS y Certificaciones
  const [solicitudes, setSolicitudes] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [newSolicitudState, setNewSolicitudState] = useState('RECIBIDA');
  const [solicitudResponse, setSolicitudResponse] = useState('');
  const [modeloCertificado, setModeloCertificado] = useState('modelo1');
  const [solicitudNotice, setSolicitudNotice] = useState('');

  // DATOS DINÁMICOS DEL CERTIFICADO LABORAL (CARGADOS DE LA BASE DE DATOS MAESTRA)
  const [certDatos, setCertDatos] = useState(BASE_DATOS_TRABAJADORES[0]);

  useEffect(() => {
    loadConvocatorias();
    loadExpedientes();
    loadPostulaciones();
    loadSolicitudes();
    sincronizarBaseTrabajadores();
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

  // DESCARGA DE LA BASE DE DATOS MAESTRA EN FORMATO CSV COMPATIBLE CON EXCEL
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
          const combinadas = [...parsed];
          base.forEach(b => {
            if (!combinadas.some(c => String(c.numero_documento) === String(b.numero_documento))) {
              combinadas.push(b);
            }
          });
          setPostulaciones(combinadas);
          return;
        }
      } catch {}
    }

    setPostulaciones(base);
    localStorage.setItem('frutopical_postulaciones', JSON.stringify(base));
  }

  function loadExpedientes() {
    const stored = localStorage.getItem('frutopical_expedientes');
    const base = [
      { id_expediente: 1, nombres: 'Carlos', apellidos: 'Fontalvo Amaya', tipo_documento: 'CC', numero_documento: '1042890123', cargo: 'Operario de Planta', estado: 'ACTIVO' },
      { id_expediente: 2, nombres: 'María', apellidos: 'Conrado Jiménez', tipo_documento: 'CC', numero_documento: '1043567890', cargo: 'Auxiliar de Calidad', estado: 'ACTIVO' }
    ];

    const post = JSON.parse(localStorage.getItem('frutopical_postulaciones') || '[]');
    let actualizados = stored ? JSON.parse(stored) : base;

    post.filter(p => p.estado === 'CONTRATADO').forEach(p => {
      const doc = p.numero_documento || '10234532121';
      if (!actualizados.some(e => String(e.numero_documento) === String(doc))) {
        const nom = p.candidato || `${p.nombres || ''} ${p.apellidos || ''}`.trim() || 'Colaborador';
        const partes = nom.split(' ');
        actualizados.unshift({
          id_expediente: p.id_postulacion || Date.now(),
          nombres: partes[0] || nom,
          apellidos: partes.slice(1).join(' ') || '',
          tipo_documento: 'CC',
          numero_documento: doc,
          cargo: p.convocatoria || p.cargo || 'Operario de Producción',
          estado: 'ACTIVO'
        });
      }
    });

    setExpedientes(actualizados);
    localStorage.setItem('frutopical_expedientes', JSON.stringify(actualizados));
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

    const contenidoPdfSimulado = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n` +
      `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n` +
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n` +
      `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n` +
      `5 0 obj\n<< /Length 140 >>\nstream\n` +
      `BT\n/F1 16 Tf\n50 720 Td\n(FRUTOPICAL S.A.S. - HOJA DE VIDA INSTITUCIONAL) Tj\n` +
      `/F1 12 Tf\n50 680 Td\n(Aspirante: ${nombreCompleto}) Tj\n` +
      `50 655 Td\n(Documento: ${candidato.numero_documento || '1042890123'}) Tj\n` +
      `50 630 Td\n(Convocatoria: ${candidato.convocatoria || candidato.cargo || 'General'}) Tj\n` +
      `50 605 Td\n(Correo: ${candidato.correo || 'aspirante@gmail.com'}) Tj\n` +
      `50 580 Td\n(Telefono: ${candidato.telefono || '300 123 4567'}) Tj\n` +
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

  function descargarDocumentoCcd(doc) {
    const contenidoPdf = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n` +
      `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n` +
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n` +
      `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n` +
      `5 0 obj\n<< /Length 150 >>\nstream\n` +
      `BT\n/F1 14 Tf\n50 720 Td\n(FRUTOPICAL S.A.S. - ARCHIVO CENTRAL CCD) Tj\n` +
      `/F1 11 Tf\n50 680 Td\n(Expediente: ${doc.nombre_original}) Tj\n` +
      `50 655 Td\n(Clasificacion AGN: ${doc.tipo_documento}) Tj\n` +
      `50 630 Td\n(Fecha de Radicacion: ${new Date(doc.fecha_carga).toLocaleDateString('es-CO')}) Tj\n` +
      `50 605 Td\n(Estado: Custodiado en Historia Laboral) Tj\n` +
      `ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000234 00000 n \n0000000291 00000 n \n` +
      `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n%%EOF`;

    const blob = new Blob([contenidoPdf], { type: 'application/pdf;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.nombre_original.endsWith('.pdf') ? doc.nombre_original : `${doc.nombre_original}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // AL VINCULAR UN CANDIDATO, SE GUARDA EN LA BASE DE DATOS MAESTRA DE NÓMINA
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
      funciones: [
        `Ejecución cabal de responsabilidades conforme al manual DPC del cargo ${cargo}.`,
        'Cumplimiento de estándares de Buenas Prácticas de Manufactura (BPM) e Inocuidad.',
        'Aplicación estricta de lineamientos del SG-SST institucional.'
      ]
    };

    const emps = getListaEmpleados();
    if (!emps.some(e => String(e.documento) === String(doc))) {
      emps.unshift(nuevoColaborador);
      localStorage.setItem('frutopical_empleados', JSON.stringify(emps));
    }

    const exps = JSON.parse(localStorage.getItem('frutopical_expedientes') || '[]');
    if (!exps.some(e => String(e.numero_documento) === String(doc))) {
      const partes = nombreCompleto.split(' ');
      exps.unshift({
        id_expediente: Date.now(),
        nombres: partes[0] || nombreCompleto,
        apellidos: partes.slice(1).join(' ') || '',
        tipo_documento: 'CC',
        numero_documento: doc,
        cargo: cargo,
        estado: 'ACTIVO'
      });
      localStorage.setItem('frutopical_expedientes', JSON.stringify(exps));
      setExpedientes(exps);
    }

    const actualizadosPost = postulaciones.map(p =>
      (p.id_postulacion === candidatoAprobado.id_postulacion || String(p.numero_documento) === String(doc))
        ? { ...p, estado: 'CONTRATADO' }
        : p
    );
    setPostulaciones(actualizadosPost);
    localStorage.setItem('frutopical_postulaciones', JSON.stringify(actualizadosPost));

    alert(`¡Candidato ${nombreCompleto} vinculado exitosamente a Nómina, SST y Archivo Central CCD!`);
    setSelectedPostulation(null);
    setVistaPreviaActa(false);
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

  // ATENCIÓN DE PQRS: CRUCE AUTOMÁTICO INMEDIATO CON LA BASE DE DATOS MAESTRA
  function abrirCasoPQRS(item) {
    setSelectedSolicitud(item);
    setNewSolicitudState(item.estado || 'RECIBIDA');
    setSolicitudResponse(item.respuesta_observacion || '');

    const emps = getListaEmpleados();
    const docBuscado = (item.numero_documento || '').replace(/\D/g, '');
    const nombreLimpio = (item.nombre_remitente || '').toLowerCase();

    // 1. Cruce por cédula (llave primaria)
    let encontrado = emps.find(e => docBuscado && String(e.documento).replace(/\D/g, '') === docBuscado);

    // 2. Cruce por nombre
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
        estadoLaboral: item.tipo_remitente === 'EXTRABAJADOR' ? 'EXTRABAJADOR' : 'ACTIVO',
        funciones: [
          'Ejecución cabal de actividades operativas e institucionales conforme al área asignada.',
          'Cumplimiento estricto del Manual de Buenas Prácticas de Manufactura (BPM) e Inocuidad.',
          'Verificación de los estándares del Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST).'
        ]
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
    }
    if (module === 'solicitudes') {
      setSelectedSolicitud(null);
      loadSolicitudes();
    }
  }

  const fechaHoy = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
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
                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Cuadro de clasificación series 100/200 e historias laborales.</p>
                      </div>
                    </button>

                    <button type="button" onClick={() => changeModule('solicitudes')} style={{ textAlign: 'left', padding: '1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', display: 'flex', gap: '0.8rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>💬</span>
                      <div>
                        <strong style={{ color: '#7e22ce', fontSize: '0.95rem', display: 'block' }}>5. Atención al Cliente (PQRS)</strong>
                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Trámite de radicados y expedición de los 3 certificados.</p>
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
                          placeholder="Ej: Acta de Entrega de Carné Institucional"
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
                          setUploadNotice('Documento archivado exitosamente en historia laboral.');
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
                              <td style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                  type="button"
                                  onClick={() => setVisorDoc(doc)}
                                  style={{ padding: '0.3rem 0.6rem', backgroundColor: '#f0fdf4', border: '1px solid #86efac', color: '#166534', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                  👁️ Ver Ficha
                                </button>
                                <button
                                  type="button"
                                  onClick={() => descargarDocumentoCcd(doc)}
                                  style={{ padding: '0.3rem 0.6rem', backgroundColor: '#166534', border: 'none', color: '#ffffff', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                  📥 Descargar PDF
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
                    <div className="th-page-intro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <span className="th-label">EQUIPO 5 · SERVICIO AL CLIENTE INTERNO</span>
                        <h2>Gestión de PQRS y Certificaciones Laborales</h2>
                        <p>Atiende radicados y genera certificados con cruce automático de nómina e historial contractual.</p>
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

                      {/* DATOS DE CONTACTO Y VINCULACIÓN */}
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

                    {/* EXPEDICIÓN DE CERTIFICADO CON CRUCE DE NÓMINA */}
                    <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '1.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', letterSpacing: '0.5px' }}>FORMATOS LABORALES</span>
                      <h4 style={{ margin: '0.2rem 0 0.8rem 0', color: '#166534', fontSize: '1.1rem' }}>Expedición de Certificado</h4>

                      {/* SELECTOR MAESTRO DE COLABORADOR EN LA BASE DE DATOS */}
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
                        <option value="modelo1">Modelo 1: Básico con Salario y Cargo</option>
                        <option value="modelo2">Modelo 2: Con Funciones Detalladas (DPC)</option>
                        <option value="modelo3">Modelo 3: Certificado para Extrabajador (Inactivo)</option>
                      </select>

                      {/* RESUMEN DE DATOS AUTOMÁTICOS DEL CERTIFICADO */}
                      <div style={{ backgroundColor: '#f8fafc', padding: '0.9rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', lineHeight: '1.6', marginBottom: '1.2rem' }}>
                        <p style={{ margin: '0 0 0.2rem 0' }}><strong>Titular:</strong> {certDatos.nombre}</p>
                        <p style={{ margin: '0 0 0.2rem 0' }}><strong>C.C.:</strong> {certDatos.documento}</p>
                        <p style={{ margin: '0 0 0.2rem 0' }}><strong>Cargo Oficial:</strong> {certDatos.cargo}</p>
                        <p style={{ margin: '0 0 0.2rem 0' }}><strong>Asignación Mensual:</strong> <strong style={{ color: '#166534' }}>{certDatos.salario}</strong></p>
                        <p style={{ margin: '0 0 0.2rem 0' }}><strong>Fecha de Vinculación:</strong> {certDatos.fechaIngreso}</p>
                        {modeloCertificado === 'modelo3' && (
                          <p style={{ margin: 0, color: '#c2410c' }}><strong>Fecha de Retiro:</strong> {certDatos.fechaRetiro}</p>
                        )}
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
                      gap: '0.4rem'
                    }}
                  >
                    📥 Descargar Soporte
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalHvAspirante(null)}
                    style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1.4rem', cursor: 'pointer', padding: '0 0.4rem', lineHeight: '1' }}
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
                  minHeight: '480px'
                }}
              >
                <div style={{ backgroundColor: '#143c1d', color: '#ffffff', padding: '2rem 1.4rem' }}>
                  <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
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
                      {modalHvAspirante.candidato?.charAt(0) || modalHvAspirante.nombres?.charAt(0) || 'C'}
                    </div>
                    <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.1rem', color: '#ffffff', lineHeight: '1.2' }}>
                      {modalHvAspirante.candidato || `${modalHvAspirante.nombres || ''} ${modalHvAspirante.apellidos || ''}`.trim() || 'Aspirante'}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: '#86efac', fontWeight: 'bold' }}>
                      {modalHvAspirante.convocatoria || modalHvAspirante.cargo || 'Operario de Producción'}
                    </span>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.2rem', fontSize: '0.78rem' }}>
                    <p style={{ margin: '0 0 0.4rem 0', color: '#e2e8f0' }}><strong>C.C.:</strong> {modalHvAspirante.numero_documento || '1042890123'}</p>
                    <p style={{ margin: '0 0 0.4rem 0', color: '#e2e8f0' }}><strong>Email:</strong> {modalHvAspirante.correo || 'aspirante@gmail.com'}</p>
                    <p style={{ margin: '0 0 0.4rem 0', color: '#e2e8f0' }}><strong>Tel:</strong> {modalHvAspirante.telefono || '300 123 4567'}</p>
                    <p style={{ margin: 0, color: '#e2e8f0' }}><strong>Ciudad:</strong> {modalHvAspirante.ciudad || 'Sabanagrande, Atlántico'}</p>
                  </div>
                </div>

                <div style={{ padding: '2rem', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.8rem', marginBottom: '1.4rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#166534', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        CURRICULUM VITAE INSTITUCIONAL
                      </span>
                      <h4 style={{ margin: '0.1rem 0 0 0', color: '#0f172a', fontSize: '1.1rem' }}>
                        Perfil Ocupacional y Competencias
                      </h4>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.6', margin: '0 0 1rem 0' }}>
                      Técnico con formación integral y experiencia práctica en procesos agroindustriales, aplicación de Buenas Prácticas de Manufactura (BPM), normas de inocuidad alimentaria y prevención de riesgos laborales bajo el SG-SST de Frutopical S.A.S.
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.8rem', fontSize: '0.75rem', color: '#64748b' }}>
                    <span>Habeas Data validado conforme a la Ley 1581 de 2012</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.2rem', display: 'flex', gap: '0.8rem' }}>
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

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => triggerImpresion('acta')}
                  style={{ flex: '1 1 180px', padding: '0.75rem', backgroundColor: '#ffffff', border: '1.5px solid #166534', color: '#166534', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  🖨️ Imprimir Acta Formal (PDF)
                </button>

                {notaCalculada >= 75 && (
                  <button
                    type="button"
                    onClick={() => vincularCandidato(selectedPostulation)}
                    style={{ flex: '1 1 240px', padding: '0.75rem', backgroundColor: '#166534', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    🤝 Contratar y Vincular a Nómina / CCD ➔
                  </button>
                )}
              </div>
            </section>
          </div>
        )}

        {/* MODAL VISOR CCD */}
        {visorDoc && (
          <div className="th-modal-backdrop" onMouseDown={() => setVisorDoc(null)}>
            <section className="th-postulation-modal" style={{ maxWidth: '580px', width: '92%' }} onMouseDown={(e) => e.stopPropagation()}>
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
                  <span style={{ display: 'block', color: '#64748b', fontSize: '0.75rem' }}>Sistema de Gestión Documental y Archivo Central</span>
                </div>
                <p style={{ margin: '0 0 0.4rem 0' }}><strong>Nomenclatura AGN:</strong><br /><code style={{ backgroundColor: '#e2e8f0', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{visorDoc.nombre_original}</code></p>
                <p style={{ margin: '0 0 0.4rem 0' }}><strong>Subserie / Clasificación:</strong> {visorDoc.tipo_documento}</p>
                <p style={{ margin: '0 0 0.4rem 0' }}><strong>Fecha de Radicación:</strong> {new Date(visorDoc.fecha_carga).toLocaleDateString('es-CO')}</p>
                <p style={{ margin: 0, color: '#166534', fontWeight: 'bold' }}>✓ Estado: Documento indexado y custodiado en el expediente digital del colaborador.</p>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem' }}>
                <button
                  type="button"
                  onClick={() => descargarDocumentoCcd(visorDoc)}
                  style={{ flex: 1, padding: '0.75rem', backgroundColor: '#166534', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  📥 Descargar Copia del Documento Foliado (PDF)
                </button>
                <button type="button" onClick={() => setVisorDoc(null)} style={{ padding: '0.75rem 1.2rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Cerrar
                </button>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* ÁREA OFICIAL DE IMPRESIÓN (MEMBRETE BLANCO FORMAL) */}
      <div className="print-document-area">
        {imprimirTipo === 'acta' && selectedPostulation && (
          <div style={{ padding: '10mm 15mm' }}>
            <div style={{ borderBottom: '3px solid #166534', paddingBottom: '10px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '18pt', color: '#166534' }}>FRUTAS DEL ATLÁNTICO S.A.S.</strong>
                <div style={{ fontSize: '9pt', color: '#475569' }}>NIT: 900.999.999-1 · Carrera 2A 20-35, Sabanagrande - Atlántico</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '9.5pt', fontWeight: 'bold', color: '#166534' }}>
                GESTIÓN DEL TALENTO HUMANO<br />SELECCIÓN TÉCNICA POR COMPETENCIAS
              </div>
            </div>

            <h2 style={{ textAlign: 'center', fontSize: '14pt', margin: '20px 0', textTransform: 'uppercase' }}>
              ACTA FORMAL DE VALORACIÓN PONDERADA DE CANDIDATO
            </h2>

            <div style={{ fontSize: '10pt', lineHeight: '1.7', marginBottom: '20px' }}>
              <p style={{ margin: '0 0 5px 0' }}><strong>Aspirante:</strong> {selectedPostulation.candidato || selectedPostulation.nombres}</p>
              <p style={{ margin: '0 0 5px 0' }}><strong>Cédula de Ciudadanía:</strong> {selectedPostulation.numero_documento || '1042890123'}</p>
              <p style={{ margin: '0 0 5px 0' }}><strong>Convocatoria / Cargo:</strong> {selectedPostulation.convocatoria || 'General'}</p>
              <p style={{ margin: 0 }}><strong>Fecha de Evaluación:</strong> {fechaHoy}</p>
            </div>

            <table className="print-clean-table">
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ textAlign: 'left' }}>Criterio de Selección por Competencias</th>
                  <th style={{ textAlign: 'center', width: '90px' }}>Ponderación</th>
                  <th style={{ textAlign: 'center', width: '100px' }}>Puntaje Obtenido</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1. Prueba técnica y de conocimiento</td><td style={{ textAlign: 'center' }}>30%</td><td style={{ textAlign: 'center' }}>{puntajeTecnico} / 100</td></tr>
                <tr><td>2. Pruebas psicológicas</td><td style={{ textAlign: 'center' }}>15%</td><td style={{ textAlign: 'center' }}>{puntajePsicologico} / 100</td></tr>
                <tr><td>3. Entrevista por competencias</td><td style={{ textAlign: 'center' }}>30%</td><td style={{ textAlign: 'center' }}>{puntajeEntrevista} / 100</td></tr>
                <tr><td>4. Verificación de hoja de vida</td><td style={{ textAlign: 'center' }}>15%</td><td style={{ textAlign: 'center' }}>{puntajeHv} / 100</td></tr>
                <tr><td>5. Exámenes médicos ocupacionales de ingreso</td><td style={{ textAlign: 'center' }}>10%</td><td style={{ textAlign: 'center' }}>{puntajeMedicos} / 100</td></tr>
                <tr style={{ fontWeight: 'bold', background: '#f8fafc' }}>
                  <td style={{ textAlign: 'right' }}>TOTAL PONDERADO:</td>
                  <td style={{ textAlign: 'center' }}>100%</td>
                  <td style={{ textAlign: 'center', color: '#166534', fontSize: '12pt' }}>{notaCalculada} / 100</td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: '20px', padding: '12px', border: '1.5px solid #0f172a', borderRadius: '6px', fontSize: '10pt' }}>
              <strong>DICTAMEN INSTITUCIONAL: </strong>
              <span>{notaCalculada >= 80 ? 'APTO PARA ELEGIBILIDAD Y CONTRATACIÓN INMEDIATA' : notaCalculada >= 75 ? 'PRESELECCIONADO(A) EN BANCO DE RESERVA' : 'NO SELECCIONADO(A)'}</span>
            </div>

            <div style={{ marginTop: '70px', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <div>
                <div style={{ width: '220px', borderTop: '1.5px solid #0f172a', margin: '0 auto 6px auto' }}></div>
                <strong style={{ fontSize: '10pt' }}>Jefe de Talento Humano</strong><br />
                <span style={{ fontSize: '9pt', color: '#475569' }}>Responsable de Selección Técnica</span>
              </div>
              <div>
                <div style={{ width: '220px', borderTop: '1.5px solid #0f172a', margin: '0 auto 6px auto' }}></div>
                <strong style={{ fontSize: '10pt' }}>Representante Legal / Gerencia</strong><br />
                <span style={{ fontSize: '9pt', color: '#475569' }}>Frutas Del Atlántico S.A.S.</span>
              </div>
            </div>
          </div>
        )}

        {/* CERTIFICADOS LABORALES: DILIGENCIADOS 100% AUTOMÁTICOS DESDE LA NÓMINA */}
        {imprimirTipo === 'certificado' && certDatos && (
          <div style={{ padding: '15mm 20mm', fontFamily: 'serif' }}>
            <div style={{ borderBottom: '3px solid #166534', paddingBottom: '12px', marginBottom: '35px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '18pt', fontWeight: '900', color: '#166534', fontFamily: 'Arial, sans-serif' }}>FRUTAS DEL ATLÁNTICO S.A.S.</div>
                <div style={{ fontSize: '9pt', color: '#64748b', fontFamily: 'Arial, sans-serif' }}>NIT: 900.999.999-1 · Sabanagrande, Atlántico</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '9pt', fontWeight: 'bold', color: '#166534', fontFamily: 'Arial, sans-serif' }}>
                GESTIÓN DEL TALENTO HUMANO<br />CANAL OFICIAL DE PQRS
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '14pt', fontWeight: '800', margin: '40px 0 30px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
              LA SUSCRITA REPRESENTANTE LEGAL DE FRUTAS DEL ATLÁNTICO S.A.S.
            </div>

            <div style={{ textAlign: 'center', fontSize: '13pt', fontWeight: 'bold', marginBottom: '30px' }}>
              CERTIFICA:
            </div>

            {/* MODELO 1: BÁSICO CON SALARIO Y CARGO CRUZADO */}
            {modeloCertificado === 'modelo1' && (
              <p style={{ fontSize: '11.5pt', lineHeight: '2', textAlign: 'justify' }}>
                Que el(la) señor(a) <strong>{certDatos.nombre}</strong>, identificado(a) con Cédula de Ciudadanía <strong>N° {certDatos.documento}</strong>, labora actualmente en nuestra organización mediante Contrato Individual de Trabajo a {certDatos.tipoContrato || 'Término Indefinido'} desde el <strong>{certDatos.fechaIngreso}</strong>, desempeñando el cargo de <strong>{certDatos.cargo}</strong>, devengando una asignación salarial básica mensual de <strong>{certDatos.salarioLetras || certDatos.salario} ({certDatos.salario})</strong> más todas las prestaciones sociales y afiliaciones obligatorias al Sistema General de Seguridad Social (EPS, AFP, ARL y Caja de Compensación Familiar).
              </p>
            )}

            {/* MODELO 2: CON FUNCIONES DETALLADAS Y CARGO CRUZADO */}
            {modeloCertificado === 'modelo2' && (
              <div>
                <p style={{ fontSize: '11.5pt', lineHeight: '1.9', textAlign: 'justify' }}>
                  Que el(la) señor(a) <strong>{certDatos.nombre}</strong>, identificado(a) con Cédula de Ciudadanía <strong>N° {certDatos.documento}</strong>, se encuentra vinculado(a) laboralmente con FRUTAS DEL ATLÁNTICO S.A.S. en el cargo de <strong>{certDatos.cargo}</strong> desde el <strong>{certDatos.fechaIngreso}</strong>, desempeñando a cabalidad las funciones estipuladas en el Manual de Funciones y Competencias (DPC):
                </p>
                <ul style={{ fontSize: '10.5pt', lineHeight: '1.8', margin: '15px 0 20px 25px' }}>
                  {(certDatos.funciones || [
                    'Ejecución de actividades operativas e institucionales conforme al área asignada.',
                    'Cumplimiento estricto del Manual de Buenas Prácticas de Manufactura (BPM) e Inocuidad.',
                    'Verificación de los estándares del Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST).'
                  ]).map((fun, fIdx) => (
                    <li key={fIdx}>{fun}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* MODELO 3: PARA EXTRABAJADOR (INACTIVO) CON FECHA DE RETIRO */}
            {modeloCertificado === 'modelo3' && (
              <p style={{ fontSize: '11.5pt', lineHeight: '2', textAlign: 'justify' }}>
                Que el(la) señor(a) <strong>{certDatos.nombre}</strong>, identificado(a) con Cédula de Ciudadanía <strong>N° {certDatos.documento}</strong>, laboró al servicio de FRUTAS DEL ATLÁNTICO S.A.S. mediante contrato laboral desde el <strong>{certDatos.fechaIngreso}</strong> hasta el <strong>{certDatos.fechaRetiro || '31 de agosto de 2026'}</strong>, ocupando el cargo de <strong>{certDatos.cargo}</strong> con una asignación salarial de <strong>{certDatos.salarioLetras || certDatos.salario} ({certDatos.salario})</strong>, habiendo finalizado su vínculo laboral a paz y salvo por todo concepto de salarios, cesantías, primas y liquidación de prestaciones sociales conforme al Código Sustantivo del Trabajo.
              </p>
            )}

            <p style={{ fontSize: '11pt', lineHeight: '1.8', marginTop: '30px' }}>
              La presente constancia se expide a solicitud del interesado en Sabanagrande, Atlántico, a los {fechaHoy}.
            </p>

            <div style={{ marginTop: '80px', textAlign: 'center' }}>
              <div style={{ width: '250px', borderTop: '1.5px solid #0f172a', margin: '0 auto 8px auto' }}></div>
              <strong style={{ fontSize: '11pt' }}>SAMY DARIANY RODRÍGUEZ SEÑA</strong><br />
              <span style={{ fontSize: '10pt', color: '#475569' }}>Representante Legal</span><br />
              <span style={{ fontSize: '9pt', color: '#64748b' }}>Frutas Del Atlántico S.A.S. · NIT 900.999.999-1</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}