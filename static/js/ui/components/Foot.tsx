import './Foot.scss'
import { Common } from '../../app/Common'
import { useEffect, useState } from 'react'


const handleClick = (url: string) => {
  window.open(url, '_blank');
};

export function Foot() {
  // @ts-ignore
  const Web = ( <div id="Foot" className='w-100 h-r-250' mode="web">
        <div>
            <img className="w-r-146 h-r-95" src={require('../../assets/web/Foot/dc.png')} alt=""  />
            <div className='f-14 mt-20'>© 2024 ComputeAI, All Rights Reserved.</div>
        </div>
        <div className='flexcc'>
          <img  onClick={() => handleClick('https://twitter.com/')} className="w-r-63 h-r-63 ml-20 cur" src={require('../../assets/web/Foot/1.png')} alt=""  />
          <img onClick={() => handleClick('https://t.me/')} className="w-r-63 h-r-63 ml-20 cur" src={require('../../assets/web/Foot/2.png')} alt=""  />          
          <img onClick={() => handleClick('https://mighty-2.gitbook.io/computeai')} className="w-r-63 h-r-63 ml-20 cur" src={require('../../assets/web/Foot/4.png')} alt=""  />          
        </div>
    </div>
  )
  // @ts-ignore
  const Mobile = ( <div id="Foot" mode="mobile">
      <div>
            <img className="w-r-78 h-r-49" src={require('../../assets/web/Foot/dc.png')} alt=""  />
            <div className='mt-5' style={{fontSize: '7px'}}>© 2024 ComputeAI, All Rights Reserved.</div>
        </div>
        <div className='flexcc'>
          <img onClick={() => handleClick('https://twitter.com/')} className="w-r-30 h-r-30 ml-5" src={require('../../assets/web/Foot/1.png')} alt=""  />
          <img onClick={() => handleClick('https://t.me/')} className="w-r-30 h-r-30 ml-5" src={require('../../assets/web/Foot/2.png')} alt=""  />          
          <img onClick={() => handleClick('https://mighty-2.gitbook.io/computeai')}  className="w-r-30 h-r-30 ml-5" src={require('../../assets/web/Foot/4.png')} alt=""  />          
        </div>
    </div>
  )
  return Common.isMobile ? Mobile : Web
}
