import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const LinePlot = ({ data, id="", displayLabel=false }) => {
  const chartRef = useRef(null);
  const [chartKey, setChartKey] = useState(0);  
  const [myChart, setMyChart] = useState(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (myChart) {
        myChart.destroy();
      }
      
      let newChart={}
      if(!displayLabel){
        newChart=new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.labels,
            datasets: [{
              label: '',
              data: data.values,
              borderColor: '#2E8B57',
              tension: 0.8,
              borderWidth:2,
              lineTension: 0.8
            }]
          },
          options: {
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                display: false
              },
              y: {
                display: false
              }
            },
            layout: {
              padding: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
              }
            },
            elements: {
              point: {
                radius: 0, // Set the radius to 0 to hide the points
              }
            },
            fill: true,
            backgroundColor: '#D3F8D3',
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
      else{
        newChart=new Chart(ctx, {
          type: 'line',
          data, 
          // {
          //   labels: data.labels,
          //   datasets: [{
          //     label: data.datasetLabel,
          //     data: data.values,
          //     borderColor: 'rgba(255, 99, 132, 1)',
          //     borderWidth: 2,
          //     fill: false
          //   }]
          // },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }

      setMyChart(newChart);
    
      return () => {
          if (newChart) {
              newChart.destroy();
          }
      };
    }
  }, [data, chartKey]);

  return <canvas id={'line-plot'+id} ref={chartRef} />;
};

export default LinePlot;
