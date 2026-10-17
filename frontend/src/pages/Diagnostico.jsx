import React, { useState } from 'react';

export default function Diagnostico({ onVolver }) {
  const [subTab, setSubTab] = useState('plataforma');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', letterSpacing: '1px', textTransform: 'uppercase' }}>
            EQUIPO 1 · CARACTERIZACIÓN ORGANIZACIONAL
          </span>
          <h2 style={{ margin: '0.2rem 0', color: '#1e293b', fontSize: '1.4rem' }}>
            1. Diagnóstico y Direccionamiento Estratégico
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Frutas Del Atlántico S.A.S. (Frutopical) · Sabanagrande, Atlántico
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

      <div style={{ display: 'flex', gap: '0.6rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setSubTab('plataforma')}
          style={{
            padding: '0.65rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: subTab === 'plataforma' ? '3px solid #2e7d32' : 'none',
            fontWeight: subTab === 'plataforma' ? '800' : '600',
            color: subTab === 'plataforma' ? '#2e7d32' : '#64748b',
            cursor: 'pointer',
            fontSize: '0.88rem'
          }}
        >
          🏢 Plataforma Estratégica & DOFA
        </button>
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
          ⚖️ 1. Documentos Legales
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
          📜 2. Políticas Organizacionales
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
          📊 3. Estructura & Manuales DPC
        </button>
        <button
          type="button"
          onClick={() => setSubTab('problemas')}
          style={{
            padding: '0.65rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: subTab === 'problemas' ? '3px solid #ef6c00' : 'none',
            fontWeight: subTab === 'problemas' ? '800' : '600',
            color: subTab === 'problemas' ? '#ef6c00' : '#64748b',
            cursor: 'pointer',
            fontSize: '0.88rem'
          }}
        >
          🌳 Árbol de Problemas
        </button>
      </div>

      {subTab === 'plataforma' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>MISIÓN</span>
              <h3 style={{ margin: '0.3rem 0 0.6rem 0', color: '#1e293b' }}>Propósito Fundamental</h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.6' }}>
                FRUTOPICAL S.A.S. produce y comercializa frutas tropicales y sus derivados, ofreciendo productos de calidad mediante procesos eficientes, un equipo humano comprometido y el uso de tecnologías que contribuyen a la satisfacción de clientes, el desarrollo sostenible y el crecimiento organizacional.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#c2410c', textTransform: 'uppercase' }}>VISIÓN 2030</span>
              <h3 style={{ margin: '0.3rem 0 0.6rem 0', color: '#1e293b' }}>Proyección Estratégica</h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.6' }}>
                Para el año 2030, FRUTOPICAL S.A.S. será reconocida como una empresa referente del sector agroindustrial por la calidad de sus productos, la innovación de sus procesos y la implementación de soluciones digitales que fortalezcan la gestión del talento humano y el servicio al cliente.
              </p>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.8rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>DIAGNÓSTICO SITUACIONAL</span>
            <h3 style={{ margin: '0.3rem 0 1.2rem 0', color: '#1e293b' }}>Matriz DOFA Organizacional</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
              <div style={{ backgroundColor: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', padding: '1.2rem' }}>
                <strong style={{ color: '#166534', display: 'block', marginBottom: '0.5rem' }}>💪 FORTALEZAS (Internas)</strong>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#334155', lineHeight: '1.5' }}>
                  <li>Ubicación estratégica en el Atlántico con acceso a cuencas frutícolas locales.</li>
                  <li>Procesos de pulpa 100% natural sin aditivos químicos ni conservantes.</li>
                  <li>Equipo humano calificado y certificado en BPM e higiene alimentaria.</li>
                  <li>Implementación de la plataforma digital propia TalentHub.</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '10px', padding: '1.2rem' }}>
                <strong style={{ color: '#991b1b', display: 'block', marginBottom: '0.5rem' }}>⚠️ DEBILIDADES (Internas)</strong>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#334155', lineHeight: '1.5' }}>
                  <li>Capacidad instalada de frío en etapa de escalamiento agroindustrial.</li>
                  <li>Dependencia estacional de cosechas locales de mango, maracuyá y guayaba.</li>
                  <li>Manejo documental preexistente basado en formatos manuales.</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#eff6ff', border: '1.5px solid #93c5fd', borderRadius: '10px', padding: '1.2rem' }}>
                <strong style={{ color: '#1d4ed8', display: 'block', marginBottom: '0.5rem' }}>🚀 OPORTUNIDADES (Externas)</strong>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#334155', lineHeight: '1.5' }}>
                  <li>Creciente demanda regional por pulpas de frutas saludables y naturales.</li>
                  <li>Alianzas comerciales con restaurantes, hoteles y canal HORECA.</li>
                  <li>Acompañamiento y articulación formativa con el SENA Regional Atlántico.</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#fff7ed', border: '1.5px solid #fdba74', borderRadius: '10px', padding: '1.2rem' }}>
                <strong style={{ color: '#9a3412', display: 'block', marginBottom: '0.5rem' }}>🛡️ AMENAZAS (Externas)</strong>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#334155', lineHeight: '1.5' }}>
                  <li>Variación climática que altera los ciclos y precios de fruta fresca.</li>
                  <li>Competencia de procesadoras industriales posicionadas a nivel nacional.</li>
                  <li>Fluctuaciones en costos de empaque y transporte refrigerado.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 1: DOCUMENTOS LEGALES (RUT, NIT Y CÁMARA CON ENLACES EXACTOS) */}
      {subTab === 'legales' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.8rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>
              ETIQUETA 1 · CONSTITUCIÓN LEGAL DE LA EMPRESA
            </span>
            <h3 style={{ margin: '0.2rem 0', color: '#1e293b', fontSize: '1.25rem' }}>
              Documentos Legales y Tributarios de Frutopical S.A.S.
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              Soporte documental que acredita la existencia jurídica, personería y formalidad tributaria de la entidad.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
            <div style={{ border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '1.2rem', backgroundColor: '#f8fafc' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>📄</div>
              <strong style={{ display: 'block', color: '#1e293b' }}>Registro Único Tributario (RUT)</strong>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.4rem 0 1rem 0' }}>
                Identificación tributaria simulada expedida conforme a la normatividad DIAN para Frutas Del Atlántico S.A.S. (NIT 900.999.999-1).
              </p>
              <a
                href={encodeURI('/docs/Simulación Didáctica RUT - Frutas Del Atlántico S.A.S..pdf')}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', padding: '0.45rem 0.9rem', backgroundColor: '#166534', color: '#fff', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', textDecoration: 'none' }}
              >
                👁️ Ver Documento PDF
              </a>
            </div>

            <div style={{ border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '1.2rem', backgroundColor: '#f8fafc' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>💳</div>
              <strong style={{ display: 'block', color: '#1e293b' }}>Identificación Tributaria (NIT Didáctico)</strong>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.4rem 0 1rem 0' }}>
                Certificado formal de asignación de NIT con código de verificación ante el registro mercantil.
              </p>
              <a
                href={encodeURI('/docs/Simulación Didáctica NIT - Frutas Del Atlántico S.A.S..pdf')}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', padding: '0.45rem 0.9rem', backgroundColor: '#166534', color: '#fff', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', textDecoration: 'none' }}
              >
                👁️ Ver Documento PDF
              </a>
            </div>

            <div style={{ border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '1.2rem', backgroundColor: '#f8fafc' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>🏛️</div>
              <strong style={{ display: 'block', color: '#1e293b' }}>Existencia y Representación Legal</strong>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.4rem 0 1rem 0' }}>
                Certificado de Cámara de Comercio que valida la matrícula mercantil, domicilio en Sabanagrande y representación legal.
              </p>
              <a
                href={encodeURI('/docs/Certificado de Existencia y Representacion Legal - FRUTOPICAL SAS.pdf')}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', padding: '0.45rem 0.9rem', backgroundColor: '#166534', color: '#fff', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', textDecoration: 'none' }}
              >
                👁️ Ver Documento PDF
              </a>
            </div>

            <div style={{ border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '1.2rem', backgroundColor: '#f8fafc' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>🔒</div>
              <strong style={{ display: 'block', color: '#1e293b' }}>Tratamiento de Datos Personales</strong>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.4rem 0 1rem 0' }}>
                Formato y consentimiento informado de Habeas Data para colaboradores y aspirantes (Ley 1581 de 2012).
              </p>
              <a
                href={encodeURI('/docs/Autorizacion Tratamiento Datos Personales - FRUTOPICAL SAS.pdf')}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', padding: '0.45rem 0.9rem', backgroundColor: '#166534', color: '#fff', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', textDecoration: 'none' }}
              >
                👁️ Ver Documento PDF
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: POLÍTICAS */}
      {subTab === 'politicas' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>
                ETIQUETA 2 · MARCO NORMATIVO Y DIRECTRIZ
              </span>
              <h3 style={{ margin: '0.2rem 0', color: '#1e293b', fontSize: '1.25rem' }}>
                Políticas Organizacionales e Institucionales
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                Directrices formales que orientan la operación, calidad y clima organizacional.
              </p>
            </div>

            <a
              href={encodeURI('/docs/Politica organizacionales.pdf')}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: '0.55rem 1.1rem', backgroundColor: '#2e7d32', color: '#ffffff', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none' }}
            >
              📥 Descargar Documento Completo en PDF
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
            <div style={{ borderLeft: '4px solid #166534', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0 8px 8px 0' }}>
              <strong style={{ color: '#166534', display: 'block', marginBottom: '0.3rem' }}>1. Política Integral de Calidad e Inocuidad</strong>
              <p style={{ fontSize: '0.83rem', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                Asegurar que las pulpas y derivados se procesen bajo estándares sanitarios y de Buenas Prácticas de Manufactura (BPM).
              </p>
            </div>

            <div style={{ borderLeft: '4px solid #ef6c00', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0 8px 8px 0' }}>
              <strong style={{ color: '#c2410c', display: 'block', marginBottom: '0.3rem' }}>2. Política de Seguridad y Salud en el Trabajo (SG-SST)</strong>
              <p style={{ fontSize: '0.83rem', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                Prevención de incidentes y enfermedades laborales en planta mediante dotación periódica de EPP e inducción continua.
              </p>
            </div>

            <div style={{ borderLeft: '4px solid #2563eb', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0 8px 8px 0' }}>
              <strong style={{ color: '#1d4ed8', display: 'block', marginBottom: '0.3rem' }}>3. Política Ambiental y Sostenibilidad</strong>
              <p style={{ fontSize: '0.83rem', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                Reducción de residuos orgánicos mediante el aprovechamiento de cáscaras y residuos de fruta para abono en el Atlántico.
              </p>
            </div>

            <div style={{ borderLeft: '4px solid #7c3aed', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0 8px 8px 0' }}>
              <strong style={{ color: '#6d28d9', display: 'block', marginBottom: '0.3rem' }}>4. Política de Atención al Cliente y PQRS</strong>
              <p style={{ fontSize: '0.83rem', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                Atención formal con radicado de seguimiento en un plazo máximo de 48 horas para colaboradores y partes interesadas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ESTRUCTURA Y MANUALES DPC */}
      {subTab === 'estructura' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.8rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>
              ETIQUETA 3 · JERARQUÍA Y LÍNEAS DE MANDO
            </span>
            <h3 style={{ margin: '0.2rem 0 1rem 0', color: '#1e293b', fontSize: '1.25rem' }}>
              Organigrama Institucional de Frutopical S.A.S.
            </h3>

            <div style={{ textAlign: 'center', backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
              <img
                src={encodeURI('/docs/0. Organigrama.jpg')}
                alt="Organigrama de Frutopical S.A.S."
                style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = `
                    <div style="padding: 2rem; color: #166534;">
                      <strong>📊 Estructura Jerárquica:</strong>
                      <p style="font-size: 0.88rem; color: #475569; max-width: 600px; margin: 0.5rem auto;">
                        <strong>Gerencia General</strong> (Samy Dariany Rodríguez) → <strong>Operaciones & Calidad</strong> → <strong>Supervisión de Planta</strong> (Operarios de Producción y Mantenimiento) | <strong>Gestión Humana</strong>.
                      </p>
                    </div>
                  `;
                }}
              />
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.8rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#ef6c00', textTransform: 'uppercase' }}>
              MANUALES DE FUNCIONES POR COMPETENCIAS
            </span>
            <h3 style={{ margin: '0.2rem 0 1rem 0', color: '#1e293b', fontSize: '1.25rem' }}>
              Descripciones de Puesto de Trabajo (DPC)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem' }}>
              <div style={{ border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '1.3rem', backgroundColor: '#f8fafc' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase' }}>DPC 05</span>
                <strong style={{ display: 'block', fontSize: '1.05rem', color: '#1e293b', margin: '0.2rem 0 0.5rem 0' }}>
                  Técnico en Soporte de Infraestructura y Sistemas
                </strong>
                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.5', margin: '0 0 1rem 0' }}>
                  Garantizar la disponibilidad, operatividad, mantenimiento preventivo y seguridad informática de la infraestructura tecnológica, redes y la plataforma TalentHub.
                </p>
                <a
                  href={encodeURI('/docs/5 DPC Soporte t cnico.docx')}
                  download
                  style={{ display: 'inline-block', padding: '0.45rem 0.9rem', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', textDecoration: 'none' }}
                >
                  📥 Descargar Manual DPC (.docx)
                </a>
              </div>

              <div style={{ border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '1.3rem', backgroundColor: '#f8fafc' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>DPC 11</span>
                <strong style={{ display: 'block', fontSize: '1.05rem', color: '#1e293b', margin: '0.2rem 0 0.5rem 0' }}>
                  Operario de Producción y Transformación de Fruta
                </strong>
                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.5', margin: '0 0 1rem 0' }}>
                  Ejecutar las operaciones de recepción, lavado, despulpado, pasteurizado y envasado de pulpas tropicales cumpliendo rigurosamente los protocolos de BPM y SST.
                </p>
                <a
                  href={encodeURI('/docs/11 DPC Operario de produccion.docx')}
                  download
                  style={{ display: 'inline-block', padding: '0.45rem 0.9rem', backgroundColor: '#166534', color: '#ffffff', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', textDecoration: 'none' }}
                >
                  📥 Descargar Manual DPC (.docx)
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: ÁRBOL DE PROBLEMAS */}
      {subTab === 'problemas' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.8rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#ef6c00', textTransform: 'uppercase' }}>
            METODOLOGÍA DE MARCO LÓGICO
          </span>
          <h3 style={{ margin: '0.2rem 0 1.2rem 0', color: '#1e293b' }}>
            Árbol de Problemas: Gestión del Talento Humano
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '850px', margin: '0 auto' }}>
            <div style={{ backgroundColor: '#fef2f2', border: '1.5px solid #fca5a5', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <strong style={{ color: '#991b1b', fontSize: '0.88rem' }}>EFECTOS / CONSECUENCIAS</strong>
              <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.82rem', color: '#334155' }}>
                Retrasos en respuesta a peticiones laborales · Falta de trazabilidad en archivo documental · Riesgo de incumplimiento en dotación y actas de SST.
              </p>
            </div>

            <div style={{ textAlign: 'center', fontSize: '1.2rem', color: '#94a3b8' }}>⬆</div>

            <div style={{ backgroundColor: '#fff7ed', border: '2px solid #ea580c', padding: '1.2rem', borderRadius: '10px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#c2410c', textTransform: 'uppercase' }}>PROBLEMA CENTRAL</span>
              <h4 style={{ margin: '0.2rem 0', color: '#9a3412', fontSize: '1.1rem' }}>
                Ineficiencia en la administración manual y dispersa de los procesos de Talento Humano en Frutopical S.A.S.
              </h4>
            </div>

            <div style={{ textAlign: 'center', fontSize: '1.2rem', color: '#94a3b8' }}>⬆</div>

            <div style={{ backgroundColor: '#f0fdf4', border: '1.5px solid #86efac', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <strong style={{ color: '#166534', fontSize: '0.88rem' }}>CAUSAS RAÍZ</strong>
              <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.82rem', color: '#334155' }}>
                Inexistencia de un portal digital unificado · Procesos de selección evaluados sin baremos ponderados · Registros de inducción y dotación en papel físico.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}