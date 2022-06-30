// @flow
import styles from './index.less';
import { useEffect } from 'react';
import { addUserApplyGetRewardInfo } from '@/api/event';
import { message } from 'antd';

export default ({ close, userInfo, setIsRewardState, isRewardState }: any) => {
  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const fetchReward = async () => {
    setIsRewardState(!isRewardState);
    const { code } = await addUserApplyGetRewardInfo(userInfo.evmWalletAddr);
    if (code === 0) {
      message.success('success!');
      close();
      return;
    }
    message.error('error!');
  };

  return (
    <div className={styles.container} onClick={stopPropagation}>
      <div className={styles.close} onClick={close}></div>
      <div className={styles.input}>
        <input type="text" defaultValue={userInfo.evmWalletAddr} disabled />
      </div>
      <div className={styles.detail1}>
        <span className={styles.detail_point}>2022年6月30日</span>
        まで全ての報酬
      </div>
      <div className={styles.detail2}>
        受け取り日時：
        <span className={styles.detail_point}>2022年7月3日</span>以前
      </div>
      <div className={styles.buttons}>
        <div className={styles.button} onClick={close}></div>
        <div className={styles.button} onClick={fetchReward}></div>
      </div>
    </div>
  );
};
