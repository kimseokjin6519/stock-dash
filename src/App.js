import React, { useState } from 'react';
import LeftMenu from './components/leftMenu'
import RightView from './RightView'

const App = () => {
   
   const tickerListJSON = ["AAPL", "NVDA", "MSFT", "AMZN", "TSLA", "META"];

   const [activeSymbol, setActiveSymbol] = useState(null);

   return (
      <div>
         <div className=""><LeftMenu tickerList = {tickerListJSON} setActiveSymbol = {setActiveSymbol} /></div>
         <div className="flex items-center top-0 right-20 fixed"><RightView tickerList = {tickerListJSON} activeSymbol = {activeSymbol} /></div>

      </div>
   );
}

export default App;