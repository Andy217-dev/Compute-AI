import React from "react";
import ReactDOM from "react-dom/client";
import "./ui/css/index.css";
import "./ui/css/public.scss";
import { Provider } from "react-redux";
import { Store } from "./app/Store";
import "antd/dist/antd.css";
import "swiper/css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { FirstPage } from "./ui/pages/First";
import { HomePage } from "@/ui/pages/Home";
import { AboutPage } from "@/ui/pages/About";
import { StartContributingPage } from "@/ui/pages/StartContributing";
import { StakePage } from "ui/pages/Stake";


import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import { sepolia } from 'viem/chains';

import "./utils/rem"

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}
const projectId = '34402936887e1b09c7a3c3b32411b160'
const chains = [sepolia]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })
createWeb3Modal({ wagmiConfig, projectId, chains })


root.render(
<WagmiConfig config={wagmiConfig}  >
<Router>
    <Provider store={Store}>
      <Routes>
         <Route path="/" element={<FirstPage />}>
             <Route path="/stake" element={<StakePage />}></Route>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/about" element={<AboutPage />}></Route>
            <Route path="/startContributing" element={<StartContributingPage />}></Route>
         </Route>
      </Routes>
    </Provider>
  </Router>

</WagmiConfig>
 
);
