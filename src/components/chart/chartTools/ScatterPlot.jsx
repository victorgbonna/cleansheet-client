// ScatterPlot.js
import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const ScatterPlot = ({ data }) => {
  const chartRef = useRef(null);
  const [chartKey, setChartKey] = useState(0); 
  const [myChart, setMyChart] = useState(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (myChart) {
        myChart.destroy();
    }
      const datasets = data.datasets.map((dataset, datasetIndex) => {
        const colors = dataset.data.map((point, pointIndex) => {
          // Generate color based on x-value (assuming unique x-values)
          return `${ pointIndex % 3===0?'red':"blue"}`;
        });

        return {
          label: dataset.label,
          data: dataset.data,
          backgroundColor: colors,
          borderColor: 'rgba(0, 0, 0, 1)', // Border color
          borderWidth: 1, // Border width
          pointRadius: 5 // Point radius
        };
      });


      const newChart=new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: datasets
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
            },
          scales: {
            x: {
                ticks: {
                    //option 2, use callback to change labels to empty string
                    callback: () => ('')
                  },
              beginAtZero:true
            },
            y: {
              beginAtZero: true // Ensure y-axis starts at zero
            }
          }
        }
      });
      setMyChart(newChart)
    return () => {
        if (newChart) {
            newChart.destroy();
        }
    };
  }, [data, chartKey]);

  return <canvas ref={chartRef}></canvas>;
};

export default ScatterPlot;
