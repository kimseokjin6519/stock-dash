import React, { useState } from 'react';

import LeftMenu from './components/leftMenu'
import RightView from './components/RightView'

const App = () => {
   
   const tickerListJSON = ["AAPL", "NVDA", "MSFT", "AMZN", "TSLA", "META"];

   const [activeSymbol, setActiveSymbol] = useState(tickerListJSON[0]);

   return (
      <div>
         <div className=""><LeftMenu tickerList = {tickerListJSON} setActiveSymbol = {setActiveSymbol} /></div>
         <div className="flex top-0 left-[400px] fixed"><RightView key={activeSymbol} activeSymbol = {activeSymbol} /></div>

      </div>
   );
}

export default App;