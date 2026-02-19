import React from 'react';
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Handshake,
    CreditCard,
    Search,
    ArrowRight,
    CheckCircle2,
    Users,
    Car
} from "lucide-react";
// Note: Assets should be placed in src/assets/ when available
// import heroShowroom from '../assets/hero-showroom.jpg';
// import transparenciaEquipo from '../assets/transparencia-equipo.jpg';

const HERO_FALLBACK = 'https://picsum.photos/seed/car-dealership/1200/1200';
const TEAM_FALLBACK = 'https://picsum.photos/seed/transparency/1000/1200';

const Hero = () => (
    <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-takeoff-blue text-xs font-bold uppercase tracking-widest mb-6">
                        Misión y Visión
                    </span>
                    <h1 className="text-5xl lg:text-7xl font-black leading-[0.9] mb-8 tracking-tighter">
                        CONECTAMOS TUS SUEÑOS CON EL <span className="text-takeoff-blue">MEJOR STOCK</span> DEL PAÍS.
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-xl">
                        En <span className="font-bold text-black">TAKEOFF AUTO</span>, no solo vendemos autos; somos arquitectos de soluciones de movilidad. Actuamos como el puente estratégico entre vos y el inventario exclusivo de <span className="font-bold">Tu Auto</span> en <span className="font-bold">Fiat Turín</span>.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a href="/catalogo" className="bg-takeoff-blue text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-blue-200">
                            Ver Catálogo <ArrowRight size={20} />
                        </a>
                        <a href="/credito" className="bg-white border-2 border-black text-black px-8 py-4 rounded-xl font-bold hover:bg-black hover:text-white transition-all">
                            Simular Crédito
                        </a>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="relative"
                >
                    <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative">
                        <img
                            src={HERO_FALLBACK}
                            alt="Fiat Turín Showroom"
                            className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                            <div className="text-white">
                                <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Respaldo Institucional</p>
                                <p className="text-2xl font-bold italic">Alianza Estratégica con Grupo Antun</p>
                            </div>
                        </div>
                    </div>
                    {/* Floating Badge */}
                    <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-takeoff-blue">
                                <Car size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-black">+100</p>
                                <p className="text-xs text-gray-500 font-bold uppercase">Unidades Certificadas</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    </section>
);

const Alliance = () => (
    <section className="py-24 bg-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">EL DIFERENCIAL: LA ALIANZA ESTRATÉGICA</h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    Nuestra unión con Grupo Antun nos permite ofrecerte lo mejor de dos mundos: stock masivo y atención boutique.
                </p>
            </div>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 max-w-4xl mx-auto">
                {/* Node 1 */}
                <div className="flex flex-col items-center text-center z-10">
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-black mb-4 shadow-xl">
                        <Users size={40} />
                    </div>
                    <p className="font-bold uppercase tracking-widest text-sm">Tu Auto / Grupo Antun</p>
                    <p className="text-xs text-gray-500 mt-1">El Respaldo</p>
                </div>

                {/* Connection Line */}
                <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-takeoff-blue to-transparent"></div>

                {/* Node 2 (Center) */}
                <div className="flex flex-col items-center text-center z-10 scale-110">
                    <div className="w-32 h-32 rounded-full bg-takeoff-blue flex items-center justify-center text-white mb-4 shadow-2xl shadow-blue-500/20 border-4 border-white">
                        <div className="font-black text-xl leading-none">
                            TAKE<br />OFF
                        </div>
                    </div>
                    <p className="font-bold uppercase tracking-widest text-sm text-takeoff-blue">TAKEOFF AUTO</p>
                    <p className="text-xs text-gray-400 mt-1">El Nexo Estratégico</p>
                </div>

                {/* Node 3 */}
                <div className="flex flex-col items-center text-center z-10">
                    <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4">
                        <Handshake size={40} />
                    </div>
                    <p className="font-bold uppercase tracking-widest text-sm">El Cliente</p>
                    <p className="text-xs text-gray-500 mt-1">Tu Sueño</p>
                </div>
            </div>

            <div className="mt-20 text-center max-w-3xl mx-auto">
                <p className="text-xl leading-relaxed italic text-gray-300">
                    "Vos elegís la unidad en Fiat Turín, nosotros nos encargamos de que la alcances con la agilidad de una gestión personalizada."
                </p>
            </div>
        </div>
    </section>
);

const Pillars = () => {
    const pillars = [
        {
            icon: <Search className="text-takeoff-blue" size={32} />,
            title: "Selección Rigurosa",
            desc: "Cada auto de nuestra alianza pasa por una inspección de 100 puntos antes de ser publicado. Calidad garantizada."
        },
        {
            icon: <ShieldCheck className="text-takeoff-blue" size={32} />,
            title: "Respaldo Mecánico",
            desc: "Ofrecemos 3 meses de garantía real en motor y caja, asegurando tu inversión desde el primer kilómetro."
        },
        {
            icon: <CreditCard className="text-takeoff-blue" size={32} />,
            title: "Inclusión Financiera",
            desc: "Tu pasado no define tu futuro. Aprobamos créditos donde otros dicen no, con planes de hasta 72 cuotas."
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {pillars.map((p, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="p-10 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl transition-all"
                        >
                            <div className="mb-6">{p.icon}</div>
                            <h3 className="text-2xl font-black mb-4 tracking-tight uppercase">{p.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{p.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Transparency = () => (
    <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-gray-100">
                <div className="grid lg:grid-cols-2">
                    <div className="p-12 lg:p-20 flex flex-col justify-center">
                        <h2 className="text-4xl font-black mb-8 tracking-tight uppercase">Transparencia en el Proceso</h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            Somos intermediarios que agregan valor. Nuestra función es asesorarte, calificar tu perfil crediticio y asegurar que el vehículo que retiras de la agencia sea exactamente lo que esperás.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Atendemos 24/7 con asistencia virtual",
                                "Gestión de documentación sin burocracia",
                                "Test Drive previo a la compra",
                                "Calificación crediticia inmediata"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 font-bold text-sm uppercase tracking-wider">
                                    <CheckCircle2 className="text-takeoff-blue" size={20} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative h-[400px] lg:h-auto">
                        <img
                            src={TEAM_FALLBACK}
                            alt="Teamwork"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const Nosotros = () => {
    return (
        <div className="nosotros-page min-h-screen font-sans selection:bg-takeoff-blue selection:text-white">
            <main>
                <Hero />
                <Alliance />
                <Pillars />
                <Transparency />

                {/* CTA Final */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-takeoff-blue rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-500/40">
                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase">¿Listo para despegar?</h2>
                                <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto font-medium">
                                    Tu próximo auto te espera en Fiat Turín. Nosotros hacemos que el camino sea simple.
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center gap-6">
                                    <a href="/catalogo" className="bg-white text-takeoff-blue px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform text-center">
                                        EXPLORAR CATÁLOGO
                                    </a>
                                    <a href="/login" className="bg-black text-white px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform text-center">
                                        HABLAR CON UN ASESOR
                                    </a>
                                </div>
                            </div>
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Nosotros;
