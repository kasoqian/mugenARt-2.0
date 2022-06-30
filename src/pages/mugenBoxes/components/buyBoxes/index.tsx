import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import Swiper, { Autoplay } from 'swiper';
import OwnerItem from '../ownerItem';
import Atlas from './components/atlas';
import { message, Spin } from 'antd';

import Wallet, { getPltProvider } from '@/api/Wallet';
import { PLTContractAbi, PLTCONTRACT_ADDRESS } from '@/const/contract';
import {
  createOrder,
  createExchangeOrder,
  updateOrderThirdOrderId,
  getBlindBoxMintInfoAndProductRemain,
} from '@/api/mugenBox';
import { useModel, history } from 'umi';
import useLocals from '@/hooks/useLocals';
import useCountDown from '@/hooks/useCountDown';

import {
  ECardNumber,
  EPaymentMethod,
  EBoxType,
  EBlindBoxStatus,
} from '../../types';

import BoxNavImg from '../../assets/owner-nav-img.png';
import BoxImg from '../../assets/box-show-img.png';

import NextIcon from '../../assets/next-icon.png';
import Card1Active from '../../assets/card-1-active.png';
import Card1Normal from '../../assets/card-1-normal.png';
import Card5Active from '../../assets/card-5-active.png';
import Card5Normal from '../../assets/card-5-normal.png';

import './index.less';
import 'swiper/swiper-bundle.css';

Swiper.use([Autoplay]);

const paymentTypeMap = {
  [EPaymentMethod.CreditCard]: 0, // 法币支付
  [EPaymentMethod.Cryptocurrency]: 1, // 20支付白名单支付
  [EPaymentMethod.White]: 5, // 白名单支付
};

interface IProps {}

