import React, { useState, useEffect } from 'react';
import '../dashboard.css';

// 1. MATRIZ OFICIAL EXACTA DE LOS 16 ELEMENTOS DE PROTECCIÓN PERSONAL (EPP) SEGÚN PROTOCOLO FRUTOPICAL
const LISTA_OFICIAL_EPP = [
  { id: 'epp1', nombre: 'Lentes de protección (Filtro UV / Luz azul / Transparente)', aplicacion: 'Planta / Mantenimiento / Control de Calidad' },
  { id: 'epp2', nombre: 'Botas de seguridad con puntera antideslizante (Dieléctricas / Convencionales)', aplicacion: 'Bodega / Logística / Operaciones Mecánicas' },
  { id: 'epp3', nombre: 'Botas de caucho industrial antideslizantes', aplicacion: 'Planta Húmeda / Lavado y Despulpado de Fruta' },
  { id: 'epp4', nombre: 'Guantes de protección táctil / química (Nitrilo / Desechables)', aplicacion: 'Manipulación de Alimentos / Inocuidad BPM' },
  { id: 'epp5', nombre: 'Guantes de protección mecánica / agarre (Carnaza / Antideslizantes)', aplicacion: 'Cargue y Descargue de Huacales / Mantenimiento' },
  { id: 'epp6', nombre: 'Guantes dieléctricos', aplicacion: 'Instalaciones Eléctricas / Tableros de Fuerza' },
  { id: 'epp7', nombre: 'Guantes térmicos', aplicacion: 'Cuartos Fríos / Almacenamiento de Pulpa Congelada' },
  { id: 'epp8', nombre: 'Manilla antiestática', aplicacion: 'Sistemas / Instrumentación y Calibración' },
  { id: 'epp9', nombre: 'Protectores auditivos (Inserción / Copa)', aplicacion: 'Línea de Pasteurización y Maquinaria Pesada' },
  { id: 'epp10', nombre: 'Delantal / Peto plástico impermeable', aplicacion: 'Despulpado y Envasado al Vacío' },
  { id: 'epp11', nombre: 'Chaqueta / Capote impermeable', aplicacion: 'Patio de Recepción y Lavado de Materia Prima' },
  { id: 'epp12', nombre: 'Chaqueta térmica', aplicacion: 'Operación al interior de Cámaras de Congelación' },
  { id: 'epp13', nombre: 'Chaleco reflectivo', aplicacion: 'Despachos, Patio de Maniobras y Transporte' },
  { id: 'epp14', nombre: 'Faja ergonómica lumbar', aplicacion: 'Manipulación Manual de Cargas y Estibado' },
  { id: 'epp15', nombre: 'Cofia para el cabello', aplicacion: 'Uso Obligatorio en toda el Área de Manufactura (BPM)' },
  { id: 'epp16', nombre: 'Tapabocas / Kit de bioseguridad', aplicacion: 'Inocuidad Alimentaria Integral y Prevención Sanitaria' }
];

// 2. MODELOS Y FORMULARIOS OFICIALES DISPONIBLES EN EL REPOSITORIO DOCUMENTAL
const FORMULARIOS_REPOSITORIO = [
  { id: 'f_eps', entidad: 'EPS - Sistema General de Seguridad Social en Salud', tipo: 'Afiliación', formato: 'Formulario Único Nacional de Afiliación EPS (Sura / Sanitas / Salud Total)', estadoUso: 'Vigente' },
  { id: 'f_arl', entidad: 'ARL Positiva Compañía de Seguros S.A.', tipo: 'Afiliación y Novedades', formato: 'Formulario Institucional de Vinculación y Registro de Centro de Trabajo (Riesgo I a III)', estadoUso: 'Vigente' },
  { id: 'f_afp', entidad: 'Fondos de Pensiones y Cesantías (Porvenir / Protección / Colfondos)', tipo: 'Afiliación / Traslado', formato: 'Formulario de Elección de Régimen Pensional y Cuenta Individual de Cesantías', estadoUso: 'Vigente' },
  { id: 'f_caja', entidad: 'Caja de Compensación Familiar (Comfamiliar Atlántico)', tipo: 'Afiliación Empleador y Trabajador', formato: 'Formulario de Afiliación y Registro de Beneficiarios al Subsidio Familiar', estadoUso: 'Vigente' },
  { id: 'm_indef', entidad: 'Minuta Legal Frutopical S.A.S.', tipo: 'Contratación', formato: 'Minuta de Contrato Individual de Trabajo a Término Indefinido (11 Cláusulas CST)', estadoUso: 'Plantilla Vigente' },
  { id: 'm_fijo', entidad: 'Minuta Legal Frutopical S.A.S.', tipo: 'Contratación', formato: 'Minuta de Contrato Individual de Trabajo a Término Fijo Inferior a un Año', estadoUso: 'Plantilla Vigente' }
];

