import React, { useState } from 'react';

// LISTA OFICIAL DE LOS 13 PERFILES DE CARGO (DPC)
const PERFILES_DPC = [
  { codigo: 'DPC 01', cargo: 'Gerente General', archivo: '1 DPC Gerente General.docx', area: 'Dirección' },
  { codigo: 'DPC 02', cargo: 'Jefe de Talento Humano', archivo: '2 DPC Jefe de talento humano.docx', area: 'Talento Humano' },
  { codigo: 'DPC 03', cargo: 'Auxiliar de Talento Humano', archivo: '3 DPC Auxiliar TH.docx', area: 'Talento Humano' },
  { codigo: 'DPC 04', cargo: 'Jefe Administrativo y Financiero', archivo: '4 DPC Jefe admin y financiero.docx', area: 'Administración' },
  { codigo: 'DPC 05', cargo: 'Soporte Técnico e Infraestructura', archivo: '5 DPC Soporte técnico.docx', area: 'Tecnología' },
  { codigo: 'DPC 06', cargo: 'Jefe de Producción', archivo: '6 DPC Jefe de produccion.docx', area: 'Producción' },
  { codigo: 'DPC 07', cargo: 'Supervisor de Producción', archivo: '7 DPC Supervisor de produccion.docx', area: 'Producción' },
  { codigo: 'DPC 08', cargo: 'Jefe de Calidad', archivo: '8 DPC Jefe de calidad.docx', area: 'Calidad' },
  { codigo: 'DPC 09', cargo: 'Auxiliar de Calidad', archivo: '9 DPC Auxiliar de calidad.docx', area: 'Calidad' },
  { codigo: 'DPC 10', cargo: 'Jefe Comercial y Mercadeo', archivo: '10 DPC Jefe comercial y mercadeo.docx', area: 'Comercial' },
  { codigo: 'DPC 11', cargo: 'Operario de Producción', archivo: '11 DPC Operario de produccion.docx', area: 'Planta' },
  { codigo: 'DPC 12', cargo: 'Auxiliar de Servicios Generales', archivo: '12 DPC Auxiliar de servicios generales.docx', area: 'Servicios' },
  { codigo: 'DPC 13', cargo: 'Vendedor / Asesor Comercial', archivo: '13 DPC Vendedor.docx', area: 'Comercial' }
];

