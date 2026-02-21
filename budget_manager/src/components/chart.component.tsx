import { Doughnut } from 'react-chartjs-2';
import './chart.component.css';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useRef } from 'react';
import type { BudgetData } from '../models/budget.data';

type props = {
    data: BudgetData[],
};
const chartComponent = ({ data }: props) => {
    const chartRef = useRef<Chart | null>(null);
    const loadChartData = (data1: BudgetData[]) => {
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
        const canvas = document.getElementById('myChart') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            if (chartRef.current) {
                chartRef.current.destroy();
            }

            chartRef.current = new Chart(ctx, {
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Budget Distribution',
                        },
                    },
                },
                type: 'doughnut',
                data: {
                    labels: data1.map(item => item.category),
                    datasets: [
                        {
                            data: data1.map(item => item.amount),
                            backgroundColor: colors.slice(0, data1.length)
                        }
                    ]
                }
            }
            );
        }
    }

    useEffect(() => {
        Chart.register(ArcElement, Tooltip, Legend);
        loadChartData(data);
    }, [data]);

    return (
        <div className="card">
            <canvas id="myChart"></canvas>
        </div>
    );
}


export default chartComponent;