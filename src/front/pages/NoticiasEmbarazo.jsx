import { useNavigate } from "react-router-dom";

export const NoticiasEmbarazo = () => {
    const navigate = useNavigate();

    return (
        <div className="container mt-4 mb-5">
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold text-primary mb-3">
                    <i className="fas fa-newspaper me-3"></i>
                    Noticias sobre el Embarazo
                </h1>
                <p className="lead text-muted">
                    Información actualizada 2026 para acompañarte en esta hermosa etapa
                </p>
            </div>

           
            <div className="row mb-5 align-items-center">
                <div className="col-md-6">
                    <img 
                        src="https://images.pexels.com/photos/1556652/pexels-photo-1556652.jpeg" 
                        alt="Desarrollo del bebé"
                        className="img-fluid rounded-4 shadow-lg"
                        style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                    />
                </div>
                <div className="col-md-6">
                    <div className="p-4">
                        <h2 className="fw-bold mb-3">
                            <i className="fas fa-calendar-alt text-primary me-2"></i>
                            Desarrollo Trimestre a Trimestre
                        </h2>
                        <p className="fs-5 text-secondary">
                            Cada trimestre trae cambios únicos para ti y tu bebé. En el primer trimestre se 
                            forman los órganos vitales, en el segundo el bebé comienza a moverse y en el 
                            tercero se prepara para nacer. Conoce semana a semana cómo crece tu bebé, qué 
                            síntomas puedes experimentar y qué cuidados necesitas en cada etapa de tu embarazo.
                        </p>
                    </div>
                </div>
            </div>

           
            <div className="row mb-5 align-items-center flex-row-reverse">
                <div className="col-md-6">
                    <img 
                        src="https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg" 
                        alt="Nutrición en el embarazo"
                        className="img-fluid rounded-4 shadow-lg"
                        style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                    />
                </div>
                <div className="col-md-6">
                    <div className="p-4">
                        <h2 className="fw-bold mb-3">
                            <i className="fas fa-apple-alt text-primary me-2"></i>
                            Nutrición Durante el Embarazo
                        </h2>
                        <p className="fs-5 text-secondary">
                            Una alimentación equilibrada es fundamental para el desarrollo de tu bebé y tu 
                            bienestar. Aprende qué alimentos son esenciales, cuáles evitar, la importancia 
                            del ácido fólico, hierro y calcio. Estudios de 2026 revelan nuevas recomendaciones 
                            sobre suplementos vitamínicos y dietas específicas según el trimestre de embarazo.
                        </p>
                    </div>
                </div>
            </div>

           
            <div className="row mb-5 align-items-center">
                <div className="col-md-6">
                    <img 
                        src="https://images.pexels.com/photos/3984340/pexels-photo-3984340.jpeg"
                        alt="Ejercicio durante el embarazo"
                        className="img-fluid rounded-4 shadow-lg"
                        style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                    />
                </div>
                <div className="col-md-6">
                    <div className="p-4">
                        <h2 className="fw-bold mb-3">
                            <i className="fas fa-dumbbell text-primary me-2"></i>
                            Ejercicio y Bienestar
                        </h2>
                        <p className="fs-5 text-secondary mb-4">
                            Mantenerte activa durante el embarazo tiene múltiples beneficios. Conoce las 
                            actividades recomendadas:
                        </p>
                        <ul className="list-unstyled mt-4">
                            <li className="mb-3">
                                <i className="fas fa-check-circle text-success me-2 fs-5"></i>
                                <strong>Yoga prenatal:</strong> Mejora flexibilidad y reduce el estrés
                            </li>
                            <li className="mb-3">
                                <i className="fas fa-check-circle text-success me-2 fs-5"></i>
                                <strong>Natación:</strong> Ejercicio de bajo impacto ideal para embarazadas
                            </li>
                            <li className="mb-3">
                                <i className="fas fa-check-circle text-success me-2 fs-5"></i>
                                <strong>Caminatas:</strong> Fortalece el sistema cardiovascular
                            </li>
                            <li className="mb-3">
                                <i className="fas fa-check-circle text-success me-2 fs-5"></i>
                                <strong>Pilates:</strong> Fortalece el suelo pélvico y abdomen
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

           
            <div className="row mb-5 align-items-center flex-row-reverse">
                <div className="col-md-6">
                    <img 
                        src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg" 
                        alt="Controles médicos"
                        className="img-fluid rounded-4 shadow-lg"
                        style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                    />
                </div>
                <div className="col-md-6">
                    <div className="p-4">
                        <h2 className="fw-bold mb-3">
                            <i className="fas fa-stethoscope text-primary me-2"></i>
                            Controles Médicos Esenciales
                        </h2>
                        <p className="fs-5 text-secondary">
                            El seguimiento médico regular es crucial para un embarazo saludable. Las ecografías 
                            permiten monitorear el desarrollo del bebé, los análisis de sangre detectan posibles 
                            complicaciones y las consultas prenatales aseguran que todo marche bien. En 2026, 
                            nuevas tecnologías permiten diagnósticos más precisos y no invasivos para la 
                            tranquilidad de las futuras mamás.
                        </p>
                    </div>
                </div>
            </div>

          
            <div className="row mt-5">
                <div className="col-12">
                    <h2 className="fw-bold text-center mb-4">
                        <i className="fas fa-star text-primary me-2"></i>
                        Artículos Destacados 2026
                    </h2>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card h-100 shadow border-0">
                        <div className="card-body">
                            <span className="badge bg-primary mb-2">Nuevo</span>
                            <h5 className="card-title fw-bold">Avances en Ecografías 4D</h5>
                            <p className="card-text text-secondary">
                                La tecnología 2026 permite ver a tu bebé en tiempo real con imágenes 
                                de alta definición. Conoce los beneficios de esta nueva generación de ecografías.
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
                            <span className="badge bg-success mb-2">Popular</span>
                            <h5 className="card-title fw-bold">Salud Mental en el Embarazo</h5>
                            <p className="card-text text-secondary">
                                Nuevos estudios sobre la importancia del bienestar emocional durante el embarazo. 
                                Técnicas de mindfulness y recursos de apoyo psicológico disponibles.
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
                            <span className="badge bg-warning text-dark mb-2">Destacado</span>
                            <h5 className="card-title fw-bold">Superalimentos para Embarazadas</h5>
                            <p className="card-text text-secondary">
                                Lista actualizada de alimentos ricos en nutrientes esenciales. Recetas fáciles 
                                y deliciosas para cada trimestre del embarazo.
                            </p>
                            <small className="text-muted">
                                <i className="fas fa-calendar me-1"></i>
                                Publicado: Marzo 2026
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