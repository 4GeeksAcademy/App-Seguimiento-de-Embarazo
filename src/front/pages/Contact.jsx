import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendContactMessage } from "../services/backendServices.js";

export const Contact = () => {
    const navigate = useNavigate();
    const [contactData, setContactData] = useState({
        email: "",
        description: ""
    });

    const handleChange = (e) => {
        setContactData({
            ...contactData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await sendContactMessage(contactData, navigate);
        
        if (success) {
            setContactData({
                email: "",
                description: ""
            });
        }
    };

    return (
        <div className="container mt-2 mb-2">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <i className="fas fa-envelope fa-4x text-primary mb-3"></i>
                                <h2 className="fw-bold">Contacto</h2>
                                <p className="text-muted">
                                    ¿Tienes alguna pregunta o problema? Envianos un mensaje y te responderemos lo antes posible.
                                </p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="email" className="form-label fw-bold">
                                        <i className="fas fa-at me-2 text-primary"></i>
                                        Correo electrónico
                                    </label>
                                    <input type="email"
                                        className="form-control form-control-lg"
                                        id="email"
                                        name="email"
                                        placeholder="ejemplo@email.com"
                                        value={contactData.email}
                                        onChange={handleChange}
                                        required/>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="description" className="form-label fw-bold">
                                        <i className="fas fa-comment me-2 text-primary"></i>
                                        Descripción del problema
                                    </label>
                                    <textarea className="form-control form-control-lg"
                                        id="description"
                                        name="description"
                                        rows="5"
                                        placeholder="Describe detalladamente tu consulta o problema..."
                                        value={contactData.description}
                                        onChange={handleChange}
                                        required>
                                    </textarea>
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary btn-lg">
                                        <i className="fas fa-paper-plane me-2"></i>
                                        Enviar mensaje
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary"
                                        onClick={() => navigate("/")}>
                                        <i className="fas fa-times me-2"></i>
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};