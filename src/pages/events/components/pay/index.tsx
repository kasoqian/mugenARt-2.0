import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { providers, Contract } from 'ethers';
import { ERC20Contract, $float } from '@volare.defi/utils.js';
import GetReward from './components/getReward';

import styles from './index.less';
import {
  getIncome,
  getUserApplyGetRewardInfo,
  getUserGrantInterestDateInfo,
  getUserGrantInterestInfo,
  getUserInterestInfo,
} from '@/api/event';
import { Empty } from 'antd';
import useLocals from '@/hooks/useLocals';
import { dialog } from '@/components/Modal';

const PLT_ENDPOINT = 'http://3.115.106.136:22000';
const PLT_CONTRACT = '0x0000000000000000000000000000000000000103';
const STAKER_ADDRESS = '0xB17B6Ea8dA65b342E6f91980c937E766FB42E0E3'; // 临时地址

export default function () {
  const [totalPool, setTotalPool] = useState<any>(0);

  const [userGrantInterestData, setUserGrantInterestData] = useState<any>({});
  const [userInterestInfo, setUserInterestInfo] = useState<any>({});
  const [userGrantInterestInfo, setUserGrantInterestInfo] = useState<any>([]);
  const [isRewardState, setIsRewardState] = useState(false);

  const [hasUserReward, setHasUserReward] = useState(false);

  const { userInfo, loginIn } = useModel('login');

  const { localText } = useLocals();

  useEffect(() => {
    return () => {
      setUserGrantInterestInfo([]);
      setUserInterestInfo({});
      setUserGrantInterestData({});
    };
  }, []);

  useEffect(() => {
    load();
    checkHasUserReward();
  }, [userInfo, isRewardState]);

  const load = async () => {
    await handleLoad(getUserGrantInterestDateInfo, setUserGrantInterestData);
    await handleLoad(getUserInterestInfo, setUserInterestInfo);
    await handleLoad(getUserGrantInterestInfo, setUserGrantInterestInfo);
    await handleLoad(getIncome, setTotalPool);
    /*     await getBalance(); // 获取池子中plt总量 */
  };

  const handleLoad = async (api: any, setState: any) => {
    const { data } = await api();
    setState(data);
  };

  /*   // 获取池子的总量
  const getBalance = async () => {
    const provider = new providers.JsonRpcProvider(PLT_ENDPOINT);
    const plt = new Contract(PLT_CONTRACT, ERC20Contract.ABI(), provider);

    const totalPool = $float(await plt.balanceOf(STAKER_ADDRESS));
    console.log(
      '🛠️  ~ file: index.tsx ~ line 47 ~ getBalance ~ totalPool',
      totalPool,
    );
    setTotalPool(totalPool);
  }; */

  const toThousands = (num: any) => {
    num = parseInt(num as any);
    return num.toString().replace(/\d+/, function (n: string) {
      return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    });
  };

  const toThousandsFloat = (num: any) => {
    let s1 = toThousands(num);
    let s2 = num.split('.')[1] ? num.split('.')[1].slice(0, 2) : '00';
    return s1 + '.' + s2;
  };

  const showGetRewardDialog = () => {
    if (hasUserReward) {
      return;
    }
    dialog({
      component: GetReward,
      props: {
        userInfo: userInfo,
        setIsRewardState: (e) => setIsRewardState(e),
        isRewardState: isRewardState,
      },
    });
  };

  const checkHasUserReward = async () => {
    const { data } = await getUserApplyGetRewardInfo();
    setHasUserReward(!!data);
  };

  return (
    <div className={styles.bg}>
      <div className={styles.header}>
        <div className={styles.content}>
          <div className={styles.title_container}>
            <span className={styles.title}>
              {localText['events.pay.halving']}
            </span>
            <span className={styles.cycle}>
              {userGrantInterestData?.halving_day}
            </span>
          </div>
          <div className={styles.block}>
            <div className={styles.block_container}>
              <div className={styles.num}>
                {toThousandsFloat(JSON.stringify(totalPool))}
              </div>
              <div className={styles.description}>
                {localText['events.pay.pool']}
              </div>
              <div className={styles.supply}>
                {localText['events.pay.poolRemark']}
              </div>
            </div>
            <div className={styles.block_container}>
              <div className={styles.num}>
                {userGrantInterestData?.reward_allocating_days}
              </div>
              <div className={styles.description}>
                {localText['events.pay.poolTime']}
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.content} ${styles.second_block}`}>
          {userInfo && (
            <div
              className={`${styles.get_reward} ${
                hasUserReward ? styles.get_reward_disabled : ''
              }`}
              onClick={showGetRewardDialog}
              aria-disabled="false"
            >
              {hasUserReward === false ? '報酬受取申請' : '申請完了'}
            </div>
          )}
          <div className={styles.title_container}>
            <div className={styles.title}>{localText['events.pay.data']}</div>
          </div>
          <div className={styles.block}>
            <div
              className={`${styles.block_container} ${styles.fix_position2}`}
            >
              <div className={styles.num} style={{ color: 'red' }}>
                {userInterestInfo?.wait_get > 0
                  ? toThousandsFloat(userInterestInfo?.wait_get)
                  : 0}
                <span className={styles.unit}>PLT</span>
              </div>
              <div className={styles.description}>
                {localText['events.pay.user1']}
              </div>
              <div className={styles.supply}>
                {localText['events.pay.user2']}
              </div>
            </div>
            <div className={`${styles.block_container} ${styles.fix_position}`}>
              <div className={styles.num}>
                {userInterestInfo?.effective_plt > 0
                  ? userInterestInfo?.effective_plt
                  : 0}
              </div>
              <div className={styles.description}>
                {localText['events.pay.userNft']}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.table}>
        <table className={styles.fixed}>
          <thead>
            <tr>
              <th>{localText['events.pay.table1']}</th>
              <th>{localText['events.pay.table2']}</th>
              <th>{localText['events.pay.table3']}</th>
              <th>{localText['events.pay.table4']}</th>
            </tr>
          </thead>
        </table>
        <div className={styles.scroll}>
          {userGrantInterestInfo.length === 0 && (
            <div className={styles.empty}>
              <Empty className={styles.empty_content}></Empty>
            </div>
          )}
          {userGrantInterestInfo.length > 0 && (
            <table>
              <tbody>
                {userGrantInterestInfo.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.update_time}</td>
                    <td> {toThousands(item.get_amount)}</td>
                    <td> {item.grant_date}</td>
                    <td>{localText['events.pay.tableSuccess']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div
        className={styles.footer}
        style={{ backgroundImage: `url(${localText['events.pay.bg']})` }}
      ></div>
    </div>
  );
}
