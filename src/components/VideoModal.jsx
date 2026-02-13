import React, { useState } from 'react';
import './VideoModal.css';
import { X, Loader } from 'lucide-react';

const VideoModal = ({ isOpen, onClose, videoData }) => {
    const [loading, setLoading] = useState(true);

    if (!isOpen || !videoData) return null;

    const handleVideoLoad = () => {
        setLoading(false);
    };

    return (
        <div className="video-modal-overlay" onClick={onClose}>
            <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                {loading && (
                    <div className="video-loading">
                        <Loader className="spin-loader" size={40} />
                        <p>Cargando tu experiencia...</p>
                    </div>
                )}

                <div className="video-container">
                    <video
                        controls
                        autoPlay
                        onLoadedData={handleVideoLoad}
                        className="modal-video"
                    >
                        <source src={videoData.videoUrl} type="video/mp4" />
                        Tu navegador no soporta el elemento de video.
                    </video>
                </div>
            </div>
        </div>
    );
};

export default VideoModal;
