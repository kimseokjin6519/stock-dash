import React, { useEffect, useState } from 'react';
import appleLogo from '../assets/apple-logo.svg';
import yahooLogo from '../assets/yahoo-dark.svg';

const LeftMenu = ({ tickerList, setActiveSymbol }) => {
   const [symbolsJSON, setSymbolsJSON] = useState({});

   useEffect(() => {
      const fetchSymbolsJSON = async () => {
         const symbolsMap = {};
         for (const ticker of tickerList) {
            try {
               const response = await fetch(`http://192.168.52.128:5000/chart?symbol=${ticker}`);
               const data = await response.json();
               symbolsMap[ticker] = data;
            } catch (error) {
               console.error(`Error fetching data for ${ticker}:`, error);
               symbolsMap[ticker] = "Error loading data";
            }
         }
         setSymbolsJSON(symbolsMap);
      };

      fetchSymbolsJSON();
   }, [tickerList]);

   return (
      <div className="flex h-screen w-screen items-start bg-black text-white">         
         <div className="w-[300px] h-full flex flex-col text-white box-border">
            <div className="h-[50px]"></div>

            {/* Search */}
            <div className="mx-4">
               <div className="ml-2 text-2xl font-bold">Stocks</div>
               <input
                  className="w-[300px] h-8 my-8 pl-2 rounded-lg bg-gray-800 text-sm text-white outline-none"
                  type="text"
                  placeholder="Search"
               />
               <div className="ml-4 flex font-semibold tracking-tight text-gray-300">Business News</div>
               <div className="flex items-center">
                  <div className="ml-4 flex text-xs font-semibold text-gray-500">From</div>
                  <img src={appleLogo} className="ml-1 flex h-3 object-contain invert" />
                  <div className="flex text-xs font-semibold text-gray-500">News</div> 
               </div>
               <div className="h-4"></div>
            </div>

            {/* Track */}
            {tickerList.map((ticker, index) => (
               <div key={index}>
                  <div className="mx-4">
                     <div>
                        <div
                           className="h-16 flex w-[300px] rounded-lg hover:bg-gray-700 cursor-pointer"
                           onClick={() => {
                              setActiveSymbol(ticker);
                           }}
                        >
                           <div className="ml-4 flex flex-col justify-center">
                              <div className="flex font-semibold">{ticker}</div>
                              <div className="flex whitespace-nowrap overflow-hidden text-xs font-semibold text-gray-500">
                                 {symbolsJSON[ticker]?.meta.shortName || "Loading..."}
                              </div>
                           </div>

                           <div className="flex items-center ml-auto mr-4">
                              <div className="">[Graph]</div>
                              <div className="">{symbolsJSON[ticker]?.meta.regularMarketPrice || "Loading..."}</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            ))}

            {/* Closed */}
            
            
            {/* <div className="w-[314px] bg-gray-800 text-gray-500 items-center h-14 mt-auto flex">
               <img className="h-8 ml-4 flex " src={yahooLogo} />
               <div className="ml-auto text-xs text-gray-400 font-light tracking-tight mr-4" style={{ fontFamily: 'Helvetica' }}>Market Closed</div>
            </div>
            */}

         </div>
      </div>
   );
};

export default LeftMenu;
