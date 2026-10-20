import React, { useState } from 'react';
import '../dashboard.css';

// LOS 13 PERFILES OFICIALES DPC SEGÚN EL ORGANIGRAMA DEL 27/09/2026
const PERFILES_DPC_OFICIALES = [
  {
    codigo: 'DPC 01',
    cargo: 'Gerente General',
    area: 'Dirección Estratégica',
    archivo: '1 DPC Gerente General.docx',
    nivel: 'Directivo',
    mision: 'Liderar la planeación estratégica, representación legal, sostenibilidad operativa y financiera de Frutas Del Atlántico S.A.S.'
  },
  {
    codigo: 'DPC 02',
    cargo: 'Jefe de Talento Humano',
    area: 'Talento Humano',
    archivo: '2 DPC Jefe de talento humano.docx',
    nivel: 'Táctico / Jefatura',
    mision: 'Dirigir los procesos de selección, contratación, nómina, capacitación, clima laboral, SG-SST y relaciones de trabajo de la empresa.'
  },
  {
    codigo: 'DPC 03',
    cargo: 'Auxiliar de Talento Humano',
    area: 'Talento Humano',
    archivo: '3 DPC Auxiliar TH.docx',
    nivel: 'Operativo / Apoyo',
    mision: 'Apoyar la custodia de expedientes en archivo central CCD, verificación de listas de chequeo de ingreso y reporte de novedades de nómina.'
  },
  {
    codigo: 'DPC 04',
    cargo: 'Jefe de Soporte Técnico',
    area: 'Tecnología e Infraestructura',
    archivo: '4 DPC Jefe de Soporte técnico.docx',
    nivel: 'Táctico / Jefatura',
    mision: 'Garantizar la disponibilidad, seguridad, licenciamiento y mantenimiento de la infraestructura informática y plataformas digitales institucionales.'
  },
  {
    codigo: 'DPC 05',
    cargo: 'Soporte Técnico e Infraestructura',
    area: 'Tecnología e Infraestructura',
    archivo: '5 DPC Soporte técnico.docx',
    nivel: 'Operativo / Técnico',
    mision: 'Brindar soporte técnico presencial y remoto a estaciones de trabajo, cableado estructurado, respaldo de bases de datos y conectividad.'
  },
  {
    codigo: 'DPC 06',
    cargo: 'Jefe Comercial y Mercadeo',
    area: 'Comercial',
    archivo: '6 DPC Jefe Comercial.docx',
    nivel: 'Táctico / Jefatura',
    mision: 'Definir y ejecutar los planes de comercialización de pulpas congeladas, apertura de clientes institucionales y posicionamiento de marca.'
  },
  {
    codigo: 'DPC 07',
    cargo: 'Asesor de Ventas',
    area: 'Comercial',
    archivo: '7 DPC Asesor de ventas.docx',
    nivel: 'Operativo / Asesoría',
    mision: 'Gestionar ventas directas en el canal HORECA, supermercados y distribuidores, cotizaciones y atención directa a clientes potenciales.'
  },
  {
    codigo: 'DPC 08',
    cargo: 'Community Manager',
    area: 'Comercial / Mercadeo Digital',
    archivo: '8 DPC Community Manager.docx',
    nivel: 'Operativo / Digital',
    mision: 'Gestionar las redes sociales oficiales (@frutopical_sas), diseño de piezas publicitarias, pauta digital y comunicación con el consumidor.'
  },
  {
    codigo: 'DPC 09',
    cargo: 'Auxiliar Administrativo y Contable',
    area: 'Administración y Finanzas',
    archivo: '9 DPC Auxiliar Administrativo y Contable.docx',
    nivel: 'Operativo / Administrativo',
    mision: 'Realizar la causación de facturas, soporte a compras de materia prima, archivo de comprobantes contables y conciliaciones bancarias.'
  },
  {
    codigo: 'DPC 10',
    cargo: 'Jefe de Producción y Calidad',
    area: 'Producción y Calidad',
    archivo: '10 DPC Jefe de producción y calidad.docx',
    nivel: 'Táctico / Jefatura',
    mision: 'Supervisar el proceso de despulpado, pasteurizado y congelación, asegurando el estricto cumplimiento de Buenas Prácticas de Manufactura (BPM).'
  },
  {
    codigo: 'DPC 11',
    cargo: 'Operario de Producción',
    area: 'Planta Agroindustrial',
    archivo: '11 DPC Operario de produccion.docx',
    nivel: 'Operativo de Planta',
    mision: 'Ejecutar las labores operativas de recepción, lavado, selección, despulpado, sellado y embalaje de pulpas conforme a los manuales BPM.'
  },
  {
    codigo: 'DPC 12',
    cargo: 'Auxiliar de Logística',
    area: 'Logística y Almacén',
    archivo: '12 DPC Auxiliar de Logistica.docx',
    nivel: 'Operativo / Logística',
    mision: 'Administrar el inventario en cuartos fríos, control de temperaturas, alistamiento de pedidos y verificación de remisiones de entrega.'
  },
  {
    codigo: 'DPC 13',
    cargo: 'Repartidor',
    area: 'Distribución y Despachos',
    archivo: '13 DPC Repartidor.docx',
    nivel: 'Operativo / Envíos',
    mision: 'Realizar la entrega física y transporte refrigerado de los pedidos a los clientes en Sabanagrande y municipios del Atlántico a paz y salvo.'
  }
];

