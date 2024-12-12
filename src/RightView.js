import React, { useState, useEffect } from 'react';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const RightView = ({ tickerListJSON, activeSymbol }) => {

   const [chartData, setChartData] = useState(null);
   const [customLabels, setCustomLabels] = useState([]);
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (activeSymbol) {
         fetchData(activeSymbol);
      }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [activeSymbol]);
   
   const fetchData = async () => {
      setError('');
      setChartData(null);
      try {
         const response = await fetch(`http://192.168.52.128:5000/quote?symbol=${activeSymbol}`);
         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch data');
         }
         const data = await response.json();
         const quotes = data.quotes;
         if (!quotes || quotes.length === 0) {
            throw new Error('No data available for the provided symbol.');
         }
         const labels = quotes.map((quote) => new Date(quote.date).toLocaleDateString());
         const prices = quotes.map((quote) => quote.close);
         const canvas = document.createElement('canvas');
         const ctx = canvas.getContext('2d');
         const gradient = ctx.createLinearGradient(0, 0, 0, 400);
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
                  tension: 0.01,
                  pointRadius: 0,
                  borderWidth: 1,
               },
            ],
         });
         const today = new Date();
         const rightLabel = today.toLocaleString('default', { month: 'short', year: 'numeric' });
         const middleDate = new Date(today.setMonth(today.getMonth() - 1));
         const middleLabel = middleDate.toLocaleString('default', { month: 'short', year: 'numeric' });
         const leftDate = new Date(today.setMonth(today.getMonth() - 1));
         const leftLabel = leftDate.toLocaleString('default', { month: 'short', year: 'numeric' });
         setCustomLabels([leftLabel, middleLabel, rightLabel]);
      } catch (err) {
         setError(err.message || 'Failed to fetch data. Please check the symbol.');
      } finally {
         setLoading(false);
      }
   }

   const options = {
      responsive: true,
      scales: {
         x: {
            ticks: {
               display: false,
            },
            grid: {
               display: false,
            },
         },
         y: {
            grid: {
               display: false,
            },
            ticks: {
               font: {
                  family: 'Segoe UI', 
                  size: 12,
                  weight: 500,
               },
               color: 'rgba(25, 25, 25, 1)',
               callback: function(value, index, values) {
                  if (index === 0) {
                     return '';
                  }
                  return value;
               },
            },
            position: 'right',
         },
      },
      plugins: {
         legend: {
            display: false,
            position: 'top',
            align: 'start',    
            labels: {
               color: 'black',
               boxWidth: 10,  
               padding: 10,
               font: {
                  weight: 'bold',
                  family: 'Arial',
                  size: 14,
               }, 
            },
         },
         tooltip: {
            enabled: true,
            mode: 'index', 
            intersect: false,
            callbacks: {
               title: (tooltipItems) => {
                  const date = new Date(tooltipItems[0].label);
                  return date.toLocaleDateString();
               },
               label: (tooltipItem) => {
                  return `Price: $${tooltipItem.raw.toFixed(2)}`;
               },
            },
         },
      },
      animation: {
         duration: 1000,
         easing: 'easeOutQuart',
      },
   };

   if (loading) {
      return <div></div>;
   }

   return (
      <div className="w-full h-full" style={{ maxWidth: '1200px', maxHeight: '600px', margin: '0 auto', textAlign: 'center' }}>
         <div className="h-[50px]"></div>
         <div className="flex text-3xl font-bold tracking-wide" style={{fontFamily:''}}>{ activeSymbol }</div>
         
         {chartData && (
            <div style={{ marginTop: '20px' }}>
               <Line data={chartData} options={options} width={1000} height={250} />
               <div className="text-xs font-semibold text-black" style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px', fontFamily: '' }}>
                  {customLabels.map((label, index) => (
                     <div key={index} style={{ }}>
                        {label}
                     </div>
                  ))}
               </div>
            </div>
         )}

         {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
         
      </div>
   );
};

export default RightView;
