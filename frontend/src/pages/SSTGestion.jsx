import React, { useState, useEffect } from 'react';

const EMPLEADOS_BASE = [
  { id: 1, nombre: 'Carlos Fontalvo Amaya', documento: '1042890123', cargo: 'Operario de Producción', salario: '$2.000.000 COP', fechaIngreso: '2026-02-01' },
  { id: 2, nombre: 'María Conrado Jiménez', documento: '1043567890', cargo: 'Jefe de Calidad', salario: '$3.000.000 COP', fechaIngreso: '2026-02-15' },
  { id: 3, nombre: 'David Riquett Villalobos', documento: '1044123456', cargo: 'Jefe de Producción', salario: '$3.000.000 COP', fechaIngreso: '2026-03-01' },
  { id: 4, nombre: 'Laura Mendoza Peñaranda', documento: '1045987654', cargo: 'Jefe de Talento Humano', salario: '$2.550.500 COP', fechaIngreso: '2026-03-10' }
];

export default function SSTGestion({ onVolver }) {
  const [subTab, setSubTab] = useState('vinculacion');
  const [listaEmpleados, setListaEmpleados] = useState(EMPLEADOS_BASE);
  const [selectedEmpleado, setSelectedEmpleado] = useState(EMPLEADOS_BASE[0]);
  
  const [modalActa, setModalActa] = useState(false);
  const [modalContrato, setModalContrato] = useState(false);
  const [modalInduccion, setModalInduccion] = useState(false);
  const [documentoImprimir, setDocumentoImprimir] = useState(null);

  // Sincronización en vivo con contratados del Módulo 2 y Expedientes
  useEffect(() => {
    let combinados = [...EMPLEADOS_BASE];

    // 1. Cargar desde frutopical_empleados
    const guardadosEmp = localStorage.getItem('frutopical_empleados');
    if (guardadosEmp) {
      try {
        const parsedEmp = JSON.parse(guardadosEmp);
        if (Array.isArray(parsedEmp)) {
          parsedEmp.forEach(emp => {
            if (!combinados.some(c => String(c.documento) === String(emp.documento))) {
              combinados.unshift(emp);
            }
          });
        }
      } catch {}
    }

    // 2. Cargar directamente candidatos en estado CONTRATADO desde postulaciones (Ej: Miguel Grimaldo)
    const guardadosPost = localStorage.getItem('frutopical_postulaciones');
    if (guardadosPost) {
      try {
        const parsedPost = JSON.parse(guardadosPost);
        if (Array.isArray(parsedPost)) {
          parsedPost.filter(p => p.estado === 'CONTRATADO').forEach(p => {
            const doc = p.numero_documento || '10234532121';
            if (!combinados.some(c => String(c.documento) === String(doc))) {
              const nom = p.candidato || `${p.nombres || ''} ${p.apellidos || ''}`.trim() || 'Colaborador';
              const cargo = p.convocatoria || p.cargo || 'Operario de Producción';
              let salario = '$2.000.000 COP';
              if (cargo.toLowerCase().includes('calidad')) salario = '$3.000.000 COP';
              if (cargo.toLowerCase().includes('talento humano')) salario = '$2.550.500 COP';

              combinados.unshift({
                id: p.id_postulacion || Date.now(),
                nombre: nom,
                documento: doc,
                cargo: cargo,
                salario: salario,
                fechaIngreso: new Date().toISOString().split('T')[0]
              });
            }
          });
        }
      } catch {}
    }

    setListaEmpleados(combinados);
    setSelectedEmpleado(combinados[0]);
  }, []);

  // Lista de chequeo documental integral exigida (CST, Res. 2674/2013 y Ley 1581)
  const [checklist, setChecklist] = useState({
    cedula150: true,
    hojaVidaSoportes: true,
    soportesEstudio: true,
    certificacionesLaborales: true,
    antecedentesJudiciales: true,
    examenMedicoIngreso: true,
    manipulacionAlimentos: true,
    afiliacionEps: true,
    afiliacionAfp: true,
    afiliacionArl: true,
    cajaCompensacion: true,
    contratoFirmado: true,
    autorizacionDatos: true,
    entregaRit: true,
    entregaEpp: true
  });

  const [dotacion, setDotacion] = useState({
    cofia: true, tapabocas: true, delantal: true,
    botasPvc: true, guantesNitrilo: true, gafasSeguridad: true, uniformeAntifluido: true
  });

  const totalChecklist = Object.keys(checklist).length;
  const completadosChecklist = Object.values(checklist).filter(Boolean).length;
  const porcentajeVinculacion = Math.round((completadosChecklist / totalChecklist) * 100);

  function toggleCheck(key) { setChecklist(prev => ({ ...prev, [key]: !prev[key] })); }
  function toggleDotacion(key) { setDotacion(prev => ({ ...prev, [key]: !prev[key] })); }

  function ejecutarImpresion(tipo) {
    setDocumentoImprimir(tipo);
    setTimeout(() => { window.print(); }, 250);
  }

  const fechaHoy = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <style>{`
        .sst-print-area { display: none; }
        @media print {
          body * { visibility: hidden !important; }
          .sst-print-area, .sst-print-area * { visibility: visible !important; display: block !important; }
          .sst-print-area { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; margin: 0 !important; padding: 15mm 20mm !important; background: #ffffff !important; color: #1e293b !important; box-sizing: border-box !important; }
          .sst-print-clean-table { width: 100% !important; border-collapse: collapse !important; margin: 15px 0 !important; }
          .sst-print-clean-table th, .sst-print-clean-table td { border: 1px solid #334155 !important; padding: 6px 10px !important; font-size: 10pt !important; }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', letterSpacing: '1px', textTransform: 'uppercase' }}>
              MÓDULO 3 · FORMALIZACIÓN Y SEGURIDAD INDUSTRIAL
            </span>
            <h2 style={{ margin: '0.2rem 0', color: '#1e293b', fontSize: '1.4rem' }}>
              Vinculación de Trabajadores y SG-SST
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              Aseguramiento normativo, entrega de dotación bajo Res. 2400 y contratación formal en Frutopical S.A.S.
            </p>
          </div>

          <button type="button" onClick={onVolver} style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '0.55rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', color: '#334155' }}>
            ← Volver al Panel
          </button>
        </div>

        {/* SELECTOR DE COLABORADOR EN VIVO (MUESTRA A MIGUEL GRIMALDO Y CONTRATADOS) */}
        <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #86efac', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', boxShadow: '0 4px 15px rgba(22, 101, 52, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '1.4rem' }}>👤</span>
            <div>
              <strong style={{ display: 'block', fontSize: '0.92rem', color: '#143c1d' }}>Colaborador Activo para Gestión:</strong>
              <span style={{ fontSize: '0.82rem', color: '#475569' }}>
                {selectedEmpleado?.cargo} (C.C. {selectedEmpleado?.documento}) · Salario Asignado: <strong style={{ color: '#166534' }}>{selectedEmpleado?.salario}</strong>
              </span>
            </div>
          </div>

          <select
            value={selectedEmpleado?.documento}
            onChange={(e) => {
              const found = listaEmpleados.find(emp => String(emp.documento) === String(e.target.value));
              if (found) setSelectedEmpleado(found);
            }}
            style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: '2px solid #166534', fontWeight: 'bold', color: '#166534', fontSize: '0.85rem', backgroundColor: '#f0fdf4', cursor: 'pointer' }}
          >
            {listaEmpleados.map(emp => (
              <option key={emp.documento} value={emp.documento}>
                {emp.nombre} - {emp.cargo}
              </option>
            ))}
          </select>
        </div>

        {/* SUBPESTAÑAS OFICIALES */}
        <div style={{ display: 'flex', gap: '0.6rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setSubTab('vinculacion')} style={{ padding: '0.65rem 1rem', background: 'none', border: 'none', borderBottom: subTab === 'vinculacion' ? '3px solid #166534' : 'none', fontWeight: subTab === 'vinculacion' ? '800' : '600', color: subTab === 'vinculacion' ? '#166534' : '#64748b', cursor: 'pointer', fontSize: '0.88rem' }}>
            📋 1. Vinculación de Trabajadores (Lista de Chequeo)
          </button>
          <button type="button" onClick={() => setSubTab('dotacion')} style={{ padding: '0.65rem 1rem', background: 'none', border: 'none', borderBottom: subTab === 'dotacion' ? '3px solid #166534' : 'none', fontWeight: subTab === 'dotacion' ? '800' : '600', color: subTab === 'dotacion' ? '#166534' : '#64748b', cursor: 'pointer', fontSize: '0.88rem' }}>
            🦺 2. Entrega de Dotación y EPP (SST)
          </button>
          <button type="button" onClick={() => setSubTab('induccion')} style={{ padding: '0.65rem 1rem', background: 'none', border: 'none', borderBottom: subTab === 'induccion' ? '3px solid #ef6c00' : 'none', fontWeight: subTab === 'induccion' ? '800' : '600', color: subTab === 'induccion' ? '#ef6c00' : '#64748b', cursor: 'pointer', fontSize: '0.88rem' }}>
            🎓 3. Constancias e Inducción SST
          </button>
          <button type="button" onClick={() => setSubTab('contratacion')} style={{ padding: '0.65rem 1rem', background: 'none', border: 'none', borderBottom: subTab === 'contratacion' ? '3px solid #ef6c00' : 'none', fontWeight: subTab === 'contratacion' ? '800' : '600', color: subTab === 'contratacion' ? '#ef6c00' : '#64748b', cursor: 'pointer', fontSize: '0.88rem' }}>
            ✍️ 4. Minuta y Firma de Contrato
          </button>
        </div>

        {/* 1. VINCULACIÓN DE TRABAJADORES (LISTA DE CHEQUEO COMPLETA) */}
        {subTab === 'vinculacion' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.8rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>
                  CONTROL DOCUMENTAL PRE-CONTRACTUAL (CST & INVIMA)
                </span>
                <h3 style={{ margin: '0.2rem 0', color: '#1e293b' }}>
                  Lista de Chequeo Documental de Ingreso: {selectedEmpleado?.nombre}
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  Verificación de requisitos normativos previo a la firma contractual y apertura de expediente.
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Conformidad de Expediente:</span>
                <strong style={{ display: 'block', fontSize: '1.5rem', color: porcentajeVinculacion === 100 ? '#166534' : '#ea580c' }}>
                  {porcentajeVinculacion}% ({completadosChecklist}/{totalChecklist})
                </strong>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem' }}>
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.2rem', backgroundColor: '#f8fafc' }}>
                <strong style={{ display: 'block', fontSize: '0.88rem', color: '#166534', marginBottom: '0.6rem' }}>
                  Bloque 1: Documentación Personal y Hoja de Vida
                </strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    ['cedula150', 'Cédula de Ciudadanía ampliada al 150% (Obligatorio)'],
                    ['hojaVidaSoportes', 'Hoja de Vida firmada con soportes (Obligatorio)'],
                    ['soportesEstudio', 'Soportes de Estudio / Diplomas (Obligatorio)'],
                    ['certificacionesLaborales', 'Mínimo 2 Certificaciones Laborales previas'],
                    ['antecedentesJudiciales', 'Certificados de Antecedentes (Policía/Procuraduría)']
                  ].map(([k, label]) => (
                    <label key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={checklist[k]} onChange={() => toggleCheck(k)} style={{ accentColor: '#166534' }} />
                      <span style={{ color: checklist[k] ? '#166534' : '#475569', fontWeight: checklist[k] ? 'bold' : 'normal' }}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.2rem', backgroundColor: '#f8fafc' }}>
                <strong style={{ display: 'block', fontSize: '0.88rem', color: '#c2410c', marginBottom: '0.6rem' }}>
                  Bloque 2: Salud Ocupacional e Inocuidad (BPM)
                </strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    ['examenMedicoIngreso', 'Certificado Médico de Aptitud Laboral de Ingreso'],
                    ['manipulacionAlimentos', 'Carné Vigente Manipulación de Alimentos (Res. 2674)'],
                    ['autorizacionDatos', 'Autorización de Tratamiento de Datos (Ley 1581)'],
                    ['entregaRit', 'Constancia de Entrega del Reglamento Interno (RIT)'],
                    ['entregaEpp', 'Acta de Dotación y Elementos EPP (Res. 2400)']
                  ].map(([k, label]) => (
                    <label key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={checklist[k]} onChange={() => toggleCheck(k)} style={{ accentColor: '#c2410c' }} />
                      <span style={{ color: checklist[k] ? '#9a3412' : '#475569', fontWeight: checklist[k] ? 'bold' : 'normal' }}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.2rem', backgroundColor: '#f8fafc' }}>
                <strong style={{ display: 'block', fontSize: '0.88rem', color: '#1d4ed8', marginBottom: '0.6rem' }}>
                  Bloque 3: Seguridad Social y Contrato
                </strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    ['afiliacionEps', 'Certificación de Afiliación a EPS activa'],
                    ['afiliacionAfp', 'Certificación de Fondo de Pensiones (AFP)'],
                    ['afiliacionArl', 'Afiliación a ARL en Nivel de Riesgo Clase II'],
                    ['cajaCompensacion', 'Afiliación a Caja de Compensación Familiar'],
                    ['contratoFirmado', 'Contrato Individual de Trabajo firmado en original']
                  ].map(([k, label]) => (
                    <label key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={checklist[k]} onChange={() => toggleCheck(k)} style={{ accentColor: '#1d4ed8' }} />
                      <span style={{ color: checklist[k] ? '#1e40af' : '#475569', fontWeight: checklist[k] ? 'bold' : 'normal' }}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. DOTACIÓN Y EPP */}
        {subTab === 'dotacion' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.8rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>
                  RESOLUCIÓN 2400 DE 1979 · CONTROL OPERATIVO
                </span>
                <h3 style={{ margin: '0.2rem 0', color: '#1e293b' }}>
                  Matriz de Dotación Agroindustrial y EPP para: {selectedEmpleado?.nombre}
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  Asignación formal de elementos según el cargo de <strong>{selectedEmpleado?.cargo}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalActa(true)}
                style={{ backgroundColor: '#166534', color: '#ffffff', border: 'none', padding: '0.75rem 1.4rem', borderRadius: '8px', fontWeight: '800', fontSize: '0.88rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(22, 101, 52, 0.25)' }}
              >
                👁️ Ver e Imprimir Acta de Entrega (PDF)
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {Object.entries({
                cofia: 'Cofia cubre-cabello (Inocuidad BPM)',
                tapabocas: 'Tapabocas desechable termosellado',
                delantal: 'Delantal PVC impermeable industrial',
                botasPvc: 'Botas de seguridad PVC con puntera',
                guantesNitrilo: 'Guantes de nitrilo grado alimentario',
                gafasSeguridad: 'Gafas de seguridad policarbonato',
                uniformeAntifluido: 'Uniforme antifluido institucional'
              }).map(([key, label]) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', borderRadius: '10px', backgroundColor: dotacion[key] ? '#f0fdf4' : '#f8fafc', border: dotacion[key] ? '1.5px solid #86efac' : '1px solid #cbd5e1', cursor: 'pointer' }}>
                  <input type="checkbox" checked={dotacion[key]} onChange={() => toggleDotacion(key)} style={{ width: '18px', height: '18px', accentColor: '#166534' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: dotacion[key] ? '700' : '500', color: dotacion[key] ? '#166534' : '#475569' }}>{label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* 3. CONSTANCIAS E INDUCCIÓN SST (RESPONSABLE: JEFE DE TALENTO HUMANO) */}
        {subTab === 'induccion' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.8rem', border: '1px solid #e2e8f0', maxWidth: '680px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#ef6c00', textTransform: 'uppercase' }}>
              CAPACITACIÓN INSTITUCIONAL
            </span>
            <h3 style={{ margin: '0.2rem 0 0.8rem 0', color: '#1e293b' }}>
              Constancia de Inducción SST
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.2rem' }}>
              Registro formal de inducción en puesto de trabajo para <strong>{selectedEmpleado?.nombre}</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>Fecha de Inducción:</label>
                <input type="text" readOnly value={fechaHoy} style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontWeight: 'bold' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>Temario de Inducción Impartido:</label>
                <textarea rows="3" readOnly value="Políticas Institucionales Frutopical, SG-SST (Dec. 1072), Matriz de Peligros en Planta Agroindustrial, Buenas Prácticas de Manufactura (BPM) y Uso Correcto de EPP." style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '0.82rem' }} />
              </div>

              <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1.5px solid #86efac' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#166534' }}>Evaluación de Comprensión SST:</span>
                  <strong style={{ color: '#166534', fontSize: '1rem' }}>95% (Aprobado)</strong>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#bbf7d0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '95%', height: '100%', backgroundColor: '#166534' }}></div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>Instructor / Responsable Evaluador:</label>
                <input
                  type="text"
                  readOnly
                  value="Jefe de Talento Humano · Frutopical S.A.S."
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1.5px solid #166534', backgroundColor: '#f0fdf4', color: '#166534', fontWeight: 'bold', fontSize: '0.85rem' }}
                />
              </div>

              <button
                type="button"
                onClick={() => ejecutarImpresion('induccion')}
                style={{ width: '100%', padding: '0.8rem', backgroundColor: '#166534', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}
              >
                🖨️ Certificar e Imprimir Constancia de Inducción PDF
              </button>
            </div>
          </div>
        )}

        {/* 4. MINUTA Y CONTRATO */}
        {subTab === 'contratacion' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.8rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#ef6c00', textTransform: 'uppercase' }}>CÓDIGO SUSTANTIVO DEL TRABAJO · FORMALIZACIÓN</span>
                <h3 style={{ margin: '0.2rem 0', color: '#1e293b' }}>Contrato Individual de Trabajo a Término Indefinido</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Condiciones salariales oficiales para {selectedEmpleado?.nombre}.</p>
              </div>

              <button
                type="button"
                onClick={() => setModalContrato(true)}
                style={{ backgroundColor: '#ef6c00', color: '#ffffff', border: 'none', padding: '0.75rem 1.4rem', borderRadius: '8px', fontWeight: '800', fontSize: '0.88rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 108, 0, 0.3)' }}
              >
                👁️ Ver e Imprimir Minuta Contractual (PDF)
              </button>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.88rem', lineHeight: '1.7', color: '#334155' }}>
              <p style={{ margin: '0 0 0.6rem 0' }}><strong>Empleador:</strong> FRUTAS DEL ATLÁNTICO S.A.S. (NIT 900.999.999-1) · Sabanagrande, Atlántico</p>
              <p style={{ margin: '0 0 0.6rem 0' }}><strong>Trabajador:</strong> {selectedEmpleado?.nombre} · C.C. {selectedEmpleado?.documento}</p>
              <p style={{ margin: '0 0 0.6rem 0' }}><strong>Cargo Asignado:</strong> {selectedEmpleado?.cargo}</p>
              <p style={{ margin: '0 0 0.6rem 0' }}><strong>Asignación Mensual:</strong> <strong style={{ color: '#166534' }}>{selectedEmpleado?.salario}</strong> + Prestaciones y Auxilio Legal de Transporte.</p>
              <p style={{ margin: 0, color: '#166534', fontWeight: 'bold' }}>✓ Modalidad: Término indefinido conforme al Artículo 45 del CST.</p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL PREVISUALIZACIÓN ACTA DE DOTACIÓN */}
      {modalActa && (
        <div className="th-modal-backdrop" onMouseDown={() => setModalActa(false)}>
          <section className="th-postulation-modal" style={{ maxWidth: '680px', width: '94%', maxHeight: '90vh', overflowY: 'auto' }} onMouseDown={(e) => e.stopPropagation()}>
            <div className="th-modal-header">
              <div>
                <span className="th-label">SISTEMA DE GESTIÓN SST · RESOLUCIÓN 2400</span>
                <h3 style={{ margin: '0.2rem 0' }}>Acta Formal de Entrega de Dotación y EPP</h3>
              </div>
              <button type="button" className="th-modal-close" onClick={() => setModalActa(false)}>×</button>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.5rem', marginTop: '1rem', fontSize: '0.85rem', lineHeight: '1.6' }}>
              <div style={{ borderBottom: '2.5px solid #166534', paddingBottom: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '1.05rem', color: '#166534' }}>FRUTAS DEL ATLÁNTICO S.A.S. (FRUTOPICAL)</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>NIT: 900.999.999-1 · Sabanagrande, Atlántico</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.75rem', fontWeight: 'bold', color: '#166534' }}>Código: SST-FOR-008</div>
              </div>

              <h4 style={{ textAlign: 'center', margin: '0 0 1rem 0', textTransform: 'uppercase' }}>ACTA INDIVIDUAL DE ENTREGA DE DOTACIÓN Y EPP</h4>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px', fontSize: '0.8rem' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px', border: '1px solid #cbd5e1' }}><strong>Colaborador:</strong> {selectedEmpleado?.nombre}</td>
                    <td style={{ padding: '6px', border: '1px solid #cbd5e1' }}><strong>Identificación:</strong> C.C. {selectedEmpleado?.documento}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px', border: '1px solid #cbd5e1' }}><strong>Cargo:</strong> {selectedEmpleado?.cargo}</td>
                    <td style={{ padding: '6px', border: '1px solid #cbd5e1' }}><strong>Fecha:</strong> {fechaHoy}</td>
                  </tr>
                </tbody>
              </table>

              <table style={{ width: '100%', borderCollapse: 'collapse', margin: '0.8rem 0', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Elemento Asignado</th>
                    <th style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Norma</th>
                    <th style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Cofia cubre-cabello desechable</td><td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Inocuidad BPM</td><td style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#166534', fontWeight: 'bold' }}>✓ Entregado</td></tr>
                  <tr><td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Tapabocas termosellado</td><td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Protocolo Inocuidad</td><td style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#166534', fontWeight: 'bold' }}>✓ Entregado</td></tr>
                  <tr><td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Delantal PVC impermeable industrial</td><td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Res. 2400/1979</td><td style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#166534', fontWeight: 'bold' }}>✓ Entregado</td></tr>
                  <tr><td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Botas de seguridad PVC con puntera</td><td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Antideslizante</td><td style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#166534', fontWeight: 'bold' }}>✓ Entregado</td></tr>
                  <tr><td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Guantes de nitrilo grado alimentario</td><td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Manipulación directa</td><td style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#166534', fontWeight: 'bold' }}>✓ Entregado</td></tr>
                  <tr><td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Gafas de seguridad policarbonato</td><td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Protección ocular</td><td style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#166534', fontWeight: 'bold' }}>✓ Entregado</td></tr>
                  <tr><td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Uniforme antifluido institucional</td><td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Art. 230 CST</td><td style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#166534', fontWeight: 'bold' }}>✓ Entregado</td></tr>
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', textAlign: 'center', fontSize: '0.8rem' }}>
                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #0f172a', marginBottom: '4px' }}></div>
                  <strong>{selectedEmpleado?.nombre}</strong><br />C.C. {selectedEmpleado?.documento}<br />Firma del Colaborador
                </div>
                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #0f172a', marginBottom: '4px' }}></div>
                  <strong>SAMY DARIANY RODRÍGUEZ SEÑA</strong><br />Representante Legal / SST<br />Frutas Del Atlántico S.A.S.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem' }}>
              <button type="button" onClick={() => ejecutarImpresion('acta')} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#166534', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                🖨️ Imprimir / Guardar en PDF
              </button>
              <button type="button" onClick={() => setModalActa(false)} style={{ padding: '0.75rem 1.2rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Cerrar
              </button>
            </div>
          </section>
        </div>
      )}

      {/* MODAL PREVISUALIZACIÓN CONTRATO LABORAL */}
      {modalContrato && (
        <div className="th-modal-backdrop" onMouseDown={() => setModalContrato(false)}>
          <section className="th-postulation-modal" style={{ maxWidth: '680px', width: '94%', maxHeight: '90vh', overflowY: 'auto' }} onMouseDown={(e) => e.stopPropagation()}>
            <div className="th-modal-header">
              <div>
                <span className="th-label">CÓDIGO SUSTANTIVO DEL TRABAJO · FORMALIZACIÓN</span>
                <h3 style={{ margin: '0.2rem 0' }}>Minuta Oficial de Contrato de Trabajo</h3>
              </div>
              <button type="button" className="th-modal-close" onClick={() => setModalContrato(false)}>×</button>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.5rem', marginTop: '1rem', fontSize: '0.85rem', lineHeight: '1.6' }}>
              <div style={{ borderBottom: '2.5px solid #ef6c00', paddingBottom: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '1.05rem', color: '#166534' }}>FRUTAS DEL ATLÁNTICO S.A.S.</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>NIT: 900.999.999-1 · Sabanagrande, Atlántico</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.75rem', fontWeight: 'bold', color: '#ef6c00' }}>MINUTA CONTRACTUAL OFICIAL</div>
              </div>

              <h4 style={{ textAlign: 'center', margin: '0 0 1rem 0', textTransform: 'uppercase' }}>CONTRATO INDIVIDUAL DE TRABAJO A TÉRMINO INDEFINIDO</h4>

              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px', marginBottom: '12px', borderRadius: '6px', fontSize: '0.8rem' }}>
                <strong>Empleador:</strong> FRUTAS DEL ATLÁNTICO S.A.S. · NIT 900.999.999-1<br />
                <strong>Trabajador:</strong> {selectedEmpleado?.nombre} · C.C. {selectedEmpleado?.documento}<br />
                <strong>Cargo:</strong> {selectedEmpleado?.cargo}<br />
                <strong>Salario Mensual:</strong> {selectedEmpleado?.salario} + Prestaciones y Auxilio de Transporte<br />
                <strong>Modalidad:</strong> Término Indefinido conforme al Artículo 45 del CST.
              </div>

              <p style={{ fontSize: '0.8rem', textAlign: 'justify', margin: '0 0 0.5rem 0' }}>
                <strong>PRIMERA. OBJETO:</strong> EL EMPLEADOR contrata los servicios personales de EL TRABAJADOR para desempeñar las funciones de <strong>{selectedEmpleado?.cargo}</strong>, cumpliendo las directrices de Calidad, Inocuidad BPM y SG-SST de la planta de Sabanagrande.
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', textAlign: 'center', fontSize: '0.8rem' }}>
                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #0f172a', marginBottom: '4px' }}></div>
                  <strong>SAMY DARIANY RODRÍGUEZ SEÑA</strong><br />Representante Legal<br />EL EMPLEADOR
                </div>
                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #0f172a', marginBottom: '4px' }}></div>
                  <strong>{selectedEmpleado?.nombre}</strong><br />C.C. {selectedEmpleado?.documento}<br />EL TRABAJADOR
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem' }}>
              <button type="button" onClick={() => ejecutarImpresion('contrato')} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#ef6c00', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                🖨️ Imprimir / Guardar en PDF
              </button>
              <button type="button" onClick={() => setModalContrato(false)} style={{ padding: '0.75rem 1.2rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Cerrar
              </button>
            </div>
          </section>
        </div>
      )}

      {/* ÁREA DE IMPRESIÓN LIMPIA */}
      <div className="sst-print-area">
        {documentoImprimir === 'acta' && (
          <div>
            <div style={{ borderBottom: '3px solid #166534', paddingBottom: '10px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '19px', fontWeight: '800', color: '#166534' }}>FRUTAS DEL ATLÁNTICO S.A.S. (FRUTOPICAL)</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>NIT: 900.999.999-1 · Sabanagrande, Atlántico</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '11px', fontWeight: 'bold', color: '#166534' }}>SISTEMA DE GESTIÓN SST</div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: '800', margin: '20px 0' }}>ACTA DE ENTREGA DE DOTACIÓN Y EPP (RESOLUCIÓN 2400 DE 1979)</div>
            <p style={{ fontSize: '12px' }}><strong>Colaborador:</strong> {selectedEmpleado?.nombre} · <strong>C.C.:</strong> {selectedEmpleado?.documento} · <strong>Cargo:</strong> {selectedEmpleado?.cargo}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', textAlign: 'center', fontSize: '12px' }}>
              <div style={{ width: '45%' }}><div style={{ borderTop: '1.5px solid #0f172a', marginBottom: '6px' }}></div><strong>{selectedEmpleado?.nombre}</strong><br />Firma del Trabajador</div>
              <div style={{ width: '45%' }}><div style={{ borderTop: '1.5px solid #0f172a', marginBottom: '6px' }}></div><strong>SAMY DARIANY RODRÍGUEZ SEÑA</strong><br />Representante Legal / SST</div>
            </div>
          </div>
        )}

        {documentoImprimir === 'induccion' && (
          <div>
            <div style={{ borderBottom: '3px solid #166534', paddingBottom: '10px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '19px', fontWeight: '800', color: '#166534' }}>FRUTAS DEL ATLÁNTICO S.A.S.</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>NIT: 900.999.999-1 · Sabanagrande, Atlántico</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '11px', fontWeight: 'bold', color: '#166534' }}>GESTIÓN DEL TALENTO HUMANO</div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: '800', margin: '20px 0' }}>CONSTANCIA DE INDUCCIÓN INSTITUCIONAL Y SG-SST</div>
            <p style={{ fontSize: '12.5px', lineHeight: '1.8' }}>
              Se certifica que el(la) colaborador(a) <strong>{selectedEmpleado?.nombre}</strong>, identificado(a) con C.C. <strong>{selectedEmpleado?.documento}</strong>, culminó satisfactoriamente su proceso de inducción reglamentaria para el cargo de <strong>{selectedEmpleado?.cargo}</strong>, con una calificación de comprensión del <strong>95%</strong>.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', textAlign: 'center', fontSize: '12px' }}>
              <div style={{ width: '45%' }}><div style={{ borderTop: '1.5px solid #0f172a', marginBottom: '6px' }}></div><strong>{selectedEmpleado?.nombre}</strong><br />Firma del Trabajador</div>
              <div style={{ width: '45%' }}><div style={{ borderTop: '1.5px solid #0f172a', marginBottom: '6px' }}></div><strong>Jefe de Talento Humano</strong><br />Frutas Del Atlántico S.A.S.</div>
            </div>
          </div>
        )}

        {documentoImprimir === 'contrato' && (
          <div>
            <div style={{ borderBottom: '2.5px solid #166534', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#166534' }}>FRUTAS DEL ATLÁNTICO S.A.S.</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>NIT: 900.999.999-1 · Sabanagrande, Atlántico</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '11px', color: '#166534', fontWeight: 'bold' }}>MINUTA CONTRACTUAL</div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '14.5px', fontWeight: '800', margin: '18px 0' }}>CONTRATO INDIVIDUAL DE TRABAJO A TÉRMINO INDEFINIDO</div>
            <p style={{ fontSize: '12.5px', lineHeight: '1.7' }}>
              Entre FRUTAS DEL ATLÁNTICO S.A.S. y <strong>{selectedEmpleado?.nombre}</strong> (C.C. {selectedEmpleado?.documento}), se suscribe el presente contrato de trabajo para el cargo de <strong>{selectedEmpleado?.cargo}</strong>, con una asignación mensual de <strong>{selectedEmpleado?.salario}</strong> más auxilio legal de transporte.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', textAlign: 'center', fontSize: '12px' }}>
              <div style={{ width: '45%' }}><div style={{ borderTop: '1.5px solid #0f172a', marginBottom: '6px' }}></div><strong>SAMY DARIANY RODRÍGUEZ SEÑA</strong><br />Representante Legal</div>
              <div style={{ width: '45%' }}><div style={{ borderTop: '1.5px solid #0f172a', marginBottom: '6px' }}></div><strong>{selectedEmpleado?.nombre}</strong><br />El Trabajador</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}