export default (props: IProps) => {
  const [cardActiveNum, setCardActiveNum] = useState<ECardNumber>(
    ECardNumber.ONE,
  ); // 选中个数
  const boxInfoRef = useRef<any>(null);
  const [ownersModalVisible, setOwnersModalVisible] = useState<boolean>(false); // 盲盒贡献者弹窗
  const [paymentChooseModalVisible, setPaymentChooseModalVisible] =
    useState<boolean>(false); // 选择支付方式弹窗
  const [paymentMethod, setPaymentMethod] = useState<EPaymentMethod>(
    EPaymentMethod.CreditCard,
  ); // 支付方式
  const [congratulation1ModalVisible, setCongratulation1ModalVisible] =
    useState<boolean>(false); // 开盒一个的时候奖品弹窗
  const [congratulation5ModalVisible, setCongratulation5ModalVisible] =
    useState<boolean>(false); // 开盒五个的时候奖品弹窗
  const [atlasModalVisible, setAtlasModalVisible] = useState<boolean>(false); // 图鉴弹窗

  const [openBoxResList, setOpenBoxResList] = useState([]);

  const [boxRemain, setBoxRemain] = useState(0); // 剩余盲盒数量
  const [boxTotal, setBoxTotal] = useState(0); // 总盲盒数量
  const [paymentLoadingText, setPaymentLoadingText] = useState('');
  const [paymentDesc, setPaymentDesc] = useState(''); // 支付中描述文案
  const {
    boxInfo,
    boxCopyRightList,
    rateFeeBlockInfo,
    userWhiteListPoint,
    getBoxesList,
    updateBoxInfo,
    updateUserWhiteListPoint,
  } = useModel('useMugenBox');
  const { loginIn, userInfo } = useModel('login');
  const { setAutoShowBindWalletModal } = useModel('useSetting');
  const { socketInstance } = useModel('useSocket');

  const { localText, language } = useLocals();
  const { beginCountDown, clearCountDown, minute, second, remainTime } =
    useCountDown(); // 选择支付方式弹窗倒计时
  const {
    beginCountDown: boxBeginCountDown,
    clearCountDown: boxClearCountDown,
    day: boxDay,
    hour: boxHour,
    minute: boxMinute,
    second: boxSecond,
    remainTime: boxRemainTime,
  } = useCountDown(); // 盲盒的倒计时
  const { fixLayout, looseLayout } = useModel('useFixModalScroll');
  const { unityRef: openAnimationRef, setOpenAnimationVisible } =
    useModel('useUnity');

  const isFiveCard = cardActiveNum === ECardNumber.FIVE;
  const canUseWhitePay = userWhiteListPoint >= Number(cardActiveNum);
  const isSellOut =
    boxInfo.blind_box_shelling_status === EBlindBoxStatus.SoldOut;

  const remainPercentage = useMemo(
    () => Number(boxRemain / boxTotal),
    [boxRemain, boxTotal],
  );

  const [productRemainInfo, setProductRemainInfo] = useState<any>({});

  const fetchProductRemain = async () => {
    const data = await getBlindBoxMintInfoAndProductRemain(boxInfo.id);
    if (!!data) {
      setProductRemainInfo(data);
    }
  };

  useEffect(() => {
    fetchProductRemain();
  }, [boxInfo.id]);

  // 价钱、手续费、总金额
  const [moneyFee, moneyCollectible, moneyTotal] = useMemo(() => {
    let moneyCollectible = 0;
    if (paymentMethod === EPaymentMethod.Cryptocurrency) {
      // 20 支付
      moneyCollectible = Number(cardActiveNum) * boxInfo?.digital_sell_price;
    } else if (paymentMethod === EPaymentMethod.CreditCard) {
      // 法币支付
      moneyCollectible = Number(cardActiveNum) * boxInfo?.sell_price;
    }
    const moneyFee = (moneyCollectible * rateFeeBlockInfo.transaction) / 100;
    const moneyTotal = moneyCollectible + moneyFee;
    return [moneyFee, moneyCollectible, moneyTotal];
  }, [cardActiveNum, paymentMethod, rateFeeBlockInfo, boxInfo]);

  const buyActionDisable = useMemo(() => {
    if (!boxInfo || Object.keys(boxInfo).length === 0) return true;
    if (boxInfo.box_type === EBoxType.Reward) {
      return boxInfo?.user_remain_exchange_times < Number(cardActiveNum);
    } else if (boxInfo.box_type === EBoxType.Normal) {
      return boxInfo.blind_box_shelling_status !== EBlindBoxStatus.Selling;
    }
    return false;
  }, [cardActiveNum, boxInfo]);

  const currentNum = useMemo(() => {
    if (boxInfo.box_type === EBoxType.Reward) {
      return boxInfo?.user_remain_exchange_times;
    } else {
      return isFiveCard
        ? Number(boxInfo?.digital_sell_price) * 5
        : boxInfo?.digital_sell_price;
    }
  }, [isFiveCard, boxInfo]);

  // 开始播放开盒第一段动画
  const playVideoFirst = useCallback(() => {
    console.log('playVideoFirst');
    setCongratulation1ModalVisible(false);
    setCongratulation5ModalVisible(false);
    setPaymentChooseModalVisible(false);
    setPaymentLoadingText('');
    setPaymentDesc('');
    setOpenAnimationVisible(true);
    // @ts-ignore
    openAnimationRef.current?.playRemoteVideoLoop(
      boxInfoRef.current?.open_box_stage1_url,
    );
  }, [boxInfo]);

  // 开始播放开盒二、三段动画
  const playVideoSecondThird = useCallback(
    async (thirdVideoList = []) => {
      console.log('playVideoSecondThird');
      const videoList = [
        boxInfoRef.current?.open_box_stage2_url,
        ...thirdVideoList,
      ];
      // @ts-ignore
      openAnimationRef.current?.handlePlayRemoteVideoList(videoList);
    },
    [boxInfo],
  );

  const handleVideoPlayEnd = useCallback(
    (msg: string) => {
      if (msg === 'ArrayComplete' || msg === 'ERROR_TIMEOUT') {
        setTimeout(() => {
          if (!openBoxResList?.length) return;
          openBoxResList?.length === Number(ECardNumber.FIVE)
            ? setCongratulation5ModalVisible(true)
            : setCongratulation1ModalVisible(true);

          setOpenAnimationVisible(false);
        }, 1000);
      }
    },
    [openBoxResList],
  );

  useEffect(() => {
    openAnimationRef?.current?.addEventListener?.(
      'OnVideoFinish',
      handleVideoPlayEnd,
    );
    return () => {
      openAnimationRef?.current?.removeEventListener?.(
        'OnVideoFinish',
        handleVideoPlayEnd,
      );
    };
  }, [openAnimationRef, handleVideoPlayEnd]);

  useEffect(() => {
    if (openAnimationRef?.current?.isLoaded) {
      openAnimationRef?.current?.sendMessage?.('Canvas/Video', 'ResumeUnity');
    }
    return () => {
      setOpenAnimationVisible(false);
      openAnimationRef?.current?.sendMessage?.('Canvas/Video', 'PauseUnity');
    };
  }, [openAnimationRef]);

  const handleConfirmPayment = useCallback(async () => {
    try {
      // 创建订单
      setPaymentLoadingText('loading');
      // 20 支付
      if (paymentMethod === EPaymentMethod.Cryptocurrency) {
        // WalletConnect 钱包
        const pltProvider = getPltProvider();
        const wallet = Wallet(pltProvider as any);
        const [userWalletAddress] = await pltProvider.enable();
        // MetaMask 钱包
        // const wallet = Wallet(window.ethereum);
        // const [userWalletAddress] = await wallet.web3.eth.requestAccounts();
        const web3 = wallet.web3;
        const orderRes = await createOrder({
          user_pay_wallet_addr: userWalletAddress,
          blind_box_id: boxInfo.id,
          pay_type: paymentTypeMap[paymentMethod],
          amount: cardActiveNum,
        });
        setPaymentDesc(localText['box.buy.pltPayDesc']);
        const pltPrice = wallet.web3.utils.toWei(
          moneyTotal.toString(),
          'ether',
        );
        // 创建合约实例
        const myContract = new wallet.web3.eth.Contract(
          PLTContractAbi,
          PLTCONTRACT_ADDRESS,
        );

        // 合约转账
        const data = myContract.methods
          .transfer(rateFeeBlockInfo.wallet, pltPrice.toString())
          .encodeABI({
            from: userWalletAddress,
            to: PLTCONTRACT_ADDRESS,
            value: pltPrice,
            gasPrice: 0,
            gas: 0,
          });

        const tx = {
          from: userWalletAddress,
          to: PLTCONTRACT_ADDRESS,
          // value: '0x00', // metamask 钱包使用
          value: pltPrice, //  hashPlaette 钱包使用
          data,
          gasLimit: web3.utils.toHex('21000'),
          gasPrice: 0,
          gas: 0,
        };
        // 发起交易
        const transactionRes = await web3.eth.sendTransaction(tx);
        // 更新 20 支付的 hash
        const updateRes = await updateOrderThirdOrderId({
          orderId: orderRes.id,
          third_order_id: transactionRes.transactionHash,
        });
        // @ts-ignore
        window.__order_id__ = orderRes.id;
      } else if (paymentMethod === EPaymentMethod.CreditCard) {
        // 法币支付
        const orderRes = await createOrder({
          blind_box_id: boxInfo.id,
          pay_type: paymentTypeMap[paymentMethod],
          amount: cardActiveNum,
        });
        setPaymentDesc(localText['box.buy.paypalDesc']);
        // @ts-ignore
        window.__order_id__ = orderRes.id;
        window.open(orderRes.paypal_return_url);
      } else if (paymentMethod === EPaymentMethod.White) {
        // 白名单支付
        const orderRes = await createOrder({
          blind_box_id: boxInfo.id,
          pay_type: paymentTypeMap[paymentMethod],
          amount: cardActiveNum,
        });
        updateUserWhiteListPoint();
      }
      getBoxesList();
    } catch (error: any) {
      setPaymentLoadingText('');
      setPaymentDesc('');
      console.error(error);
      message.error(error.message || 'system error!');
    }
  }, [boxInfo, cardActiveNum, paymentMethod, rateFeeBlockInfo, moneyTotal]);

  const againBuy = useCallback(
    (num: ECardNumber) => {
      setCardActiveNum(num);
      setCongratulation1ModalVisible(false);
      setCongratulation5ModalVisible(false);
      setOpenBoxResList([]);
      if (boxInfo.box_type === EBoxType.Reward) {
        handleBuyRewardBox(num);
      } else {
        setPaymentChooseModalVisible(true);
        // 重置倒计时
        clearCountDown();
        beginCountDown(5 * 60 * 1000); // 5 分钟
      }
    },
    [boxInfo],
  );

  const handleBuyRewardBox = useCallback(
    async (num: ECardNumber) => {
      try {
        const res = await createExchangeOrder({
          blind_box_id: boxInfo.id,
          amount: num,
        });
        updateBoxInfo();
        getBoxesList();
      } catch (error: any) {
        console.error(error);
        message.error(error.message || 'system error!');
      }
    },
    [boxInfo],
  );

  const showAtlasModel = useCallback((setCongratulationModalVisible: any) => {
    setCongratulationModalVisible(false);
    setAtlasModalVisible(true);
  }, []);

  useEffect(() => {
    setBoxRemain(boxInfo?.product_remain || 0);
    setBoxTotal(boxInfo?.product_total || 0);
    boxBeginCountDown(boxInfo?.remain_time || 0);
    boxInfoRef.current = boxInfo;
    return () => {
      clearCountDown();
      boxClearCountDown();
    };
  }, [boxInfo]);

  useEffect(() => {
    if (Number(remainTime) <= 0) {
      clearCountDown();
      setPaymentChooseModalVisible(false);
      setPaymentLoadingText('');
    }
  }, [remainTime]);

  useEffect(() => {
    if (boxInfo.id && boxRemainTime <= 0) {
      updateBoxInfo();
    }
  }, [boxRemainTime, boxInfo]);

  useEffect(() => {
    if (
      ownersModalVisible ||
      paymentChooseModalVisible ||
      congratulation1ModalVisible ||
      congratulation5ModalVisible
    ) {
      fixLayout();
    } else {
      looseLayout();
    }
  }, [
    ownersModalVisible,
    paymentChooseModalVisible,
    congratulation1ModalVisible,
    congratulation5ModalVisible,
  ]);

  useEffect(() => {
    setPaymentMethod(EPaymentMethod.CreditCard);
  }, [cardActiveNum]);

  useEffect(() => {
    let subscribeRes: { id: string; unsubscribe: () => void };

    if (socketInstance) {
      subscribeRes = socketInstance.subscribe(
        '/mugenArtTopic/boxProductRemain',
        function (response: any) {
          // console.log('subscribe result', response.body);
          try {
            if (
              boxInfoRef.current.id === JSON.parse(response.body).data.box_id
            ) {
              const remainInfo = JSON.parse(response.body).data;
              setBoxRemain(remainInfo?.product_remain);
              setBoxTotal(remainInfo?.product_total);
            }
          } catch (error) {}
        },
      );
    }
    return () => {
      subscribeRes?.unsubscribe?.();
    };
  }, [socketInstance]);

  useEffect(() => {
    let subscribeRes: { id: string; unsubscribe: () => void };
    if (userInfo && socketInstance) {
      subscribeRes = socketInstance.subscribe(
        `/mugenArtTopic/openBoxStage/${userInfo.userId}`,
        function (response: any) {
          try {
            const data = JSON.parse(response.body)?.data || {};
            const { open_stage, open_results = [] } = data;
            if (open_stage === 2) {
              playVideoFirst();
            } else if (open_stage === 3) {
              playVideoSecondThird(
                open_results.map((item: any) => item.open_box_video_url),
              );
              setOpenBoxResList(open_results);
            }
          } catch (error) {
            console.error(error);
          }
        },
      );
    }
    return () => {
      subscribeRes?.unsubscribe?.();
    };
  }, [userInfo, socketInstance]);

  return (
    <div className="buy-boxes-warpper">
      <div className="buy-boxes">
        <div className="nft-display">
          {productRemainInfo?.blind_box_product_remains &&
            productRemainInfo?.blind_box_product_remains.length > 0 &&
            productRemainInfo?.blind_box_product_remains.map(
              (item: any, index: number) => (
                <div className="nft-card" key={index}>
                  <img src={item.product_image_url}></img>
                  <div className="nft-docs">
                    残り {item.product_remain_number}
                  </div>
                </div>
              ),
            )}
        </div>
        <div className="left">
          <div className="animation">
            <img src={boxInfo?.box_style_image_url || BoxImg} alt="" />
          </div>
          {/* 勿删！！！暂时隐藏 */}
          {/*           <div className="progress-warpper">
            <div className="num">
              <div
                key={remainPercentage + boxRemain}
                className="percent"
                style={{ left: `${remainPercentage * 100}%` }}
              >
                {boxRemain}
              </div>
            </div>
            <div className="progress">
              <div
                key={remainPercentage + boxTotal}
                className={classNames(
                  'percent',
                  {
                    yellow: remainPercentage <= 0.7 && remainPercentage > 0.3,
                  },
                  {
                    red: remainPercentage <= 0.3,
                  },
                )}
                style={{ width: `${remainPercentage * 100}%` }}
              ></div>
            </div>
          </div> */}
        </div>
        <div className="right">
          <div className="title">
            {boxInfo[`box_name_${language}`]}
            <span className="badge">
              <img src={require('../../assets/badge-ja.png')} />
            </span>
          </div>
          <div className="desc">{boxInfo[`box_introduce_${language}`]}</div>
          <div className="hr"></div>
          <div className="money">
            <div className="num">{currentNum}</div>
            <div className="unit">{boxInfo?.digital_sell_unit_name}</div>
          </div>
          <div className="hr"></div>
          <div className="owner">
            <div className="owner-module-title">
              <img src={BoxNavImg} alt="" />
            </div>
            <div className="list">
              {boxCopyRightList.slice(0, 4).map((item: any, i: number) => {
                return (
                  <OwnerItem
                    photo={item?.tks_user_image_url}
                    name={item?.tks_user_name}
                    key={i}
                  />
                );
              })}
              {boxCopyRightList?.length > 4 && (
                <img
                  className="next-icon"
                  src={NextIcon}
                  alt="next"
                  onClick={() => setOwnersModalVisible(true)}
                />
              )}
              {ownersModalVisible && (
                <div className="modal-warpper">
                  <div className="modal-mask"></div>
                  <div className="modal">
                    <div
                      className="close"
                      onClick={() => setOwnersModalVisible(false)}
                    ></div>
                    <div className="container">
                      {boxCopyRightList.map((item: any, i: number) => {
                        return (
                          <OwnerItem
                            photo={item?.tks_user_image_url}
                            name={item?.tks_user_name}
                            key={i}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="count-down-block">
            {boxRemainTime > 0 && (
              <div
                className={classNames('count-down', {
                  'waiting-sell':
                    boxInfo.blind_box_shelling_status ===
                    EBlindBoxStatus.WaitingSell,
                  selling:
                    boxInfo.blind_box_shelling_status ===
                    EBlindBoxStatus.Selling,
                })}
              >
                <div className="count-down-item">{boxDay}</div>
                <div className="count-down-item">{boxHour}</div>
                <div className="count-down-item">{boxMinute}</div>
                <div className="count-down-item">{boxSecond}</div>
              </div>
            )}
          </div>
          <div className="action-warpper">
            <div className="card-choose">
              <img
                className="common-card card-1"
                src={isFiveCard ? Card1Normal : Card1Active}
                onClick={() => setCardActiveNum(ECardNumber.ONE)}
                alt="one"
              />
              <img
                className="common-card card-5"
                src={isFiveCard ? Card5Active : Card5Normal}
                onClick={() => setCardActiveNum(ECardNumber.FIVE)}
                alt="five"
              />
            </div>
            <div className="count-down-and-buy">
              <div className="des">
                Total minted
                <span>
                  {' '}
                  {productRemainInfo?.total_mint
                    ? productRemainInfo?.total_mint
                    : 0}{' '}
                </span>
              </div>
              <div
                className={classNames('buy', {
                  disable: buyActionDisable,
                })}
                onClick={async () => {
                  const userInfo = await loginIn();
                  if (!userInfo.evmWalletAddr) {
                    setAutoShowBindWalletModal(true);
                    history.push('/user/settings');
                    return;
                  }
                  if (buyActionDisable) return;
                  setOpenAnimationVisible(false);
                  if (boxInfo.box_type === EBoxType.Reward) {
                    handleBuyRewardBox(cardActiveNum);
                  } else {
                    setPaymentChooseModalVisible(true);
                    beginCountDown(5 * 60 * 1000); // 5 分钟
                  }
                }}
              >
                {localText[isSellOut ? 'box.buy.solidOut' : 'box.buy.buyNow']}
              </div>
            </div>
          </div>
          <div className="tips">{localText['box.buy.tips']}</div>
        </div>
      </div>
      <div className="saleBar">
        <a href="/#/events">
          <img src={require('../../assets/saleBar-en.png')} />
        </a>
      </div>
      {/* choose payment method modal */}
      {paymentChooseModalVisible && (
        <div className="payment-choose-modal">
          <div className="modal-mask"></div>
          <div className="modal">
            {!!paymentLoadingText && (
              <div className="loading">
                <Spin
                  spinning={!!paymentLoadingText}
                  // tip={paymentLoadingText}
                  size="large"
                />
              </div>
            )}
            <div
              className="close"
              onClick={() => {
                setPaymentChooseModalVisible(false);
                setPaymentLoadingText('');
                setPaymentDesc('');
                clearCountDown();
              }}
            />
            <div className="left">
              <div className="box-img">
                <img src={boxInfo?.box_style_image_url || BoxImg} alt="" />
              </div>
              <div className="info-text">
                <div className="title">
                  {boxInfo?.box_name_en}
                  <span className="card-number">x{cardActiveNum}</span>
                </div>
                <div className="desc">{boxInfo?.box_introduce_en}</div>
              </div>
              <div className="count-down-time">
                {minute}:{second}
              </div>
            </div>
            <div className="right">
              <div className="payment-method-list">
                <div
                  className={classNames('method-item', 'credit-card', {
                    active: paymentMethod === EPaymentMethod.CreditCard,
                  })}
                  onClick={() => setPaymentMethod(EPaymentMethod.CreditCard)}
                ></div>
                <div
                  className={classNames('method-item', 'white', {
                    active: paymentMethod === EPaymentMethod.White,
                    disable: !canUseWhitePay,
                  })}
                  onClick={() => {
                    if (canUseWhitePay) setPaymentMethod(EPaymentMethod.White);
                  }}
                >
                  <p className="remaining">{userWhiteListPoint} Remaining</p>
                </div>
                <div
                  className={classNames('method-item', 'cryptocurrency', {
                    active: paymentMethod === EPaymentMethod.Cryptocurrency,
                  })}
                  onClick={() =>
                    setPaymentMethod(EPaymentMethod.Cryptocurrency)
                  }
                ></div>
              </div>
              <div className="money-info">
                <div className="total">
                  {moneyTotal}
                  {paymentMethod === EPaymentMethod.CreditCard
                    ? ` ${boxInfo?.sell_unit_name}`
                    : ` ${boxInfo?.digital_sell_unit_name}`}
                </div>
                <div className="collectible">
                  {moneyCollectible}
                  {paymentMethod === EPaymentMethod.CreditCard
                    ? ` ${boxInfo?.sell_unit_name}`
                    : ` ${boxInfo?.digital_sell_unit_name}`}
                </div>
                <div className="fee">
                  {moneyFee}
                  {paymentMethod === EPaymentMethod.CreditCard
                    ? ` ${boxInfo?.sell_unit_name}`
                    : ` ${boxInfo?.digital_sell_unit_name}`}
                </div>
              </div>
              <div
                className="action"
                onClick={() => handleConfirmPayment()}
              ></div>
              <div className="paying-desc">{paymentDesc}</div>
            </div>
          </div>
        </div>
      )}
      {/* prize one modal */}
      {congratulation1ModalVisible && (
        <div
          className={classNames(
            'congratulation-common-modal',
            'congratulation1-modal',
            { show: congratulation1ModalVisible },
          )}
        >
          <div className="modal-mask"></div>
          <div className="modal">
            <div
              className="close"
              onClick={() => setCongratulation1ModalVisible(false)}
            ></div>
            <div className="container">
              {openBoxResList?.map((item: any, key) => {
                return (
                  <div className="prize-item" key={key}>
                    <img className="thumbnail" src={item.image} alt="prize" />
                  </div>
                );
              })}
            </div>
            <div
              className="go-preview"
              onClick={() => showAtlasModel(setCongratulation1ModalVisible)}
            ></div>
            <div
              className="once-again"
              onClick={() => againBuy(ECardNumber.ONE)}
            ></div>
            <div
              className="fifth-again"
              onClick={() => againBuy(ECardNumber.FIVE)}
            ></div>
          </div>
        </div>
      )}
      {/* prize five modal */}
      {congratulation5ModalVisible && (
        <div
          className={classNames(
            'congratulation-common-modal',
            'congratulation5-modal',
            { show: congratulation5ModalVisible },
          )}
        >
          <div className="modal-mask"></div>
          <div className="modal">
            <div
              className="close"
              onClick={() => setCongratulation5ModalVisible(false)}
            ></div>
            <div className="container">
              {openBoxResList?.map((item: any, key) => {
                return (
                  <div className="prize-item" key={key}>
                    <img className="thumbnail" src={item.image} alt="prize" />
                  </div>
                );
              })}
            </div>
            <div
              className="go-preview"
              onClick={() => showAtlasModel(setCongratulation5ModalVisible)}
            ></div>
            <div
              className="once-again"
              onClick={() => againBuy(ECardNumber.ONE)}
            ></div>
            <div
              className="fifth-again"
              onClick={() => againBuy(ECardNumber.FIVE)}
            ></div>
          </div>
        </div>
      )}
      {atlasModalVisible && (
        <Atlas
          setVisible={setAtlasModalVisible}
          setBackModelVisible={() => {
            if (cardActiveNum === '1') setCongratulation1ModalVisible(true);
            if (cardActiveNum === '5') setCongratulation5ModalVisible(true);
          }}
        ></Atlas>
      )}
    </div>
  );
};
