// @ts-ignore
import styles from './index.less';
import { TwitterOutlined, GoogleOutlined } from '@ant-design/icons';
import { getUserInfo, IUserInfo } from '@/api/user';
import { useEffect, useState } from 'react';

import useLocals from '@/hooks/useLocals';

export default function IndexPage() {
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);

  const { localText } = useLocals();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await getUserInfo();
      if (res && +res.code === 0) {
        setUserInfo(() => res.data);
      } else {
        console.error(res);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.avator}>
        <img
          className={styles.avator}
          src={
            userInfo?.userPicture
              ? userInfo.userPicture
              : require('./assets/user_default.png')
          }
          alt="avator"
        />
        <div className={styles.wallet}>
          <h1 className={styles.wallet_address}>
            {userInfo?.nickName
              ? userInfo?.nickName
              : localText['user.setting.nickName']}
          </h1>
        </div>
        <span className={styles.email_address}>{userInfo?.emailAddr}</span>
      </div>

      <div className={styles.detail}>
        <div className={styles.google}>
          <GoogleOutlined className={styles.email_icon} />
          <span>{userInfo?.googleUserId}</span>
        </div>
        <div>|</div>
        <div className={styles.twitter}>
          <TwitterOutlined className={styles.email_icon} />
          <span>{userInfo?.twitterUserId}</span>
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.chain}>
        {userInfo?.flowWalletAddr ? (
          <div className={styles.chain_card}>
            <div>
              <h1>Flow</h1>
              <p>{userInfo.flowWalletAddr}</p>
            </div>
          </div>
        ) : null}
        {userInfo?.evmWalletAddr ? (
          <div className={styles.chain_card}>
            <div>
              <h1>HashPalette</h1>
              <p>{userInfo.evmWalletAddr}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
