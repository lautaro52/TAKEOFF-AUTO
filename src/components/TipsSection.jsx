import React, { useState } from 'react';
import './TipsSection.css';
import VideoModal from './VideoModal';

// Photos to be uploaded by the user
import tip1 from '../assets/tip-1.png';
import tip2 from '../assets/tip-2.png';
import tip3 from '../assets/tip-3.png';
import tip4 from '../assets/tip-4.png';

const TipsSection = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);

    const tips = [
        {
            id: 1,
            title: "Crédito TAKEOFF",
            highlight: "Paga cualquier auto TAKEOFF hasta en 72 meses y un ingreso desde el 15%",
            footer: "Crédito TAKEOFF: paga tu auto a meses",
            image: tip1,
            videoUrl: "/assets/videos/tip-video-1.mp4"
        },
        {
            id: 2,
            title: "¿Qué es la repuve?",
            highlight: "¿Qué es la repuve?",
            footer: "¿Qué es la repuve?",
            image: tip2,
            videoUrl: "/assets/videos/tip-video-2.mp4"
        },
        {
            id: 3,
            title: "Trámite de placas",
            highlight: "Trámite de placas",
            footer: "Trámite de placas",
            image: tip3,
            videoUrl: "/assets/videos/tip-video-3.mp4"
        },
        {
            id: 4,
            title: "Diferencia entre:",
            highlight: "SUV, Hatch, Sedan y PickUP",
            footer: "Diferencia entre: SUV, Hatch, Sedan, PickUP.",
            image: tip4,
            videoUrl: "/assets/videos/tip-video-4.mp4"
        }
    ];

    return (
        <section className="tips-section">
            <div className="container">
                <h2 className="tips-title">Tips y Videos</h2>
                <div className="tips-grid">
                    {tips.map((tip) => (
                        <div
                            key={tip.id}
                            className="tip-card"
                            style={{ backgroundImage: `url(${tip.image})` }}
                            onClick={() => setSelectedVideo(tip)}
                        >
                            <div className="tip-hover-overlay">
                                <div className="play-icon-wrapper">
                                    <div className="play-icon"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <VideoModal
                isOpen={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
                videoData={selectedVideo}
            />
        </section>
    );
};

export default TipsSection;
