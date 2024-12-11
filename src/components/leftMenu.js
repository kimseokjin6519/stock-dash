import React from 'react';
import appleLogo from '../assets/apple-logo.svg';
import yahooLogo from '../assets/yahoo.png';

const LeftMenu = () => {

   return (
      <div className="flex h-screen w-screen items-start">
         
         <div className="w-[300px] h-full flex flex-col text-black">

            {/* Search */}

            <div className="mx-4">
               <div className="h-[50px]"></div>
               <div className="ml-2 text-2xl font-bold">Stocks</div>
               <input className="w-[300px] h-8 my-8 pl-2 rounded-lg bg-gray-200 text-sm outline-none" type="text" placeholder="Search" />
               <div className="ml-4 flex font-semibold tracking-tight">Business News</div>
               <div className="flex items-center">
                  <div className="ml-4 flex text-xs font-semibold text-gray-400">From</div>
                  <img src={appleLogo} className="ml-1 flex h-3 object-contain"/>
                  <div className="flex text-xs font-semibold text-gray-400">News</div> 
               </div>
               <div className="h-4"></div>
            </div>

            {/* Track */}
            
            <div className="mx-4">
               <div>
                  <div className="h-16 flex w-[300px] rounded-lg hover:bg-gray-200 cursor-default">   
                     <div className="ml-4 flex flex-col justify-center">
                        <div className="flex font-semibold">AAPL</div>
                        <div className="flex text-xs font-semibold text-gray-400">Apple Inc.</div>
                     </div>
                     
                     <div className="flex items-center ml-auto mr-4">
                        <div className="">[Graph]</div>
                        <div className="">[$100.00]</div>
                     </div>
                  </div>
               </div>

               <div>
                  <div className="h-16 flex w-[300px] rounded-lg hover:bg-gray-200 cursor-default">   
                     <div className="ml-4 flex flex-col justify-center">
                        <div className="flex font-semibold">NVDA</div>
                        <div className="flex text-xs font-semibold text-gray-400">Nvidia Corp.</div>
                     </div>
                     
                     <div className="flex items-center ml-auto mr-4">
                        <div className="">[Graph]</div>
                        <div className="">[$100.00]</div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Closed */}
            
            <div className="bg-gray-200 text-gray-400 items-center h-14 mt-auto flex">
               <img className="h-8 ml-4 flex object-contain" src={yahooLogo} />
               <div className="ml-auto text-xs text-gray-500 font-light tracking-tight mr-4" style={{fontFamily:'Helvetica'}}>Market Closed</div>
            </div>
            
         </div>
      </div>
      );
}

export default LeftMenu;