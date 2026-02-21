import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Calculator, Headset } from 'lucide-react';
import './PurchaseProcess.css';

const PurchaseProcess = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = React.useState(1);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev % 3) + 1);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleStep1Click = () => {
        navigate('/catalogo');
    };

    const handleStep2Click = () => {
        const element = document.getElementById('simulation-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Dispatch event to show highlight
            window.dispatchEvent(new CustomEvent('highlight-calculator'));
        }
    };

    const handleStep3Click = () => {
        window.dispatchEvent(new CustomEvent('open-chatbot'));
    };

    const steps = [
        {
            number: 1,
            title: "Elegí tu auto",
            icon: <Car size={48} strokeWidth={1.5} />,
            color: "#0066FF",
            onClick: handleStep1Click
        },
        {
            number: 2,
            title: "Elegí la cuota que más te convenga",
            icon: <Calculator size={48} strokeWidth={1.5} />,
            color: "#0066FF",
            onClick: handleStep2Click
        },
        {
            number: 3,
            title: "Agendá tu cita",
            icon: <Headset size={48} strokeWidth={1.5} />,
            color: "#0066FF",
            onClick: handleStep3Click
        }
    ];

    return (
        <section className="purchase-process" id="purchase-process">
            <div className="container">
                <div className="process-flow">
                    <div className="flow-line"></div>
                    <div className="flow-steps-indicators">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`step-indicator ${step.number === activeStep ? 'active heartbeat' : ''} ${step.onClick ? 'clickable' : ''}`}
                                onClick={step.onClick}
                            >
                                {step.number}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="process-grid">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`process-item ${step.number === activeStep ? 'active' : ''} ${step.onClick ? 'clickable' : ''}`}
                            onClick={step.onClick}
                        >
                            <div className={`mobile-step-number ${step.number === activeStep ? 'active heartbeat' : ''}`}>{step.number}</div>
                            <div className="icon-container" style={{ color: step.number === activeStep ? '#0066FF' : '#999' }}>
                                {step.icon}
                            </div>
                            <h3>{step.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PurchaseProcess;
