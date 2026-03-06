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
                            ✨ Comenzar Ahora
                        </Link>
                    </div>
                </div>

               
                <div className="col-md-6">
                    <div className="home-shapes-container">
                        <div className="home-shapes-wrapper">
                            
                           
                            <div className="home-circle home-circle-top">
                                <i className="fas fa-calendar-check fa-4x home-icon-primary"></i>
                                <div className="home-label home-label-primary">
                                    Seguimiento
                                </div>
                            </div>

                            
                            <div className="home-diamond">
                                <div className="home-diamond-content">
                                    <span className="home-emoji">🤰</span>
                                </div>
                                <div className="home-label home-label-secondary">
                                    Tu Embarazo
                                </div>
                            </div>

                            
                            <div className="home-circle home-circle-bottom">
                                <i className="fas fa-lightbulb fa-4x home-icon-warning"></i>
                                <div className="home-label home-label-warning">
                                    Consejos
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
	);
}; 