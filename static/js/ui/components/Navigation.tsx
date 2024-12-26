import './Navigation.scss'
import {Common} from '../../app/Common'
import {useEffect, useState} from 'react'
import {Button, Radio, Dropdown, Menu} from 'antd'
import {Popover, Toast} from 'antd-mobile'
import {CloseOutline} from 'antd-mobile-icons'
import {To, useNavigate, useLocation} from 'react-router-dom'
import {useWeb3Modal} from '@web3modal/wagmi/react'
import {useAccount, useDisconnect} from 'wagmi'
import type {MenuProps} from 'antd'

export function Navigation() {
    const {open, close} = useWeb3Modal()
    const {address, isConnecting, isDisconnected} = useAccount()
    const navigate = useNavigate()
    const skip = (url: To, type: string) => {
        if (type) {
            navigate(url, {state: {type: type}})
        } else {
            navigate(url)
        }
    }
    const {disconnect} = useDisconnect()

    function formtterAddress(address: any) {
        if (address) {
            return (
                address.substring(0, 5) +
                '...' +
                address.substring(address.length - 4, address.length)
            )
        }
        return ''
    }

    function logo() {
        return (
            <div className="flexcc cur" onClick={() => skip('/', '')}>
                <img
                    className="w-r-104 h-r-67"
                    src={require('../../assets/web/logo.png')}
                    alt=""
                />
            </div>
        )
    }

    // @ts-ignore
    const Web = (<div id="navigation" mode="web">
            {/* 占位 */}
            <div
                className="h-r-100 w-100 "
                style={{backgroundColor: 'rgba(18, 18, 18, 1)'}}></div>
            <div className="navigation">
                <div>{logo()}</div>
                <div className="flexcc navList h-100">
                    <div className="ml-75 navItem cur" onClick={() => skip('/', '')}>
                        <Popover
                            content={<div>products</div>}
                            trigger="click"
                        >
                            <span>Products</span>
                        </Popover>
                    </div>
                    <div className="ml-75 navItem cur" onClick={() => skip('/stake', '')}>
                        <Popover
                            content={<div>stake</div>}
                            trigger="click"
                        >
                            <span>Stake</span>
                        </Popover>
                    </div>
                    <div className="ml-75 navItem cur" onClick={() => skip('/', '')}>
                        <Popover
                            content={<div>coming soon</div>}
                            trigger="click"
                        >
                            <span>Rent</span>
                        </Popover>
                    </div>
                    <div className="ml-75 navItem cur" onClick={() => skip('/about', '')}>
                        About
                    </div>
                    {address ? (
                        <div onClick={() => open()} className="ml-75 web3But">
                            <span style={{color: "white", fontSize: "20px", marginRight: 5}}>●</span>
                            {formtterAddress(address)}</div>
                    ) : (
                        <div className="ml-75 web3But" onClick={() => open()}>
                            <span style={{color: "back", fontSize: "20px", marginRight: 5}}>●</span>
                            Connect Wallet
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    const actions: Action[] = [
        {key: 'Products', text: 'Products'},
        {key: 'Stake', text: 'Stake'},
        {key: 'Rent', text: 'Rent'},
        {key: 'About', text: 'About'},
    ]

    const selAction = (node: any) => {
        console.log(node);
        if (node.key === 'About') {
            skip('/about', '')
        }
        else if (node.key === 'Products') {
            skip('/', '')
        }
        else if (node.key === 'Rent') {
            skip('/', '')
        }
        else if (node.key === 'Stake') {
            skip('/stake', '')
        } else {
            Toast.show({
                content: 'coming soon',
                position: 'top',
            })
        }

    }
    // @ts-ignore
    const Mobile = (<div id="navigation" mode="mobile">
            <div
                className="w-100 h-r-80"
                style={{backgroundColor: 'rgba(18, 18, 18, 1)'}}></div>
            <div className='navigation'>
                <div className="w-r-58 h-r-38" onClick={() => skip('/', '')}>
                    <img
                        className="w-100 h-100"
                        src={require('@/assets/mobile/logo.png')}
                        alt=""
                    />
                </div>
                <div className="flexcc">
                    {address ? (
                        <div onClick={() => open()} className="mr-20 web3But ">
                            <span style={{color: "white", fontSize: "20px", marginRight: 5}}>●</span>
                            {formtterAddress(address)}</div>
                    ) : (
                        <div className="mr-20 web3But" onClick={() => open()}>
                            <span style={{color: "black", fontSize: "20px"}}>●</span>
                            Connect Wallet
                        </div>
                    )}

                    <div className="w-r-28 h-r-28">
                        <Popover.Menu
                            mode="dark"
                            className="pop"
                            actions={actions.map((action) => ({
                                ...action,
                                icon: null,
                            }))}
                            onAction={(node) => selAction(node)}
                            placement="bottom-start"
                            destroyOnHide={true}
                            trigger="click">
                            <img
                                className="w-r-28 h-r-28"
                                src={require('@/assets/mobile/nav.png')}
                                alt=""
                            />
                        </Popover.Menu>
                    </div>

                </div>
            </div>
        </div>
    )
    return Common.isMobile ? Mobile : Web
}
