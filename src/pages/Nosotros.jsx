import React from 'react';
import { Link } from 'react-router-dom';
import './Nosotros.css';
import { motion } from "framer-motion";
import { API_CONFIG } from '../config';
import {
    ShieldCheck,
    Handshake,
    CreditCard,
    Search,
    ArrowRight,
    CheckCircle2,
    Check,
    Users,
    Car,
} from "lucide-react";

// ── IMÁGENES ──────────────────────────────────────────────────────────────
import heroShowroom from '../assets/nosotros/hero-showroom.jpg';
import transparencyProceso from '../assets/nosotros/transparencia-proceso.jpg';
// Cuando tengas la foto del equipo, habilitá esta línea:
// import transparenciaEquipo from '../assets/nosotros/transparencia-equipo.jpg';

const HERO_SHOWROOM = heroShowroom;
const TRANSPARENCY_IMG = transparencyProceso;
// Placeholder SVG — sólo se usa si TEAM_TRANSPARENCY est null
const grayPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='900' viewBox='0 0 800 900'%3E%3Crect width='800' height='900' fill='%23D1D5DB'/%3E%3Ctext x='400' y='450' font-family='sans-serif' font-size='24' fill='%239CA3AF' text-anchor='middle' dominant-baseline='middle'%3ESubí tu foto aquí%3C/text%3E%3C/svg%3E";

// ─────────────────────────────────────────────
// HERO — diseño basado en referencia exacta
// ─────────────────────────────────────────────

