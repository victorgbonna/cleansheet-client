// // HeatmapChart.js
// import { useEffect, useRef } from 'react';
// import Chart from 'chart.js/auto';
// import 'chartjs-chart-heatmap';

// const HeatmapChart = ({ data }) => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     if (chartRef && chartRef.current) {
//       const ctx = chartRef.current.getContext('2d');

//       new Chart(ctx, {
//         type: 'heatmap',
//         data: data,
//         options: {
//           scales: {
//             x: {
//               ticks: {
//                 display: false // Hide x-axis ticks
//               }
//             },
//             y: {
//               ticks: {
//                 display: false // Hide y-axis ticks
//               }
//             }
//           },
//           plugins: {
//             legend: {
//               display: false // Hide legend
//             }
//           }
//         }
//       });
//     }
//   }, [data]);

//   return <canvas ref={chartRef}></canvas>;
// };

// export default HeatmapChart;
// HeatmapChart.js
// import { useEffect, useRef } from 'react';
// import { HeatMapComponent } from '@syncfusion/ej2-react-heatmap';

// const HeatmapChart = ({ data }) => {
 
// };
import { HeatMapComponent, Inject, Tooltip } from '@syncfusion/ej2-react-heatmap';

const HeatmapChart=()=> {
  let heatmapData= [
    [52, 65, 67, 45, 37, 52],
    [68, null, 63, 51, 30, 51],
    [7, 16, 47, null, 88, 6],
    [66, 64, null, 40, 47, 41],
    [14, 46, 97, 69, null, 3],
    [54, 46, 61, 46, null, 39]

  ];
  return (
    <div className="App">
      <HeatMapComponent dataSource={heatmapData} height='350px' width='750px'
      titleSettings={{text:'Sales Revenue per Employee (in 1000 US$)'}}
      xAxis={{
        labels:['Nancy', 'Andrew', 'Janet', 'Margaret', 'Steven', 'Michael' ],
        valueType:'Category'
      }}
      yAxis={{
        labels:['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
        valueType:'Category'
      }}
      paletteSettings={{
        palette:[
          { color: '#C06C84'},
          { color: '#6C5B7B'},
          { color: '#355C7D'}
        ],
        type:'Fixed'
      }}
      cellSettings={{
        tileType:'Rect',
        bubbleType:'SizeAndColor',
        isInversedBubbleSize:true,
        format:'${value}'
      }}
      showTooltip={true}
      >
        <Inject services={[Tooltip]}/>
      </HeatMapComponent>
    </div>
  );
}


export default HeatmapChart;
