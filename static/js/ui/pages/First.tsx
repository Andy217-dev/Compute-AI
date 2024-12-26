
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Common } from "@/app/Common";
import {Outlet, useLocation} from "react-router-dom"
import {Navigation} from "@/ui/components/Navigation";
import {Foot} from "@/ui/components/Foot";


import './FirstPage.css'

export function FirstPage() {
  // @ts-ignore
  const Web = <div id="FirstPage" mode="web"  >
      <Navigation></Navigation>
      <Outlet></Outlet>
    <Foot></Foot>

  </div>

  // @ts-ignore
  const Mobile = <div id="FirstPage" mode="mobile" >
     <Navigation></Navigation>
    <Outlet></Outlet>
    <Foot></Foot>
  </div>
  return Common.isMobile ? Mobile : Web
}

