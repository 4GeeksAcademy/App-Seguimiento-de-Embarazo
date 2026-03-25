import { useNavigate } from "react-router-dom";

export const Noticias = () => {
    const navigate = useNavigate();

    return (
        <div className="container mt-5 mb-5">
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold text-primary mb-3">
                    <i className="fas fa-baby me-3"></i>
                    Noticias sobre el Parto
                </h1>
                <p className="lead text-muted">
                    Información actualizada y confiable para prepararte para el gran día
                </p>
            </div>

          
            <div className="row mb-5 align-items-center">
                <div className="col-md-6">
                    <img 
                        src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800" 
                        alt="Preparación para el parto"
                        className="img-fluid rounded-4 shadow-lg"
                        style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                    />
                </div>
                <div className="col-md-6">
                    <div className="p-4">
                        <h2 className="fw-bold mb-3">
                            <i className="fas fa-clipboard-check text-primary me-2"></i>
                            Preparándote para el Parto
                        </h2>
                        <p className="fs-5 text-secondary">
                            El parto es un momento único e inolvidable. Conocer las diferentes etapas del trabajo 
                            de parto, las señales de que ha comenzado y qué esperar en cada fase te ayudará a 
                            sentirte más tranquila y preparada. Aprende sobre las contracciones, la dilatación, 
                            y cuándo es el momento de ir al hospital.
                        </p>
                    </div>
                </div>
            </div>

            
            <div className="row mb-5 align-items-center flex-row-reverse">
                <div className="col-md-6">
                    <img 
                        src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800" 
                        alt="Tipos de parto"
                        className="img-fluid rounded-4 shadow-lg"
                        style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                    />
                </div>
                <div className="col-md-6">
                    <div className="p-4">
                        <h2 className="fw-bold mb-3">
                            <i className="fas fa-hospital text-primary me-2"></i>
                            Tipos de Parto
                        </h2>
                        <p className="fs-5 text-secondary">
                            Existen diferentes métodos de parto y cada uno tiene sus características. El parto 
                            natural, la cesárea, el parto en agua o el parto con epidural son algunas de las 
                            opciones disponibles. Conoce las ventajas y consideraciones de cada método para 
                            que puedas tomar la mejor decisión junto a tu médico según tus necesidades y 
                            circunstancias particulares.
                        </p>
                    </div>
                </div>
            </div>

            
            <div className="row mb-5 align-items-center">
                <div className="col-md-6">
                    <img 
                        src="https://images.pexels.com/photos/7089629/pexels-photo-7089629.jpeg"
                        alt="Maleta para el hospital"
                        className="img-fluid rounded-4 shadow-lg"
                        style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                    />
                </div>
                <div className="col-md-6">
                    <div className="p-4">
                        <h2 className="fw-bold mb-3">
                            <i className="fas fa-suitcase text-primary me-2"></i>
                            Lista Esencial para el Hospital
                        </h2>
                        <p className="fs-5 text-secondary mb-4">
                            Tener tu maleta preparada con antelación te dará tranquilidad. Aquí está todo 
                            lo que necesitas llevar:
                        </p>
                        <ul className="list-unstyled mt-4">
                            <li className="mb-3">
                                <i className="fas fa-check-circle text-success me-2 fs-5"></i>
                                <strong>Documentación:</strong> DNI, tarjeta sanitaria, plan de parto
                            </li>
                            <li className="mb-3">
                                <i className="fas fa-check-circle text-success me-2 fs-5"></i>
                                <strong>Para ti:</strong> Ropa cómoda, artículos de higiene, bata, zapatillas
                            </li>
                            <li className="mb-3">
                                <i className="fas fa-check-circle text-success me-2 fs-5"></i>
                                <strong>Para el bebé:</strong> Ropita, pañales, mantita, silla de coche
                            </li>
                            <li className="mb-3">
                                <i className="fas fa-check-circle text-success me-2 fs-5"></i>
                                <strong>Extras:</strong> Cámara, cargador de móvil, snacks saludables
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            
            <div className="row mb-5 align-items-center flex-row-reverse">
                <div className="col-md-6">
                    <img 
                        src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800" 
                        alt="Cuidados postparto"
                        className="img-fluid rounded-4 shadow-lg"
                        style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                    />
                </div>
                <div className="col-md-6">
                    <div className="p-4">
                        <h2 className="fw-bold mb-3">
                            <i className="fas fa-heartbeat text-primary me-2"></i>
                            Cuidados Postparto
                        </h2>
                        <p className="fs-5 text-secondary">
                            Los primeros días después del parto son de adaptación tanto para ti como para tu bebé. 
                            La recuperación física y emocional es gradual. Conoce los cuidados necesarios para tu 
                            cuerpo, las señales de alerta a las que debes prestar atención, y cómo establecer la 
                            lactancia materna. Recuerda que pedir ayuda y descansar es fundamental en esta etapa.
                        </p>
                    </div>
                </div>
            </div>

            
            
            <div className="text-center mt-5">
                <button
                    className="btn custom-btn btn-lg px-5 py-3 rounded-pill"
                    onClick={() => navigate("/contact")}
                >
                    <i className="fas fa-bell me-2"></i>
                    Contactanos
                </button>
            </div>
        </div>
    );
};