/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
import './index.scss'
import { Common } from '@/app/Common'
import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useLocation, To } from 'react-router-dom'
import { httpGet, httpPost } from '../../../utils/httpUtils'
import { Carousel } from 'antd';
export function AboutPage() {
  // @ts-ignore
  const Web = (<div id="AboutPage" mode="web">
    <div className='DCS'>
      <div className='DCSbox'>
        <div className='w-r-950 ffs f-44'>
          <div>DSC aims to democratize access to advanced computing resources. </div>
          <div className='my-30'>We empower innovators around the world by providing scalable, secure, and cost-effective AI computing power.</div>
          <div>By harnessing underutilized computing resources, we aim to accelerate AI research and development, enabling breakthroughs that push the boundaries of what's possible.</div>
        </div>    
     </div>
    </div>
    <div className='flexcc overflow-hidden my-100'>
      <img className="w-r-15720 h-r-438" src={require('@/assets/web/about/1.png')} alt=""  /> 
    </div>
    <div className='flexcc overflow-hidden pb-100'>
      <img className="w-r-15720 h-r-420" src={require('@/assets/web/about/2.png')} alt=""  /> 
    </div>
  </div>
  )
  // @ts-ignore
  const Mobile = <div id="AboutPage" mode="mobile">
    <div className='DCS px-20 ffs f-19 pt-130'>
      <div>DSCAim to democratize access to advanced computing resources.</div>
      <div className='my-30'>We empower innovators around the world by providing scalable, secure, and cost-effective AI computing power.</div>
      <div>By harnessing underutilized computing resources, we aim to accelerate AI research and development, enabling breakthroughs that push the boundaries of what's possible.</div>
    </div>
    <div className='flexcc overflow-hidden pt-50'>
      <img className="w-r-328 h-r-268" src={require('@/assets/mobile/about/2.png')} alt=""  /> 
    </div>
    <div className='flexcc overflow-hidden py-50'>
      <img className="w-r-328 h-r-268" src={require('@/assets/mobile/about/1.png')} alt=""  /> 
    </div>

  </div>
  return Common.isMobile ? Mobile : Web
}

