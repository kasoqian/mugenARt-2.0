import styles from './index.less';

import { useEffect, useState } from 'react';
import { createActivityOrder, getUserActivityProcessInfo } from '@/api/event';

import ShowVideo from '../showVideo';
import ShowAward from '../showAward';
import { dialog } from '@/components/Modal';
import useLocals from '@/hooks/useLocals';
import { useModel } from 'umi';

/*
 * buttonState
 * 0 - 未达到兑换要求，默认按钮
 * 1 - 兑换中，激活按钮
 * 2 - 兑换完毕，隐藏按钮
 */
type ButtonStateType = {
  index: number;
  awardId: string;
  buttonState: number;
  className: any;
};

type awardDataSourceType = {
  img: string;
  video: string;
};

function DisplayDetails({ className, setRefreshRemain }: any) {
  // 徽章总量
  const [totalBadge, setTotalBadge] = useState(0);
  // 用户获得的徽章总量
  const [userBadgeTotal, setUserBadgeTotal] = useState(0);
  // 用户获得的list
  const [userBadgeList, setUserBadgeList] = useState([]);
  // 所有奖品
  const [nftRewardLists, setNftRewardLists] = useState([]);
  // 按钮状态
  const [userButtonStatues, setUserButtonStatues] = useState<ButtonStateType[]>(
    [],
  );

  const { userInfo } = useModel('login');

  const { localText } = useLocals();

  /* 重新请求nft数据 */
  const [reload, setReLoad] = useState(false);

  /* 领取步骤
   * 0 - 无状态
   * 1 - 播放动画
   * 2 - 播放奖品
   */
  const [awardSteps, setAwardSteps] = useState(0);
  /* 领取数据 */
  const [awardDataSource, setAwardDataSource] = useState<awardDataSourceType>({
    img: '',
    video: '',
  });

  useEffect(() => {
    return () => {
      setTotalBadge(0);
      setUserBadgeTotal(0);
      setUserBadgeList([]);
      setNftRewardLists([]);
      setUserButtonStatues([]);
      setAwardSteps(0);
      setAwardDataSource({ img: '', video: '' });
    };
  }, []);

  useEffect(() => {
    fetchUserState();
  }, [reload, userInfo]);

  useEffect(() => {
    if (awardSteps == 2) {
      dialog({
        component: ShowAward,
        props: {
          imgSrc: awardDataSource.img,
        },
      });
    }
  }, [awardSteps]);

  const fetchUserState = async () => {
    const result = await getUserActivityProcessInfo();

    /* 设置奖品列表 */
    setNftRewardLists(result.activity_products_with_user_own_info);
    /* 设置徽章总量 - bar */
    setTotalBadge(result.total_badge_num);
    /* 设置用户徽章总量 - bar */
    setUserBadgeTotal(result.user_own_badge_num);
    /* 设置用户的nft - list */
    setUserBadgeList(result.badge_with_user_own_info);
    /* 设置徽章状态 - button */
    setUserButtonStatues(
      result.activity_products_with_user_own_info.map(
        (item: any, index: number) => {
          const buttonState = buttonStateHandle(
            item.is_user_can_exchange,
            item.exchange_status,
          );
          const className = getButtonStyle(buttonState);
          const awardId = item.id;
          return { index, buttonState, className, awardId };
        },
      ),
    );
  };

  /* 由2个状态组合成的按钮的3种表现形式 */
  const buttonStateHandle = (canExchanged: number, statusExchanged: number) => {
    const sum = canExchanged + statusExchanged;
    if (sum === 0) return 0;
    if (sum === 1) return 1;
    if (sum > 1) return 2;
  };

  /* 进度条根据状态显示不同的图片 */
  const progressImg = (total: number) => {
    if (total <= 3) return require('./assets/progress-0.png');
    if (total <= 6) return require('./assets/progress-1.png');
    if (total <= 9) return require('./assets/progress-2.png');
    return require('./assets/progress-3.png');
  };

  /* 根据不同的状态显示按钮状态 */
  const getButtonStyle = (buttonState: number | undefined) => {
    if (buttonState === 0) return null;
    if (buttonState === 1) return styles.button_active;
    if (buttonState === 2) return styles.button_hidden;
    return null;
  };

  const getNftStyle = (buttonState: number | null) => {
    if (buttonState === 0) return null;
    if (buttonState === 1) return styles.card_active;
    if (buttonState === 2) return styles.card_got;
    return null;
  };

  /* 多状态nft图 */
  const getNftImgEl = (index: number) => {
    if (userButtonStatues.length === 0) return;

    let buttonState: any = userButtonStatues[index].buttonState;
    let needBadgeNumber: any = nftRewardLists[index]['need_badge_number'];
    let nftCardStyle = getNftStyle(buttonState);

    needBadgeNumber =
      needBadgeNumber >= 10 ? needBadgeNumber : `0${needBadgeNumber}`;

    return (
      <div key={index} className={styles.progress_card}>
        <div className={`${styles.card} ${nftCardStyle}`}>
          <img src={nftRewardLists[index]['product_image_url']} />
          <strong className={styles.card_num}>{needBadgeNumber}</strong>
        </div>
        {getNftButtonEl(index)}
      </div>
    );
  };

  /* 多状态按钮 */
  const getNftButtonEl = (index: number) => {
    if (userButtonStatues.length === 0) return;

    let buttonEvent = () => {};
    const buttonState = userButtonStatues[index].buttonState;
    const buttonStyle = getButtonStyle(buttonState);

    if (buttonState === 1) {
      buttonEvent = async () => {
        await fetchReward({
          buttonState,
          awardId: userButtonStatues[index].awardId,
          activity_product_number: nftRewardLists[index]['need_badge_number'],
        });
        setReLoad((state) => !state);
        setAwardDataSource({
          img: nftRewardLists[index]['product_image_url'],
          video: nftRewardLists[index]['open_box_video_url'],
        });
        setAwardSteps(1);
      };
    }

    return (
      <div
        className={`${styles.reward_button} ${buttonStyle}`}
        onClick={buttonEvent}
      >
        {localText['events.activities.reward']}
      </div>
    );
  };

  const fetchReward = async ({
    buttonState,
    awardId,
    activity_product_number,
  }: any) => {
    if (buttonState !== 1) return;

    const result = await createActivityOrder({
      product_id: awardId,
      pay_type: 4,
      activity_product_number,
    });

    setRefreshRemain((v: boolean) => !v); // 刷新左侧模型中的余额
    console.log(result);
  };

  return (
    <div className={className}>
      {awardSteps === 1 ? (
        <ShowVideo setSteps={setAwardSteps} videoSrc={awardDataSource.video} />
      ) : null}
      <div className={styles.title}>
        {localText['events.activities.detailTitle']}
      </div>
      <div className={styles.content}>
        {localText['events.activities.detailContent']}
      </div>
      <div className={styles.title2}>
        <img
          src={require('../../../../../../assets/detail-title-icon.png')}
        ></img>
        <p>{localText['events.activities.copyright']}</p>
      </div>
      <div
        className={styles.progress}
        style={{ backgroundImage: `url(${progressImg(userBadgeTotal)})` }}
      >
        {nftRewardLists.length > 0 &&
          nftRewardLists.map((nft, index) => {
            return getNftImgEl(index);
          })}
      </div>
      <div className={styles.title2}>
        <img
          src={require('../../../../../../assets/detail-title-icon.png')}
        ></img>
        <p>
          {localText['events.activities.badges']} ({userBadgeTotal}/{totalBadge}
          )
        </p>
      </div>
      <div className={styles.list}>
        {userBadgeList.length > 0 &&
          userBadgeList.map((nft: any) => {
            return (
              <img
                className={nft.own_number === 0 ? styles.grey : null}
                key={nft.id}
                src={nft.product_image_data_url}
              />
            );
          })}
      </div>
    </div>
  );
}

export default DisplayDetails;
