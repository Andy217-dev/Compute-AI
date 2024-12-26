/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
import USDT_DSC_LP_ABI from '@/conf/abi/USDT-DSC-LP-ABI.json';
import V2Wrapper_ABI from '@/conf/abi/V2Wrapper-ABI.json';
import './index.scss'
import PrDataContext from '@/ui/pages/Stake/prDataContext';
import {Common} from '@/app/Common'
import {useEffect, useState, useRef} from 'react'
import {Link, useNavigate, useLocation, To} from 'react-router-dom'
import {httpGet, httpPost} from '../../../utils/httpUtils'
import {Carousel, Popover} from 'antd';
import {Swiper, Toast} from 'antd-mobile'
import {LeftOutline, RightOutline} from 'antd-mobile-icons'
import {gsap} from "gsap";
import {ScrollToPlugin} from "gsap/ScrollToPlugin";
import {ethers} from "ethers";

gsap.registerPlugin(ScrollToPlugin);


export function StakePage() {
    const navigate = useNavigate()
    const skip = (url: To) => {
        navigate(url)
    }

    // 初始化组件状态 1-未连接钱包 2-未授权钱包 3-没有做过质押 4-做了抵押
    const [businessStatus, setBusinessStatus] = useState(1);

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
        gsap.to(".StartBut1", {rotation: 360, x: 0, duration: 1})
        gsap.to(".StartBut2", {rotation: -360, x: 0, duration: 1})
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


    const [showOne, setShowOne] = useState({
        scrollTop700: false, scrollTop800: false,
        scrollTop900: false,
        scrollTop1000: false,
        scrollTop1100: false
    });


    useEffect(function () {
        window.addEventListener('scroll', function (e) {
            const scrollTop = document.documentElement.scrollTop;
            if (Common.isMobile) {
                if (scrollTop > 40) {
                    showOne.scrollTop700 = true;
                    setShowOne({...showOne});
                }
                if (scrollTop > 120) {
                    showOne.scrollTop800 = true;
                    setShowOne({...showOne});
                }
                if (scrollTop > 200) {
                    showOne.scrollTop900 = true;
                    setShowOne({...showOne});
                }

                if (scrollTop > 240) {
                    showOne.scrollTop1000 = true;
                    setShowOne({...showOne});
                }

                if (scrollTop > 340) {
                    showOne.scrollTop1100 = true;
                    setShowOne({...showOne});
                }
            } else {
                if (scrollTop > 350) {
                    showOne.scrollTop700 = true;
                    setShowOne({...showOne});
                }
                if (scrollTop > 630) {
                    showOne.scrollTop800 = true;
                    setShowOne({...showOne});
                }
                if (scrollTop > 750) {
                    showOne.scrollTop900 = true;
                    setShowOne({...showOne});
                }

                if (scrollTop > 900) {
                    showOne.scrollTop1000 = true;
                    setShowOne({...showOne});
                }
            }

        })

    }, [])


    const [rewardPerDay, setRewardPerDay] = useState(0.000000);
    const [pr_Earned, setPr_Earned] = useState(0.000000);
    const [pr_Staked_Liquidity, setPr_Staked_Liquidity] = useState(0.000000);
    const [pr_APR, setPr_APR] = useState(0.00);

    function amountFixed(amount: number) {
        return Number(amount).toFixed(6)
    }

    function amountFixedV2(amount: number, digits: number) {
        return Number(amount).toFixed(digits)
    }

    // @ts-ignore
    const Web = (<div id="HomePage" mode="web">
            <div className='w-100 h-r-830 HomeTop'>
                <div className='pr-title'>
                    <img src={require('@/assets/mobile/Products/img.png')} alt=""/>
                    <div className='pr-title-h1'>DSC-USDT LP</div>
                    <div className='pr-token-info pr-one'>
                        <div>APR</div>
                        <div className='pr-title-txt'>{amountFixedV2(pr_APR, 2)}%</div>
                    </div>
                    <div className='pr-token-info'>
                        <div>Earned</div>
                        <div>${amountFixed(pr_Earned)}</div>
                    </div>
                    <div className='pr-token-info pr-left'>
                        <div>Staked Liquidity</div>
                        <div>${amountFixed(pr_Staked_Liquidity)}</div>
                    </div>
                    <div className='pr-help'>
                        <img src={require('@/assets/mobile/Products/img_1.png')} alt=""/>
                    </div>
                    <div className='pr-token-info'>
                        <div>Reward Per Day</div>
                        <div>{amountFixedV2(rewardPerDay, 2)} DSC</div>
                    </div>
                </div>
                <div className='pr-content'>
                    <div className='pr-add-button'>
                        <a className={'pr-add-button-a'}
                           href={'https://app.uniswap.org/#/add/v2/0xdac17f958d2ee523a2206206994597c13d831ec7/0xComingSoon?chain=bsc'}
                           target="_blank">
                            <div className='pr-button'>
                                Add DSC-USDT LP
                            </div>
                        </a>
                        <div className='pr-button-link'>
                            <span>View Info</span>
                            <a href={'https://pancakeswap.finance/info/pairs/0x06ba915b8d97aa4e80b6579e58620619a988c6d9?chain=bsc'}
                               target="_blank">
                                <img src={require('@/assets/mobile/Products/img_2.png')} alt=""/>
                            </a>
                        </div>
                        <div className='pr-button-link'>
                            <span>View Contract</span>
                            <a href={'https://bscscan.com/address/0xComingSoon'}
                               target="_blank">
                                <img src={require('@/assets/mobile/Products/img_3.png')} alt=""/>
                            </a>
                        </div>
                    </div>
                    <div className='pr-data-list'>
                        <PrDataContext status={businessStatus}
                                       token={'DSC-USDT LP'}
                                       tokenContractABI={USDT_DSC_LP_ABI}
                                       tokenContractAddress={'0x06ba915b8d97aa4e80b6579e58620619a988c6d9'}
                                       V2WrapperABI={V2Wrapper_ABI}
                                       V2WrapperAddress={"0x2F33FF558dea1A3b5C61c14b7C198E715e524402"}
                                       setPr_Earned={setPr_Earned}
                                       setPr_Staked_Liquidity={setPr_Staked_Liquidity}
                                       setPr_APR={setPr_APR}
                                       setReward_PerDay={setRewardPerDay}
                        />
                    </div>
                </div>
            </div>
        </div>
    )

    const SwiperRef = useRef();
    // @ts-ignore
    const Mobile = <div id="HomePage" mode="mobile">
        <div className='w-100 h-r-830 HomeTop'>
            <div className='pr-title'>
                <div>
                    <img src={require('@/assets/mobile/Products/img.png')} alt=""/>
                    <div className='pr-title-h1'>DSC-USDT LP</div>
                </div>
                <div>
                    <div className='pr-token-info pr-one pr-apr'>
                        <div>APR</div>
                        <div className='pr-title-txt'>{amountFixedV2(pr_APR, 2)}%</div>
                    </div>
                    <div className='pr-token-info'>
                        <div>Earned</div>
                        <div>${amountFixed(pr_Earned)}</div>
                    </div>
                </div>
                <div>
                    <div className='pr-token-info pr-left pr-staked'>
                        <div>Staked Liquidity</div>
                        <div>${amountFixed(pr_Staked_Liquidity)}</div>
                    </div>
                    <div className='pr-token-info'>
                        <div>Reward Per Day</div>
                        <div>{amountFixedV2(rewardPerDay, 2)} DSC</div>
                    </div>
                </div>
            </div>
            <div className='pr-content'>
                <div className='pr-data-list'>
                    <PrDataContext status={businessStatus}
                                   token={'DSC-USDT LP'}
                                   tokenContractABI={USDT_DSC_LP_ABI}
                                   tokenContractAddress={'0x06ba915b8d97aa4e80b6579e58620619a988c6d9'}
                                   V2WrapperABI={V2Wrapper_ABI}
                                   V2WrapperAddress={"0x2F33FF558dea1A3b5C61c14b7C198E715e524402"}
                                   setPr_Earned={setPr_Earned}
                                   setPr_Staked_Liquidity={setPr_Staked_Liquidity}
                                   setPr_APR={setPr_APR}
                                   setReward_PerDay={setRewardPerDay}
                    />
                </div>
                <div className='pr-add-button'>
                    <a className={'pr-add-button-a'}
                       href={'https://app.uniswap.org/#/add/v2/0xdac17f958d2ee523a2206206994597c13d831ec7/0xComingSoon?chain=bsc'}
                       target="_blank">
                        <div className='pr-button'>
                            Add DSC-USDT LP
                        </div>
                    </a>
                    <div className={'pr-add-button-link-div'}>
                        <div className='pr-button-link'>
                            <span>View Info</span>
                            <a href={'https://pancakeswap.finance/info/pairs/0x06ba915b8d97aa4e80b6579e58620619a988c6d9?chain=bsc'}
                               target="_blank">
                                <img src={require('@/assets/mobile/Products/img_2.png')} alt=""/>
                            </a>
                        </div>
                        <div className='pr-button-link'>
                            <span>View Contract</span>
                            <a href={'https://bscscan.com/address/0xComingSoon'}
                               target="_blank">
                                <img src={require('@/assets/mobile/Products/img_3.png')} alt=""/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    return Common.isMobile ? Mobile : Web
}

