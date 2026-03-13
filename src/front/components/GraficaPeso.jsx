import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler // 1. Importamos el plugin de relleno
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// 2. Registramos todos los componentes necesarios, incluido el Filler
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const GraficaPeso = ({ registros }) => {
    // Preparamos los datos para la gráfica
    // Si no hay registros, enviamos arrays vacíos para que no rompa
    const labels = registros?.map(r => new Date(r.fecha).toLocaleDateString()) || [];
    const pesos = registros?.map(r => r.peso) || [];

    const data = {
        labels,
        datasets: [
            {
                fill: true, // Ahora esto funcionará sin errores
                label: 'Mi Peso (kg)',
                data: pesos,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // El color del relleno
                tension: 0.3, // Curva de la línea
                pointRadius: 5,
                pointHoverRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: false, // Empezar cerca del peso real, no desde 0
                title: {
                    display: true,
                    text: 'Kilogramos'
                }
            }
        }
    };

    return (
        <div style={{ height: '300px' }}>
            {registros && registros.length > 0 ? (
                <Line data={data} options={options} />
            ) : (
                <div className="text-center p-5 border rounded bg-light">
                    <p className="text-muted">Aún no hay suficientes datos para mostrar la gráfica.</p>
                </div>
            )}
        </div>
    );
};

export default GraficaPeso;