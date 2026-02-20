import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
    const row1 = [
        { name: "Ricardo Lorza", date: "03 febrero 2026", text: "Excelente atención y ubicación. El servicio fue muy bueno y los precios por los autos son justos.", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
        { name: "Cesar Perez", date: "27 enero 2026", text: "Muy bien todo, son muy amables y atentos, voy a regresar para cerrar mi financiamiento.", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
        { name: "Pablo Ojeda", date: "15 enero 2026", text: "Aunque el papeleo puede ser tardado, la atención es amable y eficiente. Sin duda volvería.", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
        { name: "Diego Flores", date: "29 diciembre 2025", text: "Me gustó la atención, el personal es amable y resuelven tus dudas. Revisé los autos sin presión.", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
        { name: "Salvador Luna", date: "11 diciembre 2025", text: "Llevé mi auto para gestionar la venta y salí con el 100% del pago en el momento. Muy seguro.", avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
        { name: "Román Montero", date: "20 noviembre 2025", text: "Atienden bien, me pagaron más que en otras partes por mi auto. El proceso fue muy ágil.", avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
        { name: "Lucía Méndez", date: "05 noviembre 2025", text: "Super rápido todo, el financiamiento me lo aprobaron en el momento. Muy profesionales.", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
        { name: "Marcos Torres", date: "18 octubre 2025", text: "El auto que compré está impecable. El servicio post-venta es excelente y muy atento.", avatar: "https://randomuser.me/api/portraits/men/7.jpg" },
        { name: "Elena Rivas", date: "02 octubre 2025", text: "Muy profesionales. Me ayudaron con todo el trámite de la transferencia de forma gratuita.", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
        { name: "Gabriel Soto", date: "14 septiembre 2025", text: "La mejor opción para vender tu auto de forma segura y sin vueltas comerciales.", avatar: "https://randomuser.me/api/portraits/men/8.jpg" }
    ];

    const row2 = [
        { name: "Ana Belén", date: "10 febrero 2026", text: "Increíble experiencia, el proceso de inspección fue muy detallado y transparente.", avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
        { name: "Jorge Ruiz", date: "22 enero 2026", text: "Me sorprendió la limpieza y el estado de los vehículos en exhibición. Parecen nuevos.", avatar: "https://randomuser.me/api/portraits/men/9.jpg" },
        { name: "Carla Díaz", date: "08 enero 2026", text: "Vender mi auto fue súper sencillo, la tasación fue justa y el pago realmente rápido.", avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
        { name: "Mateo San", date: "16 diciembre 2025", text: "Excelente trato desde que entramos hasta que nos fuimos con nuestro nuevo auto.", avatar: "https://randomuser.me/api/portraits/men/10.jpg" },
        { name: "Sofía Castro", date: "25 noviembre 2025", text: "Muy buena plataforma para buscar y comparar modelos. Muy intuitiva y fácil de usar.", avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
        { name: "Andrés Gil", date: "09 noviembre 2025", text: "El equipo de ventas sabe lo que hace. Me asesoraron perfectamente con el seguro.", avatar: "https://randomuser.me/api/portraits/men/11.jpg" },
        { name: "Valeria Paz", date: "24 octubre 2025", text: "Comprar mi primer auto fue un sueño gracias a la facilidad que brindan en todo momento.", avatar: "https://randomuser.me/api/portraits/women/6.jpg" },
        { name: "Hugo Bossi", date: "07 octubre 2025", text: "Me ahorré mucho tiempo con los trámites digitales. Proceso muy moderno y eficaz.", avatar: "https://randomuser.me/api/portraits/men/12.jpg" },
        { name: "Rocío Jara", date: "22 septiembre 2025", text: "La garantía que ofrecen me dio mucha tranquilidad al comprar mi vehículo usado.", avatar: "https://randomuser.me/api/portraits/women/7.jpg" },
        { name: "Lucas Vera", date: "30 agosto 2025", text: "100% recomendados, transparencia total en cada paso del proceso de compra.", avatar: "https://randomuser.me/api/portraits/men/13.jpg" }
    ];

    const renderTestimonial = (review, index) => (
        <div key={index} className="testimonial-card">
            <div className="testimonial-header">
                <img src={review.avatar} alt={review.name} className="testimonial-avatar" />
                <div className="testimonial-info">
                    <h4>{review.name}</h4>
                    <span>{review.date}</span>
                </div>
            </div>
            <p className="testimonial-text">{review.text}</p>
        </div>
    );

    return (
        <section className="testimonials">
            <div className="testimonials-container">
                <div className="container">
                    <h2 className="section-title">Lo que opinan nuestros clientes</h2>
                </div>

                <div className="marquee-wrapper">
                    <div className="marquee-content marquee-left">
                        {row1.map(renderTestimonial)}
                        {/* Duplicate for seamless loop */}
                        {row1.map((r, i) => renderTestimonial(r, `r1-dup-${i}`))}
                    </div>
                </div>

                <div className="marquee-wrapper">
                    <div className="marquee-content marquee-right">
                        {row2.map(renderTestimonial)}
                        {/* Duplicate for seamless loop */}
                        {row2.map((r, i) => renderTestimonial(r, `r2-dup-${i}`))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
