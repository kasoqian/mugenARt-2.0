import { useState, useEffect } from 'react';
import { getReferralLink, ShareContent } from '@/api/user';
import styles from './index.less';
import { message } from 'antd';
import { getUserRecommendInfo, userGetRewardTimes } from '@/api/event';
import useLocals from '@/hooks/useLocals';
import { useModel } from 'umi';

type SourceDataType = {
  blind_box_id?: string;
  create_time?: string;
  friend_open_times?: number;
  id?: number;
  update_time?: string;
  user_id?: string;
  user_reward_exchange_times?: number;
};

function RuleScore() {
  const [shareContent, setShareContent] = useState<ShareContent>({});
  const [scoreDataSource, setScoreDataSource] = useState<SourceDataType>({});
  const [refresh, setRefresh] = useState(false);

  const { localText } = useLocals();

  const { userInfo, loginIn } = useModel('login', (model) => ({
    userInfo: model.userInfo,
    loginIn: model.loginIn,
  }));

  useEffect(() => {
    return () => {
      setShareContent({});
      setScoreDataSource({});
    };
  }, []);

  useEffect(() => {
    fetchShare();
    fetchDataSource();
  }, [refresh, userInfo]);

  const fetchShare = async () => {
    const res = await getReferralLink();
    if (res && +res.code === 0) {
      setShareContent(res.data);
    }
  };

  const fetchDataSource = async () => {
    const res = await getUserRecommendInfo();
    setScoreDataSource(res);
  };

  const copyShareUrl = async () => {
    const content = shareContent?.referralLink;
    if (!!content) {
      await navigator.clipboard.writeText(content);
      message.success(`${localText['events.activities.copied']}: ` + content);
      return;
    }
    if (!userInfo) {
      loginIn();
      return;
    }
    message.error(localText['events.earn.error']);
  };

  /* 收集次数 */
  const fetchCollectionTimes = async () => {
    if (!userInfo) {
      loginIn();
      return;
    }
    if (scoreDataSource?.user_reward_exchange_times === 0) return;

    const res = await userGetRewardTimes();

    if (res.code !== 0) {
      message.error('System error!');
    } else {
      message.success('Collection Success!');
      setRefresh((v) => !v);
    }
  };

  const getStartBarImg = () => {
    let openTimes = scoreDataSource?.friend_open_times;
    if (openTimes === undefined) return;

    if (
      openTimes % 4 === 0 &&
      scoreDataSource?.user_reward_exchange_times === 0
    ) {
      return require('../../../../../../assets/rule-progress-bar-0.png');
    }
    if (openTimes % 4 === 1) {
      return require('../../../../../../assets/rule-progress-bar-1.png');
    }
    if (openTimes % 4 === 2) {
      return require('../../../../../../assets/rule-progress-bar-2.png');
    }
    if (openTimes % 4 === 3) {
      return require('../../../../../../assets/rule-progress-bar-3.png');
    }
    if (
      openTimes % 4 === 0 &&
      scoreDataSource?.user_reward_exchange_times !== 0
    ) {
      return require('../../../../../../assets/rule-progress-bar-4.png');
    }
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${localText['events.activities.bg']})`,
      }}
    >
      <div
        className={`${styles.ball} ${
          scoreDataSource?.user_reward_exchange_times === 0
            ? styles.ball_empty
            : styles.ball_full
        }`}
      >
        <div className={styles.score}>
          {!!scoreDataSource?.user_reward_exchange_times
            ? scoreDataSource?.user_reward_exchange_times
            : 0}
        </div>
        <div className={styles.remark}>
          {localText['events.activities.chances']}
        </div>
      </div>
      <div className={styles.bar}>
        <img src={getStartBarImg()} alt="" />
      </div>
      <div className={styles.button_list}>
        {scoreDataSource?.user_reward_exchange_times !== 0 && (
          <div className={styles.button} onClick={fetchCollectionTimes}>
            {localText['events.activities.timesButton']}
          </div>
        )}
        {scoreDataSource?.user_reward_exchange_times === 0 && (
          <div className={`${styles.button} ${styles.grey}`}>
            {localText['events.activities.timesButton']}
          </div>
        )}
        <div className={styles.button} onClick={copyShareUrl}>
          {localText['events.activities.linkButton']}
        </div>
      </div>
    </div>
  );
}

export default RuleScore;
