import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const RegistroEmbarazo = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        ultima_menstruacion: "",
        peso_inicial: "",
        longitud_ciclo: "28"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/registroEmbarazo`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...formData,
                        peso_inicial: parseFloat(formData.peso_inicial),
                        longitud_ciclo: parseInt(formData.longitud_ciclo)
                    }),
                }
            );

            if (!response.ok) {
                const text = await response.text();
                console.error("Error del backend:", text);
                return;
            }

            const data = await response.json();
            console.log("Respuesta del backend:", data);


            navigate("/panelPersonal");
        } catch (error) {
            console.error("Error al hacer fetch:", error);
        }
    };

    return (
        <div
            className="container-fluid min-vh-100 d-flex align-items-center py-5"
            style={{
                background: "linear-gradient(135deg, #fdfbfb 0%, #f5f0ff 50%, #ffeef8 100%)"
            }}
        >
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">


                        <div className="text-center mb-2">
                            <div
                                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    background: "linear-gradient(135deg, #ffd1dc 0%, #ffb3d9 100%)"
                                }}
                            >
                                <span style={{ fontSize: "4rem" }}>🤰</span>
                            </div>
                            <h2 className="fw-bold mb-2" style={{ color: "#6a4c93" }}>
                                ¡Comencemos tu Seguimiento!
                            </h2>
                            <p className="text-muted">
                                Completa estos datos para calcular tu fecha probable de parto
                            </p>
                        </div>




                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold" style={{ color: "#6a4c93" }}>
                                            <i className="fas fa-user me-2"></i>
                                            Nombre
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            className="form-control form-control-lg"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            placeholder="Ingresa tu nombre"
                                            required
                                        />
                                        <small className="form-text text-muted fst-italic">
                                            Tu nombre completo
                                        </small>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold" style={{ color: "#6a4c93" }}>
                                            <i className="fas fa-calendar-alt me-2"></i>
                                            Última Fecha de Menstruación
                                        </label>
                                        <input
                                            type="date"
                                            name="ultima_menstruacion"
                                            className="form-control form-control-lg"
                                            value={formData.ultima_menstruacion}
                                            onChange={handleChange}
                                            max={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                        <small className="form-text text-muted fst-italic">
                                            Primer día de tu último periodo menstrual
                                        </small>
                                    </div>


                                    <div className="mb-4">
                                        <label className="form-label fw-bold" style={{ color: "#6a4c93" }}>
                                            <i className="fas fa-weight me-2"></i>
                                            Peso al Inicio del Embarazo
                                        </label>
                                        <div className="input-group input-group-lg">
                                            <input
                                                type="number"
                                                name="peso_inicial"
                                                className="form-control"
                                                value={formData.peso_inicial}
                                                onChange={handleChange}
                                                placeholder="65"
                                                min="30"
                                                max="200"
                                                step="0.1"
                                                required
                                            />
                                            <span className="input-group-text fw-bold bg-primary text-white">
                                                kg
                                            </span>
                                        </div>
                                        <small className="form-text text-muted fst-italic">
                                            Tu peso antes del embarazo
                                        </small>
                                    </div>


                                    <div className="mb-4">
                                        <label className="form-label fw-bold" style={{ color: "#6a4c93" }}>
                                            <i className="fas fa-sync-alt me-2"></i>
                                            Longitud de tu Ciclo Menstrual
                                        </label>
                                        <div
                                            className="card border-0"
                                            style={{
                                                background: "linear-gradient(135deg, #f8f5ff 0%, #fff5f8 100%)"
                                            }}
                                        >
                                            <div className="card-body p-4">
                                                <input
                                                    type="range"
                                                    name="longitud_ciclo"
                                                    className="form-range"
                                                    value={formData.longitud_ciclo}
                                                    onChange={handleChange}
                                                    min="21"
                                                    max="35"
                                                />
                                                <div className="text-center mt-3">
                                                    <h3 className="fw-bold mb-0" style={{ color: "#6a4c93" }}>
                                                        {formData.longitud_ciclo} días
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                        <small className="form-text text-muted fst-italic">
                                            Tiempo promedio entre periodos
                                        </small>
                                    </div>


                                    <div className="d-grid gap-2 d-md-flex justify-content-md-between mt-4">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-lg px-5"
                                            onClick={() => navigate(-1)}
                                        >
                                            Volver
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-lg px-5"
                                            style={{
                                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                border: "none",
                                                color: "white"
                                            }}
                                        >
                                            <i className="fas fa-heart me-2"></i>
                                            Guardar y Continuar
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};