const Hero = () => (
    <section className="w-full bg-white" style={{ paddingTop: '80px', borderTop: '2px solid transparent' }}>
        {/* Marcador de Versión Invisible para Refresh Check: V12 */}
        <div className="nosotros-hero-grid" style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '48px 64px 80px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            alignItems: 'stretch',
        }}
        >
            {/* ── COLUMNA IZQUIERDA ── */}
            <motion.div
                className="nosotros-hero-text"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    paddingBottom: '0px',
                    height: '100%',
                }}
            >
                <div>
                    {/* Badge "MISIÓN Y VISIÓN" */}
                    <span className="nosotros-hero-badge" style={{
                        display: 'inline-block',
                        padding: '4px 14px',
                        borderRadius: '999px',
                        border: '1px solid #BFDBFE',
                        background: '#EFF6FF',
                        color: '#0052FF',
                        fontSize: '10px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.25em',
                        marginBottom: '14px',
                    }}>
                        MISIÓN Y VISIÓN
                    </span>

                    {/* H1 — Tamaño balanceado para no exceder la foto */}
                    <h1 className="nosotros-hero-title" style={{
                        fontSize: 'clamp(2.4rem, 4.2vw, 4.8rem)',
                        fontWeight: 900,
                        lineHeight: 0.9,
                        letterSpacing: '-0.02em',
                        color: '#000000',
                        textTransform: 'uppercase',
                        marginBottom: '16px',
                    }}>
                        CONECTAMOS<br />
                        TUS SUEÑOS CON<br />
                        <span style={{ color: '#0052FF' }}>EL MEJOR STOCK</span><br />
                        DEL PAÍS.
                    </h1>

                    {/* Párrafo — Tamaño balanceado */}
                    <p className="nosotros-hero-desc" style={{
                        fontSize: '16px',
                        fontWeight: 500,
                        color: '#4B5563',
                        lineHeight: 1.5,
                        maxWidth: '520px',
                        marginBottom: '0px',
                    }}>
                        En <strong style={{ color: '#000', fontWeight: 800 }}>TAKEOFF AUTO</strong>, no solo vendemos autos; somos arquitectos de soluciones de movilidad. Actuamos como el puente estratégico entre vos y el inventario exclusivo de <strong style={{ color: '#000', fontWeight: 800 }}>Tu Auto</strong> en <strong style={{ color: '#000', fontWeight: 800 }}>Fiat Turín</strong>.
                    </p>
                </div>

                {/* Botones — Anclados a la base gracias a space-between y height: 100% */}
                <div className="nosotros-hero-buttons" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: 'auto', paddingBottom: '4px' }}>
                    <Link to="/catalogo" className="nosotros-hero-btn nosotros-hero-btn-primary" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '16px 32px',
                        background: '#0052FF',
                        color: '#fff',
                        borderRadius: '999px',
                        fontWeight: 900,
                        fontSize: '13px',
                        textDecoration: 'none',
                        boxShadow: '0 8px 25px rgba(0,82,255,0.25)',
                        transition: 'transform 0.2s',
                    }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Ver Catálogo <ArrowRight size={15} />
                    </Link>
                    <Link to="/#simulation-section" className="nosotros-hero-btn nosotros-hero-btn-secondary" style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px 32px',
                        background: 'transparent',
                        color: '#111',
                        border: '1px solid #111',
                        borderRadius: '999px',
                        fontWeight: 900,
                        fontSize: '13px',
                        textDecoration: 'none',
                        transition: 'background 0.2s, color 0.2s',
                    }}
                        onMouseOver={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111'; }}
                    >
                        Simular Crédito
                    </Link>
                </div>
            </motion.div>

            {/* ── COLUMNA DERECHA — Imagen con card y badge ── */}
            <motion.div
                className="nosotros-hero-image"
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65 }}
                style={{ position: 'relative', paddingTop: '16px', paddingRight: '16px' }}
            >
                {/* Badge flotante — sale del borde superior derecho del card */}
                <div className="nosotros-hero-image-badge" style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    zIndex: 20,
                    background: '#fff',
                    borderRadius: '20px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    minWidth: '180px',
                }}>
                    <div style={{
                        width: '40px', height: '40px',
                        borderRadius: '12px',
                        background: '#EFF6FF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <Car size={20} color="#0052FF" />
                    </div>
                    <div>
                        <p style={{ fontSize: '24px', fontWeight: 900, color: '#000', lineHeight: 1 }}>+100</p>
                        <p style={{ fontSize: '8.5px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '4px' }}>
                            Unidades Certificadas
                        </p>
                    </div>
                </div>

                {/* Card de imagen — ratio portrait 4:5 */}
                <div className="nosotros-hero-image-card" style={{ borderRadius: '32px', overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.18)', position: 'relative' }}>
                    <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
                        <img
                            src={HERO_SHOWROOM || grayPlaceholder}
                            alt="Fiat Turín Showroom — TakeOff Auto"
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                        {/* Overlay gradiente inferior */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 80%)',
                            pointerEvents: 'none',
                        }} />
                        {/* Caption */}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 36px' }}>
                            <p style={{
                                fontSize: '11px', fontWeight: 900,
                                textTransform: 'uppercase', letterSpacing: '0.25em',
                                color: '#0052FF', marginBottom: '8px',
                            }}>
                                Respaldo Institucional
                            </p>
                            <p style={{
                                fontSize: '22px', fontWeight: 900,
                                fontStyle: 'italic', color: '#fff',
                                letterSpacing: '-0.01em', lineHeight: 1.1,
                            }}>
                                Alianza Estratégica con Grupo Antun
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

        </div>
    </section>
);

// ─────────────────────────────────────────────
// ALLIANCE
// ─────────────────────────────────────────────
const Alliance = () => (
    <section className="w-full bg-black text-white py-32 overflow-hidden">
        <div
            style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '0 64px'
            }}
        >
            <div className="text-center mb-24 transition-all">
                <span className="text-takeoff-blue font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">
                    El Diferencial
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase mb-6 leading-none">
                    LA ALIANZA ESTRATÉGICA
                </h2>
                <div className="flex flex-col items-center">
                    <p
                        className="text-gray-400 max-w-2xl text-[17px] font-medium leading-relaxed text-center"
                    >
                        Nuestra unión con <span className="text-white">Grupo Antun</span> nos permite ofrecerte lo mejor de dos mundos: <br className="hidden sm:block" />
                        stock masivo y atención boutique.
                    </p>
                </div>
            </div>

            {/* Diagrama de Nodos */}
            <div className="nosotros-alliance-nodes relative flex flex-col sm:flex-row items-center justify-center gap-16 sm:gap-28 py-8">
                {/* Connecting line — desktop — Azul #0052FF */}
                <div
                    className="hidden sm:block absolute top-1/2 -translate-y-1/2 left-[24%] right-[24%] h-[2px] z-0"
                    style={{ background: '#0052FF' }}
                />

                {/* ── Mobile curved connectors (hidden on sm+) ── */}
                <svg
                    className="sm:hidden absolute inset-0 w-full h-full z-[1] pointer-events-none"
                    viewBox="0 0 200 500"
                    preserveAspectRatio="none"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Curve 1: Node 1 → Node 2 (swings left) */}
                    <path
                        d="M 100 95 C 30 140, 30 200, 100 240"
                        stroke="#0052FF"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.7"
                    />
                    {/* Curve 2: Node 2 → Node 3 (swings right) */}
                    <path
                        d="M 100 310 C 170 350, 170 410, 100 445"
                        stroke="#0052FF"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.7"
                    />
                </svg>

                {/* Node: El Respaldo (Blanco) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center z-10"
                >
                    <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center mb-6 shadow-xl">
                        <Car size={34} className="text-black" />
                    </div>
                    <h3 className="text-[12px] font-black uppercase tracking-widest text-white mb-1.5">TU AUTO / GRUPO ANTUN</h3>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">El Respaldo</p>
                </motion.div>

                {/* Node: NEXO (Azul - Central - Más Grande) */}
                <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center z-10"
                >
                    <div
                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(0,82,255,0.4)] transition-transform hover:scale-105"
                        style={{ background: '#0052FF', border: '3px solid #fff' }}
                    >
                        <div className="font-black text-2xl sm:text-3xl leading-[0.8] tracking-tighter uppercase text-center text-white">
                            TAKE<br />OFF
                        </div>
                    </div>
                    <h3 className="text-[12px] font-black uppercase tracking-widest text-takeoff-blue mb-1.5" style={{ color: '#0052FF' }}>TAKEOFF AUTO</h3>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">El Nexo Estratégico</p>
                </motion.div>

                {/* Node: El Cliente (Gris Oscuro) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center z-10"
                >
                    <div
                        className="w-28 h-28 rounded-full flex items-center justify-center mb-6 border-2"
                        style={{ background: '#111', borderColor: '#333' }}
                    >
                        <Handshake size={34} className="text-white" />
                    </div>
                    <h3 className="text-[12px] font-black uppercase tracking-widest text-white mb-1.5">EL CLIENTE</h3>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Tu Sueño</p>
                </motion.div>
            </div>

            {/* Frase Final */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-20 text-center"
            >
                <div className="flex flex-col items-center">
                    <p
                        className="text-lg sm:text-xl italic text-gray-400 font-medium max-w-3xl leading-relaxed text-center"
                    >
                        "Vos elegís la unidad en Fiat Turín, nosotros nos encargamos de que la alcances con la agilidad de una gestión personalizada."
                    </p>
                </div>
            </motion.div>
        </div>
    </section>
);

