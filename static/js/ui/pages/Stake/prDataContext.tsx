import './index.scss'
import React, {useEffect, useRef, useState} from 'react';
import {message} from 'antd';
import {useWeb3Modal, useWeb3ModalState} from '@web3modal/wagmi/react'
import {useAccount, useDisconnect} from 'wagmi'
import Modal from "@/ui/pages/Stake/modal";
import Web3 from "web3";
import {BigNumber, ethers} from "ethers";
import Decimal from 'decimal.js';

let interval: any = [];

// @ts-ignore
function PrDataContext({
                           status,
                           token,
                           tokenContractABI,
                           tokenContractAddress,
                           V2WrapperABI,
                           V2WrapperAddress,
                           setPr_Earned,
                           setPr_Staked_Liquidity,
                           setPr_APR,
                           setReward_PerDay
                       }) {
    const {open, close} = useWeb3Modal()
    const {disconnect} = useDisconnect()
    let {address, connector, isConnecting, isDisconnected} = useAccount()
    const [isAddModalOpen, setAddIsModalOpen] = useState(false);
    const [isSubtractModalOpen, setSubtractIsModalOpen] = useState(false);
    const MAX_UINT256 = BigNumber.from("115792089237316195423570985008687907853269984665640564039457584007913129639935");
    let web3 = new Web3('https://bsc-dataseed.binance.org');
    let contractWeb3 = new web3.eth.Contract(tokenContractABI, tokenContractAddress);
    let wrapperWeb3 = new web3.eth.Contract(V2WrapperABI, V2WrapperAddress);
    const [businessStatus, setBusinessStatus] = useState(status);

    // 切换使用 钱包的 provider
    useEffect(() => {
        if (connector) {
            connector.getProvider().then((provider) => {
                // 如果已经连接了钱包，使用钱包的RPC端点
                web3 = new Web3(provider);
                contractWeb3 = new web3.eth.Contract(tokenContractABI, tokenContractAddress);
                wrapperWeb3 = new web3.eth.Contract(V2WrapperABI, V2WrapperAddress);
            });
        } else {
            // 如果没有连接钱包，使用默认的RPC端点
            web3 = new Web3('https://bsc-dataseed.binance.org');
            contractWeb3 = new web3.eth.Contract(tokenContractABI, tokenContractAddress);
            wrapperWeb3 = new web3.eth.Contract(V2WrapperABI, V2WrapperAddress);
        }
    }, [connector]);

    // 用户资产信息
    let [userBalance, setUserBalance] = useState(new Decimal('0.000000'));
    let [userStake, setUserStake] = useState(new Decimal('0.000000'));
    let [userIncome, setUserIncome] = useState(new Decimal('0.000000'));
    let [stakeLP, setStakeLP] = useState(new Decimal('0.000000'));
    let [unStakeLP, setUnStakeLP] = useState(new Decimal('0.000000'));
    let [totalStaked, setTotalStaked] = useState(new Decimal('0.000000'));
    let [rewardPerDay, setRewardPerDay] = useState(new Decimal('0.000000'));

    // 获取代币精度 默认18
    let decimals = 18;
    // Unit 转 高精度 Decimal
    function units2Decimal(unitNum: number) {
        return new Decimal(ethers.utils.formatUnits(unitNum, decimals))
    }

    const hasInitialized = useRef(false);

    useEffect(() => {
        if (!hasInitialized.current) {
            // 获取精度
            contractWeb3.methods.decimals().call()
                .then((data: any) => {
                    decimals = data
                })

            // 获取LP/每天奖励数量
            wrapperWeb3.methods.rewardPerSecond().call()
                .then((data: any) => {
                    let rewardPerSecond = Number(ethers.utils.formatUnits(data, 18));
                    setReward_PerDay(rewardPerSecond * 60 * 60 * 24)
                    setRewardPerDay(new Decimal(rewardPerSecond * 60 * 60 * 24))
                })


            // 计算汇率
            contractWeb3.methods.getReserves().call()
                .then((data: any) => {
                    DSC_USDT_Rate = units2Decimal(data._reserve0).dividedBy(units2Decimal(data._reserve1));
                    setDSC_USDT_Rate(units2Decimal(data._reserve0).dividedBy(units2Decimal(data._reserve1)));
                    reserve0 = units2Decimal(data._reserve0);
                    setReserve0State(units2Decimal(data._reserve0))
                    reserve1 = units2Decimal(data._reserve1);
                    setReserve1State(units2Decimal(data._reserve1))
                });

            // 计算对应代币汇率
            contractWeb3.methods.totalSupply().call().then((data: any): void => {
                let totalSupply = units2Decimal(data)
                LP_USDT_Rate = reserve0.dividedBy(totalSupply);
                LP_DSC_Rate = reserve1.dividedBy(totalSupply);
                setLP_USDT_Rate(reserve0.dividedBy(totalSupply));
                setLP_DSC_Rate(reserve1.dividedBy(totalSupply));
            });

            contractWeb3.methods.balanceOf(V2WrapperAddress).call()
                .then((data: any) => {
                    setPr_Staked_Liquidity(lp2UsdtAndDsc(units2Decimal(data)))
                    setTotalStaked(new Decimal(ethers.utils.formatUnits(data, 18)))
                })

            hasInitialized.current = true;
        }
    }, []);

    // 汇率
    let [DSC_USDT_Rate, setDSC_USDT_Rate] = useState(new Decimal('0'));
    let [reserve0, setReserve0State] = useState(new Decimal('0'));
    let [reserve1, setReserve1State] = useState(new Decimal('0'));
    let [LP_DSC_Rate, setLP_DSC_Rate] = useState(new Decimal('0'));
    let [LP_USDT_Rate, setLP_USDT_Rate] = useState(new Decimal('0'));

    useEffect(() => {
        setPr_APR(getPoolApr(LP_USDT_Rate, DSC_USDT_Rate, totalStaked, rewardPerDay));
    }, [LP_USDT_Rate, DSC_USDT_Rate, totalStaked, rewardPerDay]);

    // 汇率转换
    function lp2DSC(lpNum: Decimal) {
        return lpNum.times(LP_DSC_Rate).times(DSC_USDT_Rate);
    }

    function lp2UsdtAndDsc(lpNum: Decimal) {
        return lpNum.times(LP_DSC_Rate.times(DSC_USDT_Rate.times(2)));
    }

    function dsc2Usdt(amount: Decimal) {
        return amount.times(DSC_USDT_Rate);
    }

    // 固定6位展示金额
    function ensureSixDecimals(amount: Decimal) {
        let fixAmount = amount.toNumber().toFixed(6);
        return amount.toNumber() < 0 ? '0.000000' : fixAmount
    }

    const getPoolApr = (
        lpPrice: Decimal | null,
        dscPrice: Decimal | null,
        totalStaked: Decimal | null,
        rewardPerDay: Decimal | null,
    ): number | '0.00' => {
        console.log(lpPrice?.toNumber(), dscPrice?.toNumber(), totalStaked?.toNumber(), rewardPerDay?.toNumber())
        if (lpPrice === null || dscPrice === null || totalStaked === null || rewardPerDay === null) {
            return '0.00'
        }

        const totalRewardPricePerYear = (dscPrice.times(rewardPerDay)).mul(365)
        const totalStakingTokenInPool = lpPrice.times(totalStaked)
        const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
        return apr.isNaN() || !apr.isFinite() ? '0.00' : apr.toNumber()
    }

    const openAddModal = () => {
        setUserBalanceSnapshot(userBalance);
        setUserStakeSnapshot(userStake);
        setAddIsModalOpen(true);
    };

    const closeAddModal = () => {
        setAddIsModalOpen(false);
        setUnStakeLP(new Decimal('0'))
        setStakeLP(new Decimal('0'))
        handleStakeClick(0)
        setStakeLPCommit(0)
    };

    const openSubtractModal = () => {
        setUserBalanceSnapshot(userBalance);
        setUserStakeSnapshot(userStake);
        setSubtractIsModalOpen(true);
        setStakeLPCommit(0)
    };

    const closeSubtractModal = () => {
        setSubtractIsModalOpen(false);
        handleStakeClick(0)
        setUnStakeLP(new Decimal('0'))
        setStakeLP(new Decimal('0'))
    };

    useEffect(() => {
        if (address) {
            if (isDisconnected) {
                cleanData()
                return
            }

            userInfoLoad();
            let walletAddress = localStorage.getItem("walletAddress");
            if (walletAddress) {
                addInterval();
                localStorage.setItem('walletAddress', address);
            }
            if (!walletAddress) {
                message.success('Successfully connected to your electronic wallet.');
                localStorage.setItem('walletAddress', address);
                addInterval();
            }
            if (localStorage.getItem('wallet-enable-' + address) != 'ok') {
                setBusinessStatus(2);
            }
            // 查看钱包是否已授权过
            if (localStorage.getItem('wallet-enable-' + address) == 'ok') {
                if (userStake.equals(new Decimal('0'))) {
                    setBusinessStatus(4);
                } else {
                    setBusinessStatus(3);
                }
            }
        } else {
            cleanData()
        }
    }, [address]);


    // 如果断开了钱包链接
    useEffect(() => {
        if (isDisconnected) {
            cleanData()
        }
    }, [isDisconnected]);


    // 清空钱包数据
    function cleanData() {
        for (let i = 0; i < interval.length; i++) {
            if (interval[i]) {
                clearInterval(interval[i])
            }
        }

        disconnect();

        setPr_Earned(0);
        setPr_APR(0)

        localStorage.removeItem('address')
        localStorage.removeItem('walletAddress')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('wallet-enable-' + address)

        setUserBalance(new Decimal('0.000000'))
        setUserIncome(new Decimal('0.000000'))
        setStakeLP(new Decimal('0.000000'))
        setUnStakeLP(new Decimal('0.000000'))
        setUserStake(new Decimal('0.000000'))

        setBusinessStatus(1);
        handleStakeClick(0)
        setPendingRewardState(0)
        setStakeLPCommit(0)
    }

    function userInfoLoad() {
        if (address) {
            let requestAddress = String(address)
            // 获取当前账户流动代币余额
            const balanceOf = contractWeb3.methods.balanceOf(requestAddress).call()
                .then((data: any) => {
                    if (requestAddress != String(address)) {
                        cleanData()
                        return null;
                    }
                    setUserBalance(units2Decimal(data))
                    return units2Decimal(data);
                })

            // 获取当前用户收益
            const pendingRewardPromis = wrapperWeb3.methods.pendingReward(requestAddress).call()
                .then((data: any) => {
                    if (requestAddress != String(address)) {
                        cleanData()
                        return null;
                    }
                    setUserIncome(units2Decimal(data))
                    setPr_Earned(dsc2Usdt(units2Decimal(data)))
                    return data;
                })

            // 获取当前账户信息
            const userInfoPromise = wrapperWeb3.methods.userInfo(requestAddress).call()
                .then((data: any) => {
                    if (requestAddress != String(address)) {
                        cleanData()
                        return null;
                    }
                    localStorage.setItem('userInfo', JSON.stringify(data));
                    // 如果投入的LP大于0
                    setUserStake(units2Decimal(data.amount))
                    if (data.amount > 0) {
                        localStorage.setItem('wallet-enable-' + address, 'ok');
                        if (requestAddress == String(address)) {
                            setBusinessStatus(4);
                        }
                    }
                    return data;
                })
        }

        // 随时更新 USDT 价格
        contractWeb3.methods.getReserves().call()
            .then((data: any) => {
                setDSC_USDT_Rate(units2Decimal(data._reserve0).dividedBy(units2Decimal(data._reserve1)));
                reserve0 = units2Decimal(data._reserve0)
                reserve1 = units2Decimal(data._reserve1)
                setReserve0State(units2Decimal(data._reserve0))
                setReserve1State(units2Decimal(data._reserve1))
            });


        // 计算对应代币汇率
        contractWeb3.methods.totalSupply().call().then((data: any): void => {
            let totalSupply = units2Decimal(data)
            LP_USDT_Rate = reserve0.dividedBy(totalSupply);
            LP_DSC_Rate = reserve1.dividedBy(totalSupply);
            setLP_USDT_Rate(reserve0.dividedBy(totalSupply));
            setLP_DSC_Rate(reserve1.dividedBy(totalSupply));
        });

        contractWeb3.methods.balanceOf(V2WrapperAddress).call()
            .then((data: any) => {
                setPr_Staked_Liquidity(lp2UsdtAndDsc(units2Decimal(data)))
                setTotalStaked(new Decimal(ethers.utils.formatUnits(data, 18)))
            })
    }

    const [stakeLPCommit, setStakeLPCommit] = useState(0);

    // stakeLP
    const stakeLPSubmission = async () => {
        if (stakeLP.equals(new Decimal('0'))) {
            message.warn('You have not selected any assets for staking.');
            return;
        }

        try {
            setStakeLPCommit(1)
            let boolean = await allowanceEnable();
            if (!boolean) {
                return
            }
            // @ts-ignore
            let promise = await connector.getProvider().then((provider) => {
                return provider;
            });
            const provider = new ethers.providers.Web3Provider(promise);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(V2WrapperAddress, V2WrapperABI, signer);

            // 获取当前网络ID
            const networkId = await provider.getNetwork().then((network: { chainId: any; }) => network.chainId);
            // 检查是否是BSC主网或测试网
            if (networkId !== 56) {
                message.warn('Please switch to Ethereum Mainnet.');
                // @ts-ignore
                window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [{
                        chainId: '0x38',
                        rpcUrls: ["https://bsc-dataseed.binance.org"],
                        chainName: "BSC",
                    }]
                });
                return false;
            }

            // @ts-ignore
            await window.ethereum.request({method: 'eth_requestAccounts'});
            const address = await signer.getAddress();


            // 对于max 临界值判断
            let stakeLPUnit = ethers.utils.parseUnits(stakeLP.toFixed(decimals), decimals);
            let userBalanceLPUnit = ethers.utils.parseUnits(String(userBalance), decimals);
            if (stakeLPUnit.gte(userBalanceLPUnit)) {
                stakeLPUnit = userBalanceLPUnit
            }

            console.log("stakeLPUnit=", stakeLPUnit.toString())
            console.log("balanceOf=", userBalanceLPUnit.toString())

            // 发送质押交易
            const depositTx = await contract.deposit(stakeLPUnit.toString(), true, {
                from: address,
            })

            // 等待交易被矿工打包
            message.success('Please wait for transaction processing....', 15);
            await depositTx.wait();
            message.success('You have successfully operated the stake LP.');
            closeAddModal();
        } catch (error: any) {
            if (error.code == -32000) {
                message.success('You have successfully operated the stake LP. Please wait for asynchronous processing.');
                closeAddModal();
                return
            }

            // @ts-ignore
            if (error.code === 4001) {
                message.warn('Please authorize the transaction in your wallet.');
            } else {
                message.warn('Please check if you have enough BNB to pay the fee or if the transaction parameters are correct.');
                console.error('Error during staking LP:', error);
            }
        } finally {
            setStakeLPCommit(0)
            userInfoLoad();
        }
    };

    // unStakeLP
    const unStakeLPSubmission = async () => {
        if (unStakeLP.equals(new Decimal('0'))) {
            message.warn('You have not canceled the staking because you have not selected any assets');
            return;
        }

        try {
            setStakeLPCommit(1)
            let boolean = await allowanceEnable();
            if (!boolean) {
                return
            }
            // @ts-ignore
            let promise = await connector.getProvider().then((provider) => {
                return provider;
            });
            // @ts-ignore
            const provider = new ethers.providers.Web3Provider(promise);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(V2WrapperAddress, V2WrapperABI, signer);

            // 获取当前网络ID
            const networkId = await provider.getNetwork().then(network => network.chainId);
            // 检查是否是BSC主网或测试网
            if (networkId !== 56) {
                message.warn('Please switch to Ethereum Mainnet.');
                // @ts-ignore
                window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [{
                        chainId: '0x38',
                        rpcUrls: ["https://bsc-dataseed.binance.org"],
                        chainName: "BSC",
                    }]
                });
                return false;
            }

            // @ts-ignore
            await window.ethereum.request({method: 'eth_requestAccounts'});
            const address = await signer.getAddress();

            // 对于max 临界值判断
            let unStakeLPUnit = ethers.utils.parseUnits(unStakeLP.toFixed(decimals), decimals);
            let userBalanceLPUnit = ethers.utils.parseUnits(String(userStake), decimals);
            if (unStakeLPUnit.gte(userBalanceLPUnit)) {
                unStakeLPUnit = userBalanceLPUnit
            }

            console.log("unStakeLPUnit=", unStakeLPUnit.toString())
            console.log("balanceOf=", userBalanceLPUnit.toString())

            // 发送提取交易
            const withdrawTx = await contract.withdraw(unStakeLPUnit.toString(), true, {
                from: address
            });

            // 等待交易被矿工打包
            message.success('Please wait for transaction processing....', 15);
            await withdrawTx.wait();
            message.success('You have successfully operated the unStake LP.');
            closeSubtractModal();
        } catch (error: any) {
            if (error.code == -32000) {
                message.success('You have successfully operated the stake LP. Please wait for asynchronous processing.');
                closeSubtractModal();
                return
            }

            console.error('Error during unstaking LP:', error);
            // @ts-ignore
            if (error.code === 4001) {
                message.warn('User rejected the transaction. Please try again.');
            } else {
                message.warn('The transaction is canceled or please check if the transaction parameters are correct or if there are enough assets.');
            }
        } finally {
            setStakeLPCommit(0)
            userInfoLoad();
        }
    };

    const [pendingRewardState, setPendingRewardState] = useState(0);
    // 领取奖励
    const pendingReward = async () => {
        try {
            setPendingRewardState(1)

            // @ts-ignore
            let promise = await connector.getProvider().then((provider) => {
                return provider;
            });
            // @ts-ignore
            const provider = new ethers.providers.Web3Provider(promise);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(V2WrapperAddress, V2WrapperABI, signer);

            // 获取当前网络ID
            const networkId = await provider.getNetwork().then(network => network.chainId);
            // 检查是否是BSC主网或测试网
            if (networkId !== 56) {
                message.warn('Please switch to Ethereum Mainnet.');
                // @ts-ignore
                window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [{
                        chainId: '0x38',
                        rpcUrls: ["https://bsc-dataseed.binance.org"],
                        chainName: "BSC",
                    }]
                });
                return false;
            }

            // @ts-ignore
            await window.ethereum.request({method: 'eth_requestAccounts'});
            const address = await signer.getAddress();

            // 检查可领取的奖励数量
            const pendingRewardAmount = await contract.pendingReward(address);

            if (pendingRewardAmount > 0) {
                // 发送领取奖励的交易
                try {
                    const withdrawTx = await contract.withdraw(0, false, {from: address});
                    message.success('Please wait for transaction processing....', 15);
                    await withdrawTx.wait();
                    message.success('You have successfully claimed your rewards.');
                } catch (error: any) {
                    if (error.code == -32000) {
                        message.success('You have successfully initiated the transaction. Please wait for asynchronous processing.');
                        return
                    }
                    message.error('Cancellation of the transaction or Failed to claim reward transaction.');
                    console.error(error)
                }
            } else {
                message.warn('You don\'t have any rewards to claim.');
            }
        } catch (error) {
            console.error('Error during claiming rewards:', error);
            // @ts-ignore
            if (error.code === 4001) {
                message.warn('User rejected the transaction. Please try again.');
            } else {
                message.warn('The transaction is canceled or please check if the transaction parameters are correct or if there are enough assets.');
            }
        } finally {
            userInfoLoad();
            setPendingRewardState(0)
        }
    };


    const [userBalanceSnapshot, setUserBalanceSnapshot] = useState(new Decimal('0.000000'));
    const [userStakeSnapshot, setUserStakeSnapshot] = useState(new Decimal('0.000000'));

    // 控制点击百分比按钮
    const [selectedStake, setSelectedStake] = useState(0);
    const handleStakeClick = (stake: number) => {
        setSelectedStake(stake);
    };

    // 当前操作stake资产计算
    const calculationStake = (proportion: number, type: string) => {
        let balanceSnapshot = new Decimal(userBalance);
        let stakeSnapshot = new Decimal(userStake);

        if (type === 'add') {
            // 百分比计算
            const amount = balanceSnapshot.times(proportion).dividedBy(100);
            setUserBalanceSnapshot(balanceSnapshot.minus(amount));
            setUserStakeSnapshot(stakeSnapshot.add(amount));
            setStakeLP(amount);

            let elementById: any = document.getElementById('handleStakeChange-input');
            elementById.value = inputAmountFixed(amount.toNumber())
            elementById.classList.remove('insufficient-assets')
        }

        if (type === 'subtract') {
            const amount = stakeSnapshot.times(proportion).dividedBy(100);
            setUserBalanceSnapshot(balanceSnapshot.add(amount));
            setUserStakeSnapshot(stakeSnapshot.minus(amount));
            setUnStakeLP(amount)

            let elementById: any = document.getElementById('handleUnStakeChange-input');
            elementById.value = inputAmountFixed(amount.toNumber())
            elementById.classList.remove('insufficient-assets')
        }
    }


    // 钱包授权
    const [pendingRewardEnableState, setPendingRewardEnableState] = useState(0);

    const allowanceEnable = async () => {
        try {
            setPendingRewardEnableState(1);
            if (window.ethereum) {
                // @ts-ignore
                let promise = await connector.getProvider().then((provider) => {
                    return provider;
                });
                const provider = new ethers.providers.Web3Provider(promise);
                const signer = provider.getSigner(address);
                const contract = new ethers.Contract(tokenContractAddress, tokenContractABI, signer);

                // 获取当前网络ID
                const networkId = await provider.getNetwork().then(network => network.chainId);

                // 检查是否是BSC主网或测试网
                if (networkId !== 56) {
                    message.warn('Please switch to Ethereum Mainnet.');
                    // @ts-ignore
                    window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [{
                            chainId: '0x38',
                            rpcUrls: ["https://bsc-dataseed.binance.org"],
                            chainName: "BSC",
                        }]
                    });
                    return false;
                }

                if (localStorage.getItem('wallet-enable-' + address) == 'ok') {
                    if (userStake.greaterThan(new Decimal('0'))) {
                        setBusinessStatus(4);
                    } else {
                        setBusinessStatus(3);
                    }
                    return true;
                }

                // 尝试获取allowance，同时设置超时时间
                const allowance = await contract.allowance(address, V2WrapperAddress)
                    .then((data: any) => {
                        return data;
                    });

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 5000)
                );

                await Promise.race([allowance, timeoutPromise]);

                if (allowance.gte(MAX_UINT256)) {
                    if (userStake.greaterThan(new Decimal('0'))) {
                        setBusinessStatus(4);
                    } else {
                        setBusinessStatus(3);
                    }
                    localStorage.setItem('wallet-enable-' + address, 'ok');
                    return true;
                }

                const approveTx = await contract.approve(V2WrapperAddress, MAX_UINT256);
                // 等待交易被矿工打包
                message.success('Please wait for a while Authorization is in progress....');
                await approveTx.wait();
                message.success('Authorization successful, you can start the subsequent pledge operation.');

                if (userStake.greaterThan(new Decimal('0'))) {
                    setBusinessStatus(4);
                } else {
                    setBusinessStatus(3);
                }
                localStorage.setItem('wallet-enable-' + address, 'ok');
                return true;
            } else {
                message.warn('Please install MetaMask or a web3 browser extension.');
            }
        } catch (error) {
            // @ts-ignore
            if (error.message === 'Timeout') {
                message.error('Please check if you are joining LP.');
                return false;
            }
            // @ts-ignore
            if (error.code === 4001) {
                message.warn('User rejected the transaction. Please try again.');
            } else {
                console.error('Error during authorization:', error);
                message.warn('Please agree to authorize access to your account first.');
            }
        } finally {
            setPendingRewardEnableState(0);
        }
    };

    function addInterval() {
        if (address) {
            for (let i = 0; i < interval.length; i++) {
                if (interval[i]) {
                    clearInterval(interval[i])
                }
            }
            interval.push(setInterval(userInfoLoad, 3000))
        }
    }

    const inputAmountFixed = (value: number) => {
        let fixAmount = ensureSixDecimals(new Decimal(value));
        return value < 0 ? '0.000000' : fixAmount
    };

    const handleStakeChange = (event: any) => {
        let newValue = event.target.value;
        const regex = /^\d*(\.\d{0,6})?$/;
        if (!regex.test(newValue)) {
            event.target.value = ensureSixDecimals(stakeLP)
            return
        }

        let balanceSnapshot = userBalance;
        let stakeSnapshot = userStake;
        let nowBalance = balanceSnapshot.minus(newValue);
        let nowStake = stakeSnapshot.plus(newValue);

        if (nowBalance.lessThan(new Decimal('0'))) {
            newValue = balanceSnapshot
            nowBalance = balanceSnapshot.minus(newValue);
            nowStake = stakeSnapshot.plus(newValue);
            event.target.value = inputAmountFixed(newValue)
        } else {
            event.target.classList.remove('insufficient-assets')
        }

        setUserBalanceSnapshot(nowBalance);
        setUserStakeSnapshot(nowStake);
        setStakeLP(new Decimal(newValue));
    }

    const handleUnStakeChange = (event: any) => {
        let newValue = event.target.value;
        const regex = /^\d*(\.\d{0,6})?$/;
        if (!regex.test(newValue)) {
            event.target.value = ensureSixDecimals(unStakeLP)
            return
        }

        let balanceSnapshot = userBalance;
        let stakeSnapshot = userStake;
        let nowBalance = balanceSnapshot.plus(newValue);
        let nowStake = stakeSnapshot.minus(newValue);

        if (nowStake.lessThan(new Decimal('0'))) {
            newValue = userStake
            nowBalance = balanceSnapshot.plus(newValue);
            nowStake = stakeSnapshot.minus(newValue);
            event.target.value = inputAmountFixed(newValue)
        } else {
            event.target.classList.remove('insufficient-assets')
        }

        setUserBalanceSnapshot(nowBalance);
        setUserStakeSnapshot(nowStake);
        setUnStakeLP(new Decimal(newValue));
    };

    return (
        <>
            {businessStatus === 1 && <div className="pr-data-context">
                <div className='pr-data-context pr-centered'>
                    <div className='pr-connect'>
                        <div className='pr-start-farming'>START FARMING</div>
                        <div className='pr-button pr-connect'>
                            <div className='pr-wallet' onClick={() => {
                                open().then(r => {

                                });
                            }}>Connect Wallet
                            </div>
                        </div>
                        <div className='pr-prompt'>
                            Please link your electronic wallet to start generating revenue.
                        </div>
                    </div>
                </div>
            </div>}

            {businessStatus === 2 && <div className="pr-data-context">
                <div className='pr-data-context pr-data-left-enable-div'>
                    {/* 价格 左 */}
                    <div className='pr-data-left pr-data-left-enable'>
                        <div className='pr-enable-prompt'>
                            Please enable your wallet to start your transactions.
                        </div>
                        <div className='pr-button pr-button-enable pr-enable-pendingReward-load-div'>
                            <div
                                className={pendingRewardEnableState > 0 ? 'pr-enable-pendingReward-load' : ''}
                                onClick={() => {
                                    {
                                        if (pendingRewardEnableState == 0) {
                                            allowanceEnable();
                                        }
                                    }
                                }}>Enable
                            </div>
                        </div>
                        <div>
                            <a href={'https://app.uniswap.org/#/add/v2/0xdac17f958d2ee523a2206206994597c13d831ec7/0xComingSoon'}
                               target="_blank">
                                Click Join USDT-COMT-LP
                            </a>
                        </div>
                    </div>

                    {/* 价格 右 */}
                    <div className='pr-data-right'>
                        <div className='pr-txt'>
                            <span>COMT EARNED</span>
                            <span className='pr-big-txt pr-userIncome'>{ensureSixDecimals(userIncome)}</span>
                            <span>~{ensureSixDecimals(dsc2Usdt(userIncome))} USD</span>
                        </div>

                        <div
                            className={userIncome.greaterThan(new Decimal('0')) ? 'pr-button pr-harvest pr-pendingReward-load-dev' : 'pr-button pr-harvest not-income'}>
                            {userIncome.greaterThan(new Decimal('0')) && (
                                <div
                                    className={pendingRewardState > 0 ? 'pr-pendingReward-load' : ''}
                                    onClick={() => {
                                        pendingReward()
                                    }}>Harvest</div>
                            )}
                            {userIncome.lessThanOrEqualTo(new Decimal('0')) && (
                                <div>Harvest</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>}


            {businessStatus === 3 && <div className="pr-data-context">
                <div className='pr-data-context pr-lp'>
                    {/* LP数量 左 */}
                    <div className='pr-data-left pr-lp-div'>
                        <div className='pr-txt'>
                            <span>{token} STAKED</span>
                            <span className='pr-big-txt'>{ensureSixDecimals(userStake)}</span>
                            <span>~{ensureSixDecimals(lp2UsdtAndDsc(userStake))} USD</span>
                            <span>1 DSC {ensureSixDecimals(DSC_USDT_Rate)} USDT</span>
                        </div>

                        <div className='pr-sum-button stake-lp'>
                            <div onClick={() => {
                                openAddModal();
                            }}>Stake LP
                            </div>
                        </div>
                    </div>

                    {/* 收益 右 */}
                    <div className='pr-data-right'>
                        <div className='pr-txt'>
                            <span>COMT EARNED</span>
                            <span className='pr-big-txt pr-userIncome'>{ensureSixDecimals(userIncome)}</span>
                            <span>~{ensureSixDecimals(dsc2Usdt(userIncome))} USD</span>
                        </div>

                        <div
                            className={userIncome.greaterThan(new Decimal('0')) ? 'pr-button pr-harvest pr-pendingReward-load-dev' : 'pr-button pr-harvest not-income'}>
                            {userIncome.greaterThan(new Decimal('0')) && (
                                <div
                                    className={pendingRewardState > 0 ? 'pr-pendingReward-load' : ''}
                                    onClick={() => {
                                        pendingReward()
                                    }}>Harvest</div>
                            )}
                            {userIncome.lessThanOrEqualTo(new Decimal('0')) && (
                                <div>Harvest</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>}

            {businessStatus === 4 && <div className="pr-data-context">
                <div className='pr-data-context pr-lp'>
                    {/* LP数量 左 */}
                    <div className='pr-data-left pr-lp-div'>
                        <div className='pr-txt'>
                            <span>{token}</span>
                            <span className='pr-big-txt'>{ensureSixDecimals(userStake)}</span>
                            <span>~{ensureSixDecimals(lp2UsdtAndDsc(userStake))} USD</span>
                            <span>1 DSC {ensureSixDecimals(DSC_USDT_Rate)} USDT</span>
                        </div>

                        <div className='pr-sum-button'>
                            <div onClick={() => {
                                openSubtractModal();
                            }}>-
                            </div>
                            <div onClick={() => {
                                openAddModal();
                            }}>+
                            </div>
                        </div>
                    </div>

                    {/* 收益 右 */}
                    <div className='pr-data-right'>
                        <div className='pr-txt'>
                            <span>COMT EARNED</span>
                            <span className='pr-big-txt pr-userIncome'>{ensureSixDecimals(userIncome)}</span>
                            <span>~{ensureSixDecimals(dsc2Usdt(userIncome))} USD</span>
                        </div>

                        <div
                            className={userIncome.greaterThan(new Decimal('0')) ? 'pr-button pr-harvest pr-pendingReward-load-dev' : 'pr-button pr-harvest not-income'}>
                            {userIncome.greaterThan(new Decimal('0')) && (
                                <div
                                    className={pendingRewardState > 0 ? 'pr-pendingReward-load' : ''}
                                    onClick={() => {
                                        if (pendingRewardState == 0) {
                                            pendingReward()
                                        }
                                    }}>Harvest</div>
                            )}
                            {userIncome.lessThanOrEqualTo(new Decimal('0')) && (
                                <div>Harvest</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>}

            {/*Unstake LP*/}
            <Modal isOpen={isSubtractModalOpen} title='Unstake LP tokens'
                   onClose={closeSubtractModal}>
                <div className='pr-button-content'>
                    <div className='pr-button-content-text'>
                        <span>Unstake</span>
                        <span>Balance: {ensureSixDecimals(userStakeSnapshot)}</span>
                    </div>
                    <div className='pr-button-content-text'>
                        <span className='pr-big-txt'>
                           <input
                               id='handleUnStakeChange-input'
                               type="number"
                               inputMode="decimal"
                               step="0.000001"
                               placeholder="0.000000"
                               onInput={handleUnStakeChange}/>
                        </span>
                        <span className='pr-big-txt'>{token}</span>
                    </div>
                    <div className='pr-button-content-text'>
                        <span>~{ensureSixDecimals(lp2UsdtAndDsc(unStakeLP))} USD</span>
                    </div>
                    <div className='pr-percentage'>
                        <div className={selectedStake === 25 ? 'selected' : ''}
                             onClick={() => {
                                 handleStakeClick(25)
                                 calculationStake(25, 'subtract')
                             }}>25%
                        </div>
                        <div className={selectedStake === 50 ? 'selected' : ''}
                             onClick={() => {
                                 handleStakeClick(50)
                                 calculationStake(50, 'subtract')
                             }}>50%
                        </div>
                        <div className={selectedStake === 75 ? 'selected' : ''}
                             onClick={() => {
                                 handleStakeClick(75)
                                 calculationStake(75, 'subtract')
                             }}>75%
                        </div>
                        <div className={selectedStake === 100 ? 'selected' : ''}
                             onClick={() => {
                                 handleStakeClick(100)
                                 calculationStake(100, 'subtract')
                             }}>MAX
                        </div>
                    </div>
                </div>
                <div className='pr-button-content-window'>
                    <div className='pr-button' onClick={closeSubtractModal}>Cancel</div>
                    <div
                        className={stakeLPCommit == 0 ? 'pr-button clean' : 'pr-button clean pr-stakeLPSubmission-load'}
                        onClick={() => {
                            if (stakeLPCommit == 0) {
                                unStakeLPSubmission();
                            }
                        }}>Confirm
                    </div>
                </div>
            </Modal>


            {/*Stake LP*/}
            <Modal isOpen={isAddModalOpen} title='Stake LP tokens' onClose={closeAddModal}>
                <div className='pr-button-content'>
                    <div className='pr-button-content-text'>
                        <span>Stake</span>
                        <span>Balance: {ensureSixDecimals(userBalanceSnapshot)}</span>
                    </div>
                    <div className='pr-button-content-text'>
                        <span className='pr-big-txt'>
                            <input
                                id='handleStakeChange-input'
                                type="number"
                                inputMode="decimal"
                                step="0.000001"
                                placeholder="0.000000"
                                onInput={handleStakeChange}/>
                        </span>
                        <span className='pr-big-txt'>COMT-USDT LP</span>
                    </div>
                    <div className='pr-button-content-text'>
                        <span>~{ensureSixDecimals(lp2UsdtAndDsc(stakeLP))} USD</span>
                    </div>
                    <div className='pr-percentage'>
                        <div className={selectedStake === 25 ? 'selected' : ''}
                             onClick={() => {
                                 handleStakeClick(25)
                                 calculationStake(25, 'add')
                             }}>25%
                        </div>
                        <div className={selectedStake === 50 ? 'selected' : ''}
                             onClick={() => {
                                 handleStakeClick(50)
                                 calculationStake(50, 'add')
                             }}>50%
                        </div>
                        <div className={selectedStake === 75 ? 'selected' : ''}
                             onClick={() => {
                                 handleStakeClick(75)
                                 calculationStake(75, 'add')
                             }}>75%
                        </div>
                        <div className={selectedStake === 100 ? 'selected' : ''}
                             onClick={() => {
                                 handleStakeClick(100)
                                 calculationStake(100, 'add')
                             }}>MAX
                        </div>
                    </div>
                </div>
                <div className='pr-rates'>
                    <div>
                        Annual ROl at current rates:
                    </div>
                    <div>
                        <div className='pr-rates-number'>$0.00</div>
                        <a href='https://app.uniswap.org/#/add/v2/0xdac17f958d2ee523a2206206994597c13d831ec7/0xComingSoon'
                           target="_blank">
                            <div className='pr-calculator'>
                                <img src={require('@/assets/mobile/Products/img_4.png')} alt=""/>
                            </div>
                        </a>
                    </div>
                </div>
                <div className='pr-button-content-window'>
                    <div className='pr-button' onClick={closeAddModal}>Cancel</div>
                    <div
                        className={stakeLPCommit == 0 ? 'pr-button clean' : 'pr-button clean pr-stakeLPSubmission-load'}
                        onClick={() => {
                            if (stakeLPCommit == 0) {
                                stakeLPSubmission();
                            }
                        }}>Confirm
                    </div>
                </div>

                {userBalance.equals(new Decimal('0')) && (
                    <div className='pr-link'>
                        No tokens to stake,Add CAKE-USDT LP
                        <a href={'https://pancakeswap.finance/add/0xComingSoon/0x55d398326f99059fF775485246999027B3197955/2500?chain=bsc'}
                           target="_blank">
                            <img src={require('@/assets/mobile/Products/img_2.png')} alt=""/>
                        </a>
                    </div>
                )}
            </Modal>
        </>
    );
}

export default PrDataContext;