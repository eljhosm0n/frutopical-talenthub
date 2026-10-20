import React, { useState, useEffect } from 'react';
import '../dashboard.css';

// 1. LISTA OFICIAL EXACTA DE LOS 16 ELEMENTOS DE PROTECCIÓN PERSONAL (EPP)
const LISTA_OFICIAL_EPP = [
  { id: 'epp1', nombre: 'Lentes de protección (Filtro UV / Luz azul / Transparente)', area: 'Planta / Mantenimiento / Control Calidad' },
  { id: 'epp2', nombre: 'Botas de seguridad con puntera antideslizante (Dieléctricas / Convencionales)', area: 'Bodega / Logística / Operaciones Mecánicas' },
  { id: 'epp3', nombre: 'Botas de caucho industrial antideslizantes', area: 'Planta Húmeda / Lavado y Despulpado de Fruta' },
  { id: 'epp4', nombre: 'Guantes de protección táctil / química (Nitrilo / Desechables)', area: 'Manipulación de Fruta / Inocuidad BPM' },
  { id: 'epp5', nombre: 'Guantes de protección mecánica / agarre (Carnaza / Antideslizantes)', area: 'Cargue, Descargue y Mantenimiento' },
  { id: 'epp6', nombre: 'Guantes dieléctricos', area: 'Instalaciones Eléctricas / Tableros' },
  { id: 'epp7', nombre: 'Guantes térmicos', area: 'Cuartos Fríos / Congelación' },
  { id: 'epp8', nombre: 'Manilla antiestática', area: 'Sistemas e Infraestructura' },
  { id: 'epp9', nombre: 'Protectores auditivos (Inserción / Copa)', area: 'Línea de Pasteurización y Maquinaria Pesada' },
  { id: 'epp10', nombre: 'Delantal / Peto plástico impermeable', area: 'Despulpado y Envasado al Vacío' },
  { id: 'epp11', nombre: 'Chaqueta / Capote impermeable', area: 'Recepción y Lavado Externo de Fruta' },
  { id: 'epp12', nombre: 'Chaqueta térmica', area: 'Cámaras de Almacenamiento Congelado' },
  { id: 'epp13', nombre: 'Chaleco reflectivo', area: 'Despachos, Patio de Maniobras y Envíos' },
  { id: 'epp14', nombre: 'Faja ergonómica lumbar', area: 'Manipulación Manual de Cargas y Estibado' },
  { id: 'epp15', nombre: 'Cofia para el cabello', area: 'Uso Obligatorio en toda la Planta (BPM)' },
  { id: 'epp16', nombre: 'Tapabocas / Kit de bioseguridad', area: 'Inocuidad Alimentaria Integral' }
];

// 2. REPOSITORIO DE PLANTILLAS Y FORMULARIOS VIGENTES CON LAS ENTIDADES OFICIALES DE LA EMPRESA
const REPOSITORIO_DOCUMENTAL = [
  { id: 'f_arl', entidad: 'ARL COLMENA SEGUROS', tipo: 'Riesgos Laborales', formato: 'Formulario Único de Afiliación y Novedades (Riesgo I a IV)', archivo: 'Formato afiliacion COLMENA.pdf', vigencia: 'Vigente Oficial' },
  { id: 'f_caja', entidad: 'Combarranquilla', tipo: 'Compensación Familiar', formato: 'Formulario de Afiliación Trabajador y Beneficiarios', archivo: 'Formato afiliacion trabajador_Combarranquilla.pdf', vigencia: 'Vigente Oficial' },
  { id: 'f_pension_colpensiones', entidad: 'Colpensiones', tipo: 'Pensiones (Régimen Prima Media)', formato: 'Formulario de Afiliación al Sistema General de Pensiones', archivo: 'Formato AFP_Colpensiones.pdf', vigencia: 'Vigente Oficial' },
  { id: 'f_pension_porvenir', entidad: 'Porvenir', tipo: 'Pensiones y Cesantías (RAIS)', formato: 'Solicitud de Vinculación y Selección de Fondo', archivo: 'Formato AFP_Porvenir.pdf', vigencia: 'Vigente Oficial' },
  { id: 'f_pension_colfondos', entidad: 'Colfondos', tipo: 'Pensiones y Cesantías (RAIS)', formato: 'Solicitud de Vinculación o Traslado', archivo: 'Formato AFP_Colfondos.pdf', vigencia: 'Vigente Oficial' },
  { id: 'f_eps', entidad: 'EPS Sanitas', tipo: 'Salud (SGSSS)', formato: 'Formulario Único de Afiliación y Registro de Novedades', archivo: 'Formato afiliacion SANITAS.pdf', vigencia: 'Vigente Oficial' },
  { id: 'm_indef', entidad: 'Minuta Legal Frutopical', tipo: 'Contratación', formato: 'Contrato Individual de Trabajo a Término Indefinido (11 Cláusulas)', archivo: 'Minuta contrato termino indefinido.docx', vigencia: 'Plantilla Vigente' },
  { id: 'm_fijo', entidad: 'Minuta Legal Frutopical', tipo: 'Contratación', formato: 'Contrato a Término Fijo Inferior a un Año (11 Cláusulas)', archivo: 'CONTRATO A TERMINO FIJO INFERIOR A UN AÑO.docx', vigencia: 'Plantilla Vigente' }
];

