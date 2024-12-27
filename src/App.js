import React, { useState } from 'react';

import LeftMenu from './components/leftMenu'
import RightView from './components/RightView'
import LeftMenuDark from './components/leftMenuDark'
import RightViewDark from './components/RightViewDark'
import StockChart from './components/StockChart'

const App = () => {
   
   const tickerListJSON = ["AAPL", "NVDA", "MSFT", "AMZN", "TSLA", "META"];
   const [activeSymbol, setActiveSymbol] = useState(tickerListJSON[0]);
   const [darkMode, setDarkMode] = useState(false);

   const toggleMode = () =>{
      setDarkMode(!darkMode);
   }

   return (
      <div>
         <button onClick={toggleMode} className="fixed opacity-50 text-sm w-12 h-6 bottom-0 right-0 bg-gray-800 text-white " style={{fontFamily: 'Open Sans'}}>{darkMode ? 'Web' : 'Tablet'}</button>
         {!darkMode ? (
            <div>
               <div className=""><LeftMenu tickerList={tickerListJSON} setActiveSymbol={setActiveSymbol} /></div>
               <div className="flex top-0 left-[400px] fixed"><RightView key={activeSymbol} activeSymbol={activeSymbol} /></div>
            </div>
            
         ) : (
            <div>
               <div className=""><LeftMenuDark tickerList={tickerListJSON} setActiveSymbol={setActiveSymbol} /></div>
               <div className="flex top-0 left-[400px] fixed"><RightViewDark key={activeSymbol} activeSymbol={activeSymbol} /></div>
            </div>
         )}
      </div>
   );
}

export default App;