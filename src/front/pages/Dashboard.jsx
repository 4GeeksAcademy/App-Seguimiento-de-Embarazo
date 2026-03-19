import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, Title, Tooltip, Legend, Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

// Definimos el estado inicial fuera para poder reutilizarlo en la limpieza
const estadoInicialRegistro = {
    peso: "",
    estado_animo: "Feliz",
    horas_sueno: 8,
    ejercicio_minutos: 0,
    vasos_agua: 0,
    patadas_bebe: 0,
    notas: "",
    sintomas: {
        nauseas: false, fatiga: false, dolor_espalda: false, hinchazon: false,
        acidez: false, insomnio: false, calambres: false, antojos: false
    },
};

export const Dashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mostrarIdeal, setMostrarIdeal] = useState(false);
    const [registro, setRegistro] = useState(estadoInicialRegistro);

    const customStyles = `
        .dashboard-container { background-color: #f4f7fa; font-family: 'Quicksand', sans-serif; }
        .glass-card { background: #ffffff; border-radius: 30px; border: none; box-shadow: 12px 12px 24px #d1d9e6, -12px -12px 24px #ffffff; }
        .motivational-hero { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: white; border-radius: 35px; padding: 3.5rem 2rem; text-align: center; box-shadow: 0 20px 40px rgba(99, 102, 241, 0.25); margin-bottom: 3rem; }
        .fruit-icon { font-size: 5rem; display: block; margin-bottom: 10px; }
        .progress-wrapper { position: relative; height: 20px; background: #edf2f7; border-radius: 50px; box-shadow: inset 2px 2px 5px #d1d9e6; margin-top: 35px; }
        .progress-fill { height: 100%; border-radius: 50px; background: linear-gradient(90deg, #6366f1, #a855f7); transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
        .progress-indicator { position: absolute; right: 0; top: -35px; background: #6366f1; color: white; padding: 3px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 800; transform: translateX(50%); box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3); }
        .premium-input { border-radius: 15px; background: #f0f4f8; border: none; box-shadow: inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff; padding: 12px 20px; font-weight: 600; }
        .btn-round { width: 45px; height: 45px; border-radius: 50%; background: #f0f4f8; box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff; border: none; color: #6366f1; transition: 0.3s; }
        .btn-round:active { box-shadow: inset 3px 3px 6px #d1d9e6; transform: scale(0.95); }
        .btn-sintoma { border: none; border-radius: 15px; padding: 10px 20px; font-size: 0.9rem; font-weight: 600; transition: all 0.3s; background: #f0f4f8; box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff; color: #64748b; }
        .btn-sintoma.active { background: #6366f1; color: white; box-shadow: inset 3px 3px 6px rgba(0,0,0,0.2); }
        .hover-scale:hover { transform: scale(1.02); }
    `;

    const fetchDashboardData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
            });
            if (response.status === 401) navigate("/login");
            if (response.ok) {
                const result = await response.json();
                result.embarazo_configurado === false ? navigate("/nuevo-embarazo") : setData(result);
            }
        } catch (error) { console.error("Error fetching dashboard:", error); } finally { setLoading(false); }
    };

    useEffect(() => { fetchDashboardData(); }, []);

    const handleGuardarDia = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/registro-diario`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
                body: JSON.stringify(registro),
            });
            if (response.ok) {
                await fetchDashboardData();
                setRegistro(estadoInicialRegistro); // Limpiamos todo el form
                alert("¡Registro guardado con éxito! ✨");
            }
        } catch (error) { alert("Error al conectar con el servidor"); }
    };

    const descargarPDF = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/exportar-pdf`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Seguimiento_Medico.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) { alert("No se pudo generar el PDF"); }
    };

    if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }}></div></div>;
    if (!data) return <div className="p-5 text-center">No se pudo cargar la información.</div>;

    const chartDatasets = [
        {
            label: "Peso Actual",
            data: data.chart_config?.data || [],
            borderColor: "#6366f1", backgroundColor: "rgba(99, 102, 241, 0.05)",
            fill: true, tension: 0.4, borderWidth: 4, pointRadius: 5, pointBackgroundColor: "#fff"
        },
        ...(mostrarIdeal ? [{
            label: "Peso Recomendado",
            data: data.chart_config?.ideal_data || [],
            borderColor: "#10b981", borderDash: [6, 4], fill: false, tension: 0.4, pointRadius: 0
        }] : [])
    ];

    return (
        <div className="container-fluid min-vh-100 py-5 dashboard-container">
            <style>{customStyles}</style>
            <div className="container" style={{ maxWidth: "1100px" }}>

                <div className="motivational-hero">
                    <h1 className="display-4 fw-bold mb-3">¡Hola, mamá!</h1>
                    <p className="fs-3 fw-light opacity-90 italic">"{data.mensaje}"</p>
                </div>

                <div className="glass-card p-5 mb-5 text-center">
                    <div className="row justify-content-center">
                        <div className="col-md-10">
                            {/* ICONO DE FRUTA RESTAURADO */}
                            <span className="fruit-icon">{data.bebe?.icono}</span>
                            <span className="text-primary fw-bold text-uppercase ls-2 small d-block mb-2">Estado de tu embarazo</span>
                            <h2 className="display-5 fw-bold text-dark mb-3">Semana {data.semana_actual}</h2>
                            <div className="d-flex justify-content-center gap-4 mb-2">
                                <span className="fs-5 text-muted"><i className="fas fa-expand-arrows-alt me-2"></i>Tamaño: <strong>{data.bebe?.tamanio}</strong></span>
                                <span className="fs-5 text-muted"><i className="fas fa-ruler-vertical me-2"></i>Aprox: <strong>{data.bebe?.tamano_cm || '0.2'} cm</strong></span>
                            </div>

                            <div className="progress-wrapper">
                                <div className="progress-fill" style={{ width: `${data.progreso}%` }}>
                                    <div className="progress-indicator">{data.progreso}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="glass-card p-4 mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                                <h6 className="fw-bold m-0 text-muted uppercase"><i className="fas fa-chart-area me-2"></i>Evolución de Peso</h6>
                                <button className={`btn btn-sm rounded-pill px-4 fw-bold transition-all ${mostrarIdeal ? 'btn-success text-white' : 'btn-outline-secondary'}`} onClick={() => setMostrarIdeal(!mostrarIdeal)}>
                                    <i className={`fas ${mostrarIdeal ? 'fa-check' : 'fa-plus'} me-2`}></i>
                                    {mostrarIdeal ? 'Mostrando Ideal' : 'Ver Peso Ideal'}
                                </button>
                            </div>
                            <div style={{ height: "300px" }}>
                                <Line key={mostrarIdeal ? "ideal" : "actual"} data={{ labels: data.chart_config?.labels || [], datasets: chartDatasets }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                            </div>
                        </div>

                        <div className="glass-card p-5">
                            <h4 className="fw-bold mb-5 text-dark border-start border-primary border-5 ps-3">Registro Diario</h4>
                            <form onSubmit={handleGuardarDia}>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <label className="small fw-bold text-muted mb-2 uppercase ls-1">Peso actual (kg)</label>
                                        <input type="number" step="0.1" className="form-control premium-input" value={registro.peso} onChange={(e) => setRegistro({ ...registro, peso: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small fw-bold text-muted mb-2 uppercase ls-1">Estado de Ánimo</label>
                                        <select className="form-select premium-input" value={registro.estado_animo} onChange={(e) => setRegistro({ ...registro, estado_animo: e.target.value })}>
                                            <option value="Feliz">Muy Feliz</option>
                                            <option value="Tranquila">Tranquila</option>
                                            <option value="Cansada">Cansada</option>
                                            <option value="Sensible">Sensible</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="p-3 bg-light rounded-4 text-center shadow-sm">
                                            <label className="small fw-bold text-muted d-block mb-3 uppercase ls-1">Hidratación</label>
                                            <div className="d-flex justify-content-center align-items-center gap-4">
                                                <button type="button" className="btn-round" onClick={() => setRegistro({ ...registro, vasos_agua: Math.max(0, registro.vasos_agua - 1) })}><i className="fas fa-minus"></i></button>
                                                <span className="h4 m-0 fw-bold px-2"><i className="fas fa-tint text-info me-2"></i>{registro.vasos_agua}</span>
                                                <button type="button" className="btn-round" onClick={() => setRegistro({ ...registro, vasos_agua: registro.vasos_agua + 1 })}><i className="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="p-3 bg-light rounded-4 text-center shadow-sm">
                                            <label className="small fw-bold text-muted d-block mb-3 uppercase ls-1">Movimientos</label>
                                            <div className="d-flex justify-content-center align-items-center gap-4">
                                                <button type="button" className="btn-round" onClick={() => setRegistro({ ...registro, patadas_bebe: Math.max(0, registro.patadas_bebe - 1) })}><i className="fas fa-minus"></i></button>
                                                <span className="h4 m-0 fw-bold px-2"><i className="fas fa-shoe-prints text-warning me-2"></i>{registro.patadas_bebe}</span>
                                                <button type="button" className="btn-round" onClick={() => setRegistro({ ...registro, patadas_bebe: registro.patadas_bebe + 1 })}><i className="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6 pt-3">
                                        <label className="small fw-bold text-muted mb-3 uppercase ls-1">Sueño: {registro.horas_sueno} horas</label>
                                        <input type="range" className="form-range" min="0" max="14" step="0.5" value={registro.horas_sueno} onChange={(e) => setRegistro({ ...registro, horas_sueno: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small fw-bold text-muted mb-2 uppercase ls-1">Ejercicio (Minutos)</label>
                                        <input type="number" className="form-control premium-input" value={registro.ejercicio_minutos} onChange={(e) => setRegistro({ ...registro, ejercicio_minutos: e.target.value })} />
                                    </div>

                                    <div className="col-12">
                                        <label className="small fw-bold text-muted mb-3 d-block uppercase ls-1">Síntomas detectados</label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {Object.keys(registro.sintomas).map((s) => (
                                                <button key={s} type="button" className={`btn-sintoma ${registro.sintomas[s] ? 'active' : ''}`} onClick={() => setRegistro({ ...registro, sintomas: { ...registro.sintomas, [s]: !registro.sintomas[s] } })}>
                                                    <i className={`fas fa-check me-2 ${registro.sintomas[s] ? '' : 'd-none'}`}></i>
                                                    {s.replace("_", " ")}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <textarea className="form-control premium-input" rows="3" placeholder="Añade notas sobre cómo te sientes hoy..." value={registro.notas} onChange={(e) => setRegistro({ ...registro, notas: e.target.value })} />
                                    </div>

                                    <div className="col-12 text-end pt-4">
                                        <button type="submit" className="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow-lg border-0 transition-all hover-scale">
                                            <i className="fas fa-heart me-2"></i> Guardar Registro Diario
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="glass-card p-5 text-center mb-4">
                            <h6 className="text-muted small fw-bold uppercase ls-2 mb-3">Faltan para el parto</h6>
                            <div className="display-2 fw-bold text-dark">{data.dias_restantes}</div>
                            <span className="badge bg-light text-primary rounded-pill px-3 py-2 fw-bold">DÍAS</span>
                            <hr className="my-4 opacity-10" />
                            <div className="small fw-bold text-muted uppercase">Fecha Estimada (FPP)</div>
                            <div className="text-dark fw-bold">{data.salud?.fpp}</div>
                        </div>

                        <div className="glass-card p-4 mb-4" style={{ borderLeft: '6px solid #6366f1' }}>
                            <div className="d-flex align-items-center mb-3">
                                <i className="fas fa-lightbulb text-warning fs-4 me-3"></i>
                                <h6 className="fw-bold m-0 uppercase text-muted">Consejo del día</h6>
                            </div>
                            <p className="text-dark italic small mb-0 lh-lg">"{data.salud?.consejo}"</p>
                        </div>

                        <button onClick={descargarPDF} className="btn btn-white glass-card w-100 py-3 mb-4 fw-bold text-danger border-0 hover-scale transition-all">
                            <i className="fas fa-file-medical me-2"></i> Descargar Historial Médico
                        </button>

                        <div className="glass-card p-4">
                            <h6 className="fw-bold text-muted small text-center mb-4 uppercase">Frecuencia Síntomas</h6>
                            <div style={{ height: "180px" }}>
                                <Bar key={JSON.stringify(data.frecuencia_sintomas)} data={{
                                    labels: ["Náu", "Fat", "Esp", "Hin", "Aci"],
                                    datasets: [{ data: data.frecuencia_sintomas ? Object.values(data.frecuencia_sintomas) : [0, 0, 0, 0, 0], backgroundColor: "rgba(99, 102, 241, 0.7)", borderRadius: 8 }]
                                }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};