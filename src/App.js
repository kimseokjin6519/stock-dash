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

         // Create the gradient
         const canvas = document.createElement('canvas');
         const ctx = canvas.getContext('2d');
         const gradient = ctx.createLinearGradient(0, 0, 0, 400); // Vertical gradient
         gradient.addColorStop(0, 'rgba(75,192,192,0.8)');  // Dense at the top
         gradient.addColorStop(1, 'rgba(75,192,192,0.2)');  // Faded at the bottom

         setChartData({
            labels,
            datasets: [
               {
                  label: `${symbol} Stock Price`,
                  data: prices,
                  borderColor: 'rgba(75,192,192,1)', // Line color
                  backgroundColor: gradient, // Apply the gradient as background
                  fill: true, // Enable filling the area under the line
                  tension: 0.4,  // Smooth the curve
               },
            ],
         });
      } catch (err) {
         setError(err.message || 'Failed to fetch data. Please check the symbol.');
      }
   };

   const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
         fetchData();
      }
   };

   return (
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '20px' }}>
         <h1>Stock Price Chart</h1>
         <input
            type="text"
            placeholder="Enter stock symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}  // Listen for Enter key
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
               <Line data={chartData} />
            </div>
         )}
      </div>
   );
};

export default App;
