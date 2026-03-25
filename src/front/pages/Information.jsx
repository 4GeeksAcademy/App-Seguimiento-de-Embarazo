import { useNavigate } from "react-router-dom";

export const Information = () => {
    const navigate = useNavigate();

    return (
        <div className="container mt-5 mb-5">
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold text-primary mb-3">
                    <i className="fas fa-heart me-3"></i>
                    Conocenos mejor!
                </h1>
                <p className="lead text-muted">
                    Todo lo que necesitas saber para vivir esta hermosa etapa
                </p>
            </div>
            <div className="row mb-5 align-items-center">
                <div className="col-md-6">
                    <img src="https://media.istockphoto.com/id/472718966/es/foto/joven-y-exitosa.jpg?s=612x612&w=0&k=20&c=yGS_3juH0W2a4H-yaHvA1w2a-SE-RgJJVV1N_xsAFX8="
                        alt="Nosotros"
                        className="img-fluid rounded-4 shadow-lg"
                        style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}/>
                </div>
                <div className="col-md-6">
                    <div className="p-4">
                        <h2 className="fw-bold mb-3">
                            <i className="fas fa-users text-primary me-2"></i>
                            Quiénes somos
                        </h2>
                        <p className="fs-5 text-secondary">
                            Somos un grupo de 3 desarrolladores apasionados por la tecnología y la salud materna.
                            Nuestro objetivo es facilitar el seguimiento del embarazo a través de herramientas
                            digitales intuitivas y accesibles, brindando información confiable y apoyo continuo
                            durante esta hermosa etapa.
                        </p>
                    </div>
                </div>
            </div>
            <div className="row mb-5 align-items-center flex-row-reverse">
                <div className="col-md-6">
                    <img src="https://media.post.rvohealth.io/wp-content/uploads/2024/04/pregnant-woman-smiling-belly-outdoors-back-pain-732x549-thumbnail.jpg"
                        alt="Ecografía de bebé"
                        className="img-fluid rounded-4 shadow-lg"
                        style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}/>
                </div>
                <div className="col-md-6">
                    <div className="p-4">
                        <h2 className="fw-bold mb-3">
                            <i className="fas fa-mobile-alt text-primary me-2"></i>
                            Nuestra aplicación
                        </h2>
                        <p className="fs-5 text-secondary">
                            Nuestra app está diseñada para acompañar a las futuras mamás en cada etapa del embarazo.
                            Ofrecemos seguimiento personalizado del desarrollo del bebé, recordatorios de citas médicas,
                            consejos de salud basados en la semana de gestación, y una comunidad de apoyo donde
                            compartir experiencias. Todo pensado para que la embarazada se sienta informada,
                            tranquila y acompañada durante estos 9 meses tan especiales.
                        </p>
                    </div>
                </div>
            </div>
            <div className="row mb-5 align-items-center">
                <div className="col-md-6">
                    <img src="https://static.vecteezy.com/system/resources/thumbnails/048/636/720/small/baby-s-milestone-first-steps-walking-with-excitement-and-newfound-confidence-free-photo.jpg"
                        alt="Preparativos para el bebé"
                        className="img-fluid rounded-4 shadow-lg"
                        style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}/>
                </div>
                <div className="col-md-6">
                    <div className="p-4">
                        <h2 className="fw-bold mb-3">
                            <i className="fas fa-star text-primary me-2"></i>Beneficios para ti</h2>
                        <p className="fs-5 text-secondary">Con nuestra aplicación podrás:</p>
                        <ul className="list-unstyled mt-4">
                            <li className="mb-3">
                                <i className="fas fa-check-circle text-success me-2 fs-5"></i>
                                <strong>Seguimiento semana a semana:</strong> Conoce el desarrollo de tu bebé en tiempo real
                            </li>
                            <li className="mb-3">
                                <i className="fas fa-check-circle text-success me-2 fs-5"></i>
                                <strong>Recordatorios inteligentes:</strong> No olvides ninguna cita médica ni medicación
                            </li>
                            <li className="mb-3">
                                <i className="fas fa-check-circle text-success me-2 fs-5"></i>
                                <strong>Contenido personalizado:</strong> Artículos y consejos según tu etapa gestacional
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="text-center mt-5">
                <button
                    className="btn custom-btn btn-lg px-5 py-3 rounded-pill"
                    onClick={() => navigate("/contact")}>
                    <i className="fas fa-envelope me-2"></i>
                    ¿Tienes dudas? Contáctanos
                </button>
            </div>
        </div>
    );
};