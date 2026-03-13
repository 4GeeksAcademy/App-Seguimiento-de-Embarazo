import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const GraficaProgreso = ({ porcentaje }) => {
    const data = {
        datasets: [{
            data: [porcentaje, 100 - porcentaje],
            backgroundColor: ['#28a745', '#e9ecef'], // Verde éxito y gris suave
            borderWidth: 0,
            circumference: 180, // Media luna
            rotation: 270,
        }],
    };

    const options = {
        cutout: '80%',
        plugins: {
            tooltip: { enabled: false },
            legend: { display: false },
        },
    };

    return (
        <div className="position-relative">
            <Doughnut data={data} options={options} />
            <div className="position-absolute top-50 start-50 translate-middle mt-2">
                <h3 className="mb-0">{Math.round(porcentaje)}%</h3>
            </div>
        </div>
    );
};