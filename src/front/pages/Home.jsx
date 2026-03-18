import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";

export const Home = () => {

    const { store, dispatch } = useGlobalReducer()

    const loadMessage = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL

            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

            const response = await fetch(backendUrl + "/api/hello")
            const data = await response.json()

            if (response.ok) dispatch({ type: "set_hello", payload: data.message })

            return data

        } catch (error) {
            if (error.message) throw new Error(
                `Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
            );
        }

    }

    useEffect(() => {
        loadMessage()
    }, [])

    return (
        <div className="container mt-5 mb-5">
            <div className="home-container">

                <div className="col-md-6 home-left-column">
                    <div>
                        <h1 className="home-title">
                            Tu Embarazo, Organizado y Tranquilo
                        </h1>

                        <p className="home-description">
                            Durante el embarazo, las futuras mamás enfrentan un mar de información dispersa:
                            citas médicas por recordar, síntomas que rastrear, cambios en el cuerpo difíciles
                            de documentar. Entre papeles médicos y consejos contradictorios, es fácil sentirse
                            abrumada justo cuando más necesitas tranquilidad.
                        </p>

                        <div className="home-mission-box">
                            <p className="text-white mb-0">
                                💜 <strong>Nuestra misión:</strong> Creamos un espacio digital donde todo lo importante
                                está en un solo lugar. Desde calcular tu fecha de parto hasta registrar cómo te
                                sientes cada día.
                            </p>
                        </div>
                    </div>

                    <div>
                        <Link to="/register" className="home-cta-button">
                             ✨Comenzar Ahora
                        </Link>
                    </div>
                </div>


                <div className="col-md-6">
                    <div className="row g-4">
                       
                        <div className="col-12">
                            <div className="card border-0 shadow-lg overflow-hidden">
                                <div className="card-body p-5 text-center position-relative"
                                    style={{
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        minHeight: "250px"
                                    }}>
                                    <div className="position-relative" style={{ zIndex: 2 }}>
                                        <h2 className="text-white fw-bold mb-3">Tu Embarazo</h2>
                                        <p className="text-white opacity-35 mb-0 fs-5">
                                            Acompañamiento profesional semana a semana
                                        </p>
                                    </div>
                                  
                                    <div className="position-absolute opacity-10"
                                        style={{
                                            top: "-20px",
                                            right: "-20px",
                                            fontSize: "15rem",
                                            zIndex: 1
                                        }}>
                                        🍼
                                    </div>
                                </div>
                            </div>
                        </div>
                                        
                       
                        <div className="col-4">
                            <div className="card border-0 shadow h-100 hover-lift"
                                style={{ transition: "all 0.3s ease" }}>
                                <div className="card-body p-4 text-center">
                                    <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "70px",
                                            height: "70px",
                                            background: "linear-gradient(135deg, #ffd1dc 0%, #ffb3d9 100%)"
                                        }}>
                                        <i className="fas fa-calendar-check fa-2x text-white"></i>
                                    </div>
                                    <h6 className="fw-bold mb-1">Seguimiento</h6>
                                    <small className="text-muted">Día a día</small>
                                </div>
                            </div>
                        </div>

                        <div className="col-4">
                            <div className="card border-0 shadow h-100 hover-lift"
                                style={{ transition: "all 0.3s ease" }}>
                                <div className="card-body p-4 text-center">
                                    <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "70px",
                                            height: "70px",
                                            background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                                        }}>
                                        <i className="fas fa-lightbulb fa-2x text-white"></i>
                                    </div>
                                    <h6 className="fw-bold mb-1">Consejos</h6>
                                    <small className="text-muted">Expertos</small>
                                </div>
                            </div>
                        </div>

                        <div className="col-4">
                            <div className="card border-0 shadow h-100 hover-lift"
                                style={{ transition: "all 0.3s ease" }}>
                                <div className="card-body p-4 text-center">
                                    <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "70px",
                                            height: "70px",
                                            background: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
                                        }}>
                                        <i className="fas fa-bell fa-2x text-white"></i>
                                    </div>
                                    <h6 className="fw-bold mb-1">Alertas</h6>
                                    <small className="text-muted">Importantes</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .hover-lift:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15) !important;}`}
                 </style>

            </div>
        </div>
    );
}; 