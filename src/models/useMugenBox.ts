import { useState, useCallback, useEffect } from 'react';
import {
  getInOrWaitSellingBox,
  getBlindBoxByIpId,
  getSpecialTksByIpId,
  getBoxSellingInfoFirstTime,
  getAllBlindBoxList,
  getBlindBoxInfoByBoxId,
  getBlindBoxCopyRightByBoxId,
  getBlindBoxIpInfoByBoxId,
  getBoxProductsByBoxId,
  getRateFeeBlockInfo,
  getUserWhiteListPoint,
  getUserExchangeBoxTimes,
} from '@/api/mugenBox';
import { useModel } from 'umi';

export default function useMugenBox() {
  const [sellingBoxData, setSellingBoxData] = useState<any>(null); // 售卖中的盲盒信息
  const [boxList, setBoxList] = useState<any>([]); // 首页某个 ip 系列下的盲盒列表
  const [specialThankList, setSpecialThankList] = useState<any>([]); // ip 的特别鸣谢作者列表
  const [openBoxesResultList, setOpenBoxesResultList] = useState<any>([]); // 盲盒的开盒结果列表
  const [allBoxesList, setAllBoxesList] = useState<any>([]); // 盲盒售卖页中的盲盒列表
  const [activeBoxId, setActiveBoxId] = useState<any>(null); // 历史盲盒列表中，激活的盲盒 id
  const [boxInfo, setBoxInfo] = useState<any>({}); // 历史盲盒列表中，激活的盲盒信息
  const [boxCopyRightList, setBoxCopyRightList] = useState<any>([]); // 历史盲盒列表中，激活的盲盒特别鸣谢作者列表
  const [boxIpInfo, setBoxIpInfo] = useState<any>({}); // 历史盲盒列表中，激活的盲盒 ip 消息
  const [boxNftList, setBoxNftList] = useState<any>([]); // 历史盲盒列表中，激活的盲盒中 nft 的列表
  const [rateFeeBlockInfo, setRateFeeBlockInfo] = useState<any>({}); // 汇率、手续费等信息
  const [userWhiteListPoint, setUserWhiteListPoint] = useState<number>(0); // 用户特权开盒次数(购买型盲盒)
  const [userExchangeBoxTimes, setUserExchangeBoxTimes] = useState<number>(0); // 用户可兑换次数(兑换型盲盒)

  const { userInfo } = useModel('login');

  const getSellingBoxData = useCallback(async () => {
    const res = await getInOrWaitSellingBox();
    setSellingBoxData(res);
  }, []);

  const getBoxListByIpId = useCallback(async ({ ipId }: { ipId: any }) => {
    if (!ipId) return;
    const res = await getBlindBoxByIpId({ ipId });
    setBoxList(res);
  }, []);

  const getSpecialThankListByBoxId = useCallback(
    async ({ ipId }: { ipId: any }) => {
      if (!ipId) return;
      const res = await getSpecialTksByIpId({ ipId });
      setSpecialThankList(res);
    },
    [],
  );

  const getOpenBoxesResultList = useCallback(async () => {
    const res = await getBoxSellingInfoFirstTime();
    setOpenBoxesResultList(res);
  }, []);

  const getBoxesList = useCallback(async () => {
    const res = await getAllBlindBoxList();
    setAllBoxesList(res);
  }, []);

  const updateBoxInfo = useCallback(() => {
    if (activeBoxId) {
      getBlindBoxInfoByBoxId(activeBoxId).then(setBoxInfo);
    }
  }, [activeBoxId]);

  const updateUserWhiteListPoint = useCallback(() => {
    if (activeBoxId) {
      getUserWhiteListPoint(activeBoxId).then(setUserWhiteListPoint);
    }
  }, [activeBoxId]);

  const resetBoxData = () => {
    setActiveBoxId(null);
    setBoxInfo({});
    setBoxCopyRightList([]);
    setBoxIpInfo({});
    setBoxNftList([]);
    setUserWhiteListPoint(0);
    setUserExchangeBoxTimes(0);
  };

  useEffect(() => {
    if (activeBoxId) {
      getBlindBoxInfoByBoxId(activeBoxId).then(setBoxInfo);
      getBlindBoxCopyRightByBoxId(activeBoxId).then(setBoxCopyRightList);
      getBlindBoxIpInfoByBoxId(activeBoxId).then(setBoxIpInfo);
      getBoxProductsByBoxId(activeBoxId).then(setBoxNftList);
    }
  }, [activeBoxId]);

  useEffect(() => {
    if (userInfo && activeBoxId) {
      getUserWhiteListPoint(activeBoxId).then(setUserWhiteListPoint);
      getUserExchangeBoxTimes(activeBoxId).then(setUserExchangeBoxTimes);
    }
  }, [userInfo, activeBoxId]);

  useEffect(() => {
    getOpenBoxesResultList();
    getBoxesList();
    getRateFeeBlockInfo().then(setRateFeeBlockInfo);
  }, []);

  return {
    sellingBoxData,
    boxList,
    specialThankList,
    openBoxesResultList,
    allBoxesList,
    activeBoxId,
    boxInfo,
    boxCopyRightList,
    boxIpInfo,
    boxNftList,
    rateFeeBlockInfo,
    userWhiteListPoint,
    userExchangeBoxTimes,
    resetBoxData,
    getBoxesList,
    updateBoxInfo,
    updateUserWhiteListPoint,
    setActiveBoxId,
    getBoxListByIpId,
    getSpecialThankListByBoxId,
    getSellingBoxData,
  };
}
