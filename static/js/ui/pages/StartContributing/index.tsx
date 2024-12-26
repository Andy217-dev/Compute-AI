/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
import './index.scss'
import { Common } from '@/app/Common'
import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useLocation, To } from 'react-router-dom'
import { httpGet, httpPost } from '../../../utils/httpUtils'
import { Carousel ,Popover} from 'antd';
import { Swiper } from 'antd-mobile'
export function StartContributingPage() {
  // @ts-ignore
  const Web = (<div id="StartContributingPage" mode="web">

    <div className='flexcc  w-100'>
      <div className='startBg ffs'>
          <div className='f-80'>Contribute your GPU/CPU to earn</div>
          <div className='f-44'>Monitor your usage status</div>
          <div className='f-44'>Lease the power at fair price</div>
          <div className='f-44'>Claim rewards</div>

       

          <Popover
                content={<div >coming soon</div>}
                trigger="click"
              >
                   <div className='startBgBut'>Start Contributing</div>
              
            </Popover>
      </div>
    </div>
    {/* Provider */}
    <div className='flexcc overflow-hidden mt-100'>
      <img className="w-r-1333 h-r-355" src={require('@/assets/web/start/pro.png')} alt=""  /> 
    </div>
    <div className='flexcc overflow-hidden '>
      <div className="w-r-1408 h-r-904 proBg">
          <div className='h-r-520 w-100  bgList'>
           <img className=" bgItem1  cur" src={require('@/assets/web/start/Group1.png')} alt=""  /> 
           <img className="  bgItem2 cur" src={require('@/assets/web/start/Group2.png')} alt=""  /> 
           <img className="  bgItem3 cur" src={require('@/assets/web/start/Group3.png')} alt=""  /> 
           <img className="  bgItem4 cur" src={require('@/assets/web/start/Group4.png')} alt=""  /> 
           <img className="  bgItem5 cur" src={require('@/assets/web/start/Group5.png')} alt=""  /> 
          </div>
      </div>
    </div>
    <div className='flexcc  pb-100 px-150 uti'>
      <img className="w-r-1332 h-r-355 utiImg" src={require('@/assets/web/start/uit.png')} alt=""  /> 
      <img className="w-r-1884 h-r-1176" src={require('@/assets/web/start/utiBg.png')} alt=""  /> 
    </div>
  </div>
  )



  const [switchIndex, setSwitchIndex] = useState(2)
 const switchData = (index:any) =>{
   setSwitchIndex(index)
 }
  // @ts-ignore
  const Mobile = <div id="StartContributingPage" mode="mobile">
      <div className='w-100 h-r-321'>
       <img className="w-100 h-100" src={require('@/assets/mobile/start/1.png')} alt=""  /> 
      </div>
      <div className='px-20'>
          <div className='ffs f-38'>
            <div>Contribute your</div>
            <div>GPU/CPU to earn</div>
          </div>
          <div className='ffs f-20 f-w-4 my-30'>
            Monitor your usage status <br/>
            Lease the power at fair price<br/>
            Claim rewards
          </div>
          <div className='w-r-213 h-r-38 flexcc text-white f-12 startBgBut'>Start Contributing</div>
      </div>
      <div className='mb-30'>
        <div className='text-center mt-40'>
          <div className='ffk f-76 lh-76' style={{letterSpacing: "0.22em"}}>Provider</div>
          <div className='ffs f-13 px-30' >That is, individuals or institutions with underutilized computing resources (such as GPUs and CPUs).</div>
        </div>

        <Swiper onIndexChange={index=>switchData(index)}  slideSize={70} trackOffset={15} loop stuckAtBoundary={false} defaultIndex={2} indicator={() => null}>
          <Swiper.Item >
            <div className='w-100 h-r-270 flexcc'><img  className={`w-100  ${switchIndex===0?'h-r-250':'h-r-170'}`}  src={require('@/assets/web/start/Group1.png')} alt=""  /></div>
          </Swiper.Item>
          <Swiper.Item >
            <div className='w-100 h-r-270 flexcc'><img className={`w-100  ${switchIndex===1?'h-r-250':'h-r-170'}`} src={require('@/assets/web/start/Group2.png')} alt=""  /></div>
          </Swiper.Item>
          <Swiper.Item >
            <div className='w-100 h-r-270 flexcc'><img className={`w-100  ${switchIndex===2?'h-r-250':'h-r-170'}`} src={require('@/assets/web/start/Group3.png')} alt=""  /></div>
          </Swiper.Item>
          <Swiper.Item >
            <div className='w-100 h-r-270 flexcc'><img className={`w-100  ${switchIndex===3?'h-r-250':'h-r-170'}`} src={require('@/assets/web/start/Group4.png')} alt=""  /></div>
          </Swiper.Item>
          <Swiper.Item >
            <div className='w-100 h-r-270 flexcc'><img className={`w-100  ${switchIndex===4?'h-r-250':'h-r-170'}`} src={require('@/assets/web/start/Group5.png')} alt=""  /></div>
          </Swiper.Item>
        </Swiper>
      </div>
      

    <div>
      <div className='text-center mt-40'>
        <div className='ffk f-76 lh-76' style={{letterSpacing: "0.22em"}}>Utilizer</div>
        <div className='ffs f-13 px-30' >AI application developers, large model training teams and Web3 Depin development teams that require large amounts of computing resources.</div>
      </div>
      <div className='flexcc overflow-hidden px-20 py-40'>
        <img className="w-r-340 h-r-591" src={require('@/assets/mobile/start/2.png')} alt=""  /> 
      </div>
    </div>
      
  </div>
  return Common.isMobile ? Mobile : Web
}

