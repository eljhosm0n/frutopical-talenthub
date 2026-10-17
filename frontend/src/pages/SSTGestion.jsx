import React, { useState, useEffect } from 'react';

const EMPLEADOS_BASE = [
  { id: 1, nombre: 'Carlos Fontalvo Amaya', documento: '1042890123', cargo: 'Operario de Producción', salario: '$2.000.000 COP', fechaIngreso: '2026-02-01' },
  { id: 2, nombre: 'María Conrado Jiménez', documento: '1043567890', cargo: 'Jefe de Calidad', salario: '$3.000.000 COP', fechaIngreso: '2026-02-15' },
  { id: 3, nombre: 'David Riquett Villalobos', documento: '1044123456', cargo: 'Jefe de Producción', salario: '$3.000.000 COP', fechaIngreso: '2026-03-01' },
  { id: 4, nombre: 'Laura Mendoza Peñaranda', documento: '1045987654', cargo: 'Jefe de Talento Humano', salario: '$2.550.500 COP', fechaIngreso: '2026-03-10' }
];

export default function SSTGestion({ onVolver }) {
  const [subTab, setSubTab] = useState('dotacion');
  const [listaEmpleados, setListaEmpleados] = useState(EMPLEADOS_BASE);
  const [selectedEmpleado, setSelectedEmpleado] = useState(EMPLEADOS_BASE[0]);
  
  const [modalActa, setModalActa] = useState(false);
  const [modalContrato, setModalContrato] = useState(false);
  const [documentoImprimir, setDocumentoImprimir] = useState(null);

  // Cargar lista dinámica de empleados vinculados en vivo
  useEffect(() => {
    const guardados = localStorage.getItem('frutopical_empleados');
    if (guardados) {
      try {
        const parsed = JSON.parse(guardados);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Unir base con los recién contratados sin duplicar
          const combinados = [...parsed];
          EMPLEADOS_BASE.forEach(b => {
            if (!combinados.some(c => c.documento === b.documento)) {
              combinados.push(b);
            }
          });
          setListaEmpleados(combinados);
          setSelectedEmpleado(combinados[0]);
          return;
        }
      } catch {}
    }
    setListaEmpleados(EMPLEADOS_BASE);
    localStorage.setItem('frutopical_empleados', JSON.stringify(EMPLEADOS_BASE));
  }, []);

  const [checklist, setChecklist] = useState({
    examenMedico: true, afiliacionEps: true, afiliacionAfp: true,
    afiliacionArl: true, cajaCompensacion: true, induccionGeneral: true, entregaEpp: true
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
          .sst-print-area { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; margin: 0 !important; padding: 20mm 15mm !important; background: #ffffff !important; color: #1e293b !important; box-sizing: border-box !important; }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', letterSpacing: '1px', textTransform: 'uppercase' }}>
              EQUIPO 3 · GESTIÓN DEL VÍNCULO LABORAL & SEGURIDAD INDUSTRIAL
            </span>
            <h2 style={{ margin: '0.2rem 0', color: '#1e293b', fontSize: '1.4rem' }}>
              3. Vinculación, Contratación y SG-SST
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              Aseguramiento normativo, entrega de EPP bajo Res. 2400 y contratación formal en Frutopical S.A.S.
            </p>
          </div>

          <button type="button" onClick={onVolver} style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '0.55rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', color: '#334155' }}>
            ← Volver al Panel
          </button>
        </div>

        {/* SELECTOR DE COLABORADOR SINCRONIZADO EN VIVO */}
        <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #86efac', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', boxShadow: '0 4px 15px rgba(22, 101, 52, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '1.4rem' }}>👤</span>
            <div>
              <strong style={{ display: 'block', fontSize: '0.92rem', color: '#143c1d' }}>Colaborador Activo para Gestión:</strong>
              <span style={{ fontSize: '0.82rem', color: '#475569' }}>{selectedEmpleado.cargo} (C.C. {selectedEmpleado.documento}) · Salario Asignado: <strong style={{ color: '#166534' }}>{selectedEmpleado.salario}</strong></span>
            </div>
          </div>

          <select
            value={selectedEmpleado.documento}
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

        {/* Subpestañas */}
        <div style={{ display: 'flex', gap: '0.6rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setSubTab('dotacion')} style={{ padding: '0.65rem 1rem', background: 'none', border: 'none', borderBottom: subTab === 'dotacion' ? '3px solid #166534' : 'none', fontWeight: subTab === 'dotacion' ? '800' : '600', color: subTab === 'dotacion' ? '#166534' : '#64748b', cursor: 'pointer', fontSize: '0.88rem' }}>
            🦺 1. Entrega de Dotación y EPP (SST)
          </button>
          <button type="button" onClick={() => setSubTab('checklist')} style={{ padding: '0.65rem 1rem', background: 'none', border: 'none', borderBottom: subTab === 'checklist' ? '3px solid #166534' : 'none', fontWeight: subTab === 'checklist' ? '800' : '600', color: subTab === 'checklist' ? '#166534' : '#64748b', cursor: 'pointer', fontSize: '0.88rem' }}>
            📋 2. Checklist de Afiliación (SGSSS)
          </button>
          <button type="button" onClick={() => setSubTab('contratacion')} style={{ padding: '0.65rem 1rem', background: 'none', border: 'none', borderBottom: subTab === 'contratacion' ? '3px solid #ef6c00' : 'none', fontWeight: subTab === 'contratacion' ? '800' : '600', color: subTab === 'contratacion' ? '#ef6c00' : '#64748b', cursor: 'pointer', fontSize: '0.88rem' }}>
            ✍️ 3. Minuta y Firma de Contrato
          </button>
        </div>

        {/* 1. DOTACIÓN Y EPP */}
        {subTab === 'dotacion' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.8rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>
                  RESOLUCIÓN 2400 DE 1979 · CONTROL OPERATIVO
                </span>
                <h3 style={{ margin: '0.2rem 0', color: '#1e293b' }}>
                  Matriz de Dotación Agroindustrial y EPP para: {selectedEmpleado.nombre}
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  Asignación formal de elementos según el cargo de <strong>{selectedEmpleado.cargo}</strong>.
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

        {/* 2. CHECKLIST SGSSS */}
        {subTab === 'checklist' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.8rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>AFILIACIONES Y SEGURIDAD SOCIAL</span>
                <h3 style={{ margin: '0.2rem 0', color: '#1e293b' }}>Lista de Chequeo de Ingreso: {selectedEmpleado.nombre}</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Cumplimiento de requisitos previos al inicio de labores operativas.</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>Avance de Vinculación:</span>
                <strong style={{ display: 'block', fontSize: '1.5rem', color: porcentajeVinculacion === 100 ? '#166534' : '#ea580c' }}>{porcentajeVinculacion}%</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {Object.entries({
                examenMedico: 'Concepto Médico Ocupacional de Ingreso (Apto sin restricciones)',
                afiliacionEps: 'Afiliación a EPS (Entidad Promotora de Salud)',
                afiliacionAfp: 'Afiliación a Administradora de Fondo de Pensiones (AFP)',
                afiliacionArl: 'Afiliación a ARL en Nivel de Riesgo Clase II (Agroindustria)',
                cajaCompensacion: 'Afiliación a Caja de Compensación Familiar (Combarranquilla/Comfamiliar)',
                induccionGeneral: 'Constancia de Inducción General de la Empresa y Políticas de Calidad',
                entregaEpp: 'Constancia y firma de entrega reglamentaria de dotación y EPP'
              }).map(([k, text]) => (
                <label key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', padding: '0.9rem 1.2rem', borderRadius: '8px', backgroundColor: checklist[k] ? '#f0fdf4' : '#ffffff', border: checklist[k] ? '1px solid #bbf7d0' : '1px solid #e2e8f0', cursor: 'pointer' }}>
                  <input type="checkbox" checked={checklist[k]} onChange={() => toggleCheck(k)} style={{ width: '18px', height: '18px', accentColor: '#166534' }} />
                  <span style={{ fontSize: '0.88rem', color: checklist[k] ? '#166534' : '#334155', fontWeight: checklist[k] ? '700' : '400' }}>{text}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* 3. MINUTA Y CONTRATO */}
        {subTab === 'contratacion' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.8rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#ef6c00', textTransform: 'uppercase' }}>CÓDIGO SUSTANTIVO DEL TRABAJO · FORMALIZACIÓN</span>
                <h3 style={{ margin: '0.2rem 0', color: '#1e293b' }}>Contrato Individual de Trabajo a Término Indefinido</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Condiciones salariales oficiales para {selectedEmpleado.nombre}.</p>
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
              <p style={{ margin: '0 0 0.6rem 0' }}><strong>Trabajador:</strong> {selectedEmpleado.nombre} · C.C. {selectedEmpleado.documento}</p>
              <p style={{ margin: '0 0 0.6rem 0' }}><strong>Cargo Asignado:</strong> {selectedEmpleado.cargo}</p>
              <p style={{ margin: '0 0 0.6rem 0' }}><strong>Asignación Mensual:</strong> <strong style={{ color: '#166534' }}>{selectedEmpleado.salario}</strong> + Prestaciones y Auxilio Legal de Transporte.</p>
              <p style={{ margin: 0, color: '#166534', fontWeight: 'bold' }}>✓ Modalidad: Término indefinido conforme al Artículo 45 del CST.</p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: PREVISUALIZACIÓN ACTA DE DOTACIÓN */}
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
                    <td style={{ padding: '6px', border: '1px solid #cbd5e1' }}><strong>Colaborador:</strong> {selectedEmpleado.nombre}</td>
                    <td style={{ padding: '6px', border: '1px solid #cbd5e1' }}><strong>Identificación:</strong> C.C. {selectedEmpleado.documento}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px', border: '1px solid #cbd5e1' }}><strong>Cargo:</strong> {selectedEmpleado.cargo}</td>
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
                  <strong>{selectedEmpleado.nombre}</strong><br />C.C. {selectedEmpleado.documento}<br />Firma del Colaborador
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

      {/* MODAL 2: PREVISUALIZACIÓN CONTRATO LABORAL */}
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
                <strong>Trabajador:</strong> {selectedEmpleado.nombre} · C.C. {selectedEmpleado.documento}<br />
                <strong>Cargo:</strong> {selectedEmpleado.cargo}<br />
                <strong>Salario Mensual:</strong> {selectedEmpleado.salario} + Prestaciones y Auxilio de Transporte<br />
                <strong>Modalidad:</strong> Término Indefinido conforme al Artículo 45 del CST.
              </div>

              <p style={{ fontSize: '0.8rem', textAlign: 'justify', margin: '0 0 0.5rem 0' }}>
                <strong>PRIMERA. OBJETO:</strong> EL EMPLEADOR contrata los servicios personales de EL TRABAJADOR para desempeñar las funciones de <strong>{selectedEmpleado.cargo}</strong>, cumpliendo las directrices de Calidad, Inocuidad BPM y SG-SST de la planta de Sabanagrande.
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', textAlign: 'center', fontSize: '0.8rem' }}>
                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #0f172a', marginBottom: '4px' }}></div>
                  <strong>SAMY DARIANY RODRÍGUEZ SEÑA</strong><br />Representante Legal<br />EL EMPLEADOR
                </div>
                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #0f172a', marginBottom: '4px' }}></div>
                  <strong>{selectedEmpleado.nombre}</strong><br />C.C. {selectedEmpleado.documento}<br />EL TRABAJADOR
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
            <p style={{ fontSize: '12px' }}><strong>Colaborador:</strong> {selectedEmpleado.nombre} · <strong>C.C.:</strong> {selectedEmpleado.documento} · <strong>Cargo:</strong> {selectedEmpleado.cargo}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', textAlign: 'center', fontSize: '12px' }}>
              <div style={{ width: '45%' }}><div style={{ borderTop: '1.5px solid #0f172a', marginBottom: '6px' }}></div><strong>{selectedEmpleado.nombre}</strong><br />Firma del Trabajador</div>
              <div style={{ width: '45%' }}><div style={{ borderTop: '1.5px solid #0f172a', marginBottom: '6px' }}></div><strong>SAMY DARIANY RODRÍGUEZ SEÑA</strong><br />Representante Legal / SST</div>
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
              Entre FRUTAS DEL ATLÁNTICO S.A.S. y <strong>{selectedEmpleado.nombre}</strong> (C.C. {selectedEmpleado.documento}), se suscribe el presente contrato de trabajo para el cargo de <strong>{selectedEmpleado.cargo}</strong>, con una asignación mensual de <strong>{selectedEmpleado.salario}</strong> más auxilio legal de transporte.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', textAlign: 'center', fontSize: '12px' }}>
              <div style={{ width: '45%' }}><div style={{ borderTop: '1.5px solid #0f172a', marginBottom: '6px' }}></div><strong>SAMY DARIANY RODRÍGUEZ SEÑA</strong><br />Representante Legal</div>
              <div style={{ width: '45%' }}><div style={{ borderTop: '1.5px solid #0f172a', marginBottom: '6px' }}></div><strong>{selectedEmpleado.nombre}</strong><br />El Trabajador</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}