export default function SSTGestion({ onVolver }) {
  const [tabActiva, setTabActiva] = useState('lista_chequeo');
  const [tipoContratoMinuta, setTipoContratoMinuta] = useState('indefinido');

  const [empleados, setEmpleados] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);

  // LISTA DE CHEQUEO (SOLO DOCUMENTOS QUE TRAE EL ASPIRANTE)
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
    b3_recibo: false
  });

  // FORMATOS INTERNOS DE CONTRATACIÓN (UBICADOS EN PESTAÑA 2)
  const [checksContratacion, setChecksContratacion] = useState({
    c_contrato: false,
    c_habeas: false,
    c_rit: false,
    c_epp: false
  });

  const [eppMarcados, setEppMarcados] = useState({});
  const [evaluadorInduccion, setEvaluadorInduccion] = useState('Laura Mendoza Peñaranda');
  const [calificacionInduccion, setCalificacionInduccion] = useState(100);
  const [fechaInduccion, setFechaInduccion] = useState(new Date().toISOString().split('T')[0]);
  const [visorModal, setVisorModal] = useState(null);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  function cargarEmpleados() {
    let lista = [];
    const guardados = localStorage.getItem('frutopical_empleados');
    if (guardados) {
      try {
        const parsed = JSON.parse(guardados);
        if (Array.isArray(parsed) && parsed.length > 0) {
          lista = parsed;
        }
      } catch {}
    }

    if (!lista.length) {
      lista = [
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
      localStorage.setItem('frutopical_empleados', JSON.stringify(lista));
    }

    setEmpleados(lista);
    setSelectedEmp(lista[0]);
  }

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
        b3_recibo: false
      });
      setChecksContratacion({
        c_contrato: false,
        c_habeas: false,
        c_rit: false,
        c_epp: false
      });
      setEppMarcados({});
    }
  }

  const esHombre =
    selectedEmp?.genero === 'M' ||
    ['carlos', 'david', 'alejandro', 'min', 'jhostin'].some((n) =>
      (selectedEmp?.nombre || '').toLowerCase().includes(n)
    );

  const camposEvaluados = [
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
    checks.b3_recibo
  ];

  if (esHombre) {
    camposEvaluados.push(checks.b3_libreta);
  }

  const cumplidos = camposEvaluados.filter(Boolean).length;
  const totalEvaluables = camposEvaluados.length;
  const porcentaje = Math.round((cumplidos / totalEvaluables) * 100);
  const estaCompleto = porcentaje === 100;

  const fechaHoyLegal = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // IMPRESIÓN LIMPIA EN VENTANA NATIVA (SIN PANTALLAZOS)
  function imprimirEnVentanaLimpia(titulo, cuerpoHtml) {
    const ventana = window.open('', '_blank', 'width=850,height=1000');
    if (!ventana) {
      alert('Por favor habilita las ventanas emergentes para generar e imprimir el documento formal.');
      return;
    }
    ventana.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${titulo}</title>
          <style>
            @page { size: letter; margin: 18mm 20mm; }
            body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.6; color: #000; margin: 0; padding: 0; }
            h2, h3, h4 { font-family: Arial, sans-serif; text-align: center; margin: 0; }
            .header { border-bottom: 2px solid #166534; padding-bottom: 8px; margin-bottom: 20px; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 9.5pt; font-family: Arial, sans-serif; }
            th, td { border: 1px solid #333; padding: 6px 8px; }
            .firmas { margin-top: 55px; display: flex; justify-content: space-between; text-align: center; }
            .linea { border-top: 1.5px solid #000; width: 220px; margin: 0 auto 6px auto; }
          </style>
        </head>
        <body>
          ${cuerpoHtml}
          <script>
            window.onload = function() { window.print(); window.close(); };
          </script>
        </body>
      </html>
    `);
    ventana.document.close();
  }

  function handleImprimirContrato() {
    const esIndefinido = tipoContratoMinuta === 'indefinido';
    const htmlContrato = `
      <div class="header">
        <h2 style="color: #166534;">FRUTAS DEL ATLÁNTICO S.A.S.</h2>
        <div style="font-size: 9pt; color: #555;">NIT: 900.999.999-1 · Carrera 2A # 20-35, Sabanagrande (Atlántico)</div>
        <h3 style="margin-top: 8px;">CONTRATO INDIVIDUAL DE TRABAJO A ${esIndefinido ? 'TÉRMINO INDEFINIDO' : 'TÉRMINO FIJO INFERIOR A UN AÑO'}</h3>
      </div>
      <table>
        <tr><td style="width: 32%;"><strong>NOMBRE DEL EMPLEADOR:</strong></td><td>FRUTAS DEL ATLÁNTICO S.A.S.</td></tr>
        <tr><td><strong>DIRECCION DEL EMPLEADOR:</strong></td><td>Carrera 2A # 20-35 Sabanagrande (Atl.)</td></tr>
        <tr><td><strong>NOMBRE DEL TRABAJADOR:</strong></td><td>${selectedEmp?.nombre}</td></tr>
        <tr><td><strong>DIRECCION DEL TRABAJADOR:</strong></td><td>${selectedEmp?.direccion || 'Sabanagrande – Atlántico'}</td></tr>
        <tr><td><strong>CARGO U OFICIO:</strong></td><td>${selectedEmp?.cargo}</td></tr>
        <tr><td><strong>SALARIO:</strong></td><td>${selectedEmp?.salarioLetras || selectedEmp?.salario} (${selectedEmp?.salario})</td></tr>
        <tr><td><strong>PERIODOS DE PAGO:</strong></td><td>Mensual</td></tr>
        <tr><td><strong>FECHA DE INICIACIÓN:</strong></td><td>${selectedEmp?.fechaIngreso}</td></tr>
        ${!esIndefinido ? '<tr><td><strong>TÉRMINO INICIAL:</strong></td><td>Seis (6) Meses</td></tr><tr><td><strong>VENCE EL DÍA:</strong></td><td>31 de agosto de 2026</td></tr>' : ''}
        <tr><td><strong>LUGAR Y CIUDAD:</strong></td><td>Sabanagrande – Atlántico</td></tr>
      </table>
      <p style="text-align: justify;">Entre EL EMPLEADOR y EL TRABAJADOR, identificados al pie de sus firmas, se celebra el presente contrato de trabajo regido por las siguientes cláusulas:</p>
      <p style="text-align: justify;"><strong>PRIMERA: OBJETO.</strong> EL EMPLEADOR contrata los servicios personales de EL TRABAJADOR para desempeñar las funciones del oficio con exclusividad y confidencialidad.</p>
      <p style="text-align: justify;"><strong>SEGUNDA: REMUNERACIÓN.</strong> Salario acordado en el encabezado. Se incluye remuneración de descansos dominicales y festivos (C.S.T.).</p>
      <p style="text-align: justify;"><strong>TERCERA: DURACIÓN DEL CONTRATO.</strong> ${esIndefinido ? 'Será indefinida mientras subsistan las causas que le dieron origen.' : 'Término inicial señalado arriba, prorrogable conforme a la ley.'}</p>
      <p style="text-align: justify;"><strong>CUARTA: TRABAJO SUPLEMENTARIO.</strong> Horas extras y recargos requerirán autorización previa y por escrito.</p>
      <p style="text-align: justify;"><strong>QUINTA: JORNADA DE TRABAJO.</strong> Se laborará la jornada máxima legal en los turnos fijados por la empresa (Art. 164 C.S.T.).</p>
      <p style="text-align: justify;"><strong>SEXTA: PERIODO DE PRUEBA.</strong> ${esIndefinido ? 'Los dos primeros meses se consideran período de prueba legal.' : 'La quinta parte del término pactado sin exceder dos meses.'}</p>
      <p style="text-align: justify;"><strong>SÉPTIMA: TERMINACIÓN UNILATERAL.</strong> Justas causas las contempladas en el Art. 62 del C.S.T. y faltas graves al reglamento interno.</p>
      <p style="text-align: justify;"><strong>OCTAVA: PROPIEDAD INTELECTUAL.</strong> Todo desarrollo o invención pertenece exclusivamente a EL EMPLEADOR.</p>
      <p style="text-align: justify;"><strong>NOVENA: MODIFICACIONES.</strong> EL TRABAJADOR acepta modificaciones laborales operativas en ejercicio del poder subordinante (Art. 23 C.S.T.).</p>
      <p style="text-align: justify;"><strong>DÉCIMA: DIRECCIÓN.</strong> Se tendrá como domicilio contractual la última dirección registrada en su hoja de vida (Ley 789/02).</p>
      <p style="text-align: justify;"><strong>UNDÉCIMA: EFECTOS.</strong> Reemplaza en su integridad cualquier acuerdo previo.</p>
      <p style="margin-top: 20px;">Para constancia se firma en Sabanagrande a los ${fechaHoyLegal}.</p>
      <div class="firmas">
        <div style="width: 45%;">
          <div class="linea"></div>
          <strong>SAMY DARIANY RODRÍGUEZ SEÑA</strong><br>Representante Legal<br><strong>EL EMPLEADOR</strong>
        </div>
        <div style="width: 45%;">
          <div class="linea"></div>
          <strong>${selectedEmp?.nombre}</strong><br>C.C. ${selectedEmp?.documento}<br><strong>EL TRABAJADOR</strong>
        </div>
      </div>
    `;
    imprimirEnVentanaLimpia(`Contrato_${selectedEmp?.nombre}`, htmlContrato);
  }

  function handleImprimirEpp() {
    const marcados = LISTA_OFICIAL_EPP.filter((e) => eppMarcados[e.id]);
    const filasEpp = marcados.length
      ? marcados.map((m) => `<tr><td>${m.nombre}</td><td style="text-align: center; font-weight: bold;">Entregado</td></tr>`).join('')
      : '<tr><td colspan="2" style="text-align: center;">No se seleccionaron elementos en esta entrega puntual.</td></tr>';

    const htmlEpp = `
      <div class="header">
        <h2 style="color: #166534;">FRUTAS DEL ATLÁNTICO S.A.S.</h2>
        <div style="font-size: 9pt; color: #555;">NIT: 900.999.999-1 · Sabanagrande (Atlántico)</div>
        <h3 style="margin-top: 8px;">ACTA FORMAL DE ENTREGA DE ELEMENTOS DE PROTECCIÓN PERSONAL (EPP)</h3>
        <div style="font-size: 9pt;">Resolución 2400 de 1979 · Decreto 1072 de 2015</div>
      </div>
      <p><strong>Colaborador:</strong> ${selectedEmp?.nombre} | <strong>C.C.:</strong> ${selectedEmp?.documento} | <strong>Cargo:</strong> ${selectedEmp?.cargo} | <strong>Fecha:</strong> ${fechaHoyLegal}</p>
      <table>
        <tr style="background-color: #f2f2f2;"><th>Elemento de Protección Personal (EPP) Entregado</th><th style="width: 100px;">Estado</th></tr>
        ${filasEpp}
      </table>
      <p style="font-size: 9pt; text-align: justify;">El colaborador se compromete a usar de forma obligatoria los EPP asignados durante toda su jornada, cuidarlos y reportar cualquier deterioro ante el Responsable del SG-SST.</p>
      <div class="firmas">
        <div style="width: 45%;">
          <div class="linea"></div>
          <strong>${selectedEmp?.nombre}</strong><br>Firma del Trabajador (Recibí Conforme)<br>C.C. ${selectedEmp?.documento}
        </div>
        <div style="width: 45%;">
          <div class="linea"></div>
          <strong>Responsable SG-SST</strong><br>Frutas Del Atlántico S.A.S.
        </div>
      </div>
    `;
    imprimirEnVentanaLimpia(`Acta_EPP_${selectedEmp?.nombre}`, htmlEpp);
  }

  function handleImprimirInduccion() {
    const htmlInduccion = `
      <div class="header">
        <h2 style="color: #166534;">FRUTAS DEL ATLÁNTICO S.A.S.</h2>
        <div style="font-size: 9pt; color: #555;">NIT: 900.999.999-1 · Sabanagrande, Atlántico</div>
        <h3 style="margin-top: 8px;">CONSTANCIA DE INDUCCIÓN INSTITUCIONAL Y SG-SST</h3>
      </div>
      <p style="text-align: justify; text-indent: 30px; margin-top: 30px;">
        Se certifica que el(la) colaborador(a) <strong>${selectedEmp?.nombre}</strong>, identificado(a) con C.C. <strong>${selectedEmp?.documento}</strong>, culminó su proceso de inducción reglamentaria para el cargo de <strong>${selectedEmp?.cargo}</strong> el día <strong>${fechaInduccion}</strong>, obteniendo una calificación de comprensión del <strong>${calificacionInduccion}%</strong> en los módulos de Políticas Institucionales Frutopical, SG-SST (Dec. 1072), Matriz de Peligros en Planta Agroindustrial, Buenas Prácticas de Manufactura (BPM) y Uso Correcto de EPP.
      </p>
      <p style="margin-top: 30px;">La presente constancia se expide en Sabanagrande a los ${fechaHoyLegal}.</p>
      <div class="firmas" style="margin-top: 80px;">
        <div style="width: 45%;">
          <div class="linea"></div>
          <strong>${selectedEmp?.nombre}</strong><br>Firma del Trabajador<br>C.C. ${selectedEmp?.documento}
        </div>
        <div style="width: 45%;">
          <div class="linea"></div>
          <strong>${evaluadorInduccion}</strong><br>Jefe de Talento Humano<br>Frutas Del Atlántico S.A.S.
        </div>
      </div>
    `;
    imprimirEnVentanaLimpia(`Induccion_${selectedEmp?.nombre}`, htmlInduccion);
  }

  function descargarArchivoRepositorio(item) {
    const enlace = document.createElement('a');
    enlace.href = `/docs/${encodeURIComponent(item.archivo)}`;
    enlace.download = item.archivo;
    enlace.target = '_blank';
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
  }

  return (
    <section className="th-page-section" style={{ padding: '2rem' }}>
      {/* CABECERA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
        <div>
          <span className="th-label">EQUIPO 3 · VINCULACIÓN Y SG-SST</span>
          <h2 style={{ margin: '0.2rem 0', color: '#166534', fontSize: '1.45rem' }}>
            Vinculación de Trabajadores y Seguridad Laboral
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Auditoría de ingreso, contratación legal, asignación de EPP e inducción institucional.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', backgroundColor: '#f0fdf4', padding: '0.5rem 0.9rem', borderRadius: '10px', border: '1.5px solid #86efac' }}>
          <strong style={{ fontSize: '0.82rem', color: '#166534' }}>Colaborador:</strong>
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

      {/* PESTAÑAS OFICIALES REORDENADAS */}
      <div style={{ display: 'flex', gap: '0.6rem', borderBottom: '2px solid #cbd5e1', marginBottom: '1.8rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setTabActiva('lista_chequeo')}
          style={{
            padding: '0.65rem 1.2rem',
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
            padding: '0.65rem 1.2rem',
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
            padding: '0.65rem 1.2rem',
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
            padding: '0.65rem 1.2rem',
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

      {/* PESTAÑA 1: LISTA DE CHEQUEO DE INGRESO (BLOQUE 4 RETIRADO) */}
      {tabActiva === 'lista_chequeo' && (
        <div>
          <div
            style={{
              padding: '1.2rem 1.5rem',
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
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: estaCompleto ? '#166534' : '#92400e', textTransform: 'uppercase' }}>
                AUDITORÍA DE INGRESO · {selectedEmp?.nombre}
              </span>
              <h3 style={{ margin: '0.2rem 0', fontSize: '1.2rem', color: estaCompleto ? '#14532d' : '#78350f' }}>
                {estaCompleto
                  ? '✅ Continuar con el proceso de vinculación'
                  : '⚠️ Contactar al nuevo ingreso para notificar documento faltante'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: estaCompleto ? '#166534' : '#92400e' }}>
                {estaCompleto
                  ? 'Soportes del aspirante al 100%. Continúa a la pestaña 2 para formalizar la contratación.'
                  : `Se han verificado ${cumplidos} de ${totalEvaluables} documentos obligatorios aportados por el trabajador.`}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: estaCompleto ? '#166534' : '#b45309' }}>
                {porcentaje}%
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b' }}>Conformidad del Aspirante</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.4rem' }}>
            {/* BLOQUE 1 */}
            <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '1.2rem' }}>
              <h4 style={{ margin: '0 0 0.4rem 0', color: '#166534', fontSize: '0.92rem', borderBottom: '1.5px solid #dcfce7', paddingBottom: '0.4rem' }}>
                BLOQUE 1: Documentos Personales de Identificación
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 0.8rem 0' }}>
                Documentos físicos entregados por el candidato seleccionado:
              </p>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b1_doc} onChange={() => setChecks((p) => ({ ...p, b1_doc: !p.b1_doc }))} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Fotocopia documento de identidad al 150% (obligatorio)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b1_ant} onChange={() => setChecks((p) => ({ ...p, b1_ant: !p.b1_ant }))} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Certificado de antecedentes</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b1_hv} onChange={() => setChecks((p) => ({ ...p, b1_hv: !p.b1_hv }))} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Hoja de vida con soportes comprobables</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b1_cert_acad} onChange={() => setChecks((p) => ({ ...p, b1_cert_acad: !p.b1_cert_acad }))} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Certificados académicos (Diploma bachiller / técnico)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b1_cert_lab} onChange={() => setChecks((p) => ({ ...p, b1_cert_lab: !p.b1_cert_lab }))} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Certificaciones laborales de experiencia previa</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.2rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b1_medico} onChange={() => setChecks((p) => ({ ...p, b1_medico: !p.b1_medico }))} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Concepto médico de ingreso (Examen de Aptitud Laboral)</span>
              </label>
            </div>

            {/* BLOQUE 2 */}
            <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '1.2rem' }}>
              <h4 style={{ margin: '0 0 0.4rem 0', color: '#166534', fontSize: '0.92rem', borderBottom: '1.5px solid #dcfce7', paddingBottom: '0.4rem' }}>
                BLOQUE 2: Seguridad Social y Dispersión de Nómina
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 0.8rem 0' }}>
                Certificados bancarios y de fondos aportados para las afiliaciones:
              </p>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b2_eps} onChange={() => setChecks((p) => ({ ...p, b2_eps: !p.b2_eps }))} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Certificado de Afiliación a EPS (Estado Activo)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b2_pension} onChange={() => setChecks((p) => ({ ...p, b2_pension: !p.b2_pension }))} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Certificado de Fondo de Pensiones (Colpensiones / Fondos Privados)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b2_cesantias} onChange={() => setChecks((p) => ({ ...p, b2_cesantias: !p.b2_cesantias }))} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Certificación de Fondo de Cesantías</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.2rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b2_banco} onChange={() => setChecks((p) => ({ ...p, b2_banco: !p.b2_banco }))} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Certificado de Cuenta Bancaria (Para dispersión de nómina)</span>
              </label>
            </div>

            {/* BLOQUE 3 */}
            <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '1.2rem' }}>
              <h4 style={{ margin: '0 0 0.4rem 0', color: '#166534', fontSize: '0.92rem', borderBottom: '1.5px solid #dcfce7', paddingBottom: '0.4rem' }}>
                BLOQUE 3: Otros Documentos Requisito
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 0.8rem 0' }}>
                Requisitos según condición legal y domicilio:
              </p>

              {esHombre ? (
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={checks.b3_libreta} onChange={() => setChecks((p) => ({ ...p, b3_libreta: !p.b3_libreta }))} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                  <span>Fotocopia libreta militar ampliada al 150% (Exigible para hombres)</span>
                </label>
              ) : (
                <div style={{ padding: '0.6rem 0.8rem', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '0.78rem', color: '#64748b', marginBottom: '0.65rem', border: '1px dashed #cbd5e1' }}>
                  ℹ️ Libreta militar no exigible (Aplica únicamente a candidatos masculinos).
                </div>
              )}

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', marginBottom: '0.2rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.b3_recibo} onChange={() => setChecks((p) => ({ ...p, b3_recibo: !p.b3_recibo }))} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Certificado de residencia / Recibo de servicio público de domicilio</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: CONTRATACIÓN (AQUÍ ESTÁ UBICADO EL BLOQUE 4 Y EL REPOSITORIO) */}
      {tabActiva === 'contratacion' && selectedEmp && (
        <div>
          {/* BLOQUE 4 UBICADO AQUÍ */}
          <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '1.4rem', marginBottom: '1.8rem' }}>
            <h4 style={{ margin: '0 0 0.4rem 0', color: '#166534', fontSize: '1rem', borderBottom: '1.5px solid #dcfce7', paddingBottom: '0.4rem' }}>
              BLOQUE 4: Formatos Internos de Contratación de Frutopical S.A.S.
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 1rem 0' }}>
              Formatos institucionales emitidos por la empresa durante la formalización:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checksContratacion.c_contrato} onChange={() => setChecksContratacion((p) => ({ ...p, c_contrato: !p.c_contrato }))} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Contrato Individual de Trabajo: Firmado en original</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checksContratacion.c_habeas} onChange={() => setChecksContratacion((p) => ({ ...p, c_habeas: !p.c_habeas }))} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Autorización firmada para Tratamiento de Datos (Ley 1581)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checksContratacion.c_rit} onChange={() => setChecksContratacion((p) => ({ ...p, c_rit: !p.c_rit }))} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Constancia de Notificación del Reglamento Interno (RIT)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={checksContratacion.c_epp} onChange={() => setChecksContratacion((p) => ({ ...p, c_epp: !p.c_epp }))} style={{ accentColor: '#166534', width: '16px', height: '16px' }} />
                <span>Formato de Entrega de Elementos EPP firmado</span>
              </label>
            </div>
          </div>

          {/* GENERADOR DE MINUTA LEGAL */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h3 style={{ margin: 0, color: '#166534', fontSize: '1.2rem' }}>Minuta Legal de Contratación:</h3>
              <select
                value={tipoContratoMinuta}
                onChange={(e) => setTipoContratoMinuta(e.target.value)}
                style={{ padding: '0.45rem 0.8rem', borderRadius: '6px', border: '1.5px solid #166534', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                <option value="indefinido">Término Indefinido</option>
                <option value="fijo">Término Fijo Inferior a un Año</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleImprimirContrato}
              style={{ backgroundColor: '#166534', color: '#ffffff', border: 'none', padding: '0.7rem 1.4rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              🖨️ Imprimir Minuta Completa (PDF)
            </button>
          </div>

          {/* VISUALIZADOR DE LA MINUTA */}
          <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '2rem', maxHeight: '480px', overflowY: 'auto', fontSize: '10pt', lineHeight: 1.7, color: '#1e293b' }}>
            <h4 style={{ textAlign: 'center', color: '#166534', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              CONTRATO INDIVIDUAL DE TRABAJO A {tipoContratoMinuta === 'indefinido' ? 'TÉRMINO INDEFINIDO' : 'TÉRMINO FIJO INFERIOR A UN AÑO'}
            </h4>
            <div style={{ backgroundColor: '#f8fafc', padding: '0.8rem', border: '1px solid #cbd5e1', margin: '1rem 0', fontSize: '9pt' }}>
              <strong>EMPLEADOR:</strong> FRUTAS DEL ATLÁNTICO S.A.S. | <strong>DIRECCIÓN:</strong> Carrera 2A # 20-35 Sabanagrande (Atl.)<br />
              <strong>TRABAJADOR:</strong> {selectedEmp.nombre} | <strong>CARGO:</strong> {selectedEmp.cargo} | <strong>SALARIO:</strong> {selectedEmp.salario}<br />
              <strong>FECHA DE INICIACIÓN:</strong> {selectedEmp.fechaIngreso} | <strong>CIUDAD:</strong> Sabanagrande – Atlántico
            </div>
            <p><strong>PRIMERA: OBJETO.</strong> EL EMPLEADOR contrata los servicios personales de EL TRABAJADOR para desempeñar las funciones propias del oficio con exclusividad y confidencialidad.</p>
            <p><strong>SEGUNDA: REMUNERACIÓN.</strong> Salario mensual acordado. Incluye descansos dominicales y festivos (C.S.T.).</p>
            <p><strong>TERCERA: DURACIÓN DEL CONTRATO.</strong> {tipoContratoMinuta === 'indefinido' ? 'Indefinida mientras subsistan las causas.' : 'Término inicial fijo prorrogable conforme a la ley.'}</p>
            <p><strong>CUARTA a UNDÉCIMA:</strong> Cláusulas sobre trabajo suplementario, jornada ordinaria, período de prueba legal, propiedad intelectual y notificaciones contractuales.</p>
          </div>

          {/* REPOSITORIO DE FORMULARIOS Y MINUTAS */}
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1.5px solid #cbd5e1' }}>
            <strong style={{ color: '#166534', fontSize: '1rem', display: 'block', marginBottom: '0.3rem' }}>
              📁 Repositorio de Minutas de Contratos y Formularios de Afiliación
            </strong>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#64748b' }}>
              Formatos oficiales vigentes para consulta y descarga institucional:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem' }}>
              {REPOSITORIO_DOCUMENTAL.map((item) => (
                <div key={item.id} style={{ backgroundColor: '#ffffff', padding: '0.9rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#c2410c' }}>{item.tipo}</span>
                    <strong style={{ display: 'block', fontSize: '0.84rem', color: '#1e293b', margin: '0.2rem 0' }}>{item.entidad}</strong>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{item.formato}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 'bold' }}>✓ {item.vigencia}</span>
                    <button
                      type="button"
                      onClick={() => setVisorModal(item)}
                      style={{ padding: '0.3rem 0.6rem', backgroundColor: '#f0fdf4', border: '1px solid #86efac', color: '#166534', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 'bold', cursor: 'pointer' }}
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

      {/* PESTAÑA 3: ENTREGA DE EPP (SIN MINUTAS DUPLICADAS AL FINAL) */}
      {tabActiva === 'epp' && selectedEmp && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
            <div>
              <span className="th-label">SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO</span>
              <h3 style={{ margin: '0.2rem 0', color: '#166534', fontSize: '1.35rem' }}>
                Matriz de EPP para {selectedEmp.nombre}
              </h3>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
                Cargo: <strong>{selectedEmp.cargo}</strong> · Protocolo oficial bajo Resolución 2400 de 1979.
              </p>
            </div>

            <button
              type="button"
              onClick={handleImprimirEpp}
              style={{ backgroundColor: '#166534', color: '#ffffff', border: 'none', padding: '0.7rem 1.4rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              🖨️ Imprimir Acta de Entrega EPP
            </button>
          </div>

          <div style={{ backgroundColor: '#f0fdf4', padding: '0.8rem 1.2rem', borderRadius: '8px', border: '1.5px solid #86efac', marginBottom: '1.4rem', fontSize: '0.82rem', color: '#166534' }}>
            ℹ️ <strong>Instrucción Técnica:</strong> Los 16 elementos inician desmarcados. El auxiliar de SST debe marcar exclusivamente los correspondientes a la labor del trabajador. (La dotación de uniformes se gestiona en formato administrativo separado).
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.8rem' }}>
            {LISTA_OFICIAL_EPP.map((epp) => {
              const checked = !!eppMarcados[epp.id];
              return (
                <label
                  key={epp.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    backgroundColor: checked ? '#ecfdf5' : '#ffffff',
                    border: `1.5px solid ${checked ? '#10b981' : '#cbd5e1'}`,
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setEppMarcados((p) => ({ ...p, [epp.id]: !p[epp.id] }))}
                    style={{ marginTop: '0.2rem', accentColor: '#166534', width: '16px', height: '16px' }}
                  />
                  <div>
                    <strong style={{ fontSize: '0.84rem', color: checked ? '#065f46' : '#1e293b', display: 'block' }}>
                      {epp.nombre}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Área: {epp.area}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* PESTAÑA 4: CONSTANCIA E INDUCCIÓN SST (SIN ACTAS DUPLICADAS AL FINAL) */}
      {tabActiva === 'induccion' && selectedEmp && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1.5px solid #cbd5e1' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#166534', fontSize: '1.2rem' }}>Parametrizar Inducción SG-SST</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Colaborador:</label>
              <input type="text" disabled value={`${selectedEmp.nombre} (C.C. ${selectedEmp.documento})`} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', fontWeight: 'bold' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Cargo:</label>
              <input type="text" disabled value={selectedEmp.cargo} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Responsable de la Inducción:</label>
              <input type="text" value={evaluadorInduccion} onChange={(e) => setEvaluadorInduccion(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1.5px solid #166534', fontWeight: 'bold' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Calificación (%):</label>
                <input type="number" min="70" max="100" value={calificacionInduccion} onChange={(e) => setCalificacionInduccion(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 'bold' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Fecha:</label>
                <input type="date" value={fechaInduccion} onChange={(e) => setFechaInduccion(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>
            <button
              type="button"
              onClick={handleImprimirInduccion}
              style={{ width: '100%', padding: '0.8rem', backgroundColor: '#166534', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              🖨️ Imprimir Constancia Formal (PDF)
            </button>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '2rem' }}>
            <h4 style={{ textAlign: 'center', color: '#166534', margin: '0 0 1rem 0' }}>FRUTAS DEL ATLÁNTICO S.A.S.</h4>
            <div style={{ textAlign: 'center', fontSize: '10.5pt', fontWeight: 'bold', marginBottom: '1.5rem' }}>CONSTANCIA DE INDUCCIÓN INSTITUCIONAL Y SG-SST</div>
            <p style={{ fontSize: '9.5pt', lineHeight: 1.8, textAlign: 'justify' }}>
              Se certifica que el(la) colaborador(a) <strong>{selectedEmp.nombre}</strong>, identificado(a) con C.C. <strong>{selectedEmp.documento}</strong>, culminó su proceso de inducción reglamentaria para el cargo de <strong>{selectedEmp.cargo}</strong> el día <strong>{fechaInduccion}</strong>, obteniendo una calificación de comprensión del <strong>{calificacionInduccion}%</strong> en los módulos de Políticas Institucionales Frutopical, SG-SST (Dec. 1072), Matriz de Peligros en Planta Agroindustrial, Buenas Prácticas de Manufactura (BPM) y Uso Correcto de EPP.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3.5rem', textAlign: 'center', fontSize: '8.5pt' }}>
              <div style={{ width: '45%' }}>
                <div style={{ borderTop: '1.5px solid #000', margin: '0 auto 4px auto', width: '160px' }}></div>
                <strong>{selectedEmp.nombre}</strong><br />Firma del Trabajador<br />C.C. {selectedEmp.documento}
              </div>
              <div style={{ width: '45%' }}>
                <div style={{ borderTop: '1.5px solid #000', margin: '0 auto 4px auto', width: '160px' }}></div>
                <strong>{evaluadorInduccion}</strong><br />Jefe de Talento Humano<br />Frutas Del Atlántico S.A.S.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VISOR REPOSITORIO */}
      {visorModal && (
        <div className="th-modal-backdrop" onMouseDown={() => setVisorModal(null)}>
          <section className="th-postulation-modal" style={{ maxWidth: '560px', width: '92%' }} onMouseDown={(e) => e.stopPropagation()}>
            <div className="th-modal-header">
              <div>
                <span className="th-label">DOCUMENTO MODELO VIGENTE</span>
                <h3 style={{ margin: '0.2rem 0' }}>{visorModal.entidad}</h3>
              </div>
              <button type="button" className="th-modal-close" onClick={() => setVisorModal(null)}>×</button>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '1.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '1rem', fontSize: '0.85rem' }}>
              <p style={{ margin: '0 0 0.4rem 0' }}><strong>Tipo:</strong> {visorModal.tipo}</p>
              <p style={{ margin: '0 0 0.4rem 0' }}><strong>Descripción:</strong> {visorModal.formato}</p>
              <p style={{ margin: '0 0 0.4rem 0' }}><strong>Archivo Digital:</strong> <code>{visorModal.archivo}</code></p>
              <p style={{ margin: 0, color: '#166534', fontWeight: 'bold' }}>✓ {visorModal.vigencia}</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem' }}>
              <button
                type="button"
                onClick={() => descargarArchivoRepositorio(visorModal)}
                style={{ flex: 1, padding: '0.75rem', backgroundColor: '#166534', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                📥 Descargar Formato ({visorModal.archivo})
              </button>
              <button type="button" onClick={() => setVisorModal(null)} style={{ padding: '0.75rem 1.2rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Cerrar
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}