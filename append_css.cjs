const fs = require('fs');
const newCss = `
/* SCROLL REVEAL ANIMATIONS */
.reveal {
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
    will-change: transform, opacity;
}

.reveal-bottom {
    transform: translateY(40px);
}

.reveal-left {
    transform: translateX(-60px);
}

.reveal-right {
    transform: translateX(60px);
}

.reveal-scale {
    transform: scale(0.9);
}

.reveal.is-visible {
    opacity: 1;
    transform: translate(0, 0) scale(1);
}

/* STAGGERED DELAYS */
.delay-100 { transition-delay: 0.1s; }
.delay-200 { transition-delay: 0.2s; }
.delay-300 { transition-delay: 0.3s; }
.delay-400 { transition-delay: 0.4s; }
.delay-500 { transition-delay: 0.5s; }
.delay-600 { transition-delay: 0.6s; }
.delay-700 { transition-delay: 0.7s; }
.delay-800 { transition-delay: 0.8s; }
`;
fs.appendFileSync('src/pages/Credit.css', newCss, 'utf8');
console.log('Appended successfully.');
