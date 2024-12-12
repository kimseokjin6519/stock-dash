import React from 'react';
import LeftMenu from './components/leftMenu'
import RightView from './RightView'

const App = () => {
   
   const tickerListJSON = ["AAPL", "NVDA", "MSFT"];

   return (
      <div>
         <LeftMenu tickerList = {tickerListJSON} />

         { /* <div className="flex items-center top-0 right-20 fixed"><RightView tickerList = {tickerListJSON} /></div> */ }

      </div>
   );
}

export default App;