export default function Diagnostico({ onVolver }) {
  const [subTab, setSubTab] = useState('estructura');
  const [descargando, setDescargando] = useState(null);

  // Función para resolver rutas seguras a /public/docs/
  function getDocUrl(filename) {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return `${cleanBase}docs/${filename}`;
  }

  // Descarga forzada para navegadores que bloquean o abren pestañas en blanco con .docx
  async function forzarDescarga(archivoNombre) {
    setDescargando(archivoNombre);
    const url = getDocUrl(archivoNombre);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Archivo no encontrado');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = archivoNombre;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback estándar en caso de restricción local
      const link = document.createElement('a');
      link.href = encodeURI(url);
      link.setAttribute('download', archivoNombre);
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => setDescargando(null), 500);
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', letterSpacing: '1px', textTransform: 'uppercase' }}>
            MÓDULO 1 · GESTIÓN ESTRATÉGICA
          </span>
          <h2 style={{ margin: '0.2rem 0', color: '#1e293b', fontSize: '1.4rem' }}>
            Caracterización Organizacional · Frutopical S.A.S.
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Estructura institucional, perfiles por competencias (DPC) y plataforma estratégica · Sabanagrande, Atlántico
          </p>
        </div>

        <button
          type="button"
          onClick={onVolver}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            padding: '0.55rem 1.2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '0.85rem',
            color: '#334155'
          }}
        >
          ← Volver al Panel
        </button>
      </div>

      {/* PESTAÑAS ESTRUCTURALES DEL MÓDULO 1 */}
      <div style={{ display: 'flex', gap: '0.6rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setSubTab('legales')}
          style={{
            padding: '0.65rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: subTab === 'legales' ? '3px solid #2e7d32' : 'none',
            fontWeight: subTab === 'legales' ? '800' : '600',
            color: subTab === 'legales' ? '#2e7d32' : '#64748b',
            cursor: 'pointer',
            fontSize: '0.88rem'
          }}
        >
          ⚖️ 1. Documentación Legal
        </button>
        <button
          type="button"
          onClick={() => setSubTab('politicas')}
          style={{
            padding: '0.65rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: subTab === 'politicas' ? '3px solid #2e7d32' : 'none',
            fontWeight: subTab === 'politicas' ? '800' : '600',
            color: subTab === 'politicas' ? '#2e7d32' : '#64748b',
            cursor: 'pointer',
            fontSize: '0.88rem'
          }}
        >
          📜 2. Direccionamiento Estratégico
        </button>
        <button
          type="button"
          onClick={() => setSubTab('diagnostico')}
          style={{
            padding: '0.65rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: subTab === 'diagnostico' ? '3px solid #2e7d32' : 'none',
            fontWeight: subTab === 'diagnostico' ? '800' : '600',
            color: subTab === 'diagnostico' ? '#2e7d32' : '#64748b',
            cursor: 'pointer',
            fontSize: '0.88rem'
          }}
        >
          🏢 3. Diagnóstico (DOFA & Árbol)
        </button>
        <button
          type="button"
          onClick={() => setSubTab('estructura')}
          style={{
            padding: '0.65rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: subTab === 'estructura' ? '3px solid #ef6c00' : 'none',
            fontWeight: subTab === 'estructura' ? '800' : '600',
            color: subTab === 'estructura' ? '#ef6c00' : '#64748b',
            cursor: 'pointer',
            fontSize: '0.88rem'
          }}
        >
          📊 4. Estructura & 13 Perfiles DPC
        </button>
      </div>

      {/* PESTAÑA 1: DOCUMENTACIÓN LEGAL */}
      {subTab === 'legales' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.8rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>
              ETIQUETA 1 · CONSTITUCIÓN LEGAL DE LA EMPRESA
            </span>
            <h3 style={{ margin: '0.2rem 0', color: '#1e293b', fontSize: '1.25rem' }}>
              Documentos Legales e Institucionales
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              Soportes oficiales que acreditan personería jurídica y formalidad ante entidades estatales.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
            <div style={{ border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '1.2rem', backgroundColor: '#f8fafc' }}>
              <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.4rem' }}>📄</span>
              <strong style={{ display: 'block', color: '#1e293b' }}>Registro Único Tributario (RUT)</strong>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.4rem 0 1rem 0' }}>Identificación tributaria oficial expedida bajo estándares DIAN.</p>
              <a href={encodeURI(getDocUrl('Simulación Didáctica RUT - Frutas Del Atlántico S.A.S..pdf'))} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '0.45rem 0.9rem', backgroundColor: '#166534', color: '#fff', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', textDecoration: 'none' }}>
                👁️ Ver Soporte PDF
              </a>
            </div>

            <div style={{ border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '1.2rem', backgroundColor: '#f8fafc' }}>
              <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.4rem' }}>💳</span>
              <strong style={{ display: 'block', color: '#1e293b' }}>Certificado de NIT</strong>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.4rem 0 1rem 0' }}>Asignación de Número de Identificación Tributaria: 900.999.999-1.</p>
              <a href={encodeURI(getDocUrl('Simulación Didáctica NIT - Frutas Del Atlántico S.A.S..pdf'))} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '0.45rem 0.9rem', backgroundColor: '#166534', color: '#fff', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', textDecoration: 'none' }}>
                👁️ Ver Soporte PDF
              </a>
            </div>

            <div style={{ border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '1.2rem', backgroundColor: '#f8fafc' }}>
              <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.4rem' }}>🏛️</span>
              <strong style={{ display: 'block', color: '#1e293b' }}>Existencia y Representación Legal</strong>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.4rem 0 1rem 0' }}>Certificado mercantil expedido por la Cámara de Comercio de Barranquilla.</p>
              <a href={encodeURI(getDocUrl('Certificado de Existencia y Representacion Legal - FRUTOPICAL SAS.pdf'))} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '0.45rem 0.9rem', backgroundColor: '#166534', color: '#fff', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', textDecoration: 'none' }}>
                👁️ Ver Soporte PDF
              </a>
            </div>

            <div style={{ border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '1.2rem', backgroundColor: '#f8fafc' }}>
              <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.4rem' }}>🔒</span>
              <strong style={{ display: 'block', color: '#1e293b' }}>Política de Protección de Datos</strong>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.4rem 0 1rem 0' }}>Consentimiento informado y Habeas Data conforme a la Ley 1581 de 2012.</p>
              <a href={encodeURI(getDocUrl('Autorizacion Tratamiento Datos Personales - FRUTOPICAL SAS.pdf'))} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '0.45rem 0.9rem', backgroundColor: '#166534', color: '#fff', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', textDecoration: 'none' }}>
                👁️ Ver Soporte PDF
              </a>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: POLÍTICAS Y DIRECCIONAMIENTO */}
      {subTab === 'politicas' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>
                ETIQUETA 2 · MARCO ESTRATÉGICO
              </span>
              <h3 style={{ margin: '0.2rem 0', color: '#1e293b', fontSize: '1.25rem' }}>
                Políticas Organizacionales
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                Compromisos de calidad, seguridad y convivencia laboral de Frutopical S.A.S.
              </p>
            </div>

            <a
              href={encodeURI(getDocUrl('Politica organizacionales.pdf'))}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: '0.55rem 1.1rem', backgroundColor: '#2e7d32', color: '#ffffff', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none' }}
            >
              📥 Ver Manual Completo de Políticas (PDF)
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
            <div style={{ borderLeft: '4px solid #166534', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0 8px 8px 0' }}>
              <strong style={{ color: '#166534', display: 'block', marginBottom: '0.3rem' }}>1. Política de Inocuidad y BPM</strong>
              <p style={{ fontSize: '0.83rem', color: '#475569', margin: 0, lineHeight: '1.5' }}>Procesamiento estricto conforme a la Res. 2674 de 2013 para consumo seguro.</p>
            </div>
            <div style={{ borderLeft: '4px solid #ef6c00', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0 8px 8px 0' }}>
              <strong style={{ color: '#c2410c', display: 'block', marginBottom: '0.3rem' }}>2. Política de SG-SST (Dec. 1072 / 2015)</strong>
              <p style={{ fontSize: '0.83rem', color: '#475569', margin: 0, lineHeight: '1.5' }}>Garantizar condiciones de trabajo seguras y dotación reglamentaria de EPP.</p>
            </div>
            <div style={{ borderLeft: '4px solid #2563eb', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0 8px 8px 0' }}>
              <strong style={{ color: '#1d4ed8', display: 'block', marginBottom: '0.3rem' }}>3. Política de Gestión Humana y Selección</strong>
              <p style={{ fontSize: '0.83rem', color: '#475569', margin: 0, lineHeight: '1.5' }}>Evaluación técnica basada en competencias, idoneidad y mérito laboral.</p>
            </div>
            <div style={{ borderLeft: '4px solid #7c3aed', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0 8px 8px 0' }}>
              <strong style={{ color: '#6d28d9', display: 'block', marginBottom: '0.3rem' }}>4. Política de Atención PQRS (Ley 1755 / 2015)</strong>
              <p style={{ fontSize: '0.83rem', color: '#475569', margin: 0, lineHeight: '1.5' }}>Respuestas garantizadas en 15 días hábiles y certificados en 3 a 5 días.</p>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: DIAGNÓSTICO (DOFA & ÁRBOL) */}
      {subTab === 'diagnostico' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.8rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>HERRAMIENTA DE ANÁLISIS</span>
            <h3 style={{ margin: '0.3rem 0 1.2rem 0', color: '#1e293b' }}>Matriz DOFA Organizacional</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
              <div style={{ backgroundColor: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', padding: '1.2rem' }}>
                <strong style={{ color: '#166534', display: 'block', marginBottom: '0.5rem' }}>💪 FORTALEZAS</strong>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#334155', lineHeight: '1.5' }}>
                  <li>Pulpas 100% naturales pasteurizadas y certificadas.</li>
                  <li>Ubicación estratégica en la cuenca agrícola de Sabanagrande.</li>
                  <li>Implementación de TalentHub para la gestión del talento.</li>
                </ul>
              </div>
              <div style={{ backgroundColor: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '10px', padding: '1.2rem' }}>
                <strong style={{ color: '#991b1b', display: 'block', marginBottom: '0.5rem' }}>⚠️ DEBILIDADES</strong>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#334155', lineHeight: '1.5' }}>
                  <li>Capacidad de refrigeración y congelación en expansión.</li>
                  <li>Dependencia del calendario de cosecha de frutas del Caribe.</li>
                </ul>
              </div>
              <div style={{ backgroundColor: '#eff6ff', border: '1.5px solid #93c5fd', borderRadius: '10px', padding: '1.2rem' }}>
                <strong style={{ color: '#1d4ed8', display: 'block', marginBottom: '0.5rem' }}>🚀 OPORTUNIDADES</strong>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#334155', lineHeight: '1.5' }}>
                  <li>Alianzas de suministro con hoteles y restaurantes del Atlántico.</li>
                  <li>Articulación institucional y formación técnica con el SENA.</li>
                </ul>
              </div>
              <div style={{ backgroundColor: '#fff7ed', border: '1.5px solid #fdba74', borderRadius: '10px', padding: '1.2rem' }}>
                <strong style={{ color: '#9a3412', display: 'block', marginBottom: '0.5rem' }}>🛡️ AMENAZAS</strong>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#334155', lineHeight: '1.5' }}>
                  <li>Fluctuación de precios de materias primas por clima.</li>
                  <li>Competencia con marcas consolidadas en retail.</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.8rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#ef6c00', textTransform: 'uppercase' }}>DIAGNÓSTICO CAUSAL</span>
            <h3 style={{ margin: '0.2rem 0 1.2rem 0', color: '#1e293b' }}>Árbol de Problemas: Gestión del Talento Humano</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', maxWidth: '850px', margin: '0 auto' }}>
              <div style={{ backgroundColor: '#fef2f2', border: '1.5px solid #fca5a5', padding: '0.9rem', borderRadius: '8px', textAlign: 'center' }}>
                <strong style={{ color: '#991b1b', fontSize: '0.85rem' }}>EFECTOS</strong>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#334155' }}>
                  Retrasos en respuesta a PQRS · Pérdida de soportes físicos de SST · Falta de estandarización en perfiles de cargo.
                </p>
              </div>
              <div style={{ textAlign: 'center', fontSize: '1rem', color: '#94a3b8' }}>⬆</div>
              <div style={{ backgroundColor: '#fff7ed', border: '2px solid #ea580c', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                <strong style={{ color: '#c2410c', fontSize: '0.78rem', textTransform: 'uppercase' }}>PROBLEMA CENTRAL</strong>
                <h4 style={{ margin: '0.2rem 0', color: '#9a3412', fontSize: '1.05rem' }}>
                  Ineficiencia por gestión manual y dispersa de los procesos de Talento Humano en Frutopical S.A.S.
                </h4>
              </div>
              <div style={{ textAlign: 'center', fontSize: '1rem', color: '#94a3b8' }}>⬆</div>
              <div style={{ backgroundColor: '#f0fdf4', border: '1.5px solid #86efac', padding: '0.9rem', borderRadius: '8px', textAlign: 'center' }}>
                <strong style={{ color: '#166534', fontSize: '0.85rem' }}>CAUSAS</strong>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#334155' }}>
                  Ausencia de una plataforma web unificada · Carencia de matrices de selección técnica ponderadas · Falta de control digital en historias laborales.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 4: ESTRUCTURA Y LOS 13 MANUALES DPC OFICIALES */}
      {subTab === 'estructura' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
          {/* ORGANIGRAMA */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.8rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>
              ETIQUETA 4 · ESTRUCTURA ORGANIZACIONAL
            </span>
            <h3 style={{ margin: '0.2rem 0 0.8rem 0', color: '#1e293b', fontSize: '1.25rem' }}>
              Organigrama y Líneas de Mando Institucionales
            </h3>

            <div style={{ textAlign: 'center', backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
              <img
                src={encodeURI(getDocUrl('0. Organigrama.jpg'))}
                alt="Organigrama Institucional Frutopical S.A.S."
                style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* LISTADO OFICIAL DE LOS 13 PERFILES DE CARGO (DPC) CON DESCARGA DIRECTA */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#ef6c00', textTransform: 'uppercase' }}>
                  MANUALES DE FUNCIONES POR COMPETENCIAS
                </span>
                <h3 style={{ margin: '0.2rem 0', color: '#1e293b', fontSize: '1.25rem' }}>
                  Descripciones de Puesto de Trabajo (13 Perfiles Oficiales DPC)
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  Haz clic en cualquiera de los cargos para descargar inmediatamente el manual de funciones en Word (.docx).
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1rem' }}>
              {PERFILES_DPC.map((perfil) => (
                <div
                  key={perfil.codigo}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '135px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#166534', backgroundColor: '#dcfce7', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        {perfil.codigo}
                      </span>
                      <small style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '600' }}>{perfil.area}</small>
                    </div>
                    <strong style={{ color: '#1e293b', fontSize: '0.92rem', display: 'block', marginBottom: '0.4rem' }}>
                      {perfil.cargo}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => forzarDescarga(perfil.archivo)}
                    disabled={descargando === perfil.archivo}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.8rem',
                      backgroundColor: '#166534',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 2px 6px rgba(22, 101, 52, 0.2)'
                    }}
                  >
                    <span>{descargando === perfil.archivo ? '⏳' : '📥'}</span>
                    {descargando === perfil.archivo ? 'Descargando...' : 'Descargar Manual (.docx)'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}