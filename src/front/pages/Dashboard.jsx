import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import GraficaPeso from "../components/GraficaPeso";
import { GraficaProgreso } from "../components/GraficaProgreso";
// 1. Asegúrate de que el nombre aquí coincida con el que usas abajo
import { FormularioRegistroDiario } from "../components/FormularioRegistroDiario";

export const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const cargarDatos = () => {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        if (savedUser && savedUser.id) {

            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/${savedUser.id}?t=${new Date().getTime()}`)
                .then(res => res.json())
                .then(result => {
                    console.log("Datos recibidos del servidor:", result.registros); // Para debug
                    setData(result);

                    setLoading(false);
                })
                .catch(err => console.error("Error al refrescar:", err));
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    if (loading) return <div className="container mt-5 text-center"><h3>Cargando tu progreso...</h3></div>;
    if (!data || !data.bebe) return <div className="container mt-5">No se encontró información del embarazo.</div>;

    const semana = data.bebe.semana || 1;
    const porcentaje = (semana / 40) * 100;

    return (
        <div className="dashboard-bg p-4">
            <div className="container">
                <div className="row">
                    <div className="col-12 mb-4">
                        {/* 2. Cambié FormularioRegistro por FormularioRegistroDiario para que coincida con tu import */}
                        <FormularioRegistroDiario onRegistroExitoso={cargarDatos} />
                    </div>

                    <div className="col-md-4 mb-4">
                        <div className="dashboard-card p-4 text-center">
                            <h4 className="home-icon-primary">Semana {data.bebe?.semana}</h4>
                            <div style={{ width: "180px", margin: "0 auto" }}>
                                <GraficaProgreso porcentaje={(data.bebe?.semana / 40) * 100} />
                            </div>
                            <h5 className="mt-3">Tu bebé es una <strong>{data.bebe.fruta}</strong></h5>
                            <p className="text-muted">{data.bebe.tamano_cm} cm aproximadamente</p>
                        </div>
                    </div>

                    <div className="col-md-8 mb-4">
                        <div className="dashboard-card p-4">
                            <h4>Seguimiento de Peso</h4>
                            <GraficaPeso
                                key={data.registros?.length || 0}
                                registros={data.registros || []}
                            />
                            <p className="mt-2 small text-muted">Total de registros: {data.total_registros}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};