// ─────────────────────────────────────────────
// PILLARS
// ─────────────────────────────────────────────
const PILLARS = [
    {
        Icon: Search,
        title: "Selección Rigurosa",
        desc: "Cada auto de nuestra alianza pasa por una inspección de 100 puntos antes de ser publicado. Calidad certificada y garantizada.",
    },
    {
        Icon: ShieldCheck,
        title: "Respaldo Mecánico",
        desc: "Ofrecemos 3 meses de garantía real en motor y caja, asegurando tu inversión desde el primer kilómetro.",
    },
    {
        Icon: CreditCard,
        title: "Inclusión Financiera",
        desc: "Tu pasado no define tu futuro. Aprobamos créditos donde otros dicen no, con planes de hasta 72 cuotas.",
    },
];

const Pillars = () => (
    <section className="w-full bg-[#FBFBFB] py-32" id="valores-section">
        {/* Version Marker: V12 */}
        <div
            className="nosotros-pillars-container"
            style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '0 64px'
            }}
        >
            <div className="text-center mb-52">
                <span className="text-takeoff-blue font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">
                    Nuestros Valores
                </span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black uppercase leading-none">
                    LOS PILARES DE NUESTRA GESTIÓN
                </h2>
            </div>
            <div
                className="nosotros-pillars-grid grid sm:grid-cols-3 gap-10"
                style={{ marginTop: '120px' }}
            >
                {PILLARS.map(({ Icon, title, desc }, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.4, delay: i * 0.1, ease: [0.21, 0.45, 0.32, 0.9] }}
                        whileHover={{
                            y: -12,
                            scale: 1.02,
                            transition: { duration: 0.3, ease: "easeOut" }
                        }}
                        className="nosotros-pillar-card group relative p-14 rounded-3xl border border-gray-100 bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] flex flex-col items-start text-left justify-start transition-all duration-500 cursor-default"
                    >
                        {/* Hover Accent Border — Rounded to match card */}
                        <div className="absolute top-0 left-0 w-full h-[3px] bg-takeoff-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-3xl" />

                        <div className="mb-9 relative">
                            {/* Icon Background Glow */}
                            <div className="absolute inset-0 bg-takeoff-blue/10 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 opacity-0 group-hover:opacity-100" />
                            <Icon
                                size={40}
                                className="text-[#0052FF] relative z-10 group-hover:rotate-[8deg] transition-transform duration-500"
                                strokeWidth={1.5}
                            />
                        </div>

                        <h3 className="text-[22px] font-[900] uppercase tracking-tighter text-black mb-6 leading-tight group-hover:text-takeoff-blue transition-colors duration-300">
                            {title}
                        </h3>
                        <p className="text-[16px] text-gray-500 leading-relaxed font-medium group-hover:text-gray-700 transition-colors duration-300">
                            {desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

// ─────────────────────────────────────────────
// TRANSPARENCY
// ─────────────────────────────────────────────
const FEATURES = [
    "ATENDEMOS 24/7 CON ASISTENCIA VIRTUAL",
    "GESTIÓN DE DOCUMENTACIÓN SIN BUROCRACIA",
    "TEST DRIVE PREVIO A LA COMPRA",
    "CALIFICACIÓN CREDITICIA INMEDIATA",
];

const Transparency = () => (
    <section className="w-full bg-[#F3F4F6] py-24" id="transparencia-section">
        {/* Version Marker: V23 — ZERO BOTTOM BORDER & FINER TEXT */}
        <div
            className="nosotros-transparency-container"
            style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 64px'
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="nosotros-transparency-card bg-white rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col md:flex-row items-stretch"
            >
                {/* Left Column: Text Content — Absolute Balance */}
                <div className="nosotros-transparency-text flex-1 flex flex-col justify-center bg-white" style={{ padding: '80px 56px 80px 80px' }}>
                    <div className="max-w-[440px] w-full">
                        <h2 className="text-4xl lg:text-[44px] font-[1000] tracking-tighter uppercase text-black mb-12 leading-[0.95]">
                            TRANSPARENCIA EN EL PROCESO
                        </h2>

                        <p className="text-[17px] text-gray-500 leading-relaxed mb-16 font-light tracking-wide">
                            Somos intermediarios que agregan valor. Nuestra función es asesorarte, calificar tu perfil crediticio y
                            asegurar que el vehículo que retiras de la agencia sea exactamente lo que esperás.
                        </p>

                        <div className="space-y-6">
                            {FEATURES.map((f, i) => (
                                <div key={i} className="flex items-center gap-5 text-[14px] font-[1000] uppercase tracking-tighter text-black">
                                    <div className="w-7 h-7 rounded-full bg-[#0052FF] flex items-center justify-center shrink-0">
                                        <Check size={14} className="text-white" strokeWidth={4} />
                                    </div>
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Image — Defining Natural Height */}
                <div className="nosotros-transparency-image flex-1 overflow-hidden flex items-stretch">
                    <img
                        src={TRANSPARENCY_IMG || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1400"}
                        alt="Transparencia en el Proceso TakeOff"
                        className="w-full h-full object-cover"
                    />
                </div>
            </motion.div>
        </div>
    </section>
);

// ─────────────────────────────────────────────
// CTA
// ─────────────────────────────────────────────
const CTA = () => (
    <section className="w-full bg-white" style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 64px' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                style={{
                    background: '#0052FF',
                    borderRadius: '4rem',
                    padding: '80px 48px',
                    textAlign: 'center',
                    color: '#fff',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 40px 100px -20px rgba(0,82,255,0.4)',
                }}
            >
                <div className="nosotros-cta-inner" style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto' }}>
                    <h2 className="nosotros-cta-title" style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                        fontWeight: 1000,
                        letterSpacing: '-0.04em',
                        textTransform: 'uppercase',
                        lineHeight: 1,
                        marginBottom: '24px',
                    }}>
                        ¿LISTO PARA DESPEGAR?
                    </h2>

                    <p className="nosotros-cta-desc" style={{
                        fontSize: '18px',
                        fontWeight: 500,
                        opacity: 0.95,
                        lineHeight: 1.5,
                        marginBottom: '48px',
                        maxWidth: '500px',
                        margin: '0 auto 48px',
                    }}>
                        Tu próximo auto te espera en Fiat Turín. Nosotros hacemos que el camino sea simple.
                    </p>

                    <div className="nosotros-cta-buttons" style={{
                        display: 'flex',
                        gap: '20px',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                    }}>
                        <Link
                            to="/catalogo"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '240px',
                                padding: '18px 36px',
                                background: '#fff',
                                color: '#0052FF',
                                borderRadius: '1.5rem',
                                fontWeight: 1000,
                                fontSize: '13px',
                                textDecoration: 'none',
                                textTransform: 'uppercase',
                                letterSpacing: '-0.02em',
                                boxShadow: '0 10px 30px rgba(255,255,255,0.2)',
                                transition: 'transform 0.2s',
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            EXPLORAR CATÁLOGO
                        </Link>

                        <a
                            href={API_CONFIG.WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '240px',
                                padding: '18px 36px',
                                background: '#000',
                                color: '#fff',
                                borderRadius: '1.5rem',
                                fontWeight: 1000,
                                fontSize: '13px',
                                textDecoration: 'none',
                                textTransform: 'uppercase',
                                letterSpacing: '-0.02em',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                transition: 'transform 0.2s',
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            HABLAR CON UN ASESOR
                        </a>
                    </div>
                </div>
            </motion.div>
        </div >
    </section >
);

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
export default function Nosotros() {
    return (
        <div className="nosotros-page w-full min-h-screen bg-white font-sans selection:bg-takeoff-blue selection:text-white">
            <Hero />
            <Alliance />
            <Pillars />
            <Transparency />
            <CTA />
        </div>
    );
}
