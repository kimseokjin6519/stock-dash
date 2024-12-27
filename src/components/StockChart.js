import React, { useState, useRef, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const StockChart = ({ activeSymbol }) => {
   const [chartData, setChartData] = useState(null);
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(true);
   
   useEffect(() => {
      if (activeSymbol) {
         fetchData();
      }
   }, [activeSymbol]);
   
   const downSample = (data, interval) => {
      return data.filter((_, index) => index % interval === 0);
  };
  
   const fetchData = async () => {
      try {
         const response = await fetch(`http://192.168.52.128:5000/chart?symbol=${activeSymbol}`);
         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch data');
         }
         const data = await response.json();
         
         let quotes = downSample(data.quotes, 3);
         
         if (!quotes || quotes.length === 0) {
            throw new Error('No data available for the provided symbol.');
         }

         const labels = quotes.map((quote) => new Date(quote.date).toLocaleDateString());
         const prices = quotes.map((quote) => quote.close);
         
         const canvas = document.createElement('canvas');
         const ctx = canvas.getContext('2d');
         const gradient = ctx.createLinearGradient(0, 0, 0, 10000);
         gradient.addColorStop(0, 'rgba(75,192,192,0.8)');
         gradient.addColorStop(1, 'rgba(75,192,192,0.2)');
         
         setChartData({
            labels,
            datasets: [
               {
                  label: `${activeSymbol} Stock Price`,
                  data: prices,
                  borderColor: 'rgba(75,192,192,1)',
                  backgroundColor: gradient,
                  fill: true,
                  tension: 0.5,
                  pointRadius: 0,
                  borderWidth: 1,
               },
            ],
         });

      } catch (err) {
         setError(err.message || 'Failed to fetch data. Please check the symbol.');
      } finally {
         setLoading(false);
      }
   }

   const [chartOptions, setChartOptions] = useState({
      responsive: true,
      plugins: {
         legend: {
            display: false,
         },
         tooltip: {
            enabled: false,
         },
      },
      scales: {
         x: {
            display: false,
         },
         y: {
            display: false,
         },
      },
      elements: {
         line: {
            borderWidth: 0,
         },
      },
      layout: {
         padding: 0, 
      },
      animation: false,
   });

   return (
      <div>
         {chartData && <Line className="" data={chartData} options={chartOptions} height={30} width={80} />}
      </div>

   );
}

export default StockChart;