import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const PieChart = (
    {customlabel, id="", data}
    ) => {
    const chartRef = useRef(null);
    const [chartKey, setChartKey] = useState(0); 
    const [myChart, setMyChart] = useState(null);
    // console.log({c})
  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (myChart) {
        myChart.destroy();
    }

    const newChart=new Chart(ctx, {
        type: 'pie',
        data: {
          labels: data.labels,
          datasets: [{
            data: data.values,
            backgroundColor: data.colors
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
    });

    setMyChart(newChart);
    
    return () => {
        if (newChart) {
            newChart.destroy();
        }
    };
  }, [data, chartKey]);

  return <canvas id={'pie-chart'+id} ref={chartRef} />;
};

export default PieChart;
