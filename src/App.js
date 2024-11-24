import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
   Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const App = () => {
   const [symbol, setSymbol] = useState('');
   const [chartData, setChartData] = useState(null);
   const [customLabels, setCustomLabels] = useState([]);
   const [error, setError] = useState('');

   const fetchData = async () => {
      setError('');
      setChartData(null);

      try {
         const response = await fetch(`http://192.168.52.128:5000/quote?symbol=${symbol}`);
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
                  label: `${symbol} Stock Price`,
                  data: prices,
                  borderColor: 'rgba(75,192,192,1)',
                  backgroundColor: gradient,
                  fill: true,
                  tension: 0.01,
                  pointRadius: 0,
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
      }
   };

   const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
         fetchData();
      }
   };

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
               },
               color: 'rgba(0, 0, 0, 0.5)',
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
   };

   return (
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '20px' }}>
         <h1>Stock Price Chart</h1>
         <input
            type="text"
            placeholder="Enter stock symbol"
            value={symbol}
            onChange={(event) => setSymbol(event.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            style={{ marginBottom: '10px', padding: '10px', width: '200px' }}
         />
         <br />
         <button
            onClick={fetchData}
            style={{
               padding: '10px 20px',
               backgroundColor: '#007bff',
               color: '#fff',
               border: 'none',
               borderRadius: '5px',
               cursor: 'pointer',
            }}
         >
            Fetch Chart
         </button>
         {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
         {chartData && (
            <div style={{ marginTop: '20px' }}>
               <Line data={chartData} options={options} />
               <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px', fontFamily: 'Segoe UI' }}>
                  {customLabels.map((label, index) => (
                     <div key={index} style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(0, 0, 0, 0.5)' }}>
                        {label}
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
   );
};

export default App;
