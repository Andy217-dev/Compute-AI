/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
import './index.scss'
import { Common } from '@/app/Common'
import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useLocation, To } from 'react-router-dom'
import { httpGet, httpPost } from '../../../utils/httpUtils'
import { Carousel ,Popover} from 'antd';
import { Swiper,Toast } from 'antd-mobile'
import { LeftOutline,RightOutline } from 'antd-mobile-icons'
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);


export function HomePage() {
  const navigate = useNavigate()
  const skip = (url: To) => {
    navigate(url)
  }

  useEffect(() => {
    const t = gsap.timeline({});
    t.to(".char", {
      opacity: 1,
      delay: .1,
      duration: .5,
      y: 0,
      ease: "Power4.inOut",
      stagger: 0.1,
    })
    gsap.to(".StartBut1", { rotation: 360, x: 0, duration: 1})
    gsap.to(".StartBut2", { rotation: -360, x: 0, duration: 1})
  }, [])


  const CarouselRef = useRef();
  const prev = () => {
    // @ts-ignore
    CarouselRef.current.prev();
  };
  const next = () => {
    // @ts-ignore
    CarouselRef.current.next();
  };

  
  const  [ showOne,setShowOne ]  =  useState({scrollTop700:false,scrollTop800:false,
    scrollTop900:false,
    scrollTop1000:false,
    scrollTop1100:false
  });


  useEffect(  function(){
    window.addEventListener('scroll',function(e){
       const scrollTop = document.documentElement.scrollTop;
       if(Common.isMobile){
        if(scrollTop > 40){
          showOne.scrollTop700=true;
          setShowOne({...showOne});
        }
        if(scrollTop > 120){
          showOne.scrollTop800=true;
          setShowOne({...showOne});
        }
        if(scrollTop > 200){
          showOne.scrollTop900=true;
          setShowOne({...showOne});
        }

        if(scrollTop > 240){
          showOne.scrollTop1000=true;
          setShowOne({...showOne});
        }

        if(scrollTop > 340){
          showOne.scrollTop1100=true;
          setShowOne({...showOne});
        }
       }else{
        if(scrollTop > 350){
          showOne.scrollTop700=true;
          setShowOne({...showOne});
        }
        if(scrollTop > 630){
          showOne.scrollTop800=true;
          setShowOne({...showOne});
        }
        if(scrollTop > 750){
          showOne.scrollTop900=true;
          setShowOne({...showOne});
        }

        if(scrollTop > 900){
          showOne.scrollTop1000=true;
          setShowOne({...showOne});
        }
       }
        
    })

  },[])



  // @ts-ignore
  const Web = (<div id="HomePage" mode="web">
    <div className='w-100 h-r-830 HomeTop'>
        <div  className='Pioneering flexcc'>
          <div className=' char'>Pioneeringr</div>
          <div className='mx-20 char'>the</div>
          <div className=' char'>Futurer</div>
          <div className='mx-20 char'>of</div>
          <div className=' char'>Computing</div>
          <div className='mx-20 char'>Power</div>
        </div>
        <div className='f-44 ffs'> Leverage AI computing power across a global network</div>
        <div className='StartBut flexc'>
          <div className='StartBut1'>
            <div className='StartButCon cur' onClick={() => skip('/StartContributing')}>
              <div className='f-20 ffi'>Start Contributing</div>
              <div>（for provider）</div>
            </div>
          </div>
          <div className='StartBut2'>
          
            <Popover
                content={<div >coming soon</div>}
                trigger="click"
              >
                  <div className='StartButU cur'>
                      <div className='f-20 ffi'> Start Utilizing</div>
                      <div> (for user)</div>
                  </div>
              
            </Popover>
          </div>
        </div>
        <div className="enable-animation">
        <div className="marquee">
          <ul className="marquee__content">
              <div className="marquee__item">
                <img className="w-101 h-r-70" src={require('@/assets/web/Home/s.png')} alt=""  />
              </div>
            </ul>
            <ul aria-hidden="true" className="marquee__content">
            <div className="marquee__item">
                <img className="w-101 h-r-70" src={require('@/assets/web/Home/s.png')} alt=""  />
              </div>
            </ul>
          </div>
        </div>
    </div>


    {/* <div className='flexcc w-100'>
     <img className="w-r-1769 h-r-1756" src={require('@/assets/web/Home/h2.png')} alt=""  />
    </div> */}

    <div className='flexdc position-relative'>
        <div  className={showOne.scrollTop700? 'fontscom fontscom1 ffk  fade-in-content':'fontscom fontscom1 ffk   fade-in-hiden'} >COLLABORATE</div>
        <div  className={showOne.scrollTop800? 'fontscom fontscom2 ffk my-40  fade-in-content':'fontscom fontscom2 ffk my-40   fade-in-hiden'}  >CONTRIBUTE</div>
        <div className={showOne.scrollTop900? 'fontscom fontscom3 ffk  fade-in-content':'fontscom fontscom3 ffk  fade-in-hiden'}  >CONNECT</div>
        <div className={showOne.scrollTop1000? 'Match ffs my-40  fade-in-content':'Match ffs my-40  fade-in-hiden'} >Match Decentralized Super Computing Power for AI large models</div>
    </div>


    <div className='flexdc position-relative'>
        <div className='text-center w-100 h-r-782' style={{overflowY:"auto"}}>
        <img loading="lazy" className="w-r-1666 h-r-782" src={require('@/assets/web/Home/gun1.png')} alt=""  /> 
        </div>
        <div className='flexcc w-100 position-absolute t-480'>
            <img className="w-r-1408 h-r-970" src={require('@/assets/web/Home/hb.png')} alt=""  />
        </div> 
    </div>

    <div className='WHYDSC'>
      <div className='flexcc w-100 ffk f-222'  style={{letterSpacing: "0.22em"}}>Why ComputeAI?</div>
      <div className='w-90 flexsb'>
        <img onClick={() => prev()} className="w-r-68 h-r-81 cur" src={require('@/assets/web/Home/l.png')} alt=""  />
        <div className='w-r-1400 h-r-654'>
        <Carousel   dots={false} ref={CarouselRef}>
        <img className="w-r-1400 h-r-654" src={require('@/assets/web/Home/sw.png')} alt=""  /> 
        <img className="w-r-1400 h-r-654" src={require('@/assets/web/Home/sw.png')} alt=""  /> 
        </Carousel>
        </div>
        <img onClick={() => next()} className="w-r-68 h-r-81 cur" src={require('@/assets/web/Home/r.png')} alt=""  />
      </div>
    </div>

    <div className='flexcc overflow-hidden my-100'>
      <img className="w-r-2330 h-r-355" src={require('@/assets/web/Home/Frame3.png')} alt=""  /> 
    </div>
    <div className='flexcc overflow-hidden my-100'>
      <img className="w-r-2200 h-r-200" src={require('@/assets/web/Home/Frame4.png')} alt=""  /> 
    </div>
    <div className='flexcc overflow-hidden '>
      <img className="w-r-1640 h-r-760" src={require('@/assets/web/Home/Frame5.png')} alt=""  /> 
    </div>
    <div className='flexcc overflow-hidden '>
      <img className="w-r-1141 h-r-522" src={require('@/assets/web/Home/roadmap.png')} alt=""  /> 
    </div>
    <div className='pb-100'>
      <div className='text-center w-100 h-r-800' style={{overflowY:"auto"}}>
        <img loading="lazy" className="w-r-1621 h-r-1628" src={require('@/assets/web/Home/Frame6.png')} alt=""  /> 
      </div>
    </div>
    
  </div>
  )




  const SwiperRef = useRef();
  // @ts-ignore
  const Mobile = <div id="HomePage" mode="mobile">
    <div className='HomePageBg'>
        <div className='f-38 ffs'>Pioneering the </div>
        <div className='f-38 ffs'>Future of </div>
        <div className='f-38 ffs'>Computing Power</div>
        <div className='f-19 ffs'>
          <div >Leverage AI computing power</div>
          <div >across a global network</div>
        </div>
        <div className='StartBut f-12 mt-40 mb-20' onClick={() => skip('/StartContributing')}>
          <div className='f-12'>Start Contributing</div>
          <div className=''>（for provider）</div>
        </div>
        <div onClick={()=>{
            Toast.show({
              content: 'coming soon',
              position: 'top',
            })

        }}     className='StartBut' style={{backgroundColor:"#185CFF"}}>
          <div className='f-12'>Start Utilizing</div>
          <div className=''>（for user)</div>
        </div>
    </div>
    {/* <div className='w-100 pt-50 pb-20'>
      <img className="w-100 h-r-32" src={require('@/assets/mobile/Home/2.png')} alt=""  />
    </div> */}

    <div className="enable-animation">
        <div className="marquee">
           <ul className="marquee__content">
              <div className="marquee__item">
              <img className="w-100 h-r-32" src={require('@/assets/mobile/Home/2.png')} alt=""  />
              </div>
            </ul>
            <ul aria-hidden="true" className="marquee__content">
            <div className="marquee__item">
            <img className="w-100 h-r-32" src={require('@/assets/mobile/Home/2.png')} alt=""  />
              </div>
            </ul>
          </div>
        </div>

    <div className='w-100'>
      <div className='flexcc flex-wrap'>
          <img className={showOne.scrollTop700? 'w-96 h-r-66 fade-in-content':'w-r-273 h-r-74 fade-in-hiden'}  src={require('@/assets/mobile/Home/c_1.png')} alt=""  /> 
          <img  className={showOne.scrollTop800? 'mt-20 w-r-318 h-r-74 fade-in-content':'w-r-318 h-r-74 fade-in-hiden'}  src={require('@/assets/mobile/Home/c_2.png')} alt=""  /> 
          <img className={showOne.scrollTop900? 'w-r-248 h-r-74 fade-in-content':'w-r-248 h-r-74 fade-in-hiden'}  src={require('@/assets/mobile/Home/c_3.png')} alt=""  /> 
          <img className={showOne.scrollTop1000? 'w-319 h-r-24 fade-in-content':' w-319 h-r-24 fade-in-hiden'} src={require('@/assets/mobile/Home/c_4.png')} alt=""  /> 
          <img className={showOne.scrollTop1100? 'w-98 h-r-292 fade-in-content':'w-98 h-r-292  fade-in-hiden'}  src={require('@/assets/mobile/Home/3.png')} alt=""  /> 
      </div>
      <div className='w-100 px-20 ffs'>
       ComputeAI is an AI computing power service platform that provides computing power incentives, computing power leasing, distribution and applications.
      </div>
      <div className='w-100 p-20 ffs'>
      It also has decentralized coordination and incentives for both supply and demand parties to expand computing power scale.
       </div>
    </div>

    {/* why */}
    <div className='px-20'>
      <div className='flexcc w-100 ffk f-67'  style={{letterSpacing: "0.22em"}}>Why ComputeAI?</div>
      <div className='w-100 swiperBox'>
        <Swiper  allowTouchMove={false} ref={SwiperRef} loop indicator={() => null}>
          <Swiper.Item >
            <div  className='w-100 h-r-159' >
            <img className="w-100 h-100" src={require('@/assets/web/Home/sw.png')} alt=""  /> 
            </div>
          </Swiper.Item>
          {/* <Swiper.Item >
            <div  className='w-100 h-r-159' >
            <img className="w-100 h-100" src={require('@/assets/web/Home/sw.png')} alt=""  /> 
            </div>
          </Swiper.Item> */}
          </Swiper>
          {/* <div className='swiperLeft'  onClick={() => {
                SwiperRef.current?.swipePrev()
              }}><LeftOutline fontSize={24} /></div>
          <div  className='swiperRight'  onClick={() => {
                SwiperRef.current?.swipeNext()
              }}><RightOutline  fontSize={24}/></div> */}
      </div>
     
    </div>
   
    <div className='w-100'>
      <div className='w-100 overflow-hidden my-20'>
        <img className="w-r-388 h-r-291" src={require('@/assets/mobile/Home/4.png')} alt=""  />
      </div>
      <div className='w-100 overflow-hidden pb-20'>
        <img className="w-r-390 h-r-150" src={require('@/assets/mobile/Home/5.png')} alt=""  />
      </div>
      <div className='w-100 overflow-hidden px-20'>
        <img className="w-r-360 h-r-520" src={require('@/assets/mobile/Home/7.png')} alt=""  />
      </div>
      <div className='w-100 overflow-hidden flexcc pb-30'>
        <img className="w-r-400 h-r-874" src={require('@/assets/mobile/Home/8.png')} alt=""  />
      </div>
    </div>
  </div>
  return Common.isMobile ? Mobile : Web
}