export default function SSTGestion({ onVolver }) {
  // PESTAÑAS EXACTAS SEGÚN INSTRUCCIÓN DOCENTE
  const [tabActiva, setTabActiva] = useState('lista_chequeo');

  // NÓMINA DE TRABAJADORES
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);

  // LISTA DE CHEQUEO INICIALMENTE DESMARCADA
  const [checks, setChecks] = useState({
    b1_doc: false,
    b1_ant: false,
    b1_hv: false,
    b1_cert_acad: false,
    b1_cert_lab: false,
    b1_medico: false,
    b2_eps: false,
    b2_pension: false,
    b2_cesantias: false,
    b2_banco: false,
    b3_libreta: false,
    b3_recibo: false,
    b4_contrato: false,
    b4_habeas: false,
    b4_rit: false,
    b4_epp: false
  });

  // MATRIZ DE EPP (INICIA TOTALMENTE DESMARCADA PARA QUE EL AUXILIAR SELECCIONE SEGÚN EL CARGO)
  const [eppMarcados, setEppMarcados] = useState({});

  // INDUCCIÓN SST INTERACTIVA
  const [evaluadorInduccion, setEvaluadorInduccion] = useState('Laura Mendoza Peñaranda');
  const [calificacionInduccion, setCalificacionInduccion] = useState(100);
  const [fechaInduccion, setFechaInduccion] = useState(new Date().toISOString().split('T')[0]);

  // IMPRESIÓN Y REPOSITORIO
  const [imprimiendo, setImprimiendo] = useState(null);
  const [visorPlantilla, setVisorPlantilla] = useState(null);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  function cargarEmpleados() {
    const guardados = localStorage.getItem('frutopical_empleados');
    if (guardados) {
      try {
        const parsed = JSON.parse(guardados);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEmpleados(parsed);
          setSelectedEmp(parsed[0]);
          return;
        }
      } catch {}
    }

    const base = [
      {
        documento: '1042890123',
        nombre: 'Carlos Fontalvo Amaya',
        cargo: 'Operario de Producción',
        salario: '$2.000.000 COP',
        salarioLetras: 'DOS MILLONES DE PESOS M/CTE',
        tipoContrato: 'Término Indefinido',
        fechaIngreso: '01 de febrero de 2026',
        genero: 'M',
        direccion: 'Calle 18 # 14-25, Sabanagrande (Atl.)',
        ciudad: 'Sabanagrande – Atlántico'
      },
      {
        documento: '1043567890',
        nombre: 'María Conrado Jiménez',
        cargo: 'Jefe de Calidad',
        salario: '$3.000.000 COP',
        salarioLetras: 'TRES MILLONES DE PESOS M/CTE',
        tipoContrato: 'Término Indefinido',
        fechaIngreso: '15 de febrero de 2026',
        genero: 'F',
        direccion: 'Carrera 4 # 21-10, Sabanagrande (Atl.)',
        ciudad: 'Sabanagrande – Atlántico'
      },
      {
        documento: '1044123456',
        nombre: 'David Riquett Villalobos',
        cargo: 'Jefe de Producción',
        salario: '$3.000.000 COP',
        salarioLetras: 'TRES MILLONES DE PESOS M/CTE',
        tipoContrato: 'Término Indefinido',
        fechaIngreso: '01 de marzo de 2026',
        genero: 'M',
        direccion: 'Calle 22 # 15-40, Sabanagrande (Atl.)',
        ciudad: 'Sabanagrande – Atlántico'
      },
      {
        documento: '1048765432',
        nombre: 'Sandra Milena Morán Henríquez',
        cargo: 'Analista de Gestión Humana',
        salario: '$2.400.000 COP',
        salarioLetras: 'DOS MILLONES CUATROCIENTOS MIL PESOS M/CTE',
        tipoContrato: 'Término Indefinido',
        fechaIngreso: '10 de febrero de 2026',
        genero: 'F',
        direccion: 'Calle 12 # 8-30, Sabanagrande (Atl.)',
        ciudad: 'Sabanagrande – Atlántico'
      }
    ];
    setEmpleados(base);
    setSelectedEmp(base[0]);
    localStorage.setItem('frutopical_empleados', JSON.stringify(base));
  }

  // AL CAMBIAR DE TRABAJADOR SE RESETEAN LOS CAMPOS PARA QUE EL AUXILIAR AUDITE
  function cambiarTrabajador(doc) {
    const emp = empleados.find((e) => String(e.documento) === String(doc));
    if (emp) {
      setSelectedEmp(emp);
      setChecks({
        b1_doc: false,
        b1_ant: false,
        b1_hv: false,
        b1_cert_acad: false,
        b1_cert_lab: false,
        b1_medico: false,
        b2_eps: false,
        b2_pension: false,
        b2_cesantias: false,
        b2_banco: false,
        b3_libreta: false,
        b3_recibo: false,
        b4_contrato: false,
        b4_habeas: false,
        b4_rit: false,
        b4_epp: false
      });
      setEppMarcados({});
    }
  }

  function handleToggleCheck(key) {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleToggleEpp(id) {
    setEppMarcados((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  // IDENTIFICACIÓN DE GÉNERO PARA EXIGIBILIDAD DE LIBRETA MILITAR
  const esHombre =
    selectedEmp?.genero === 'M' ||
    ['carlos', 'david', 'alejandro', 'jhostin'].some((n) =>
      (selectedEmp?.nombre || '').toLowerCase().includes(n)
    );

  // EVALUACIÓN DE CONFORMIDAD DOCUMENTAL DE INGRESO
  const requisitosEvaluables = [
    checks.b1_doc,
    checks.b1_ant,
    checks.b1_hv,
    checks.b1_cert_acad,
    checks.b1_cert_lab,
    checks.b1_medico,
    checks.b2_eps,
    checks.b2_pension,
    checks.b2_cesantias,
    checks.b2_banco,
    checks.b3_recibo,
    checks.b4_contrato,
    checks.b4_habeas,
    checks.b4_rit,
    checks.b4_epp
  ];

  if (esHombre) {
    requisitosEvaluables.push(checks.b3_libreta);
  }

  const cumplidos = requisitosEvaluables.filter(Boolean).length;
  const totalEvaluables = requisitosEvaluables.length;
  const porcentaje = Math.round((cumplidos / totalEvaluables) * 100);
  const estaCompleto = porcentaje === 100;

  function imprimirDocumento(tipo) {
    setImprimiendo(tipo);
    setTimeout(() => {
      window.print();
    }, 300);
  }

  const hoyFormatoLegal = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section className="th-page-section" style={{ padding: '2rem' }}>
      {/* CABECERA INSTITUCIONAL */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.6rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1.2rem' }}>
        <div>
          <span className="th-label">EQUIPO 3 · TALENTO HUMANO Y SG-SST</span>
          <h2 style={{ margin: '0.2rem 0', color: '#166534', fontSize: '1.5rem' }}>
            Vinculación de Personal y Seguridad en el Trabajo
          </h2>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#64748b' }}>
            Gestión de lista de chequeo de ingreso, formalización contractual, asignación de EPP e inducción institucional.
          </p>
        </div>

        {/* SELECTOR DE TRABAJADOR VINCULADO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', backgroundColor: '#f0fdf4', padding: '0.6rem 1rem', borderRadius: '10px', border: '1.5px solid #86efac' }}>
          <strong style={{ fontSize: '0.84rem', color: '#166534' }}>Colaborador:</strong>
          <select
            value={selectedEmp?.documento || ''}
            onChange={(e) => cambiarTrabajador(e.target.value)}
            style={{ padding: '0.45rem 0.8rem', borderRadius: '6px', border: '1.5px solid #166534', fontWeight: 'bold', fontSize: '0.85rem', backgroundColor: '#ffffff', cursor: 'pointer' }}
          >
            {empleados.map((emp) => (
              <option key={emp.documento} value={emp.documento}>
                {emp.nombre} (C.C. {emp.documento}) - {emp.cargo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PESTAÑAS EN EL ORDEN EXACTO SOLICITADO */}
      <div style={{ display: 'flex', gap: '0.6rem', borderBottom: '2px solid #cbd5e1', marginBottom: '1.8rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setTabActiva('lista_chequeo')}
          style={{
            padding: '0.7rem 1.3rem',
            border: 'none',
            background: 'none',
            borderBottom: tabActiva === 'lista_chequeo' ? '3.5px solid #166534' : 'none',
            fontWeight: tabActiva === 'lista_chequeo' ? 'bold' : 'normal',
            color: tabActiva === 'lista_chequeo' ? '#166534' : '#64748b',
            cursor: 'pointer',
            fontSize: '0.88rem'
          }}
        >
          1. Vinculación de Trabajadores (Lista de Chequeo)
        </button>

        <button
          type="button"
          onClick={() => setTabActiva('contratacion')}
          style={{
            padding: '0.7rem 1.3rem',
            border: 'none',
            background: 'none',
            borderBottom: tabActiva === 'contratacion' ? '3.5px solid #166534' : 'none',
            fontWeight: tabActiva === 'contratacion' ? 'bold' : 'normal',
            color: tabActiva === 'contratacion' ? '#166534' : '#64748b',
            cursor: 'pointer',
            fontSize: '0.88rem'
          }}
        >
          2. Contratación
        </button>

        <button
          type="button"
          onClick={() => setTabActiva('epp')}
          style={{
            padding: '0.7rem 1.3rem',
            border: 'none',
            background: 'none',
            borderBottom: tabActiva === 'epp' ? '3.5px solid #166534' : 'none',
            fontWeight: tabActiva === 'epp' ? 'bold' : 'normal',
            color: tabActiva === 'epp' ? '#166534' : '#64748b',
            cursor: 'pointer',
            fontSize: '0.88rem'
          }}
        >
          3. Entrega de EPP (SST)
        </button>

        <button
          type="button"
          onClick={() => setTabActiva('induccion')}
          style={{
            padding: '0.7rem 1.3rem',
            border: 'none',
            background: 'none',
            borderBottom: tabActiva === 'induccion' ? '3.5px solid #166534' : 'none',
            fontWeight: tabActiva === 'induccion' ? 'bold' : 'normal',
            color: tabActiva === 'induccion' ? '#166534' : '#64748b',
            cursor: 'pointer',
            fontSize: '0.88rem'
          }}
        >
          4. Constancia e Inducción SST
        </button>
      </div>

      {/* =========================================================
          PESTAÑA 1: LISTA DE CHEQUEO (AUDITORÍA DE EXPEDIENTE)
      ========================================================= */}
      {tabActiva === 'lista_chequeo' && (
        <div>
          {/* BANNER DINÁMICO DE CONFORMIDAD CON MENSAJES CONDICIONALES */}
          <div
            style={{
              padding: '1.2rem 1.6rem',
              borderRadius: '12px',
              backgroundColor: estaCompleto ? '#dcfce7' : '#fffbeb',
              border: `2px solid ${estaCompleto ? '#86efac' : '#fde68a'}`,
              marginBottom: '1.8rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: estaCompleto ? '#166534' : '#92400e', letterSpacing: '0.5px' }}>
                AUDITORÍA DE INGRESO · {selectedEmp?.nombre.toUpperCase()}
              </span>
              <h3 style={{ margin: '0.2rem 0', fontSize: '1.25rem', color: estaCompleto ? '#14532d' : '#78350f' }}>
                {estaCompleto
                  ? '✅ Continuar con el proceso de vinculación'
                  : '⚠️ Contactar al nuevo ingreso para notificar documento faltante'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: estaCompleto ? '#166534' : '#92400e' }}>
                {estaCompleto
                  ? 'Todos los requisitos documentales fueron validados. El expediente físico y digital cumple a cabalidad.'
                  : `Se han verificado ${cumplidos} de ${totalEvaluables} soportes. El auxiliar debe exigir los documentos pendientes antes de completar la contratación.`}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2.1rem', fontWeight: '900', color: estaCompleto ? '#166534' : '#b45309', lineHeight: 1 }}>
                {porcentaje}%
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b' }}>Conformidad del Expediente</span>
            </div>
          </div>

          {/* CUADRÍCULA DE LOS 4 BLOQUES DOCUMENTALES OFICIALES */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.4rem' }}>
            {/* BLOQUE 1: IDENTIFICACIÓN Y REQUISITOS PREVIOS */}
            <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '1.2rem' }}>
              <h4 style={{ margin: '0 0 0.4rem 0', color: '#166534', fontSize: '0.92rem', borderBottom: '1.5px solid #dcfce7', paddingBottom: '0.4rem' }}>
                BLOQUE 1: Documentos Personales de Identificación
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 0.8rem 0' }}>
                Documentos físicos entregados por el candidato al momento del llamado:
              </p>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b1_doc} onChange={() => handleToggleCheck('b1_doc')} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Fotocopia documento de identidad al 150% (obligatorio)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b1_ant} onChange={() => handleToggleCheck('b1_ant')} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Certificado de antecedentes</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b1_hv} onChange={() => handleToggleCheck('b1_hv')} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Hoja de vida con soportes comprobables</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b1_cert_acad} onChange={() => handleToggleCheck('b1_cert_acad')} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Certificados académicos (Diploma bachiller / técnico)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b1_cert_lab} onChange={() => handleToggleCheck('b1_cert_lab')} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Certificaciones laborales de empleos anteriores</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.2rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b1_medico} onChange={() => handleToggleCheck('b1_medico')} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Concepto médico de ingreso (Examen de Aptitud Laboral)</span>
              </label>
            </div>

            {/* BLOQUE 2: SEGURIDAD SOCIAL Y DISPERSIÓN DE NÓMINA */}
            <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '1.2rem' }}>
              <h4 style={{ margin: '0 0 0.4rem 0', color: '#166534', fontSize: '0.92rem', borderBottom: '1.5px solid #dcfce7', paddingBottom: '0.4rem' }}>
                BLOQUE 2: Seguridad Social y Dispersión de Nómina
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 0.8rem 0' }}>
                Certificados bancarios y de fondos aportados por el aspirante:
              </p>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b2_eps} onChange={() => handleToggleCheck('b2_eps')} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Certificado de Afiliación a EPS (Estado Activo)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b2_pension} onChange={() => handleToggleCheck('b2_pension')} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Certificado de Fondo de Pensiones (AFP)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b2_cesantias} onChange={() => handleToggleCheck('b2_cesantias')} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Certificación de Fondo de Cesantías</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.2rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b2_banco} onChange={() => handleToggleCheck('b2_banco')} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Certificado de Cuenta Bancaria (Para pago de nómina)</span>
              </label>
            </div>

            {/* BLOQUE 3: OTROS DOCUMENTOS REQUISITO */}
            <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '1.2rem' }}>
              <h4 style={{ margin: '0 0 0.4rem 0', color: '#166534', fontSize: '0.92rem', borderBottom: '1.5px solid #dcfce7', paddingBottom: '0.4rem' }}>
                BLOQUE 3: Otros Documentos Requisito
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 0.8rem 0' }}>
                Requisitos legales específicos según género y domicilio:
              </p>

              {esHombre ? (
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={checks.b3_libreta} onChange={() => handleToggleCheck('b3_libreta')} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                  <span>Fotocopia libreta militar ampliada al 150% (Aplica a hombres)</span>
                </label>
              ) : (
                <div style={{ padding: '0.6rem 0.8rem', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '0.78rem', color: '#64748b', marginBottom: '0.65rem', border: '1px dashed #cbd5e1' }}>
                  ℹ️ Libreta militar no exigible (Aplica únicamente a candidatos masculinos).
                </div>
              )}

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.2rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b3_recibo} onChange={() => handleToggleCheck('b3_recibo')} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Certificado de residencia / Recibo de servicio público de domicilio</span>
              </label>
            </div>

            {/* BLOQUE 4: FORMATOS INTERNOS DE CONTRATACIÓN DE FRUTOPICAL */}
            <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '1.2rem' }}>
              <h4 style={{ margin: '0 0 0.4rem 0', color: '#166534', fontSize: '0.92rem', borderBottom: '1.5px solid #dcfce7', paddingBottom: '0.4rem' }}>
                BLOQUE 4: Formatos Internos de Contratación de Frutopical
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 0.8rem 0' }}>
                Formatos institucionales firmados durante la vinculación formal:
              </p>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b4_contrato} onChange={() => handleToggleCheck('b4_contrato')} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Contrato Individual de Trabajo: Firmado en original por ambas partes</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b4_habeas} onChange={() => handleToggleCheck('b4_habeas')} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Autorización firmada para el Tratamiento de Datos (Ley 1581)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b4_rit} onChange={() => handleToggleCheck('b4_rit')} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Constancia de Notificación del Reglamento Interno de Trabajo (RIT)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.2rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b4_epp} onChange={() => handleToggleCheck('b4_epp')} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Formato de Entrega de Elementos de Protección Personal (EPP)</span>
              </label>
            </div>
          </div>

          {/* SECCIÓN DEL REPOSITORIO DE FORMULARIOS Y PLANTILLAS VIGENTES */}
          <div style={{ marginTop: '2.5rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1.5px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.8rem' }}>
              <div>
                <strong style={{ color: '#166534', fontSize: '1.05rem', display: 'block' }}>
                  📁 Repositorio de Minutas de Contratos y Formularios de Afiliación
                </strong>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  Modelos oficiales que garantizan que el departamento de Gestión Humana siempre utilice formatos vigentes.
                </p>
              </div>

              {/* RESPUESTA DIRECTA A LA DUDA DE LA PROFESORA */}
              <div style={{ backgroundColor: '#ffffff', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #86efac', fontSize: '0.78rem', color: '#166534', maxWidth: '420px', lineHeight: 1.4 }}>
                <strong>¿Cuándo se interpreta un Formulario como COMPLETO?</strong><br />
                Cuando el colaborador ya estampó su firma y huella en el formulario oficial y la empresa cuenta con el sello/radicado de confirmación de ingreso emitido por la entidad (EPS, ARL, AFP o Caja).
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.9rem' }}>
              {FORMULARIOS_REPOSITORIO.map((item) => (
                <div key={item.id} style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#c2410c', textTransform: 'uppercase' }}>{item.tipo}</span>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: '#1e293b', margin: '0.2rem 0' }}>{item.entidad}</strong>
                    <p style={{ fontSize: '0.76rem', color: '#64748b', margin: 0 }}>{item.formato}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.6rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 'bold' }}>✓ {item.estadoUso}</span>
                    <button
                      type="button"
                      onClick={() => setVisorPlantilla(item)}
                      style={{ padding: '0.35rem 0.75rem', backgroundColor: '#f0fdf4', border: '1px solid #86efac', color: '#166534', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      👁️ Ver Modelo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          PESTAÑA 2: CONTRATACIÓN (MINUTA COMPLETA CON 11 CLÁUSULAS)
      ========================================================= */}
      {tabActiva === 'contratacion' && selectedEmp && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
            <div>
              <span className="th-label">CONTRATACIÓN INDIVIDUAL DE TRABAJO</span>
              <h3 style={{ margin: '0.2rem 0', color: '#166534', fontSize: '1.35rem' }}>
                Minuta de Contrato a Término Indefinido
              </h3>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
                Colaborador: <strong>{selectedEmp.nombre}</strong> · Asignación: <strong>{selectedEmp.salario}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => imprimirDocumento('contrato')}
              style={{ backgroundColor: '#166534', color: '#ffffff', border: 'none', padding: '0.75rem 1.6rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(22,101,52,0.2)' }}
            >
              🖨️ Imprimir Minuta Completa (PDF)
            </button>
          </div>

          {/* VISOR COMPLETO Y TEXTUAL DE LA MINUTA PROVISTA POR LA PROFESORA */}
          <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '3rem', maxHeight: '720px', overflowY: 'auto', fontFamily: 'serif', fontSize: '11pt', lineHeight: '1.8', color: '#0f172a' }}>
            {/* ENCABEZADO DE TABLA EXACTA DEL WORD */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', backgroundColor: '#f8fafc', padding: '1.2rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', marginBottom: '1.8rem', fontSize: '9.5pt', fontFamily: 'Arial, sans-serif' }}>
              <div><strong>NOMBRE DEL EMPLEADOR:</strong> FRUTAS DEL ATLÁNTICO S.A.S.</div>
              <div><strong>DIRECCION DEL EMPLEADOR:</strong> Carrera 2A # 20-35 Sabanagrande (Atl.)</div>
              <div><strong>NOMBRE DEL TRABAJADOR:</strong> {selectedEmp.nombre}</div>
              <div><strong>DIRECCION DEL TRABAJADOR:</strong> {selectedEmp.direccion || 'Sabanagrande – Atlántico'}</div>
              <div><strong>CARGO U OFICIO:</strong> {selectedEmp.cargo}</div>
              <div><strong>SALARIO:</strong> {selectedEmp.salarioLetras || selectedEmp.salario} ({selectedEmp.salario})</div>
              <div><strong>PERIODOS DE PAGO:</strong> Mensual</div>
              <div><strong>FECHA DE INICIACIÓN DE LABORES:</strong> {selectedEmp.fechaIngreso}</div>
              <div><strong>LUGAR DONDE DESEMPEÑARÁ LAS LABORES:</strong> Sabanagrande – Atlántico</div>
              <div><strong>CIUDAD DONDE HA SIDO CONTRATADO:</strong> Sabanagrande – Atlántico</div>
            </div>

            <p style={{ textAlign: 'justify', marginBottom: '1.2rem' }}>
              Entre <strong>EL EMPLEADOR</strong> y <strong>EL TRABAJADOR</strong>, de las condiciones ya dichas identificados como aparece al pie de sus correspondientes firmas se ha celebrado el presente contrato individual de trabajo, regido además por las siguientes cláusulas:
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '1.2rem' }}>
              <strong>PRIMERA: OBJETO.</strong> EL EMPLEADOR contrata los servicios personales de EL TRABAJADOR y este se obliga: a) A poner al servicio de EL EMPLEADOR toda su capacidad normal de trabajo en el desempeño de las funciones propias del oficio mencionado y en las labores anexas y complementarias del mismo, de conformidad con las ordenes e instrucciones que le imparta EL EMPLEADOR directamente o a través de sus representantes; b) A prestar sus servicios en forma exclusiva al empleador; es decir, a no prestar directa ni indirectamente servicios laborales a otros empleadores, ni al trabajar por cuenta propia en el mismo oficio, durante la vigencia de este contrato, y c) A guardar absoluta reserva sobre los hechos, documentos físicos y/o electrónicos, informaciones y en general, sobre todos los asuntos y materias que lleguen a su conocimiento por causa o con ocasión de su contrato de trabajo.
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '1.2rem' }}>
              <strong>SEGUNDA: REMUNERACIÓN.</strong> EL EMPLEADOR pagará a EL TRABAJADOR por la prestación de sus servicios el salario indicado en el encabezado del presente documento, pagadero en las oportunidades también señaladas arriba. <em>PARÁGRAFO PRIMERO: SALARIO ORDINARIO:</em> Dentro del salario ordinario se encuentra incluida la remuneración de los descansos dominicales y festivos de que tratan los capítulos I y II del título VII del C.S.T. De igual manera se aclara y se conviene que en los casos en los que EL TRABAJADOR devengue comisiones o cualquier otra modalidad de salario variable, el 82.5% de dichos ingresos, constituye remuneración de la labor realizada, y el 17.5% restante está designado a remunerar el descanso en los días dominicales y festivos que tratan los capítulos I y II del título VII del C.S.T. <em>PARÁGRAFO SEGUNDO: SALARIO INTEGRAL:</em> En la eventualidad en que EL TRABAJADOR devengue salario integral, se entiende de conformidad con el numeral 2 del artículo 132 del C.S.T, subrogado por el artículo 18 de la ley 50/90, que dentro del salario integral convenio se encuentra incorporado el factor prestacional de EL TRABAJADOR, el cual no será inferior al 30% del salario antes mencionado. De igual manera se conviene y aclara que en los casos en los que EL TRABAJADOR comisiones o cualquiera otra modalidad de salario variable integral, se entenderá que dentro de la sumas reconocidas se encuentra incorporado el factor prestacional de EL TRABAJADOR, el cual no será inferior al 30% del salario antes mencionado. El salario integra acordado además de retribuir la remuneración ordinaria, remunera y compensa todo recargo por trabajo extraordinario, nocturno, dominical o festivo, primas de servicios legales o extralegales, cesantías e intereses a la cesantía, subsidios y suministros en especie, incidencia prestacional de eventuales viáticos y en general toda prestación o acreencia legal o extralegal derivada del contrato, con excepción de las vacaciones. <em>PARÁGRAFO TERCERO:</em> Las partes acuerdan que en los casos en que se reconozcan a EL TRABAJADOR beneficios por concepto de alimentación, comunicaciones, habitación o vivienda, transporte, vestuario, auxilios en dinero o en especie o bonificaciones ocasionales, se considerarán tales beneficios o reconocimientos como no salariales, y por tanto, no se tendrán en cuenta como factor salarial para la liquidación de acreencias laborales, ni para el pago de aportes parafiscales y cotizaciones a la seguridad social, de conformidad con los Arts. 15 y 16 de la ley 50/90, en concordancia con el Art. 17 de la 344/96.
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '1.2rem' }}>
              <strong>TERCERA: DURACIÓN DEL CONTRATO.</strong> La duración del presente contrato será indefinida, mientras subsistan las causas que le dieron origen y la materia del trabajo contratado.
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '1.2rem' }}>
              <strong>CUARTA: TRABAJO NOCTURNO, SUPLEMENTARIO, DOMINICAL Y/O FESTIVO.</strong> Todo trabajo nocturno, suplementario o en horas extras y todo trabajo en domingo o festivo en los que legalmente debe concederse el descanso, se remunerará conforme a la Ley. Para el reconocimiento y pago del trabajo suplementario, nocturno, dominical o festivo, EL EMPLEADOR o sus representantes deben autorizarlo previamente y por escrito. Cuando la necesidad de este trabajo se presente de manera imprevista o inaplazable, deberá ejecutarse y darse cuenta de él por escrito, a la mayor brevedad, a EL EMPLEADOR o sus representantes para su aprobación. EL EMPLEADOR, en consecuencia, no reconocerá ningún trabajo suplementario o en días de descanso legalmente obligatorio que no haya sido autorizado previamente o que, habiendo sido avisado inmediatamente, no haya sido aprobado como queda dicho. Tratándose de trabajadores de dirección, confianza o manejo, no habrá lugar al pago de horas extras.
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '1.2rem' }}>
              <strong>QUINTA: JORNADA DE TRABAJO.</strong> EL TRABAJADOR se obliga a laborar la jornada máxima legal, salvo acuerdo especial, en los turnos y dentro de las horas señalados por EL EMPLEADOR, pudiendo hacer este ajustes o cambios de horarios cuando lo estime conveniente, sin que ello se considere como una desmejora en las condiciones laborales de EL TRABAJADOR. Por acuerdo expreso o tácito de las partes, podrán repartirse total o parcialmente las horas de la jornada ordinaria, con base en lo dispuesto por el Art. 164 del C.S.T, modificado por el Art. 23 de la ley 50/90, teniendo en cuenta que los tiempos de descanso entre las secciones de la jornada no se computan dentro de las misma, según el Art. 167 ibidem.
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '1.2rem' }}>
              <strong>SEXTA: PERIODO DE PRUEBA.</strong> Los dos primeros meses del presente contrato se considera como periodo de prueba y, por consiguiente, cualquiera de las partes podrá terminar el contrato unilateralmente, en cualquier momento durante dicho periodo y sin previo aviso, sin que se cause el pago de indemnización alguna.
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '1.2rem' }}>
              <strong>SÉPTIMA: TERMINACIÓN UNILATERAL.</strong> Son justas causas para dar por terminado unilateralmente este contrato, por cualquiera de las partes, las enumeradas en el artículo 62 del C.S.T, modificado por el Art.7º del decreto 2351/65 y además, por parte de EL EMPLEADOR, las faltas que para el efecto se califiquen como graves en reglamentos, manuales, instructivos y demás documentos que contengan reglamentaciones, ordenes, instrucciones o prohibiciones de carácter general o particular, pactos, convenciones colectivas, laudos arbitrales y las que expresamente convengan calificar así en escritos que formarán parte integral del presente contrato. Expresamente se califican en este acto como falta graves, la violación a las obligaciones y prohibiciones contenidas en la cláusula primera del presente contrato.
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '1.2rem' }}>
              <strong>OCTAVA: PROPIEDAD INTELECTUAL.</strong> Las partes acuerdan que toda las invenciones, descubrimientos y trabajos originales concebidos o hechos por EL TRABAJADOR en vigencia del presente contrato pertenecerán a EL EMPLEADOR, por lo cual EL TRABAJADOR se obliga a informar a EL EMPLEADOR de forma inmediata sobre la existencia de dichas invenciones y/o trabajos originales. EL TRABAJADOR accederá a facilitar el cumplimiento de las correspondientes formalidades y dará su firma o extenderá los poderes y documentos necesarios para transferir la propiedad intelectual a EL EMPLEADOR cuando así se lo solicite. Teniendo en cuenta lo dispuesto en al normatividad de derechos de autor y lo estipulado anteriormente, las partes acuerdan que el salario devengado contiene la remuneración de transferencia de todo tipo de propiedad intelectual, razón por la cual no se causará ninguna compensación adicional.
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '1.2rem' }}>
              <strong>NOVENA: MODIFICACIONES DE LAS CONDICIONES LABORALES.</strong> EL TRABAJADOR acepta desde ahora expresamente todas las modificaciones de sus condiciones laborales determinadas por EL EMPLEADOR en ejercicio de su poder subordinante, tales como el horario de trabajo, el lugar de prestación del servicio y el cargo u oficio y/o funciones, lo dispuesto por el Art. 23 del C.S.T. modificado por el Art. 1º de la ley 50/90. Los gastos que se originen por el traslado de lugar de prestación del servicio de EL TRABAJADOR serán cubiertos por EL EMPLEADOR, de conformidad por el numeral 8º del Art. 57 del C.S.T.
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '1.2rem' }}>
              <strong>DECIMA: DIRECCION DEL TRABAJADOR.</strong> EL TRABAJADOR para todos los efectos legales, y en especial para la aplicación del parágrafo 1 del Art. 29 de la ley 789/02, norma que modificó el Art.65 del C.S.T, se compromete a informar por escrito y de manera inmediata a EL EMPLEADOR cualquier cambio en su dirección de residencia, teniéndose en todo caso como suya, la última dirección registrada en su hoja de vida.
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '2.5rem' }}>
              <strong>UNDÉCIMA: EFECTOS.</strong> El presente contrato reemplaza en su integridad y deja sin efecto alguno cualquiera otro contrato, verbal o escrito celebrado por las partes con anterioridad, pudiendo las partes convenir por escrito modificaciones al mismo, las que formarán parte integral de este contrato.
            </p>

            <p style={{ marginBottom: '1.5rem' }}>
              Para constancia se firma en dos ejemplares del mismo tenor y valor, ante testigos, un ejemplar de los cuales recibe EL TRABAJADOR en este acto, en la ciudad y fecha que se indican a continuación:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', border: '1px solid #cbd5e1', padding: '0.8rem', width: '320px', marginBottom: '3.5rem', fontSize: '10pt', fontFamily: 'Arial, sans-serif' }}>
              <div><strong>Ciudad:</strong> Sabanagrande</div>
              <div><strong>Fecha:</strong> {hoyFormatoLegal}</div>
            </div>

            {/* FIRMAS EXACTAS DEL WORD: SAMY DARIANY RODRÍGUEZ SEÑA Y TRABAJADOR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', marginTop: '4rem' }}>
              <div style={{ width: '45%' }}>
                <div style={{ borderTop: '1.5px solid #000000', margin: '0 auto 6px auto', width: '240px' }}></div>
                <strong style={{ display: 'block' }}>SAMY DARIANY RODRÍGUEZ SEÑA</strong>
                <span>Representante Legal</span><br />
                <strong>EL EMPLEADOR</strong>
              </div>

              <div style={{ width: '45%' }}>
                <div style={{ borderTop: '1.5px solid #000000', margin: '0 auto 6px auto', width: '240px' }}></div>
                <strong style={{ display: 'block' }}>{selectedEmp.nombre}</strong>
                <span>C.C. {selectedEmp.documento}</span><br />
                <strong>EL TRABAJADOR</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          PESTAÑA 3: ENTREGA DE EPP (SST) - LISTA OFICIAL DE 16
      ========================================================= */}
      {tabActiva === 'epp' && selectedEmp && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
            <div>
              <span className="th-label">SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO</span>
              <h3 style={{ margin: '0.2rem 0', color: '#166534', fontSize: '1.35rem' }}>
                Matriz de EPP para {selectedEmp.nombre}
              </h3>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
                Cargo: <strong>{selectedEmp.cargo}</strong> · Protocolo oficial bajo Resolución 2400 de 1979 y Decreto 1072 de 2015.
              </p>
            </div>

            <button
              type="button"
              onClick={() => imprimirDocumento('epp')}
              style={{ backgroundColor: '#166534', color: '#ffffff', border: 'none', padding: '0.75rem 1.6rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(22,101,52,0.2)' }}
            >
              🖨️ Imprimir Acta de Entrega EPP
            </button>
          </div>

          <div style={{ backgroundColor: '#f0fdf4', padding: '1rem 1.4rem', borderRadius: '10px', border: '1.5px solid #86efac', marginBottom: '1.5rem', fontSize: '0.84rem', color: '#166534', lineHeight: 1.5 }}>
            <strong>Criterio Técnico SG-SST (Frutopical S.A.S.):</strong> Todos los EPP inician desmarcados. El auxiliar de Seguridad y Salud en el Trabajo debe marcar exclusivamente los implementos obligatorios conforme a la matriz de riesgos del cargo. (La dotación de uniforme y calzado de calle se gestiona en formato administrativo separado).
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '0.9rem' }}>
            {LISTA_OFICIAL_EPP.map((epp) => {
              const checked = !!eppMarcados[epp.id];
              return (
                <label
                  key={epp.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.8rem',
                    padding: '0.9rem 1.1rem',
                    backgroundColor: checked ? '#ecfdf5' : '#ffffff',
                    border: `1.5px solid ${checked ? '#10b981' : '#e2e8f0'}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    boxShadow: checked ? '0 2px 8px rgba(16,185,129,0.15)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleToggleEpp(epp.id)}
                    style={{ marginTop: '0.2rem', accentColor: '#166534', width: '18px', height: '18px', flexShrink: 0 }}
                  />
                  <div>
                    <strong style={{ fontSize: '0.86rem', color: checked ? '#065f46' : '#1e293b', display: 'block', marginBottom: '0.2rem' }}>
                      {epp.nombre}
                    </strong>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Área: {epp.aplicacion}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          PESTAÑA 4: CONSTANCIA E INDUCCIÓN SST (FIRMAS EN PARALELO)
      ========================================================= */}
      {tabActiva === 'induccion' && selectedEmp && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
          {/* CONTROL Y EDICIÓN INTERACTIVA */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.8rem', borderRadius: '12px', border: '1.5px solid #cbd5e1' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#166534', fontSize: '1.2rem' }}>Parametrización de Inducción</h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>
                Colaborador Vinculado:
              </label>
              <input
                type="text"
                disabled
                value={`${selectedEmp.nombre} (C.C. ${selectedEmp.documento})`}
                style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', fontWeight: 'bold', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>
                Cargo a Desempeñar:
              </label>
              <input
                type="text"
                disabled
                value={selectedEmp.cargo}
                style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>
                Responsable de la Inducción (Evaluador):
              </label>
              <input
                type="text"
                value={evaluadorInduccion}
                onChange={(e) => setEvaluadorInduccion(e.target.value)}
                style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1.5px solid #166534', fontWeight: 'bold', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>
                  Calificación (%):
                </label>
                <input
                  type="number"
                  min="70"
                  max="100"
                  value={calificacionInduccion}
                  onChange={(e) => setCalificacionInduccion(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 'bold' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>
                  Fecha de Inducción:
                </label>
                <input
                  type="date"
                  value={fechaInduccion}
                  onChange={(e) => setFechaInduccion(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => imprimirDocumento('induccion')}
              style={{ width: '100%', padding: '0.85rem', backgroundColor: '#166534', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(22,101,52,0.2)' }}
            >
              🖨️ Imprimir Constancia Formal (PDF)
            </button>
          </div>

          {/* VISTA PREVIA LIMPIA SIN SALTOS EXTRAÑOS */}
          <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #166534', paddingBottom: '1rem', marginBottom: '2rem' }}>
              <strong style={{ fontSize: '14pt', color: '#166534' }}>FRUTAS DEL ATLÁNTICO S.A.S.</strong>
              <div style={{ fontSize: '8.5pt', color: '#64748b' }}>NIT: 900.999.999-1 · Sabanagrande, Atlántico</div>
              <h4 style={{ margin: '0.6rem 0 0 0', fontSize: '11pt', color: '#0f172a' }}>
                CONSTANCIA DE INDUCCIÓN INSTITUCIONAL Y SG-SST
              </h4>
            </div>

            <p style={{ fontSize: '10pt', lineHeight: '2', textAlign: 'justify', marginBottom: '3.5rem' }}>
              Se certifica que el(la) colaborador(a) <strong>{selectedEmp.nombre}</strong>, identificado(a) con C.C. <strong>{selectedEmp.documento}</strong>, culminó su proceso de inducción reglamentaria para el cargo de <strong>{selectedEmp.cargo}</strong> el día <strong>{fechaInduccion}</strong>, obteniendo una calificación de comprensión del <strong>{calificacionInduccion}%</strong> en los módulos de Políticas Institucionales Frutopical, SG-SST (Dec. 1072), Matriz de Peligros en Planta Agroindustrial, Buenas Prácticas de Manufactura (BPM) y Uso Correcto de EPP.
            </p>

            {/* FIRMAS LIMPIAS EN PARALELO EXACTAMENTE COMO EXIGIÓ LA PROFESORA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '9pt' }}>
              <div style={{ width: '45%' }}>
                <div style={{ borderTop: '1.5px solid #000000', margin: '0 auto 6px auto', width: '180px' }}></div>
                <strong>{selectedEmp.nombre}</strong><br />
                <span style={{ color: '#64748b' }}>Firma del Trabajador</span><br />
                <span>C.C. {selectedEmp.documento}</span>
              </div>

              <div style={{ width: '45%' }}>
                <div style={{ borderTop: '1.5px solid #000000', margin: '0 auto 6px auto', width: '180px' }}></div>
                <strong>{evaluadorInduccion}</strong><br />
                <span style={{ color: '#64748b' }}>Jefe de Talento Humano</span><br />
                <span>Frutas Del Atlántico S.A.S.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL VISOR DE PLANTILLAS DEL REPOSITORIO
      ========================================================= */}
      {visorPlantilla && (
        <div className="th-modal-backdrop" onMouseDown={() => setVisorPlantilla(null)}>
          <section className="th-postulation-modal" style={{ maxWidth: '580px', width: '92%' }} onMouseDown={(e) => e.stopPropagation()}>
            <div className="th-modal-header">
              <div>
                <span className="th-label">DOCUMENTO MODELO VIGENTE</span>
                <h3 style={{ margin: '0.2rem 0' }}>{visorPlantilla.entidad}</h3>
              </div>
              <button type="button" className="th-modal-close" onClick={() => setVisorPlantilla(null)}>×</button>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '1rem', fontSize: '0.85rem' }}>
              <p style={{ margin: '0 0 0.4rem 0' }}><strong>Tipo de Documento:</strong> {visorPlantilla.tipo}</p>
              <p style={{ margin: '0 0 0.4rem 0' }}><strong>Descripción Oficial:</strong> {visorPlantilla.formato}</p>
              <p style={{ margin: '0 0 0.4rem 0' }}><strong>Estado de Validez:</strong> <span style={{ color: '#166534', fontWeight: 'bold' }}>✓ Formato Institucional Aprobado</span></p>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.78rem' }}>
                Este documento reposa en la carpeta digital de Gestión Humana para su uso estandarizado en procesos de selección y vinculación.
              </p>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem' }}>
              <button
                type="button"
                onClick={() => alert(`Descargando plantilla modelo: ${visorPlantilla.formato}`)}
                style={{ flex: 1, padding: '0.75rem', backgroundColor: '#166534', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                📥 Descargar Formato Modelo
              </button>
              <button
                type="button"
                onClick={() => setVisorPlantilla(null)}
                style={{ padding: '0.75rem 1.2rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cerrar
              </button>
            </div>
          </section>
        </div>
      )}

      {/* =========================================================
          ÁREA OFICIAL DE IMPRESIÓN (SIN DESCUADRES NI CORTES)
      ========================================================= */}
      <div className="print-document-area">
        {/* IMPRESIÓN OFICIAL DEL CONTRATO LEGAL COMPLETO (11 CLÁUSULAS EXACTAS) */}
        {imprimiendo === 'contrato' && selectedEmp && (
          <div style={{ padding: '15mm 20mm', fontFamily: 'serif', fontSize: '10pt', lineHeight: '1.6', color: '#000000' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #166534', paddingBottom: '10px' }}>
              <strong style={{ fontSize: '15pt', color: '#166534', fontFamily: 'Arial, sans-serif' }}>FRUTAS DEL ATLÁNTICO S.A.S.</strong>
              <div style={{ fontSize: '9pt', color: '#475569', fontFamily: 'Arial, sans-serif' }}>NIT: 900.999.999-1 · Sabanagrande, Atlántico</div>
              <h3 style={{ margin: '8px 0 0 0', fontSize: '12pt', textTransform: 'uppercase', fontFamily: 'Arial, sans-serif' }}>
                CONTRATO INDIVIDUAL DE TRABAJO A TÉRMINO INDEFINIDO
              </h3>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '9pt', border: '1px solid #334155' }}>
              <tbody>
                <tr><td style={{ padding: '4px 8px', border: '1px solid #334155', width: '32%', fontWeight: 'bold' }}>NOMBRE DEL EMPLEADOR:</td><td style={{ padding: '4px 8px', border: '1px solid #334155' }}>FRUTAS DEL ATLÁNTICO S.A.S.</td></tr>
                <tr><td style={{ padding: '4px 8px', border: '1px solid #334155', fontWeight: 'bold' }}>DIRECCIÓN DEL EMPLEADOR:</td><td style={{ padding: '4px 8px', border: '1px solid #334155' }}>Carrera 2A # 20-35 Sabanagrande (Atl.)</td></tr>
                <tr><td style={{ padding: '4px 8px', border: '1px solid #334155', fontWeight: 'bold' }}>NOMBRE DEL TRABAJADOR:</td><td style={{ padding: '4px 8px', border: '1px solid #334155' }}>{selectedEmp.nombre}</td></tr>
                <tr><td style={{ padding: '4px 8px', border: '1px solid #334155', fontWeight: 'bold' }}>DIRECCIÓN DEL TRABAJADOR:</td><td style={{ padding: '4px 8px', border: '1px solid #334155' }}>{selectedEmp.direccion || 'Sabanagrande – Atlántico'}</td></tr>
                <tr><td style={{ padding: '4px 8px', border: '1px solid #334155', fontWeight: 'bold' }}>CARGO U OFICIO:</td><td style={{ padding: '4px 8px', border: '1px solid #334155' }}>{selectedEmp.cargo}</td></tr>
                <tr><td style={{ padding: '4px 8px', border: '1px solid #334155', fontWeight: 'bold' }}>SALARIO BÁSICO MENSUAL:</td><td style={{ padding: '4px 8px', border: '1px solid #334155' }}>{selectedEmp.salarioLetras || selectedEmp.salario} ({selectedEmp.salario})</td></tr>
                <tr><td style={{ padding: '4px 8px', border: '1px solid #334155', fontWeight: 'bold' }}>PERIODOS DE PAGO:</td><td style={{ padding: '4px 8px', border: '1px solid #334155' }}>Mensual</td></tr>
                <tr><td style={{ padding: '4px 8px', border: '1px solid #334155', fontWeight: 'bold' }}>FECHA DE INICIACIÓN:</td><td style={{ padding: '4px 8px', border: '1px solid #334155' }}>{selectedEmp.fechaIngreso}</td></tr>
                <tr><td style={{ padding: '4px 8px', border: '1px solid #334155', fontWeight: 'bold' }}>LUGAR Y CIUDAD:</td><td style={{ padding: '4px 8px', border: '1px solid #334155' }}>Sabanagrande – Atlántico</td></tr>
              </tbody>
            </table>

            <p style={{ textAlign: 'justify', marginBottom: '8px' }}>
              Entre <strong>EL EMPLEADOR</strong> y <strong>EL TRABAJADOR</strong>, de las condiciones ya dichas identificados como aparece al pie de sus correspondientes firmas se ha celebrado el presente contrato individual de trabajo, regido además por las siguientes cláusulas:
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '8px' }}>
              <strong>PRIMERA: OBJETO.</strong> EL EMPLEADOR contrata los servicios personales de EL TRABAJADOR y este se obliga: a) A poner al servicio de EL EMPLEADOR toda su capacidad normal de trabajo en el desempeño de las funciones propias del oficio mencionado y en las labores anexas y complementarias del mismo, de conformidad con las ordenes e instrucciones que le imparta EL EMPLEADOR directamente o a través de sus representantes; b) A prestar sus servicios en forma exclusiva al empleador; es decir, a no prestar directa ni indirectamente servicios laborales a otros empleadores, ni al trabajar por cuenta propia en el mismo oficio, durante la vigencia de este contrato, y c) A guardar absoluta reserva sobre los hechos, documentos físicos y/o electrónicos, informaciones y en general, sobre todos los asuntos y materias que lleguen a su conocimiento por causa o con ocasión de su contrato de trabajo.
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '8px' }}>
              <strong>SEGUNDA: REMUNERACIÓN.</strong> EL EMPLEADOR pagará a EL TRABAJADOR por la prestación de sus servicios el salario indicado en el encabezado del presente documento, pagadero en las oportunidades también señaladas arriba. <em>PARÁGRAFO PRIMERO: SALARIO ORDINARIO:</em> Dentro del salario ordinario se encuentra incluida la remuneración de los descansos dominicales y festivos de que tratan los capítulos I y II del título VII del C.S.T. De igual manera se aclara y se conviene que en los casos en los que EL TRABAJADOR devengue comisiones o cualquier otra modalidad de salario variable, el 82.5% de dichos ingresos, constituye remuneración de la labor realizada, y el 17.5% restante está designado a remunerar el descanso en los días dominicales y festivos que tratan los capítulos I y II del título VII del C.S.T. <em>PARÁGRAFO SEGUNDO: SALARIO INTEGRAL:</em> En la eventualidad en que EL TRABAJADOR devengue salario integral, se entiende de conformidad con el numeral 2 del artículo 132 del C.S.T, subrogado por el artículo 18 de la ley 50/90, que dentro del salario integral convenio se encuentra incorporado el factor prestacional de EL TRABAJADOR, el cual no será inferior al 30% del salario antes mencionado. El salario integral acordado remunera recargo nocturno, dominical, primas, cesantías y auxilios, con excepción de vacaciones. <em>PARÁGRAFO TERCERO:</em> Beneficios ocasionales de alimentación, transporte y habitación no constituyen salario (Arts. 15 y 16 Ley 50/90, Art. 17 Ley 344/96).
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '8px' }}>
              <strong>TERCERA: DURACIÓN DEL CONTRATO.</strong> La duración del presente contrato será indefinida, mientras subsistan las causas que le dieron origen y la materia del trabajo contratado.
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '8px' }}>
              <strong>CUARTA: TRABAJO NOCTURNO, SUPLEMENTARIO, DOMINICAL Y/O FESTIVO.</strong> Todo trabajo suplementario o en días festivos deberá ser autorizado previamente y por escrito. Tratándose de trabajadores de dirección, confianza o manejo, no habrá lugar al pago de horas extras.
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '8px' }}>
              <strong>QUINTA: JORNADA DE TRABAJO.</strong> EL TRABAJADOR se obliga a laborar la jornada máxima legal en los turnos señalados por EL EMPLEADOR (Art. 164 CST, modificado por Ley 50/90).
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '8px' }}>
              <strong>SEXTA: PERIODO DE PRUEBA.</strong> Los dos primeros meses del contrato se consideran período de prueba legal.
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '8px' }}>
              <strong>SÉPTIMA: TERMINACIÓN UNILATERAL.</strong> Son justas causas para darlo por terminado las contempladas en el Art. 62 del CST y faltas graves al reglamento interno.
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '8px' }}>
              <strong>OCTAVA: PROPIEDAD INTELECTUAL.</strong> Toda invención o creación realizada pertenecerá exclusivamente a EL EMPLEADOR.
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '8px' }}>
              <strong>NOVENA: MODIFICACIONES.</strong> EL TRABAJADOR acepta modificaciones laborales en ejercicio del poder subordinante (Art. 23 CST).
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '8px' }}>
              <strong>DÉCIMA: DIRECCIÓN.</strong> Para todos los efectos legales se tendrá como dirección oficial la última registrada en la hoja de vida (Ley 789/02).
            </p>

            <p style={{ textAlign: 'justify', marginBottom: '16px' }}>
              <strong>UNDÉCIMA: EFECTOS.</strong> El presente contrato deja sin efecto cualquier otro celebrado verbalmente o por escrito con anterioridad.
            </p>

            <p style={{ marginBottom: '15px' }}>
              Para constancia se firma en Sabanagrande, Atlántico, a los {hoyFormatoLegal}.
            </p>

            {/* FIRMAS EXACTAS: SAMY DARIANY RODRÍGUEZ SEÑA Y TRABAJADOR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', marginTop: '50px' }}>
              <div style={{ width: '45%' }}>
                <div style={{ borderTop: '1.5px solid #000000', margin: '0 auto 6px auto', width: '220px' }}></div>
                <strong>SAMY DARIANY RODRÍGUEZ SEÑA</strong><br />
                <span>Representante Legal</span><br />
                <strong>EL EMPLEADOR</strong>
              </div>

              <div style={{ width: '45%' }}>
                <div style={{ borderTop: '1.5px solid #000000', margin: '0 auto 6px auto', width: '220px' }}></div>
                <strong>{selectedEmp.nombre}</strong><br />
                <span>C.C. {selectedEmp.documento}</span><br />
                <strong>EL TRABAJADOR</strong>
              </div>
            </div>
          </div>
        )}

        {/* IMPRESIÓN OFICIAL DEL ACTA DE ENTREGA DE EPP */}
        {imprimiendo === 'epp' && selectedEmp && (
          <div style={{ padding: '15mm 20mm', fontFamily: 'Arial, sans-serif', fontSize: '9.5pt', color: '#000000' }}>
            <div style={{ borderBottom: '2px solid #166534', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '14pt', color: '#166534' }}>FRUTAS DEL ATLÁNTICO S.A.S.</strong>
                <div style={{ fontSize: '8.5pt', color: '#475569' }}>NIT: 900.999.999-1 · Sabanagrande, Atlántico</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '9pt', fontWeight: 'bold', color: '#166534' }}>
                ACTA FORMAL DE ENTREGA DE EPP<br />SG-SST (RESOLUCIÓN 2400 DE 1979)
              </div>
            </div>

            <p style={{ marginBottom: '12px' }}>
              <strong>Trabajador:</strong> {selectedEmp.nombre} | <strong>C.C.:</strong> {selectedEmp.documento} | <strong>Cargo:</strong> {selectedEmp.cargo} | <strong>Fecha:</strong> {hoyFormatoLegal}
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9' }}>
                  <th style={{ border: '1px solid #334155', padding: '6px', textAlign: 'left' }}>Elemento de Protección Personal (EPP) Asignado</th>
                  <th style={{ border: '1px solid #334155', padding: '6px', textAlign: 'center', width: '100px' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {LISTA_OFICIAL_EPP.filter(e => eppMarcados[e.id]).map((item) => (
                  <tr key={item.id}>
                    <td style={{ border: '1px solid #334155', padding: '6px' }}>{item.nombre}</td>
                    <td style={{ border: '1px solid #334155', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>Entregado</td>
                  </tr>
                ))}
                {!Object.values(eppMarcados).some(Boolean) && (
                  <tr><td colSpan="2" style={{ border: '1px solid #334155', padding: '12px', textAlign: 'center' }}>No se seleccionaron elementos en esta entrega puntual.</td></tr>
                )}
              </tbody>
            </table>

            <p style={{ fontSize: '8.5pt', textAlign: 'justify', lineHeight: '1.5' }}>
              El colaborador declara recibir a satisfacción los elementos señalados y asume el compromiso de portarlos de forma obligatoria durante su jornada laboral, garantizando su preservación y uso seguro conforme al SG-SST.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', textAlign: 'center' }}>
              <div style={{ width: '45%' }}>
                <div style={{ borderTop: '1.5px solid #000000', margin: '0 auto 6px auto', width: '200px' }}></div>
                <strong>{selectedEmp.nombre}</strong><br />
                <span>Firma del Trabajador (Recibí Conforme)</span>
              </div>

              <div style={{ width: '45%' }}>
                <div style={{ borderTop: '1.5px solid #000000', margin: '0 auto 6px auto', width: '200px' }}></div>
                <strong>Responsable SG-SST</strong><br />
                <span>Frutas Del Atlántico S.A.S.</span>
              </div>
            </div>
          </div>
        )}

        {/* IMPRESIÓN OFICIAL DE LA CONSTANCIA DE INDUCCIÓN (FIRMAS EN PARALELO LIMPIAS) */}
        {imprimiendo === 'induccion' && selectedEmp && (
          <div style={{ padding: '20mm 20mm', fontFamily: 'serif', fontSize: '11pt', color: '#000000', lineHeight: '1.8' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #166534', paddingBottom: '12px', marginBottom: '35px' }}>
              <div style={{ fontSize: '16pt', fontWeight: 'bold', color: '#166534', fontFamily: 'Arial, sans-serif' }}>FRUTAS DEL ATLÁNTICO S.A.S.</div>
              <div style={{ fontSize: '9pt', color: '#64748b', fontFamily: 'Arial, sans-serif' }}>NIT: 900.999.999-1 · Sabanagrande, Atlántico</div>
              <div style={{ fontSize: '11pt', fontWeight: 'bold', marginTop: '10px', textTransform: 'uppercase', fontFamily: 'Arial, sans-serif' }}>
                CONSTANCIA DE INDUCCIÓN INSTITUCIONAL Y SG-SST
              </div>
            </div>

            <p style={{ textAlign: 'justify', textIndent: '30px', marginBottom: '30px' }}>
              Se certifica que el(la) colaborador(a) <strong>{selectedEmp.nombre}</strong>, identificado(a) con C.C. <strong>{selectedEmp.documento}</strong>, culminó su proceso de inducción reglamentaria para el cargo de <strong>{selectedEmp.cargo}</strong> el día <strong>{fechaInduccion}</strong>, obteniendo una calificación de comprensión del <strong>{calificacionInduccion}%</strong> en los módulos de Políticas Institucionales Frutopical, SG-SST (Dec. 1072), Matriz de Peligros en Planta Agroindustrial, Buenas Prácticas de Manufactura (BPM) y Uso Correcto de EPP.
            </p>

            <p style={{ marginBottom: '80px' }}>
              La presente constancia se expide en Sabanagrande, Atlántico, a los {hoyFormatoLegal}.
            </p>

            {/* FIRMAS EXACTAS EN DOS COLUMNAS PARALELAS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
              <div style={{ width: '45%' }}>
                <div style={{ borderTop: '1.5px solid #000000', margin: '0 auto 6px auto', width: '200px' }}></div>
                <strong>{selectedEmp.nombre}</strong><br />
                <span style={{ fontSize: '9pt', color: '#475569' }}>Firma del Trabajador</span><br />
                <span style={{ fontSize: '9pt' }}>C.C. {selectedEmp.documento}</span>
              </div>

              <div style={{ width: '45%' }}>
                <div style={{ borderTop: '1.5px solid #000000', margin: '0 auto 6px auto', width: '200px' }}></div>
                <strong>{evaluadorInduccion}</strong><br />
                <span style={{ fontSize: '9pt', color: '#475569' }}>Jefe de Talento Humano</span><br />
                <span style={{ fontSize: '9pt' }}>Frutas Del Atlántico S.A.S.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}