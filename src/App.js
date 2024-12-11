import React from 'react';
import LeftMenu from './components/leftMenu'
import Backup from './Backup'

const App = () => {

   return (
      <div>
         <LeftMenu />
         <div className="flex items-center top-0 right-20 fixed"><Backup /></div>         
      </div>
   );
}

export default App;