import { useEffect, useState } from 'react';
import { dialog } from '@/components/Modal';
import Login from '../login';
import { message } from 'antd';
import { history, useModel, useLocation } from 'umi';
import Wallet from '@/api/Wallet';
// @ts-ignore
import * as fcl from '@onflow/fcl';

import { getLoginData, logOut } from '@/api/login';

import SignUp from '../sign-up';

// @ts-ignore
import styles from './index.less';
import classNames from 'classnames';

import Atlas from './components/atlas';
import useLocals from '@/hooks/useLocals';
import { getUserInfo, IUserInfo } from '@/api/user';

fcl
  .config()
  .put('accessNode.api', location.origin)
  .put('discovery.wallet', 'https://flow-wallet.blocto.app/authn');

export default function Header() {
  const [showPersonInfo, setShowPersonInfo] = useState<boolean>(false);
  const [animate, setAnimate] = useState<boolean>(false);

  const location = useLocation();

  const { userInfo, setUserInfo } = useModel('login', (model) => ({
    userInfo: model.userInfo,
    setUserInfo: model.setUserInfo,
  }));

  const localsText = useLocals(true);

  useEffect(() => {
    if (!!userInfo) {
      const Gleam = window.Gleam || [];
      Gleam.push(['UserID', userInfo.emailAddr]);
    }
  }, [userInfo]);

  const signInCallback = (uInfo: IUserInfo) => {
    setUserInfo(() => uInfo);
  };

  const loginIn = async () => {
    dialog({
      component: Login,
      props: {
        signInCallback,
      },
    });
  };

  const AtlasModel = async () => {
    dialog({
      component: Atlas,
    });
  };

  useEffect(() => {
    const isUserLogin = async () => {
      const res = await getLoginData();

      if (res && +res.code === 0) {
        const { data } = await getUserInfo();
        setUserInfo(() => data);
      }

      if (res && +res.code !== 0) {
        checkReferral();
      }
    };
    isUserLogin();
  }, []);

  const hasReferralCode = () => {
    const index = window.location.href.indexOf('referralCode');
    return index !== -1;
  };

  const checkReferral = () => {
    // 没有找到邀请码就什么也不做
    if (!hasReferralCode()) return;

    dialog({
      component: SignUp,
      props: {
        signInCallback,
      },
    });
  };

  const toAsset = () => {
    history.push('/asset/list');
  };

  const toSettings = () => {
    history.push('/user/settings');
    setShowPersonInfo(() => false);
    setAnimate(() => false);
  };

  const toLogOut = async () => {
    const pathname = location.pathname;

    if (await logOut()) {
      setUserInfo(() => null);
      message.success(localsText('dialog.loggedIn.logOutSuccess'));

      fcl
        .currentUser()
        .subscribe((user: { addr: string; loggedIn: boolean }) => {
          if (user && user.loggedIn) {
            fcl.unauthenticate();
          }
        });
    }

    if (pathname !== '/home') {
      history.replace('/home');
    }
  };

  const toShowPersonInfo = (e: any) => {
    e.stopPropagation();
    setShowPersonInfo(() => true);
    setTimeout(() => setAnimate(() => true), 200);
  };

  useEffect(() => {
    function closeDialog() {
      setShowPersonInfo(() => false);
      setTimeout(() => setAnimate(() => false), 200);
    }
    window.addEventListener('click', closeDialog);

    return () => {
      window.removeEventListener('click', closeDialog);
    };
  }, []);

  return (
    <div className={styles.header}>
      {userInfo ? <div className={styles.atlas} onClick={AtlasModel} /> : null}
      {!userInfo ? (
        <div className={styles.sign} onClick={loginIn}>
          {localsText('dialog.loggedIn.SignIn')}
        </div>
      ) : (
        <div className={styles.signed} onClick={toShowPersonInfo}>
          <div className={styles.text}>
            {userInfo.nickName && userInfo.nickName.length > 8
              ? `${userInfo.nickName.slice(0, 4)}...${userInfo.nickName.slice(
                  userInfo.nickName.length - 4,
                  userInfo.nickName.length,
                )}`
              : userInfo.nickName}
          </div>
          <div className={styles.icon} />
          {showPersonInfo ? (
            <div
              className={classNames([
                styles.personInfo,
                { [styles.show]: animate },
              ])}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className={styles.account}>
                <div
                  className={styles.logo}
                  style={{
                    backgroundImage: `url(${
                      userInfo.userPicture ||
                      require('./assets/person_detail.png')
                    })`,
                  }}
                />
                <div className={styles.walletName}>
                  {localsText('dialog.loggedIn.title')}
                </div>
                <div className={styles.walletPath}>
                  <div className={styles.walletAddress}>
                    {userInfo.emailAddr}
                  </div>
                </div>
              </div>
              <div className={styles.toAsset} onClick={toAsset}>
                {localsText('dialog.loggedIn.asset')}
              </div>
              <div className={styles.setting} onClick={toSettings}>
                {localsText('dialog.loggedIn.setting')}
              </div>
              <div className={styles.logOut} onClick={toLogOut}>
                {localsText('dialog.loggedIn.logOut')}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