export default function Diagnostico({ onVolver }) {
  const [cargoSeleccionado, setCargoSeleccionado] = useState(null);

  function descargarManual(perfil) {
    const enlace = document.createElement('a');
    enlace.href = `/docs/${encodeURIComponent(perfil.archivo)}`;
    enlace.download = perfil.archivo;
    enlace.target = '_blank';
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* CABECERA DEL MÓDULO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1.2rem' }}>
        <div>
          <span className="th-label">MÓDULO 1 · CARACTERIZACIÓN ORGANIZACIONAL</span>
          <h2 style={{ margin: '0.2rem 0', color: '#166534', fontSize: '1.6rem' }}>
            Estructura Orgánica y Perfiles de Cargo (DPC)
          </h2>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
            Alineación formal aprobada de los 13 cargos de Frutas Del Atlántico S.A.S. conforme al organigrama institucional del 27/09/2026.
          </p>
        </div>

        <button
          type="button"
          className="th-secondary-button"
          onClick={onVolver}
          style={{ padding: '0.65rem 1.4rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          ← Volver al Panel de Inicio
        </button>
      </div>

      {/* TARJETA INFORMATIVA DEL ORGANIGRAMA Y MANUAL DPC */}
      <div style={{ backgroundColor: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '14px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.2rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', letterSpacing: '0.5px' }}>
            MANUAL DE FUNCIONES Y COMPETENCIAS LABORALES
          </span>
          <h3 style={{ margin: '0.2rem 0', color: '#14532d', fontSize: '1.25rem' }}>
            13 Perfiles Oficiales de Descripción de Puesto de Trabajo (DPC)
          </h3>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#334155' }}>
            Estructura jerárquica: 1 Directivo, 4 Jefaturas / Tácticos y 8 Cargos Operativos y de Soporte.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <a
            href="/docs/0. Organigrama.jpg"
            target="_blank"
            rel="noopener noreferrer"
            style={{ padding: '0.6rem 1.2rem', backgroundColor: '#ffffff', color: '#166534', border: '1.5px solid #166534', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            📊 Ver Organigrama (.jpg)
          </a>
          <a
            href="/docs/0. Perfil De Cargo.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ padding: '0.6rem 1.2rem', backgroundColor: '#166534', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            📑 Manual DPC General (.pdf)
          </a>
        </div>
      </div>

      {/* CUADRÍCULA EXACTA DE LOS 13 PERFILES DE CARGO */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '2rem' }}>
        <div style={{ marginBottom: '1.8rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.3rem' }}>
            Descripciones de Puesto de Trabajo (13 Perfiles Oficiales DPC)
          </h3>
          <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.84rem', color: '#64748b' }}>
            Haz clic en cualquiera de los cargos para descargar inmediatamente el manual de funciones en Word (.docx) o consultar su misión del cargo.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.3rem' }}>
          {PERFILES_DPC_OFICIALES.map((dpc) => (
            <div
              key={dpc.codigo}
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '12px',
                padding: '1.3rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.9rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'border-color 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: '900', color: '#166534', backgroundColor: '#dcfce7', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    {dpc.codigo}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: '700' }}>{dpc.area}</span>
                </div>

                <strong style={{ fontSize: '1.1rem', color: '#1e293b', display: 'block', lineHeight: 1.3 }}>
                  {dpc.cargo}
                </strong>
                <span style={{ fontSize: '0.74rem', color: '#c2410c', fontWeight: 'bold', display: 'block', marginTop: '0.2rem' }}>
                  Nivel: {dpc.nivel}
                </span>

                <p style={{ margin: '0.6rem 0 0 0', fontSize: '0.8rem', color: '#556957', lineHeight: 1.45 }}>
                  {dpc.mision}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.8rem' }}>
                <button
                  type="button"
                  onClick={() => setCargoSeleccionado(dpc)}
                  style={{
                    flex: 1,
                    backgroundColor: '#f8fafc',
                    color: '#1e293b',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    fontSize: '0.76rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  👁️ Ver Detalle
                </button>
                <button
                  type="button"
                  onClick={() => descargarManual(dpc)}
                  style={{
                    flex: 1.4,
                    backgroundColor: '#166534',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    fontSize: '0.76rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  📥 Descargar Manual (.docx)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DETALLE DE CARGO DPC */}
      {cargoSeleccionado && (
        <div className="th-modal-backdrop" onMouseDown={() => setCargoSeleccionado(null)}>
          <section
            className="th-postulation-modal"
            style={{ maxWidth: '600px', width: '92%', padding: '2rem' }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="th-modal-header">
              <div>
                <span className="th-label">FICHA TÉCNICA DE DESCRIPCIÓN DE PUESTO</span>
                <h3 style={{ margin: '0.2rem 0', color: '#166534' }}>
                  {cargoSeleccionado.codigo} · {cargoSeleccionado.cargo}
                </h3>
              </div>
              <button type="button" className="th-modal-close" onClick={() => setCargoSeleccionado(null)}>×</button>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '1.2rem', marginTop: '1rem', fontSize: '0.85rem', lineHeight: 1.6 }}>
              <p style={{ margin: '0 0 0.4rem 0' }}><strong>Área Organizacional:</strong> {cargoSeleccionado.area}</p>
              <p style={{ margin: '0 0 0.4rem 0' }}><strong>Nivel Jerárquico:</strong> {cargoSeleccionado.nivel}</p>
              <p style={{ margin: '0 0 0.4rem 0' }}><strong>Archivo Digital Oficial:</strong> <code>{cargoSeleccionado.archivo}</code></p>
              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '0.6rem', marginTop: '0.6rem' }}>
                <strong>Propósito Principal y Misión del Cargo:</strong>
                <p style={{ margin: '0.3rem 0 0 0', color: '#334155' }}>{cargoSeleccionado.mision}</p>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem' }}>
              <button
                type="button"
                onClick={() => descargarManual(cargoSeleccionado)}
                style={{ flex: 1, padding: '0.75rem', backgroundColor: '#166534', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                📥 Descargar Documento Word (.docx)
              </button>
              <button
                type="button"
                onClick={() => setCargoSeleccionado(null)}
                style={{ padding: '0.75rem 1.4rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Cerrar
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}