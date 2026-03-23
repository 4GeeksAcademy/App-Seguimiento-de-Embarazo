import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";
import "../styles/home.css";

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
        <div className="home-hero">
            <div className="container px-3 py-5">
                <div className="row align-items-center home-min-vh">

                   
                    <div className="col-12 col-lg-6 mb-4 mb-lg-0 text-center text-lg-start">

                        <h1 className="home-title">
                            Tu Embarazo,<br />
                            <span className="home-title-gradient">
                                Organizado
                            </span> y Tranquilo
                        </h1>

                        <p className="home-description">
                            Durante el embarazo, las futuras mamás enfrentan un mar
                            de información dispersa: citas médicas por recordar, síntomas que
                            rastrear, cambios en el cuerpo difíciles de documentar. Entre
                            papeles médicos y consejos contradictorios, es fácil sentirse 
                            abrumada justo cuando más necesitas tranquilidad.
                        </p>

                        <div className="d-grid d-sm-flex gap-2 justify-content-center justify-content-lg-start">
                            <Link to="/register" className="home-btn-primary">
                                Comenzar Ahora <i className="fas fa-arrow-right ms-2"></i>
                            </Link>
                           
                        </div>
                    </div>

                   
                    <div className="col-12 col-lg-6 mb-4 mb-lg-0">
                       
                        <div className="d-lg-none text-center py-4">
                            <div className="home-mobile-circle">
                                <span className="home-mobile-emoji">🍼</span>
                                <h5 className="home-mobile-title">
                                    Tu Embarazo
                                </h5>
                            </div>

                            <div className="row g-2 mt-3 justify-content-center">
                                <div className="col-4">
                                    <div className="home-mini-card home-card-calendar">
                                        <i className="fas fa-calendar-alt home-card-icon"></i>
                                        <div className="home-card-label">Seguimiento</div>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="home-mini-card home-card-tips">
                                        <i className="fas fa-lightbulb home-card-icon"></i>
                                        <div className="home-card-label">Consejos</div>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="home-mini-card home-card-alerts">
                                        <i className="fas fa-bell home-card-icon"></i>
                                        <div className="home-card-label">Recordatorios</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                       
                        <div className="d-none d-lg-block home-desktop-circles">

                           
                            <div className="home-circle-center">
                                <div className="home-main-circle">
                                    <div className="text-center">
                                        <span className="home-main-emoji">🍼</span>
                                        <h4 className="home-main-title">
                                            Tu Embarazo
                                        </h4>
                                    </div>
                                </div>
                            </div>

                          
                            <div className="home-circle-tl">
                                <div className="home-circle home-circle-calendar">
                                    <div className="text-center text-white">
                                        <i className="fas fa-calendar-alt fa-3x mb-2"></i>
                                        <div className="fw-bold small">Seguimiento</div>
                                    </div>
                                </div>
                            </div>

                           
                            <div className="home-circle-tr">
                                <div className="home-circle home-circle-health">
                                    <div className="text-center text-white">
                                        <i className="fas fa-heartbeat fa-2x mb-2"></i>
                                        <div className="fw-bold small">Salud</div>
                                    </div>
                                </div>
                            </div>

                           
                            <div className="home-circle-bl">
                                <div className="home-circle home-circle-alerts">
                                    <div className="text-center text-white">
                                        <i className="fas fa-bell fa-2x mb-2"></i>
                                        <div className="fw-bold small">Recordatorios</div>
                                    </div>
                                </div>
                            </div>

                            <div className="home-circle-br">
                                <div className="home-circle home-circle-tips">
                                    <div className="text-center text-white">
                                        <i className="fas fa-lightbulb fa-2x mb-2"></i>
                                        <div className="fw-bold small">Consejos</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}; 