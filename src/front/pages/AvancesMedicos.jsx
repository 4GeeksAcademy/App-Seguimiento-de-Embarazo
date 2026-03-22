import { useNavigate } from "react-router-dom";

export const AvancesMedicos = () => {
    const navigate = useNavigate();

    return (
        <div className="container mt-5 mb-5">
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold text-primary mb-3">
                    <i className="fas fa-microscope me-3"></i>
                    Avances Médicos 2026
                </h1>
                <p className="lead text-muted">
                    Las últimas innovaciones en salud materna e infantil
                </p>
            </div>

           
            <div className="row mb-5 align-items-center">
                <div className="col-md-6">
                    <img
                        src="https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg"
                        alt="Diagnóstico prenatal"
                        className="img-fluid rounded-4 shadow-lg"
                        style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                    />
                </div>
                <div className="col-md-6">
                    <div className="p-4">
                        <h2 className="fw-bold mb-3">
                            <i className="fas fa-dna text-primary me-2"></i>
                            Diagnóstico Prenatal No Invasivo
                        </h2>
                        <p className="fs-5 text-secondary">
                            Los avances en secuenciación genética permiten detectar anomalías cromosómicas mediante
                            un simple análisis de sangre materna desde las 9 semanas de gestación. Las nuevas técnicas
                            de 2026 ofrecen una precisión del 99.9% sin riesgos para el bebé, eliminando la necesidad
                            de procedimientos invasivos como la amniocentesis en la mayoría de los casos.
                        </p>
                    </div>
                </div>
            </div>

            
            <div className="row mb-5 align-items-center flex-row-reverse">
                <div className="col-md-6">
                    <img
                        src="https://images.pexels.com/photos/3952231/pexels-photo-3952231.jpeg"
                        alt="Tratamientos de fertilidad"
                        className="img-fluid rounded-4 shadow-lg"
                        style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                    />
                </div>
                <div className="col-md-6">
                    <div className="p-4">
                        <h2 className="fw-bold mb-3">
                            <i className="fas fa-flask text-primary me-2"></i>
                            Reproducción Asistida de Nueva Generación
                        </h2>
                        <p className="fs-5 text-secondary">
                            La inteligencia artificial revoluciona los tratamientos de fertilidad. Algoritmos avanzados
                            pueden predecir con mayor exactitud la viabilidad de embriones, optimizando las tasas de
                            éxito en fecundación in vitro. Los nuevos protocolos de estimulación ovárica personalizados
                            según el perfil genético reducen efectos secundarios y aumentan las probabilidades de embarazo.
                        </p>
                    </div>
                </div>
            </div>

           
            <div className="row mb-5 align-items-center">
                <div className="col-md-6">
                    <img
                        src="https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg"
                        alt="Tecnología en el parto"
                        className="img-fluid rounded-4 shadow-lg"
                        style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                    />
                </div>
                <div className="col-md-6">
                    <div className="p-4">
                        <h2 className="fw-bold mb-3">
                            <i className="fas fa-heartbeat text-primary me-2"></i>
                            Monitoreo Fetal Inteligente
                        </h2>
                        <p className="fs-5 text-secondary mb-4">
                            Dispositivos portátiles y sistemas de monitoreo continuo transforman el cuidado prenatal:
                        </p>
                        <ul className="list-unstyled mt-4">
                            <li className="mb-3">
                                <i className="fas fa-check-circle text-success me-2 fs-5"></i>
                                <strong>Parches inteligentes:</strong> Monitorizan contracciones y frecuencia cardíaca fetal 24/7
                            </li>
                            <li className="mb-3">
                                <i className="fas fa-check-circle text-success me-2 fs-5"></i>
                                <strong>IA predictiva:</strong> Detecta complicaciones antes de que sean críticas
                            </li>
                            <li className="mb-3">
                                <i className="fas fa-check-circle text-success me-2 fs-5"></i>
                                <strong>Realidad aumentada:</strong> Guía a médicos durante cesáreas complejas
                            </li>
                            <li className="mb-3">
                                <i className="fas fa-check-circle text-success me-2 fs-5"></i>
                                <strong>Telemedicina avanzada:</strong> Consultas especializadas en tiempo real
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="row mb-5 align-items-center flex-row-reverse">
                <div className="col-md-6">
                    <img
                        src="https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg"
                        alt="Medicina personalizada"
                        className="img-fluid rounded-4 shadow-lg"
                        style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                    />
                </div>
                <div className="col-md-6">
                    <div className="p-4">
                        <h2 className="fw-bold mb-3">
                            <i className="fas fa-user-md text-primary me-2"></i>
                            Medicina Materno-Fetal Personalizada
                        </h2>
                        <p className="fs-5 text-secondary">
                            El análisis del genoma completo permite anticipar riesgos específicos de cada embarazo.
                            Los tratamientos se adaptan al perfil genético de madre y bebé, previniendo complicaciones
                            como preeclampsia, diabetes gestacional o parto prematuro. La farmacogenómica asegura que
                            cada medicamento sea seguro y efectivo según la genética individual.
                        </p>
                    </div>
                </div>
            </div>

            <div className="row mt-5">
                <div className="col-12">
                    <h2 className="fw-bold text-center mb-4">
                        <i className="fas fa-lightbulb text-primary me-2"></i>
                        Investigaciones Destacadas 2026
                    </h2>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card h-100 shadow border-0">
                        <div className="card-body">
                            <span className="badge bg-primary mb-2">Revolucionario</span>
                            <h5 className="card-title fw-bold">IA Detecta Autismo Prenatal</h5>
                            <p className="card-text text-secondary">
                                Algoritmos de machine learning pueden identificar marcadores tempranos de trastornos
                                del espectro autista mediante análisis de ultrasonidos avanzados en el segundo trimestre.
                            </p>
                            <small className="text-muted">
                                <i className="fas fa-calendar me-1"></i>
                                Publicado: Marzo 2026
                            </small>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card h-100 shadow border-0">
                        <div className="card-body">
                            <span className="badge bg-success mb-2">Innovación</span>
                            <h5 className="card-title fw-bold">Terapia Génica Fetal</h5>
                            <p className="card-text text-secondary">
                                Primeros ensayos clínicos exitosos de edición genética in utero para corregir
                                enfermedades congénitas graves antes del nacimiento.
                            </p>
                            <small className="text-muted">
                                <i className="fas fa-calendar me-1"></i>
                                Publicado: Febrero 2026
                            </small>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card h-100 shadow border-0">
                        <div className="card-body">
                            <span className="badge bg-warning text-dark mb-2">Breakthrough</span>
                            <h5 className="card-title fw-bold">Útero Artificial Funcional</h5>
                            <p className="card-text text-secondary">
                                Desarrollan incubadora avanzada que puede salvar bebés prematuros extremos desde
                                las 22 semanas, revolucionando el cuidado neonatal.
                            </p>
                            <small className="text-muted">
                                <i className="fas fa-calendar me-1"></i>
                                Publicado: Enero 2026
                            </small>
                        </div>
                    </div>
                </div>
            </div>

         

         
            <div className="text-center mt-5">
                <button
                    className="btn btn-primary btn-lg px-5 py-3 rounded-pill"
                    onClick={() => navigate("/contact")}
                >
                    <i className="fas fa-envelope me-2"></i>
                    Contáctanos
                </button>
            </div>
        </div>
    );
};