import React, { useState, useEffect, useRef } from 'react';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const RightView = ({ tickerListJSON, activeSymbol }) => {

   const [chartData, setChartData] = useState(null);
   const [customLabels, setCustomLabels] = useState([]);
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(true);
   const [quoteData, setQuoteData] = useState(null);
   const [quoteSummaryData, setQuoteSummaryData] = useState(null);

   const chartRef = useRef(null);
   const [chartWidth, setChartWidth] = useState(0);

   useEffect(() => {
      if (chartRef.current) {
         setChartWidth(chartRef.current.chartArea.width);
      }
      console.log(chartWidth);
   }, [chartData]);

   useEffect(() => {
      if (activeSymbol) {
         fetchData(activeSymbol);
         fetchQuoteData(activeSymbol);
         fetchQuoteSummaryData(activeSymbol);
      }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [activeSymbol]);
   
   const formatEX = (digits) => {
      switch (true) {
         case (digits >= 1e12):
             return (
               <div className="flex">
                  <div>{(digits / 1e12).toFixed(2)}</div>
                  <div style={{ fontFamily: 'Open Sans' }}>T</div>
               </div>
            ); 
         case (digits >= 1e09):
            return (
               <div className="flex">
                  <div>{(digits / 1e09).toFixed(2)}</div>
                  <div style={{ fontFamily: 'Open Sans' }}>B</div>
               </div>
            ); 
         case (digits >= 1e06):
            return (
               <div className="flex">
                  <div>{(digits / 1e06).toFixed(2)}</div>
                  <div style={{ fontFamily: 'Open Sans' }}>M</div>
               </div>
            ); 
         case (digits >= 1e03):
            return (
               <div className="flex">
                  <div>{(digits / 1e03).toFixed(2)}</div>
                  <div style={{ fontFamily: 'Open Sans' }}>K</div>
               </div>
            ); 
         default:
            return digits.toString();
      }
   };
   
   const fetchQuoteSummaryData = async () => {
      setError('');
      setQuoteSummaryData(null);
      try {
         const response = await fetch(`http://192.168.52.128:5000/info?symbol=${activeSymbol}`);
         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch data');
         }
         const data = await response.json();
         setQuoteSummaryData(data);
      }
      catch (err) { setError(err.message || 'Failed to fetch data. Please check the symbol.') }
   };

   const fetchQuoteData = async () => {
      setError('');
      setQuoteData(null);
      try {
         const response = await fetch(`http://192.168.52.128:5000/quote?symbol=${activeSymbol}`);
         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch data');
         }
         const data = await response.json();
         setQuoteData(data);
      }
      catch (err) { setError(err.message || 'Failed to fetch data. Please check the symbol.') }
   };
   
   const fetchData = async () => {
      setError('');
      setChartData(null);
      try {
         const response = await fetch(`http://192.168.52.128:5000/chart?symbol=${activeSymbol}`);
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
         duration: 500, 
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
               <Line ref={chartRef} data={chartData} options={options} width={1000} height={250} />
               <div className="text-xs font-semibold text-black" style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px', fontFamily: '' }}>
                  {customLabels.map((label, index) => (
                     <div key={index} style={{ }}>
                        {label}
                     </div>
                  ))}
               </div>
            </div>
         )}

         {/* Financials */}
         <div className="mt-8"></div>
         <div className="bg-gray-200 h-[1px]" style={{ width: `${chartWidth}px` }}></div>
         <div className="mt-8"></div>
         
         <div className="flex grid grid-cols-4 gap-2 text-sm" style={{ width: `${chartWidth}px` }} >

            <div className="border-r border-gray-300">
               
               <div className="flex">
                  <div className="flex justify-center ml-6 text-gray-400 font-semibold leading-snug" style={{ fontFamily: '' }}>Open</div>
                  <div className="flex justify-center ml-auto mr-4 font-semibold text-sm tracking-wide" style={{ fontFamily: 'Droid Sans Mono' }}>{quoteData?.regularMarketOpen ? (quoteData?.regularMarketOpen).toFixed(2) : ''}</div>
               </div>

               <div className="flex">
                  <div className="flex justify-center ml-6 text-gray-400 font-semibold leading-snug" style={{ fontFamily: '' }}>High</div>
                  <div className="flex justify-center ml-auto mr-4 font-semibold text-sm tracking-wide" style={{ fontFamily: 'Droid Sans Mono' }}>{quoteData?.regularMarketDayHigh ? (quoteData?.regularMarketDayHigh).toFixed(2) : ''}</div>
               </div>

               <div className="flex">
                  <div className="flex justify-center ml-6 text-gray-400 font-semibold leading-snug" style={{ fontFamily: '' }}>Low</div>
                  <div className="flex justify-center ml-auto mr-4 font-semibold text-sm tracking-wide" style={{ fontFamily: 'Droid Sans Mono' }}>{quoteData?.regularMarketDayLow ? (quoteData?.regularMarketDayLow).toFixed(2) : ''}</div>
               </div>
            
            </div>

            <div className="border-r border-gray-300">
            
               <div className="flex">
                  <div className="flex justify-center ml-4 text-gray-400 font-semibold leading-snug" style={{ fontFamily: '' }}>Vol</div>
                  <div className="flex justify-center ml-auto mr-4 font-semibold text-sm tracking-wide" style={{ fontFamily: 'Droid Sans Mono' }}>{quoteData?.regularMarketVolume ? formatEX(quoteData?.regularMarketVolume) : ''}</div>
               </div>
            
               <div className="flex">
                  <div className="ml-4 text-gray-400 font-semibold leading-snug" style={{ fontFamily: '' }}>P/E</div>
                  <div className="flex justify-center ml-auto mr-4 font-semibold text-sm tracking-wide" style={{ fontFamily: 'Droid Sans Mono' }}>{quoteData?.trailingPE ? (quoteData?.trailingPE).toFixed(2) : '' }</div>
               </div>
            
               <div className="flex">
                  <div className="ml-4 text-gray-400 font-semibold leading-snug" style={{ fontFamily: '' }}>Mkt Cap</div>
                  <div className="flex justify-center ml-auto mr-4 font-semibold text-sm tracking-wide" style={{ fontFamily: 'Droid Sans Mono' }}>{quoteData?.marketCap ? formatEX(quoteData?.marketCap) : ''}</div>
               </div>
            
            </div>

            <div className="border-r border-gray-300">
            
               <div className="flex">
                  <div className="ml-4 text-gray-400 font-semibold leading-snug" style={{ fontFamily: '' }}>52W H</div>
                  <div className="flex justify-center ml-auto mr-4 font-semibold text-sm tracking-wide" style={{ fontFamily: 'Droid Sans Mono' }}>{quoteData?.fiftyTwoWeekHigh ? (quoteData?.fiftyTwoWeekHigh).toFixed(2) : ''}</div>
               </div>
            
               <div className="flex">
                  <div className="ml-4 text-gray-400 font-semibold leading-snug" style={{ fontFamily: '' }}>52W L</div>
                  <div className="flex justify-center ml-auto mr-4 font-semibold text-sm tracking-wide" style={{ fontFamily: 'Droid Sans Mono' }}>{quoteData?.fiftyTwoWeekLow ? (quoteData?.fiftyTwoWeekLow).toFixed(2) : ''}</div>
               </div>
            
               <div className="flex">
                  <div className="ml-4 text-gray-400 font-semibold leading-snug" style={{ fontFamily: '' }}>Avg Vol</div>
                  <div className="flex justify-center ml-auto mr-4 font-semibold text-sm tracking-wide" style={{ fontFamily: 'Droid Sans Mono' }}>{quoteData?.averageDailyVolume3Month ? formatEX(quoteData?.averageDailyVolume3Month) : ''}</div>
               </div>

            </div>

            <div className="">
            
               <div className="flex">
                  <div className="ml-4 text-gray-400 font-semibold leading-snug" style={{ fontFamily: '' }}>Yield (%)</div>
                  <div className="flex justify-center ml-auto mr-6 font-semibold text-sm tracking-wide" style={{ fontFamily: 'Droid Sans Mono' }}>{quoteData?.dividendYield ? (quoteData.dividendYield).toFixed(2) : ''}</div>
               </div>
            
               <div className="flex">
                  <div className="ml-4 text-gray-400 font-semibold leading-snug" style={{ fontFamily: '' }}>Beta</div>
                  <div className="flex justify-center ml-auto mr-6 font-semibold text-sm tracking-wide" style={{ fontFamily: 'Droid Sans Mono' }}>{quoteSummaryData?.summaryDetail?.beta}</div>
               </div>
            
               <div className="flex">
                  <div className="ml-4 text-gray-400 font-semibold leading-snug" style={{ fontFamily: '' }}>EPS</div>
                  <div className="flex justify-center ml-auto mr-6 font-semibold text-sm tracking-wide" style={{ fontFamily: 'Droid Sans Mono' }}>{quoteData?.epsTrailingTwelveMonths}</div>
               </div>
            
            </div>

         </div>

         <div className="mt-8"></div>
            <div className="bg-gray-200 h-[1px]" style={{ width: `${chartWidth}px` }}></div>
         <div className="mt-8"></div>

         {/*
         <div className="mt-6 h-8 rounded-sm bg-[rgba(75,192,192,0.4)]" style={{ width: `${chartWidth}px`}}></div>
         */}        
         {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>
         
   );
};

export default RightView;
