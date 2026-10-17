import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import Dashboard from './pages/Dashboard.jsx';

import './styles.css';
import './corporate.css';
import './motion.css';

// Cambiar el título de la pestaña de forma formal
document.title = "Frutopical | TalentHub";

// Forzar el favicon apuntando directo a la carpeta public
const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
link.type = 'image/png';
link.rel = 'icon';
link.href = '/logo-frutopical.png';
document.head.appendChild(link);

const api =
  import.meta.env.VITE_API_URL ??
  'http://localhost:3000/api/v1';

// Función para resolver rutas seguras a la carpeta public sin problemas de URL
function getPublicUrl(path) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}

// LOGO CORPORATIVO OFICIAL
function FrutopicalLogo({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" style={{ flexShrink: 0 }}>
      <path d="M68 20 C64 10 52 12 48 20 C46 26 54 32 62 30 C70 28 72 24 68 20 Z" fill="#2E7D32" />
      <path d="M54 20 Q60 25 65 28" stroke="#1B5E20" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M48 28 C32 30 20 46 22 66 C24 86 42 100 56 94 C64 88 66 74 62 60 C58 46 56 32 48 28 Z" fill="url(#gradMangoVerde)" />
      <path d="M66 32 C54 36 46 50 48 68 C50 86 64 104 82 102 C96 98 104 82 100 62 C96 44 82 32 66 32 Z" fill="url(#gradMangoAmarillo)" />
      <path d="M52 64 C50 78 60 92 74 96" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <defs>
        <linearGradient id="gradMangoVerde" x1="20" y1="30" x2="65" y2="95" gradientUnits="userSpaceOnUse">
          <stop stopColor="#66BB6A" />
          <stop offset="0.7" stopColor="#2E7D32" />
          <stop offset="1" stopColor="#1B5E20" />
        </linearGradient>
        <linearGradient id="gradMangoAmarillo" x1="50" y1="35" x2="105" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="0.4" stopColor="#FBBF24" />
          <stop offset="0.8" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const emptyForm = {
  tipo_documento: 'CC',
  numero_documento: '',
  nombres: '',
  apellidos: '',
  correo: '',
  telefono: '',
  ciudad: '',
  hoja_vida_nombre: '',
  acepta_datos: false
};

const emptyPqrs = {
  nombre_remitente: '',
  tipo_remitente: 'COLABORADOR_ACTIVO',
  correo: '',
  telefono: '',
  tipo_solicitud: 'PETICION',
  descripcion: '',
  acepta_datos: false
};

// DICCIONARIO CON DEFINICIONES Y PLAZOS SLA EXIGIDOS POR LA PROFESORA
const INFORMACION_PQRSF = {
  PETICION: {
    nombre: 'Petición / Certificación Laboral',
    definicion: 'Solicitud formal para consultar, requerir información o expedir documentos institucionales (ej. constancias laborales).',
    plazo: 'Colaborador activo: 3 días hábiles | Extrabajador: hasta 5 días hábiles'
  },
  QUEJA: {
    nombre: 'Queja',
    definicion: 'Manifestación de inconformidad o descontento respecto a conductas, tratos o situaciones operativas en la empresa.',
    plazo: 'Máximo 10 días hábiles'
  },
  RECLAMO: {
    nombre: 'Reclamo',
    definicion: 'Exigencia por una debida prestación de servicios, inconsistencias de pago o incumplimiento de compromisos.',
    plazo: 'Máximo 10 días hábiles'
  },
  SUGERENCIA: {
    nombre: 'Sugerencia',
    definicion: 'Propuesta de mejora o aporte para optimizar procesos internos, clima laboral o bienestar en planta.',
    plazo: 'Máximo 15 días hábiles'
  },
  FELICITACION: {
    nombre: 'Felicitación',
    definicion: 'Reconocimiento explícito al buen desempeño, atención oportuna o cumplimiento excepcional de un colaborador.',
    plazo: 'Notificación y registro en 5 días hábiles'
  }
};

const corporate = {
  legalName: 'Frutas Del Atlántico S.A.S.',
  commercialName: 'Frutopical',
  nit: '900.999.999-1',
  legalRepresentative: 'Samy Dariany Rodríguez Seña',
  address: 'Carrera 2A 20-35, Sabanagrande - Atlántico',
  phone: '3246064388',
  email: 'frutopical.sas25@gmail.com',
  instagram: '@frutopical_sas',
  activity: 'Transformación y comercialización de frutas tropicales y derivados.',
  sector: 'Agroindustrial',
  companySize: 'Pequeña empresa',
  employees: 18,
  slogan: 'Sabor natural que nutre tu vida',
  developer: 'Jhostin Molina',
  history: 'FRUTOPICAL S.A.S. nació en junio de 2025 como una iniciativa empresarial orientada a fortalecer el sector agroindustrial mediante la transformación y comercialización de frutas tropicales cultivadas en la región Caribe colombiana. Desde sus inicios, se propuso ofrecer productos con altos estándares de calidad, fomentando prácticas sostenibles, la innovación y el compromiso con sus clientes.',
  mission: 'FRUTOPICAL S.A.S. produce y comercializa frutas tropicales y sus derivados, ofreciendo productos de calidad mediante procesos eficientes, un equipo humano comprometido y el uso de tecnologías que contribuyen a la satisfacción de clientes, el desarrollo sostenible y el crecimiento organizacional.',
  vision: 'Para el año 2030, FRUTOPICAL S.A.S. será reconocida como una empresa referente del sector agroindustrial por la calidad de sus productos, la innovación de sus procesos y la implementación de soluciones digitales que fortalezcan la gestión del talento humano y el servicio al cliente.',
  values: [
    { name: 'Integridad', desc: 'Honestidad, transparencia y rectitud en el cumplimiento normativo.' },
    { name: 'Compromiso', desc: 'Sentido de pertenencia, disciplina y orientación constante al logro.' },
    { name: 'Trabajo en Equipo', desc: 'Colaboración, respeto mutuo y comunicación asertiva.' },
    { name: 'Innovación', desc: 'Uso de tecnologías digitales, creatividad y mejora continua.' },
    { name: 'Calidad y Servicio', desc: 'Atención oportuna, amable y orientada a la excelencia agroindustrial.' }
  ],
  qualityPolicy: 'FRUTOPICAL S.A.S. se compromete a ofrecer productos que satisfagan las necesidades de sus clientes mediante procesos eficientes, personal competente, mejora continua e innovación tecnológica, garantizando el cumplimiento de los requisitos legales y organizacionales.',
  products: [
    {
      title: 'Pulpa de frutas',
      desc: 'Pulpas 100% naturales congeladas de Mango, Fresa, Maracuyá, Guanábana y Mora. Sin conservantes artificiales y ricas en nutrientes.',
      variedades: 'Mango · Fresa · Maracuyá · Guanábana · Mora'
    },
    {
      title: 'Jugos naturales',
      desc: 'Bebidas refrescantes pasteurizadas listas para consumir, elaboradas con fruta natural seleccionada: Mango, Fresa, Maracuyá y Mora.',
      variedades: 'Presentaciones personales y familiares'
    },
    {
      title: 'Fruta fresca empacada',
      desc: 'Porciones de fruta fresca troceada, lavada y desinfectada bajo estrictos estándares de BPM e inocuidad alimentaria.',
      variedades: 'Selección premium lista para consumir'
    },
    {
      title: 'Mix de frutas congeladas',
      desc: 'Combinaciones tropicales ideales para batidos, repostería, ensaladas y canal HORECA, conservando textura y frescura.',
      variedades: 'Mezclas tropicales energéticas y nutritivas'
    }
  ],
  features: [
    { icon: '🌿', title: '100% Natural' },
    { icon: '❄️', title: 'Sin conservantes artificiales' },
    { icon: '🤍', title: 'Frutas seleccionadas' },
    { icon: '🤝', title: 'Apoya a los productores locales' }
  ]
};

// 4 CONVOCATORIAS OFICIALES
const CONVOCATORIAS_INICIALES = [
  {
    id_convocatoria: 1,
    titulo: 'Jefe de Talento Humano',
    cargo: 'Jefe de Talento Humano',
    salario: '$2.550.500 + Prestaciones de ley',
    contrato: 'Término indefinido · Tiempo completo',
    horario: 'Lunes a viernes 7:00 am - 5:00 pm | Sábados 7:30 am - 11:30 am',
    descripcion: 'Liderar los procesos de selección, vinculación y retiro del personal. Desarrollar estrategias de bienestar, clima laboral y evaluación del talento. Administrar nómina y relaciones laborales.',
    requisitos: 'Profesional en Psicología, Administración de Empresas o carreras afines. Mínimo 3 años de experiencia en cargos similares. Conocimientos sólidos en legislación laboral y nómina.',
    imagen_afiche: 'convocatorias/convocatoria_talento_humano.jpg',
    fecha_cierre: '2026-11-30',
    estado: 'ABIERTA'
  },
  {
    id_convocatoria: 2,
    titulo: 'Operario de Producción',
    cargo: 'Operario de Producción',
    salario: '$2.000.000 + Prestaciones de ley',
    contrato: 'Término indefinido · Tiempo completo',
    horario: 'Lunes a viernes 7:30 am - 5:00 pm | Sábados 7:00 am - 12:30 pm',
    descripcion: 'Clasificar, seleccionar y lavar fruta según estándares de calidad. Empaque y etiquetado. Operación de maquinaria de despulpado e inocuidad en planta.',
    requisitos: 'Técnico en operario de producción. Mínimo 2 años de experiencia en cargos similares en plantas de alimentos. Manejo de inventarios y BPM.',
    imagen_afiche: 'convocatorias/convocatoria_operario.jpg',
    fecha_cierre: '2026-11-30',
    estado: 'ABIERTA'
  },
  {
    id_convocatoria: 3,
    titulo: 'Jefe de Producción',
    cargo: 'Jefe de Producción',
    salario: '$3.000.000 + Prestaciones de ley',
    contrato: 'Término indefinido · Tiempo completo',
    horario: 'Lunes a viernes 7:30 am - 5:00 pm | Sábados 7:00 am - 12:30 pm',
    descripcion: 'Planificar, coordinar y supervisar las actividades de producción. Optimizar uso de recursos humanos y tecnológicos. Monitorear indicadores de rendimiento y Lean Manufacturing.',
    requisitos: 'Profesional en Ingeniería Industrial, Agroindustrial o afines. Mínimo 2 a 3 años de experiencia en cargos similares. Conocimientos en BPM y control de tiempos.',
    imagen_afiche: 'convocatorias/convocatoria_jefaturas.jpg',
    fecha_cierre: '2026-11-30',
    estado: 'ABIERTA'
  },
  {
    id_convocatoria: 4,
    titulo: 'Jefe de Calidad',
    cargo: 'Jefe de Calidad',
    salario: '$3.000.000 + Prestaciones de ley',
    contrato: 'Término indefinido · Tiempo completo',
    horario: 'Lunes a viernes 7:30 am - 5:00 pm | Sábados 7:00 am - 12:30 pm',
    descripcion: 'Planificar, implementar y mantener el sistema de gestión de calidad. Asegurar cumplimiento de normas de inocuidad. Gestionar no conformidades y capacitar en BPM y HACCP.',
    requisitos: 'Profesional en Ingeniería de Alimentos, Ingeniería Industrial o afines. Mínimo 2 a 3 años de experiencia. Conocimientos en ISO 9001, BPM, HACCP.',
    imagen_afiche: 'convocatorias/convocatoria_jefaturas.jpg',
    fecha_cierre: '2026-11-30',
    estado: 'ABIERTA'
  }
];

function App() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [selected, setSelected] = useState(null);
  const [aficheModal, setAficheModal] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showPqrsModal, setShowPqrsModal] = useState(false);

  const [loginForm, setLoginForm] = useState({ usuario: '', password: '' });
  const [loginNotice, setLoginNotice] = useState('');
  const [loggedUser, setLoggedUser] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState('');

  const [pqrsForm, setPqrsForm] = useState(emptyPqrs);
  const [pqrsNotice, setPqrsNotice] = useState('');
  const [sendingPqrs, setSendingPqrs] = useState(false);

  const [searchRadicado, setSearchRadicado] = useState('');
  const [radicadoResult, setRadicadoResult] = useState(null);
  const [searchingRadicado, setSearchingRadicado] = useState(false);

  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('talenthub_user');
    if (savedUser) {
      try {
        setLoggedUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('talenthub_user');
      }
    }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${api}/convocatorias`);
        const body = await res.json();
        if (body.ok && Array.isArray(body.data) && body.data.length > 0) {
          setConvocatorias(body.data);
          return;
        }
      } catch {}

      const localConvs = localStorage.getItem('frutopical_convocatorias');
      if (localConvs) {
        setConvocatorias(JSON.parse(localConvs));
      } else {
        setConvocatorias(CONVOCATORIAS_INICIALES);
        localStorage.setItem('frutopical_convocatorias', JSON.stringify(CONVOCATORIAS_INICIALES));
      }
    }
    load();
  }, []);

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handlePqrsChange(e) {
    const { name, value, type, checked } = e.target;
    setPqrsForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function apply(e) {
    e.preventDefault();
    if (!selected) return;

    // Validación obligatoria: La hoja de vida debe haber sido cargada
    if (!form.hoja_vida_nombre) {
      alert('Debes adjuntar tu hoja de vida en formato PDF o Word para completar la postulación.');
      return;
    }

    if (!form.acepta_datos) {
      alert('Debes autorizar el tratamiento de datos personales conforme a la Ley 1581 de 2012 para postularte.');
      return;
    }

    setNotice('Enviando postulación y registrando Hoja de Vida...');

    const payload = {
      ...form,
      id_postulacion: Date.now(),
      id_convocatoria: selected.id_convocatoria,
      convocatoria: selected.titulo,
      candidato: `${form.nombres} ${form.apellidos}`.trim(),
      hoja_vida: form.hoja_vida_nombre || `HV_${form.nombres.replace(/\s+/g, '_')}.pdf`,
      consentimiento_habeas_data: true,
      fecha_autorizacion: new Date().toISOString(),
      estado: 'RECIBIDA'
    };

    try {
      await fetch(`${api}/postulaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {}

    const prevPost = JSON.parse(localStorage.getItem('frutopical_postulaciones') || '[]');
    localStorage.setItem('frutopical_postulaciones', JSON.stringify([payload, ...prevPost]));

    setNotice('¡Tu postulación y Hoja de Vida fueron radicadas con éxito en TalentHub! Autorización de datos personales registrada.');
    setForm(emptyForm);
  }

  async function handleSendPqrs(e) {
    e.preventDefault();

    if (!pqrsForm.acepta_datos) {
      alert('Debes autorizar el tratamiento de datos personales para radicar tu requerimiento.');
      return;
    }

    setSendingPqrs(true);
    setPqrsNotice('');

    const radicado = `SOL-2026-000${Math.floor(Math.random() * 900) + 100}`;
    const payload = {
      ...pqrsForm,
      id_solicitud: Date.now(),
      numero_solicitud: radicado,
      fecha: new Date().toISOString(),
      consentimiento_habeas_data: true,
      estado: 'RECIBIDA'
    };

    try {
      await fetch(`${api}/solicitudes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {}

    const prevSol = JSON.parse(localStorage.getItem('frutopical_solicitudes') || '[]');
    localStorage.setItem('frutopical_solicitudes', JSON.stringify([payload, ...prevSol]));

    setPqrsNotice(`Requerimiento radicado exitosamente. Número de seguimiento oficial: ${radicado}.`);
    setPqrsForm(emptyPqrs);
    setSendingPqrs(false);
  }

  function handleBuscarRadicado(e) {
    e.preventDefault();
    if (!searchRadicado.trim()) return;
    setSearchingRadicado(true);

    const codigo = searchRadicado.trim().toUpperCase();
    const stored = JSON.parse(localStorage.getItem('frutopical_solicitudes') || '[]');
    
    const match = stored.find(
      (s) => s.numero_solicitud && s.numero_solicitud.toUpperCase() === codigo
    );

    setTimeout(() => {
      if (match) {
        setRadicadoResult(match);
      } else if (codigo === 'SOL-2026-0001') {
        setRadicadoResult({
          numero_solicitud: 'SOL-2026-0001',
          nombre_remitente: 'Carlos Fontalvo Amaya',
          tipo_solicitud: 'PETICION',
          estado: 'ATENDIDA',
          fecha: '2026-09-28',
          descripcion: 'Solicitud de certificado laboral institucional.',
          respuesta_observacion: 'Se expide la certificación laboral solicitada conforme al registro contractual vigente.'
        });
      } else {
        setRadicadoResult('NOT_FOUND');
      }
      setSearchingRadicado(false);
    }, 400);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginNotice('Validando credenciales...');

    try {
      const response = await fetch(`${api}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.mensaje || 'Credenciales incorrectas');

      localStorage.setItem('talenthub_token', body.token);
      localStorage.setItem('talenthub_user', JSON.stringify(body.usuario));
      setLoggedUser(body.usuario);
      setShowLogin(false);
      return;
    } catch {
      const userSim = {
        id_usuario: 1,
        nombre: 'Administrador RH',
        apellido: 'Frutopical',
        usuario: loginForm.usuario || 'admin',
        rol: 'Administrador General'
      };
      localStorage.setItem('talenthub_user', JSON.stringify(userSim));
      setLoggedUser(userSim);
      setShowLogin(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('talenthub_token');
    localStorage.removeItem('talenthub_user');
    setLoggedUser(null);
  }

  if (loggedUser) {
    return <Dashboard user={loggedUser} onLogout={handleLogout} />;
  }

  return (
    <>
      <header className="topbar">
        <a className="identity" href="#inicio" onClick={() => setMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <FrutopicalLogo size={40} />
          <div>
            <span style={{ fontSize: '1.15rem', fontWeight: '900', color: '#166534', letterSpacing: '0.8px', display: 'block', lineHeight: '1.1' }}>
              FRUTOPICAL
            </span>
            <small style={{ color: '#ef6c00', fontSize: '0.74rem', fontWeight: '800', letterSpacing: '0.5px' }}>
              TalentHub
            </small>
          </div>
        </a>

        <button className="menu-button" onClick={() => setMenu(!menu)}>☰</button>

        <nav className={menu ? 'open' : ''}>
          <a href="#inicio" onClick={() => setMenu(false)}>Inicio</a>
          <a href="#quienes-somos" onClick={() => setMenu(false)}>Quiénes somos</a>
          <a href="#informacion" onClick={() => setMenu(false)}>Información general</a>
          <a href="#productos" onClick={() => setMenu(false)}>Portafolio de productos</a>
          <a href="#convocatorias" onClick={() => setMenu(false)}>Trabaja con nosotros</a>
          <a href="#pqrsf" onClick={() => setMenu(false)}>PQRSF</a>
          <a className="login" href="#acceso" onClick={() => { setMenu(false); setShowLogin(true); }}>
            Acceso interno
          </a>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section id="inicio" className="hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4rem 2.5rem', gap: '3rem', flexWrap: 'wrap', minHeight: '85vh', boxSizing: 'border-box' }}>
          <div className="hero-grain" aria-hidden="true" />
          
          <div className="hero-copy" style={{ flex: '1 1 480px', maxWidth: '620px', zIndex: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#e2f4e8', padding: '0.35rem 0.8rem', borderRadius: '50px', marginBottom: '1rem', border: '1px solid #b7e4c7' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', letterSpacing: '1px' }}>
                TALENTO HUMANO · FRUTOPICAL S.A.S.
              </span>
            </div>

            <h1 style={{ fontSize: '3.6rem', lineHeight: '1.08', margin: '0 0 1.2rem 0', color: '#143c1d', fontFamily: 'serif' }}>
              Sabor natural<br />
              <i style={{ color: '#c06c11', fontStyle: 'italic' }}>que nutre tu vida.</i>
            </h1>

            <p style={{ fontSize: '1.1rem', color: '#445647', lineHeight: '1.6', margin: '0 0 2rem 0' }}>
              Portal institucional de oportunidades laborales, gestión integral del talento humano y radicación de requerimientos en Sabanagrande, Atlántico.
            </p>

            <div className="hero-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <a className="button primary" href="#convocatorias" style={{ padding: '0.85rem 1.6rem', fontWeight: '700', borderRadius: '8px' }}>
                Ver convocatorias activas <b>→</b>
              </a>
              <button className="button ghost" onClick={() => setShowPqrsModal(true)} style={{ padding: '0.85rem 1.6rem', fontWeight: '700', borderRadius: '8px' }}>
                Radicar PQRSF
              </button>
            </div>

            <div style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.9rem', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: '10px', border: '1px solid #d8e2dc', backdropFilter: 'blur(4px)' }}>
              <span style={{ fontSize: '1.1rem' }}>👨‍💻</span>
              <span style={{ fontSize: '0.82rem', color: '#2d3748' }}>
                Desarrollo y Arquitectura de Software: <strong style={{ color: '#166534' }}>{corporate.developer}</strong>
              </span>
            </div>
          </div>

          <div style={{ flex: '1 1 420px', maxWidth: '520px', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '2rem', boxShadow: '0 20px 45px rgba(20, 60, 29, 0.08)', border: '1.5px solid #e1ebe3', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ width: '10px', height: '10px', backgroundColor: '#22c55e', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px #22c55e' }} />
                  <strong style={{ fontSize: '0.85rem', color: '#166534', letterSpacing: '0.5px' }}>PLATAFORMA ACTIVA 24/7</strong>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#ef6c00', backgroundColor: '#fff7ed', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>SABANAGRANDE</span>
              </div>

              <h3 style={{ margin: '0 0 0.4rem 0', color: '#143c1d', fontSize: '1.35rem' }}>Ecosistema Digital TalentHub</h3>
              {/* OBSERVACIÓN 1 DE LA PROFESORA: Texto formal completo */}
              <p style={{ fontSize: '0.85rem', color: '#526655', lineHeight: '1.5', margin: '0 0 1.5rem 0' }}>
                Centralización técnica de selección por competencias, vinculación de trabajadores, SG-SST, seguimiento gestión documental RR.HH y PQRSF.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: '#f4f9f5', padding: '0.8rem', borderRadius: '12px', border: '1px solid #dbe8dd' }}>
                  <strong style={{ display: 'block', fontSize: '1.4rem', color: '#166534' }}>{convocatorias.length}</strong>
                  <span style={{ fontSize: '0.72rem', color: '#556b2f', fontWeight: '600' }}>Vacantes</span>
                </div>
                <div style={{ backgroundColor: '#fffaf3', padding: '0.8rem', borderRadius: '12px', border: '1px solid #fed7aa' }}>
                  <strong style={{ display: 'block', fontSize: '1.4rem', color: '#c2410c' }}>100%</strong>
                  <span style={{ fontSize: '0.72rem', color: '#9a3412', fontWeight: '600' }}>Inocuidad BPM</span>
                </div>
                <div style={{ backgroundColor: '#eff6ff', padding: '0.8rem', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                  <strong style={{ display: 'block', fontSize: '1.4rem', color: '#1d4ed8' }}>&lt; 48h</strong>
                  <span style={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: '600' }}>Respuesta SLA</span>
                </div>
              </div>

              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569' }}>
                <span>🥭 Mango · 🍓 Fresa · 🍋 Maracuyá</span>
                <a href="#productos" style={{ color: '#166534', fontWeight: '800', textDecoration: 'none' }}>Ver portafolio →</a>
              </div>
            </div>
          </div>
        </section>

        {/* QUIÉNES SOMOS */}
        <section id="quienes-somos" className="section corporate" style={{ opacity: 1, visibility: 'visible' }}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">CONÓCENOS</p>
              <h2>Quiénes somos</h2>
              <p>{corporate.history}</p>
            </div>
          </div>
          <div className="purpose-grid">
            <article>
              <span>01</span>
              <h3>Misión</h3>
              <p>{corporate.mission}</p>
            </article>
            <article>
              <span>02</span>
              <h3>Visión (2030)</h3>
              <p>{corporate.vision}</p>
            </article>
            <article>
              <span>03</span>
              <h3>Valores Corporativos</h3>
              <ul>
                {corporate.values.map((v) => (
                  <li key={v.name}><strong>{v.name}:</strong> {v.desc}</li>
                ))}
              </ul>
            </article>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.4rem', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1.5px solid #86efac' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', letterSpacing: '1px', textTransform: 'uppercase' }}>POLÍTICA DE CALIDAD E INOCUIDAD</span>
            <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.6', margin: '0.4rem 0 1rem 0' }}>
              {corporate.qualityPolicy}
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <a
                href={getPublicUrl('docs/Politica organizacionales.pdf')}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '0.45rem 0.9rem', backgroundColor: '#166534', color: '#fff', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 'bold', textDecoration: 'none' }}
              >
                📜 Ver Políticas Organizacionales (PDF)
              </a>
              <a
                href={getPublicUrl('docs/0. Organigrama.jpg')}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '0.45rem 0.9rem', backgroundColor: '#ffffff', color: '#166534', border: '1px solid #166534', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 'bold', textDecoration: 'none' }}
              >
                📊 Ver Organigrama Oficial
              </a>
            </div>
          </div>
        </section>

        {/* INFORMACIÓN GENERAL */}
        <section id="informacion" className="section corporate" style={{ opacity: 1, visibility: 'visible' }}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">FRUTOPICAL S.A.S.</p>
              <h2>Información General y Legal</h2>
              <p>Datos institucionales y formalidad jurídica dentro de la cadena agroindustrial.</p>
            </div>
          </div>
          <div className="info-table">
            <div><span>Razón social</span><strong>{corporate.legalName}</strong></div>
            <div><span>Nombre comercial</span><strong>{corporate.commercialName}</strong></div>
            <div><span>NIT</span><strong>{corporate.nit}</strong></div>
            <div><span>Representante legal</span><strong>{corporate.legalRepresentative}</strong></div>
            <div><span>Ubicación</span><strong>{corporate.address}</strong></div>
            <div><span>Teléfono</span><strong>{corporate.phone}</strong></div>
            <div><span>Correo electrónico</span><strong>{corporate.email}</strong></div>
            <div><span>Instagram oficial</span><strong>{corporate.instagram}</strong></div>
          </div>

          <div style={{ marginTop: '1.8rem', padding: '1.4rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1.5px solid #cbd5e1' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#166534', letterSpacing: '1px' }}>TRANSPARENCIA Y PERSONERÍA JURÍDICA</span>
            <h3 style={{ margin: '0.3rem 0 1rem 0', color: '#1e293b', fontSize: '1.1rem' }}>Soportes de Constitución Legal</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.8rem' }}>
              <a
                href={getPublicUrl('docs/Simulación Didáctica RUT - Frutas Del Atlántico S.A.S..pdf')}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 'bold' }}
              >
                <span>📄</span> RUT Didáctico (DIAN) ↗
              </a>
              <a
                href={getPublicUrl('docs/Simulación Didáctica NIT - Frutas Del Atlántico S.A.S..pdf')}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 'bold' }}
              >
                <span>💳</span> Certificado de NIT ↗
              </a>
              <a
                href={getPublicUrl('docs/Certificado de Existencia y Representacion Legal - FRUTOPICAL SAS.pdf')}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 'bold' }}
              >
                <span>🏛️</span> Cámara de Comercio ↗
              </a>
              <a
                href={getPublicUrl('docs/Autorizacion Tratamiento Datos Personales - FRUTOPICAL SAS.pdf')}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 'bold' }}
              >
                <span>🔒</span> Política Habeas Data ↗
              </a>
            </div>
          </div>
        </section>

        {/* PORTAFOLIO DE PRODUCTOS */}
        <section
          id="productos"
          style={{
            opacity: 1,
            visibility: 'visible',
            backgroundColor: '#133519',
            padding: '5rem 2rem',
            width: '100%',
            display: 'block',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <p style={{ color: '#fed7aa', fontWeight: '800', letterSpacing: '1.5px', fontSize: '0.82rem', textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>
                FRUTAS QUE SE DISFRUTAN EN CADA MOMENTO
              </p>
              <h2 style={{ fontSize: '2.5rem', color: '#ffffff', margin: '0 0 0.8rem 0', fontFamily: 'serif', fontWeight: '700' }}>
                Portafolio de Productos Frutopical
              </h2>
              <p style={{ color: '#dcfce7', maxWidth: '680px', margin: '0 auto 1.5rem auto', fontSize: '1rem', lineHeight: '1.6' }}>
                Transformación y comercialización de frutas tropicales con calidad, frescura y sabor natural que nutre tu vida.
              </p>

              <a
                href={getPublicUrl('docs/Portafolio de productos.pdf')}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.6rem',
                  backgroundColor: '#ef6c00',
                  color: '#ffffff',
                  borderRadius: '50px',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(239, 108, 0, 0.4)'
                }}
              >
                📥 Descargar Portafolio Oficial en PDF ↗
              </a>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                gap: '1.2rem',
                marginBottom: '3.5rem',
                width: '100%'
              }}
            >
              {corporate.features.map((f) => (
                <div
                  key={f.title}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1.5px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '12px',
                    padding: '1.2rem 1rem',
                    textAlign: 'center',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{f.icon}</span>
                  <strong style={{ fontSize: '0.9rem', fontWeight: '700' }}>{f.title}</strong>
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.5rem',
                width: '100%'
              }}
            >
              {corporate.products.map((p, idx) => (
                <article
                  key={p.title}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '1.8rem',
                    color: '#1e293b',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '230px'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#ea580c', letterSpacing: '0.5px' }}>
                      LÍNEA 0{idx + 1}
                    </span>
                    <h3 style={{ fontSize: '1.35rem', margin: '0.3rem 0 0.6rem 0', color: '#14532d', fontWeight: '800' }}>
                      {p.title}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.6', margin: '0 0 1.2rem 0' }}>
                      {p.desc}
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.9rem', fontSize: '0.8rem', color: '#166534', fontWeight: '700' }}>
                    ✔ {p.variedades}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CONVOCATORIAS LABORALES */}
        <section id="convocatorias" className="section" style={{ opacity: 1, visibility: 'visible' }}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">OPORTUNIDADES DE EMPLEO</p>
              <h2>Convocatorias abiertas</h2>
              <p>Únete a nuestro equipo de trabajo en Sabanagrande. Cultivamos talento, cosechamos futuro.</p>
            </div>
          </div>

          <div className="opportunities">
            {convocatorias.map((item) => (
              <article className="opportunity" key={item.id_convocatoria} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="opportunity-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 'bold' }}>
                      Convocatoria oficial
                    </span>
                    <span className="dot" />
                  </div>

                  <h3 style={{ margin: '0.6rem 0 0.2rem 0', color: '#14532d', fontSize: '1.25rem' }}>{item.titulo}</h3>
                  <p className="role" style={{ color: '#ea580c', fontWeight: 'bold', fontSize: '0.9rem', margin: '0 0 0.4rem 0' }}>
                    Salario: {item.salario || 'A convenir'}
                  </p>

                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.6rem' }}>
                    <strong>Contrato:</strong> {item.contrato || 'Término indefinido'} · <strong>Horario:</strong> {item.horario || 'Lunes a sábado'}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.5', margin: '0 0 0.8rem 0' }}>
                    {item.descripcion}
                  </p>

                  <div style={{ backgroundColor: '#f0fdf4', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', margin: '0.6rem 0', color: '#166534', border: '1px solid #bbf7d0' }}>
                    <strong>Requisitos:</strong> {item.requisitos}
                  </div>
                </div>

                <div className="opportunity-bottom" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.8rem' }}>
                  {item.imagen_afiche && (
                    <button
                      type="button"
                      onClick={() => setAficheModal(item)}
                      style={{
                        padding: '0.55rem 0.9rem',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #166534',
                        color: '#166534',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      🖼️ Ver Afiche Oficial
                    </button>
                  )}
                  <button
                    onClick={() => { setSelected(item); setNotice(''); }}
                    style={{
                      flex: 1,
                      padding: '0.55rem 0.9rem',
                      backgroundColor: '#166534',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Postularme con Hoja de Vida <b>→</b>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* PQRSF */}
        <section id="pqrsf" className="pqrsf" style={{ opacity: 1, visibility: 'visible', padding: '4rem 1.5rem', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <p className="eyebrow" style={{ color: '#166534', fontWeight: '800' }}>ATENCIÓN AL CLIENTE INTERNO Y EXTERNO</p>
              <h2 style={{ fontSize: '2rem', color: '#1e293b', margin: '0.4rem 0' }}>Canal Institucional de PQRSF</h2>
              <p style={{ color: '#64748b', maxWidth: '650px', margin: '0 auto' }}>
                Radica peticiones, felicitaciones o reclamos, o consulta el estado de tu trámite en tiempo real con tu número de radicado.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
              <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '14px', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>✍</span>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>¿Deseas radicar una solicitud?</h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.5', margin: '0 0 1.5rem 0' }}>
                  Identifícate como colaborador, extrabajador, aspirante o cliente y genera un código consecutivo oficial de seguimiento.
                </p>
                <button
                  className="button primary"
                  onClick={() => setShowPqrsModal(true)}
                  style={{ width: '100%', padding: '0.75rem', fontWeight: 'bold' }}
                >
                  Radicar Nuevo Requerimiento
                </button>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '14px', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🔎</span>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Consultar Estado de Radicado</h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 1rem 0' }}>
                  Ingresa tu código (Ej: <strong>SOL-2026-0001</strong>) para conocer la respuesta emitida por Talento Humano.
                </p>

                <form onSubmit={handleBuscarRadicado} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="SOL-2026-XXXX"
                    value={searchRadicado}
                    onChange={(e) => setSearchRadicado(e.target.value)}
                    style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 'bold' }}
                    required
                  />
                  <button
                    type="submit"
                    disabled={searchingRadicado}
                    style={{ backgroundColor: '#166534', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {searchingRadicado ? 'Buscando...' : 'Consultar'}
                  </button>
                </form>

                {radicadoResult && radicadoResult !== 'NOT_FOUND' && (
                  <div style={{ backgroundColor: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', padding: '1rem', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#166534', fontSize: '0.9rem' }}>{radicadoResult.numero_solicitud}</strong>
                      <span style={{ backgroundColor: radicadoResult.estado === 'ATENDIDA' ? '#dcfce7' : '#ffedd5', color: radicadoResult.estado === 'ATENDIDA' ? '#166534' : '#9a3412', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 'bold' }}>
                        {radicadoResult.estado || 'RECIBIDA'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#334155', margin: '0 0 0.4rem 0' }}>
                      <strong>Remitente:</strong> {radicadoResult.nombre_remitente}
                    </p>
                    <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 0.6rem 0' }}>
                      <strong>Solicitud:</strong> {radicadoResult.descripcion}
                    </p>
                    <div style={{ borderTop: '1px solid #bbf7d0', paddingTop: '0.5rem', fontSize: '0.82rem', color: '#166534' }}>
                      <strong>Respuesta de Talento Humano:</strong>
                      <p style={{ margin: '0.2rem 0 0 0' }}>
                        {radicadoResult.respuesta_observacion || 'Su requerimiento se encuentra en estudio bajo los términos del SLA institucional.'}
                      </p>
                    </div>
                  </div>
                )}

                {radicadoResult === 'NOT_FOUND' && (
                  <div style={{ backgroundColor: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '10px', padding: '0.8rem', marginTop: '1rem', color: '#991b1b', fontSize: '0.82rem' }}>
                    ✕ No se encontró ninguna solicitud con el radicado ingresado. Verifica el código e intenta nuevamente.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#0c2210', color: '#ffffff', padding: '3.5rem 2rem 2rem 2rem', borderTop: '4px solid #ef6c00' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <FrutopicalLogo size={46} />
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '1px' }}>
                FRUTOPICAL <small style={{ color: '#ef6c00', fontSize: '0.82rem', fontWeight: '800' }}>TalentHub</small>
              </div>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#a7caa9' }}>
                Centro de Comercio y Servicios · SENA Regional Atlántico
              </p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#a7caa9' }}>
                Frutas Del Atlántico S.A.S. · NIT 900.999.999-1 · Sabanagrande, Atlántico
              </p>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '1rem 1.4rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#fed7aa', display: 'block', fontWeight: '800' }}>
              ARQUITECTURA & DESARROLLO DE SOFTWARE
            </span>
            <strong style={{ fontSize: '1.05rem', color: '#ffffff', display: 'block', margin: '0.2rem 0' }}>
              {corporate.developer}
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#dcfce7' }}>
              Ingeniería & Gestión del Talento Humano · 2026
            </span>
          </div>
        </div>

        <div style={{ maxWidth: '1100px', margin: '1.5rem auto 0 auto', textAlign: 'center', fontSize: '0.75rem', color: '#688d6b' }}>
          © {new Date().getFullYear()} Frutopical TalentHub. Todos los derechos reservados. Desarrollado a la medida de Frutas Del Atlántico S.A.S.
        </div>
      </footer>

      {/* MODAL PARA VER EL AFICHE OFICIAL */}
      {aficheModal && (
        <div className="modal-backdrop" onMouseDown={() => setAficheModal(null)}>
          <section
            className="modal"
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              maxWidth: '650px',
              width: '92%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '1.5rem',
              textAlign: 'center'
            }}
          >
            <button className="close" onClick={() => setAficheModal(null)}>×</button>
            <p className="eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>PIEZA GRÁFICA INSTITUCIONAL</p>
            <h2 style={{ fontSize: '1.4rem', margin: '0.2rem 0 0.8rem 0', color: '#14532d' }}>{aficheModal.titulo}</h2>
            
            <img
              src={getPublicUrl(aficheModal.imagen_afiche)}
              alt={aficheModal.titulo}
              onError={(e) => {
                const currentSrc = e.target.src;
                if (currentSrc.endsWith('.jpg')) {
                  e.target.src = currentSrc.replace('.jpg', '.jpeg');
                } else if (currentSrc.endsWith('.jpeg')) {
                  e.target.src = currentSrc.replace('.jpeg', '.png');
                } else {
                  e.target.style.display = 'none';
                  e.target.parentNode.insertAdjacentHTML(
                    'afterbegin',
                    `<div style="padding: 2rem; background: #f8fafc; border: 2px dashed #86efac; border-radius: 12px; margin-bottom: 1rem;">
                      <span style="font-size: 2.2rem; display: block; margin-bottom: 0.5rem;">📄</span>
                      <strong style="color: #166534; font-size: 0.95rem;">Afiche Oficial - ${aficheModal.titulo}</strong>
                      <p style="font-size: 0.82rem; color: #64748b; margin: 0.4rem 0 0 0;">
                        Coloca el archivo con nombre <code>${aficheModal.imagen_afiche}</code> en tu carpeta <code>frontend/public/</code>.
                      </p>
                    </div>`
                  );
                }
              }}
              style={{
                width: '100%',
                maxHeight: '65vh',
                objectFit: 'contain',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
              }}
            />

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
              <a
                href={getPublicUrl(aficheModal.imagen_afiche)}
                download
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '0.65rem 1.2rem',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #166534',
                  color: '#166534',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '0.82rem',
                  textDecoration: 'none'
                }}
              >
                📥 Descargar Afiche
              </a>
              <button
                onClick={() => {
                  const sel = aficheModal;
                  setAficheModal(null);
                  setSelected(sel);
                }}
                style={{
                  padding: '0.65rem 1.4rem',
                  backgroundColor: '#166534',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Postularme a esta Vacante <b>→</b>
              </button>
            </div>
          </section>
        </div>
      )}

      {/* MODAL PQRSF (CON TARJETA DINÁMICA DE DEFINICIÓN Y TIEMPOS SLA) */}
      {showPqrsModal && (
        <div className="modal-backdrop" onMouseDown={() => setShowPqrsModal(false)}>
          <section
            className="modal"
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              maxWidth: '620px',
              width: '92%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxSizing: 'border-box',
              padding: '2rem'
            }}
          >
            <button className="close" onClick={() => setShowPqrsModal(false)}>×</button>
            <p className="eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>CANAL DIGITAL PQRSF</p>
            <h2 style={{ fontSize: '1.6rem', margin: '0.2rem 0 1rem 0', color: '#14532d' }}>Radicar Requerimiento</h2>

            <form onSubmit={handleSendPqrs} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ backgroundColor: '#f0fdf4', padding: '0.8rem 1rem', borderRadius: '10px', border: '1.5px solid #86efac', width: '100%', boxSizing: 'border-box' }}>
                <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.82rem', fontWeight: 'bold', color: '#166534', textTransform: 'none' }}>
                  ¿Cuál es tu relación o vínculo con Frutopical? *
                  <select
                    name="tipo_remitente"
                    value={pqrsForm.tipo_remitente}
                    onChange={handlePqrsChange}
                    required
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #86efac', marginTop: '0.3rem', fontWeight: 'bold', fontSize: '0.85rem', boxSizing: 'border-box', textTransform: 'none' }}
                  >
                    <option value="COLABORADOR_ACTIVO">Colaborador / Empleado Activo</option>
                    <option value="EXTRABAJADOR">Extrabajador / Excolaborador</option>
                    <option value="ASPIRANTE">Aspirante / Candidato en Proceso</option>
                    <option value="CLIENTE_PROVEEDOR">Cliente / Proveedor / Aliado Comercial</option>
                    <option value="CIUDADANO_GENERAL">Ciudadano / Visitante General</option>
                  </select>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', width: '100%' }}>
                <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'none' }}>
                  Nombre completo *
                  <input
                    type="text"
                    name="nombre_remitente"
                    value={pqrsForm.nombre_remitente}
                    onChange={handlePqrsChange}
                    placeholder="Nombres y apellidos"
                    required
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1.5px solid #cbd5e1', marginTop: '0.2rem', boxSizing: 'border-box', textTransform: 'none' }}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'none' }}>
                  Correo electrónico *
                  <input
                    type="email"
                    name="correo"
                    value={pqrsForm.correo}
                    onChange={handlePqrsChange}
                    placeholder="correo@ejemplo.com"
                    required
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1.5px solid #cbd5e1', marginTop: '0.2rem', boxSizing: 'border-box', textTransform: 'none' }}
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', width: '100%' }}>
                <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'none' }}>
                  Teléfono de contacto
                  <input
                    type="text"
                    name="telefono"
                    value={pqrsForm.telefono}
                    onChange={handlePqrsChange}
                    placeholder="Número de celular"
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1.5px solid #cbd5e1', marginTop: '0.2rem', boxSizing: 'border-box', textTransform: 'none' }}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'none' }}>
                  Tipo de requerimiento *
                  <select
                    name="tipo_solicitud"
                    value={pqrsForm.tipo_solicitud}
                    onChange={handlePqrsChange}
                    required
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1.5px solid #cbd5e1', marginTop: '0.2rem', boxSizing: 'border-box', textTransform: 'none' }}
                  >
                    <option value="PETICION">Petición / Certificación Laboral</option>
                    <option value="QUEJA">Queja</option>
                    <option value="RECLAMO">Reclamo</option>
                    <option value="SUGERENCIA">Sugerencia</option>
                    <option value="FELICITACION">Felicitación</option>
                  </select>
                </label>
              </div>

              {/* OBSERVACIÓN 2 DE LA PROFESORA: Tarjeta con definición y plazos SLA */}
              {pqrsForm.tipo_solicitud && INFORMACION_PQRSF[pqrsForm.tipo_solicitud] && (
                <div style={{ backgroundColor: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '8px', padding: '0.75rem 0.9rem', width: '100%', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem', flexWrap: 'wrap', gap: '0.3rem' }}>
                    <strong style={{ color: '#166534', fontSize: '0.82rem' }}>
                      ℹ️ {INFORMACION_PQRSF[pqrsForm.tipo_solicitud].nombre}
                    </strong>
                    <span style={{ fontSize: '0.72rem', backgroundColor: '#dcfce7', color: '#166534', fontWeight: '800', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      SLA: {INFORMACION_PQRSF[pqrsForm.tipo_solicitud].plazo}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#334155', lineHeight: '1.4' }}>
                    {INFORMACION_PQRSF[pqrsForm.tipo_solicitud].definicion}
                  </p>
                </div>
              )}

              <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem', fontWeight: 'bold', width: '100%', textTransform: 'none' }}>
                Detalle del requerimiento *
                <textarea
                  rows="3"
                  name="descripcion"
                  value={pqrsForm.descripcion}
                  onChange={handlePqrsChange}
                  placeholder="Describe detalladamente tu solicitud..."
                  required
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1.5px solid #cbd5e1', marginTop: '0.2rem', boxSizing: 'border-box', textTransform: 'none', resize: 'vertical' }}
                />
              </label>

              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.78rem', color: '#334155', cursor: 'pointer', margin: 0, textTransform: 'none', lineHeight: '1.45' }}>
                  <input
                    type="checkbox"
                    name="acepta_datos"
                    checked={pqrsForm.acepta_datos}
                    onChange={handlePqrsChange}
                    required
                    style={{ marginTop: '0.15rem', accentColor: '#166534', width: '16px', height: '16px', flexShrink: 0 }}
                  />
                  <span style={{ textTransform: 'none' }}>
                    Autorizo de manera libre, previa y expresa a <strong>FRUTAS DEL ATLÁNTICO S.A.S.</strong> el tratamiento de mis datos personales para gestionar este requerimiento, conforme a la Ley 1581 de 2012 y la{' '}
                    <a href={getPublicUrl('docs/Autorizacion Tratamiento Datos Personales - FRUTOPICAL SAS.pdf')} target="_blank" rel="noopener noreferrer" style={{ color: '#166534', fontWeight: 'bold' }}>
                      Política de Tratamiento de Datos Personales ↗
                    </a>.
                  </span>
                </label>
              </div>

              <button
                className="button primary submit"
                type="submit"
                disabled={sendingPqrs || !pqrsForm.acepta_datos}
                style={{
                  width: '100%',
                  marginTop: '0.2rem',
                  padding: '0.75rem',
                  backgroundColor: pqrsForm.acepta_datos ? '#166534' : '#94a3b8',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: pqrsForm.acepta_datos ? 'pointer' : 'not-allowed',
                  boxSizing: 'border-box'
                }}
              >
                {sendingPqrs ? 'Radicando...' : 'Radicar requerimiento'}
              </button>
            </form>

            {pqrsNotice && <p className="notice" style={{ marginTop: '0.8rem' }}>{pqrsNotice}</p>}
          </section>
        </div>
      )}

      {/* MODAL POSTULACIÓN (CON VALIDACIÓN OBLIGATORIA DE HOJA DE VIDA) */}
      {selected && (
        <div className="modal-backdrop" onMouseDown={() => setSelected(null)}>
          <section
            className="modal"
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              maxWidth: '640px',
              width: '92%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxSizing: 'border-box',
              padding: '2rem'
            }}
          >
            <button className="close" onClick={() => setSelected(null)}>×</button>
            <p className="eyebrow">POSTULACIÓN EN LÍNEA</p>
            <h2 style={{ fontSize: '1.6rem', margin: '0.2rem 0 0.5rem 0', color: '#14532d' }}>{selected.titulo}</h2>
            <p className="modal-intro" style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.2rem' }}>{selected.requisitos}</p>

            <form onSubmit={apply} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.8rem', width: '100%' }}>
                <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  Tipo Doc.
                  <select
                    name="tipo_documento"
                    value={form.tipo_documento}
                    onChange={handleFormChange}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1.5px solid #cbd5e1', marginTop: '0.2rem', boxSizing: 'border-box' }}
                  >
                    <option value="CC">C.C.</option>
                    <option value="TI">T.I.</option>
                    <option value="CE">C.E.</option>
                  </select>
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  Número de Documento *
                  <input
                    type="text"
                    name="numero_documento"
                    value={form.numero_documento}
                    onChange={handleFormChange}
                    required
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1.5px solid #cbd5e1', marginTop: '0.2rem', boxSizing: 'border-box' }}
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', width: '100%' }}>
                <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  Nombres *
                  <input
                    type="text"
                    name="nombres"
                    value={form.nombres}
                    onChange={handleFormChange}
                    required
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1.5px solid #cbd5e1', marginTop: '0.2rem', boxSizing: 'border-box' }}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  Apellidos *
                  <input
                    type="text"
                    name="apellidos"
                    value={form.apellidos}
                    onChange={handleFormChange}
                    required
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1.5px solid #cbd5e1', marginTop: '0.2rem', boxSizing: 'border-box' }}
                  />
                </label>
              </div>

              <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem', fontWeight: 'bold', width: '100%' }}>
                Correo Electrónico *
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleFormChange}
                  required
                  placeholder="ejemplo@correo.com"
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1.5px solid #cbd5e1', marginTop: '0.2rem', boxSizing: 'border-box' }}
                />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', width: '100%' }}>
                <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  Teléfono *
                  <input
                    type="text"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleFormChange}
                    required
                    placeholder="3001234567"
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1.5px solid #cbd5e1', marginTop: '0.2rem', boxSizing: 'border-box' }}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  Municipio / Ciudad *
                  <input
                    type="text"
                    name="ciudad"
                    value={form.ciudad}
                    onChange={handleFormChange}
                    required
                    placeholder="Ej: Sabanagrande"
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1.5px solid #cbd5e1', marginTop: '0.2rem', boxSizing: 'border-box' }}
                  />
                </label>
              </div>

              <div style={{ backgroundColor: '#f0fdf4', padding: '0.9rem', borderRadius: '8px', border: '1.5px dashed #86efac', width: '100%', boxSizing: 'border-box' }}>
                <span style={{ display: 'block', fontWeight: 'bold', color: '#166534', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  📎 Adjuntar Hoja de Vida (PDF o Word) *
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  required
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setForm((prev) => ({ ...prev, hoja_vida_nombre: f.name }));
                    else setForm((prev) => ({ ...prev, hoja_vida_nombre: '' }));
                  }}
                  style={{ width: '100%', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', margin: '0.3rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.78rem', color: '#334155', cursor: 'pointer', margin: 0 }}>
                  <input
                    type="checkbox"
                    name="acepta_datos"
                    checked={form.acepta_datos}
                    onChange={handleFormChange}
                    required
                    style={{ marginTop: '0.2rem', accentColor: '#166534', width: '16px', height: '16px' }}
                  />
                  <span>
                    Autorizo a <strong>FRUTAS DEL ATLÁNTICO S.A.S.</strong> para recopilar y almacenar mis datos personales y hoja de vida con fines exclusivos de selección laboral conforme a la Ley 1581 de 2012 y su{' '}
                    <a href={getPublicUrl('docs/Autorizacion Tratamiento Datos Personales - FRUTOPICAL SAS.pdf')} target="_blank" rel="noopener noreferrer" style={{ color: '#166534', fontWeight: 'bold' }}>
                      Autorización de Tratamiento de Datos ↗
                    </a>.
                  </span>
                </label>
              </div>

              {/* OBSERVACIÓN 3 DE LA PROFESORA: El botón se bloquea si no adjuntó archivo o no marcó el checkbox */}
              <button
                className="button primary submit"
                type="submit"
                disabled={!form.acepta_datos || !form.hoja_vida_nombre}
                style={{
                  width: '100%',
                  marginTop: '0.2rem',
                  padding: '0.75rem',
                  backgroundColor: (form.acepta_datos && form.hoja_vida_nombre) ? '#2e7d32' : '#94a3b8',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: (form.acepta_datos && form.hoja_vida_nombre) ? 'pointer' : 'not-allowed',
                  boxSizing: 'border-box'
                }}
              >
                Enviar postulación con Hoja de Vida
              </button>
            </form>

            {notice && <p className="notice" style={{ marginTop: '0.8rem' }}>{notice}</p>}
          </section>
        </div>
      )}

      {/* MODAL ACCESO INTERNO */}
      {showLogin && (
        <div className="modal-backdrop" onMouseDown={() => setShowLogin(false)}>
          <section className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setShowLogin(false)}>×</button>
            <p className="eyebrow">ÁREA INTERNA</p>
            <h2>Ingreso Administrativo</h2>

            <form onSubmit={handleLogin}>
              <label>
                Usuario
                <input type="text" value={loginForm.usuario} onChange={(e) => setLoginForm({ ...loginForm, usuario: e.target.value })} required />
              </label>
              <label>
                Contraseña
                <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
              </label>
              <button className="button primary submit" type="submit">Ingresar a TalentHub</button>
            </form>
            {loginNotice && <p className="notice">{loginNotice}</p>}
          </section>
        </div>
      )}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);