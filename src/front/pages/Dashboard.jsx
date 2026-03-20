import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, Title, Tooltip, Legend, Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const estadoInicialRegistro = {
    peso: "",
    estado_animo: "Feliz",
    horas_sueno: 8,
    ejercicio_minutos: "",
    vasos_agua: 0,
    patadas_bebe: 0,
    notas: "",
    sintomas: {
        nauseas: false, fatiga: false, dolor_espalda: false, hinchazon: false,
        acidez: false, insomnio: false, calambres: false, antojos: false
    },
};

const coloresSintomas = [
    'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)',
    'rgba(199, 199, 199, 0.7)', 'rgba(83, 102, 255, 0.7)'
];

export const Dashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mostrarIdeal, setMostrarIdeal] = useState(false);
    const [registro, setRegistro] = useState(estadoInicialRegistro);

    const customStyles = `
        .dashboard-container { background-color: #f4f7fa; font-family: 'Quicksand', sans-serif; }
        .glass-card { background: #ffffff; border-radius: 30px; border: none; box-shadow: 12px 12px 24px #d1d9e6, -12px -12px 24px #ffffff; }
        .motivational-hero { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: white; border-radius: 35px; padding: 2.5rem; text-align: center; box-shadow: 0 20px 40px rgba(99, 102, 241, 0.25); margin-bottom: 2rem; position: relative; }
        .fruit-icon { font-size: 6.5rem; display: block; margin-bottom: 5px; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1)); }
        .comparador-texto { font-size: 3.8rem; font-weight: 800; color: #2d3748; line-height: 1.1; }
        .progress-wrapper { position: relative; height: 22px; background: #edf2f7; border-radius: 50px; box-shadow: inset 2px 2px 5px #d1d9e6; margin-top: 40px; }
        .progress-fill { height: 100%; border-radius: 50px; background: linear-gradient(90deg, #6366f1, #a855f7); transition: width 1.5s ease-in-out; position: relative; }
        .progress-indicator { position: absolute; right: 0; top: -35px; background: #6366f1; color: white; padding: 3px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 800; transform: translateX(50%); }
        .premium-input { border-radius: 15px; background: #f0f4f8; border: none; box-shadow: inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff; padding: 12px 20px; font-weight: 600; }
        .btn-round { width: 45px; height: 45px; border-radius: 50%; background: #f0f4f8; box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff; border: none; color: #6366f1; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .btn-round:active { transform: scale(0.9); box-shadow: inset 2px 2px 5px #d1d9e6; }
        .btn-sintoma { border: none; border-radius: 15px; padding: 10px 18px; font-size: 0.85rem; font-weight: 600; background: #f0f4f8; box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff; color: #64748b; transition: 0.3s; }
        .btn-sintoma.active { background: #6366f1; color: white; box-shadow: inset 3px 3px 6px rgba(0,0,0,0.2); }
        .top-buttons { position: absolute; top: 20px; right: 20px; display: flex; gap: 10px; }
        .btn-glass { background: rgba(255,255,255,0.2); border: 1px solid white; color: white; border-radius: 12px; padding: 8px 15px; font-weight: 600; transition: 0.3s; backdrop-filter: blur(5px); font-size: 0.9rem; }
        .btn-glass:hover { background: white; color: #6366f1; }
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
        const payload = {
            ...registro,
            peso: parseFloat(registro.peso),
            horas_sueno: parseFloat(registro.horas_sueno) || 0,
            ejercicio_minutos: parseInt(registro.ejercicio_minutos) || 0,
            vasos_agua: parseInt(registro.vasos_agua) || 0,
            patadas_bebe: parseInt(registro.patadas_bebe) || 0,
        };
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/registro-diario`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                await fetchDashboardData();
                setRegistro(estadoInicialRegistro);
                alert("¡Registro guardado con éxito! ✨");
            }
        } catch (error) { alert("Error al conectar"); }
    };

    // RESTAURADO: Función original para el informe PDF completo
    const descargarPDF = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/exportar-pdf`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Seguimiento_Embarazo.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) { alert("No se pudo generar el reporte PDF"); }
    };

    if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-primary"></div></div>;
    if (!data) return <div className="p-5 text-center">Error al cargar datos.</div>;

    return (
        <div className="container-fluid min-vh-100 py-5 dashboard-container">
            <style>{customStyles}</style>
            <div className="container" style={{ maxWidth: "1100px" }}>

                <div className="motivational-hero">
                    <div className="top-buttons">
                        {/* RESTAURADO: Botón original con icono de PDF y texto de reporte */}
                        <button className="btn-glass" onClick={descargarPDF}>
                            <i className="fas fa-file-pdf me-2"></i> Reporte PDF
                        </button>
                        <button className="btn-glass" onClick={() => navigate("/recordatorios")}>
                            <i className="fas fa-bell me-2"></i> Recordatorios
                        </button>
                    </div>
                    <h1 className="display-4 fw-bold mb-2">¡Hola, mamá!</h1>
                    <p className="fs-4 fw-light opacity-90 italic">"{data.mensaje}"</p>
                </div>

                <div className="glass-card p-5 mb-5 text-center">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-md-4">
                            <span className="fruit-icon">{data.bebe?.icono || "🌱"}</span>
                        </div>
                        <div className="col-md-8 text-md-start">
                            <span className="text-primary fw-bold text-uppercase ls-2 small d-block mb-1">Tu bebé tiene el tamaño de:</span>
                            <h2 className="comparador-texto mb-0 text-capitalize">{data.bebe?.tamanio || "una pequeña semilla"}</h2>
                            <h3 className="display-6 text-muted fw-light mt-2">Semana {data.semana_actual}</h3>
                        </div>
                        <div className="col-md-10 mt-4">
                            <div className="d-flex justify-content-center gap-5 border-top pt-4">
                                <span className="fs-5 text-muted"><i className="fas fa-ruler-vertical me-2 text-info"></i>Longitud: <strong>{data.bebe?.tamano_cm || "--"} cm</strong></span>
                                <span className="fs-5 text-muted"><i className="fas fa-weight-hanging me-2 text-warning"></i>Peso aprox: <strong>{data.bebe?.peso_g || "--"} g</strong></span>
                            </div>
                            <div className="progress-wrapper">
                                <div className="progress-fill" style={{ width: `${data.progreso}%` }}>
                                    <div className="progress-indicator">{data.progreso}% del camino</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="glass-card p-4 mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                                <h6 className="fw-bold m-0 text-muted uppercase"><i className="fas fa-chart-line me-2"></i>Evolución de Peso</h6>
                                <button className={`btn btn-sm rounded-pill px-4 fw-bold ${mostrarIdeal ? 'btn-success text-white' : 'btn-outline-secondary'}`} onClick={() => setMostrarIdeal(!mostrarIdeal)}>
                                    {mostrarIdeal ? 'Ocultar Curva Ideal' : 'Ver Peso Ideal'}
                                </button>
                            </div>
                            <div style={{ height: "300px" }}>
                                <Line
                                    key={mostrarIdeal ? "ideal" : "real"}
                                    data={{
                                        labels: data.chart_config?.labels || [],
                                        datasets: [
                                            {
                                                label: "Tu Peso",
                                                data: data.chart_config?.data || [],
                                                borderColor: "#6366f1",
                                                tension: 0.4,
                                                fill: true,
                                                backgroundColor: (context) => {
                                                    const ctx = context.chart.ctx;
                                                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                                                    gradient.addColorStop(0, "rgba(99, 102, 241, 0.3)");
                                                    gradient.addColorStop(1, "rgba(99, 102, 241, 0)");
                                                    return gradient;
                                                },
                                                borderWidth: 4,
                                                spanGaps: true,
                                                pointRadius: 4,
                                                pointBackgroundColor: "#ffffff",
                                                pointBorderColor: "#6366f1",
                                                pointBorderWidth: 2
                                            },
                                            ...(mostrarIdeal ? [{
                                                label: "Rango Ideal",
                                                data: data.chart_config?.ideal_data || [],
                                                borderColor: "#10b981",
                                                borderDash: [5, 5],
                                                tension: 0.4,
                                                pointRadius: 0
                                            }] : [])
                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { position: 'bottom' } },
                                        scales: {
                                            x: {
                                                ticks: { autoSkip: true, maxTicksLimit: 10, maxRotation: 0 },
                                                grid: { display: false }
                                            },
                                            y: { grid: { color: "rgba(0,0,0,0.05)" } }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="glass-card p-5">
                            <h4 className="fw-bold mb-5 text-dark border-start border-primary border-5 ps-3">Registro de Hoy</h4>
                            <form onSubmit={handleGuardarDia}>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <label className="small fw-bold text-muted mb-2 uppercase ls-1">Peso actual (kg)</label>
                                        <input type="number" step="0.1" className="form-control premium-input" value={registro.peso} onChange={(e) => setRegistro({ ...registro, peso: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small fw-bold text-muted mb-2 uppercase ls-1">Estado de Ánimo</label>
                                        <select className="form-select premium-input" value={registro.estado_animo} onChange={(e) => setRegistro({ ...registro, estado_animo: e.target.value })}>
                                            <option value="Feliz">😊 Muy Feliz</option>
                                            <option value="Tranquila">😌 Tranquila</option>
                                            <option value="Cansada">😴 Cansada</option>
                                            <option value="Sensible">🥺 Sensible</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="p-3 bg-light rounded-4 text-center shadow-sm">
                                            <label className="small fw-bold text-muted d-block mb-3 uppercase ls-1">Vasos de agua</label>
                                            <div className="d-flex justify-content-center align-items-center gap-4">
                                                <button type="button" className="btn-round" onClick={() => setRegistro({ ...registro, vasos_agua: Math.max(0, parseInt(registro.vasos_agua || 0) - 1) })}><i className="fas fa-minus"></i></button>
                                                <span className="h4 m-0 fw-bold px-2"><i className="fas fa-glass-water text-info me-2"></i>{registro.vasos_agua}</span>
                                                <button type="button" className="btn-round" onClick={() => setRegistro({ ...registro, vasos_agua: parseInt(registro.vasos_agua || 0) + 1 })}><i className="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="p-3 bg-light rounded-4 text-center shadow-sm">
                                            <label className="small fw-bold text-muted d-block mb-3 uppercase ls-1">Movimientos del bebé</label>
                                            <div className="d-flex justify-content-center align-items-center gap-4">
                                                <button type="button" className="btn-round" onClick={() => setRegistro({ ...registro, patadas_bebe: Math.max(0, parseInt(registro.patadas_bebe || 0) - 1) })}><i className="fas fa-minus"></i></button>
                                                <span className="h4 m-0 fw-bold px-2"><i className="fas fa-baby text-warning me-2"></i>{registro.patadas_bebe}</span>
                                                <button type="button" className="btn-round" onClick={() => setRegistro({ ...registro, patadas_bebe: parseInt(registro.patadas_bebe || 0) + 1 })}><i className="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 pt-3">
                                        <label className="small fw-bold text-muted mb-3 uppercase ls-1">Sueño: {registro.horas_sueno} horas</label>
                                        <input type="range" className="form-range" min="0" max="14" step="0.5" value={registro.horas_sueno} onChange={(e) => setRegistro({ ...registro, horas_sueno: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small fw-bold text-muted mb-2 uppercase ls-1">Pasos o Ejercicio (Minutos)</label>
                                        <input type="number" className="form-control premium-input" placeholder="Ej: 5000" value={registro.ejercicio_minutos} onChange={(e) => setRegistro({ ...registro, ejercicio_minutos: e.target.value })} />
                                    </div>
                                    <div className="col-12">
                                        <label className="small fw-bold text-muted mb-3 d-block uppercase ls-1">Síntomas detectados</label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {Object.keys(registro.sintomas).map((s) => (
                                                <button key={s} type="button" className={`btn-sintoma ${registro.sintomas[s] ? 'active' : ''}`} onClick={() => setRegistro({ ...registro, sintomas: { ...registro.sintomas, [s]: !registro.sintomas[s] } })}>
                                                    <i className={`fas fa-check me-2 ${registro.sintomas[s] ? '' : 'd-none'}`}></i>
                                                    {s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ")}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-12 text-end pt-4">
                                        <button type="submit" className="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow-lg border-0 transition-all hover-scale">
                                            <i className="fas fa-heart me-2"></i> Guardar Todo
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="glass-card p-5 text-center mb-4 shadow-sm" style={{ borderBottom: '8px solid #a855f7' }}>
                            <h6 className="text-muted small fw-bold uppercase ls-2 mb-3">DÍAS PARA CONOCERLO</h6>
                            <div className="display-1 fw-bold text-dark">{data.dias_restantes}</div>
                            <span className="badge bg-light text-primary rounded-pill px-3 py-2 fw-bold">DÍAS RESTANTES</span>
                            <hr className="my-4 opacity-10" />
                            <div className="small fw-bold text-muted uppercase">Fecha Probable de Parto</div>
                            <div className="text-dark fw-bold fs-5">{data.salud?.fpp}</div>
                        </div>

                        <div className="glass-card p-4 mb-4" style={{ borderLeft: '6px solid #6366f1' }}>
                            <div className="d-flex align-items-center mb-3">
                                <i className="fas fa-lightbulb text-warning fs-4 me-3"></i>
                                <h6 className="fw-bold m-0 uppercase text-muted">Consejo para hoy</h6>
                            </div>
                            <p className="text-dark italic small mb-0 lh-lg">"{data.salud?.consejo}"</p>
                        </div>

                        <div className="glass-card p-4">
                            <h6 className="fw-bold text-muted small text-center mb-4 uppercase ls-1">Frecuencia de Síntomas</h6>
                            <div style={{ height: "450px" }}>
                                <Bar
                                    key={JSON.stringify(data.frecuencia_sintomas)}
                                    data={{
                                        labels: data.frecuencia_sintomas ? Object.keys(data.frecuencia_sintomas).map(s => s.replace("_", " ").toUpperCase()) : [],
                                        datasets: [{
                                            label: 'Detecciones',
                                            data: data.frecuencia_sintomas ? Object.values(data.frecuencia_sintomas) : [],
                                            backgroundColor: coloresSintomas,
                                            borderRadius: 12,
                                            borderWidth: 1,
                                            borderColor: 'rgba(0,0,0,0.05)'
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        indexAxis: 'y',
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            x: { beginAtZero: true, ticks: { stepSize: 1, color: '#64748b' }, grid: { display: false } },
                                            y: { ticks: { font: { size: 10, weight: 'bold' }, color: '#64748b' }, grid: { display: false } }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};