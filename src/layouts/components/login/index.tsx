import { useEffect, useState } from 'react';
import { dialog } from '@/components/Modal';
import BindEmail from '@/layouts/components/bind-email';
import SignIn from '@/layouts/components/sign-in';
import SignUp from '@/layouts/components/sign-up';
import { urlPrefix, isTestEnv } from '@/api/request';

import {
  getLoginNonce,
  loginWithMetamask,
  loginWithBlocto,
  loginWithWalletConnect,
} from '@/api/login';

// @ts-ignore
import * as fcl from '@onflow/fcl';
// @ts-ignore
import styles from './index.less';
import { message } from 'antd';

import { getPltProvider } from '@/api/Wallet';
import Wallet from '@/api/Wallet';

import useLocals from '@/hooks/useLocals';
import { getUserInfo, IUserInfo } from '@/api/user';
import CloseButton from '@/components/Close';
import WalletConnectProvider from '@walletconnect/web3-provider';

interface ILogin {
  close: () => void;
  signInCallback: (userInfo: IUserInfo) => Promise<void>;
}

export default function Login({ close, signInCallback }: ILogin) {
  const localsText = useLocals(true);
  const [islock, setIsLock] = useState(false);
  const [provider, setProvider] = useState<WalletConnectProvider>();

  useEffect(() => {
    const dealWithLogin = async (msg: any) => {
      const { type, code, jwtToken } = msg || {};

      if (type === 'google' || type === 'twitter') {
        /* 如果没有绑定邮箱 */
        if (+code === 1006) {
          localStorage.setItem('ACCESS_TOKEN', jwtToken);
          close();
          dialog({
            component: BindEmail,
            props: {
              signInCallback,
            },
          });
          /* 如果绑定了邮箱 */
        } else if (+code === 0) {
          message.success(localsText('dialog.signChoose.logInSuccess'));
          localStorage.setItem('ACCESS_TOKEN', jwtToken);
          const res = await getUserInfo();
          signInCallback(res.data);
          close();
        } else {
          message.error(localsText('dialog.signChoose.logInFailed'));
        }
      }
    };

    const dealWithStorage = (msg: StorageEvent) => {
      let value;
      try {
        value = JSON.parse(msg.newValue!);
      } catch (e) {
        value = msg.newValue;
      }
      if (msg.key === 'message') {
        dealWithLogin(value);
        localStorage.removeItem(msg.key as string);
      }
    };

    window.addEventListener('storage', dealWithStorage);
    return () => {
      window.removeEventListener('storage', dealWithStorage);
    };
  }, []);

  const clickEvent = (e: any) => {
    e.stopPropagation();
  };

  const showSignUp = () => {
    close();
    dialog({
      component: SignUp,
      props: {
        signInCallback,
      },
    });
  };

  const showSignIn = () => {
    close();
    dialog({
      component: SignIn,
      props: {
        signInCallback,
      },
    });
  };

  const signWithTwitter = () => {
    window.open(
      `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=LVJ1QURVV2dpWHRQT2QyWjBrUVU6MTpjaQ&redirect_uri=${urlPrefix}/mugen-auth-service/api/oauth/verifyTwitterCode&scope=users.read%20tweet.read&state=state&code_challenge=challenge&code_challenge_method=plain`,
      'Twitter Login',
      'width=500,height=600,left=300,top=100',
    );
  };

  const signWithGoogle = () => {
    const client_id = isTestEnv
      ? '689083293752-s8606bgem4m6fl33821s450e21047h6a.apps.googleusercontent.com'
      : '757587044884-kg0046kdumivopvra1na5gbvv29rivq4.apps.googleusercontent.com';
    window.open(
      `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?redirect_uri=${encodeURIComponent(
        urlPrefix,
      )}%2Fmugen-auth-service%2Fapi%2Foauth%2FverifyGoogleCode&prompt=consent&response_type=code&client_id=${client_id}&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&access_type=offline&flowName=`,
      'Chrome Login',
      'width=500,height=600,left=300,top=100',
    );
  };

  const loginWithMetaMask = async () => {
    const wallet = Wallet();

    if (!(await wallet.isMetaMaskInstalled())) {
      message.warn(localsText('message.metamaskInstall.error'));
      return;
    }

    const walletAddress = await wallet.connectWallet();
    const nonce = await getLoginNonce(walletAddress);
    const { signature, signMessage } = await wallet.sign({ nonce });
    try {
      const result = await loginWithMetamask({
        walletAddress,
        signature,
        signMessage,
        nonce,
      });

      if (result && +result.code === 0) {
        message.success(localsText('dialog.signChoose.logInSuccess'));
        if (typeof result.data !== 'string') {
          localStorage.setItem('ACCESS_TOKEN', result.data.jwtToken);
          const userInfo = await getUserInfo();
          signInCallback(userInfo.data);
          close();
        }
      }
      if (result && +result.code === 1006 && typeof result.data === 'string') {
        localStorage.setItem('ACCESS_TOKEN', result.data);
        close();
        dialog({
          component: BindEmail,
          props: {
            signInCallback,
          },
        });
      }
    } catch (e) {
      close();
      console.error(e);
    }
  };

  const loginWithBloCto = async () => {
    const { addr } = await fcl.authenticate();

    const result = await loginWithBlocto({ walletAddress: addr });
    /* 检测用户是否绑定过邮箱 */
    if (result && +result.code === 0) {
      message.success(localsText('dialog.signChoose.logInSuccess'));
      if (typeof result.data !== 'string') {
        localStorage.setItem('ACCESS_TOKEN', result.data.jwtToken);
        const userInfo = await getUserInfo();
        signInCallback(userInfo.data);
        close();
      }
    }
    if (result && +result.code === 1006 && typeof result.data === 'string') {
      localStorage.setItem('ACCESS_TOKEN', result.data);
      close();
      dialog({
        component: BindEmail,
        props: {
          signInCallback,
        },
      });
    }
  };

  const loginWithPLT = async () => {
    if (islock) {
      return;
    }
    const newProvider = getPltProvider();
    const walletAddress = (await newProvider.enable())?.[0];

    const wallet = Wallet(provider as any);
    setProvider(() => newProvider);

    message.info(localsText('dialog.signChoose.signature'));
    try {
      setIsLock(() => true);
      const nonce = await getLoginNonce(walletAddress);
      const signResult = await wallet
        .ethSign({ nonce, walletAddress })
        .catch(() => {
          setIsLock(false);
          return {};
        });
      const { signature, signMessage } = signResult || ({} as any);

      const result = await loginWithWalletConnect({
        walletAddress,
        signature,
        signMessage,
        nonce,
      });
      setIsLock(() => false);

      if (result && +result.code === 0) {
        message.success(localsText('dialog.signChoose.logInSuccess'));
        if (typeof result.data !== 'string') {
          localStorage.setItem('ACCESS_TOKEN', result.data.jwtToken);
          const userInfo = await getUserInfo();
          signInCallback(userInfo.data);
          close();
        }
      }
      if (result && +result.code === 1006 && typeof result.data === 'string') {
        localStorage.setItem('ACCESS_TOKEN', result.data);
        close();
        dialog({
          component: BindEmail,
          props: {
            signInCallback,
          },
        });
      }
    } catch (e) {
      close();
      setIsLock(false);
      console.error(e);
    }
  };

  useEffect(() => {
    if (provider) {
      provider.on('disconnect', (code: number, reason: string) => {
        setIsLock(false);
      });
    }
  }, [provider]);

  return (
    <>
      <CloseButton />
      <div className={styles.login} onClick={clickEvent}>
        <div className={styles.signIn} onClick={showSignIn}>
          {localsText('dialog.signChoose.signIn')}
        </div>
        <div className={styles.signUp} onClick={showSignUp}>
          {localsText('dialog.signChoose.signUp')}
        </div>
        {/*    <div
          id="google"
          className={styles.signWithGoogle}
          onClick={signWithGoogle}
        >
          <img src={require('./assets/google.png')} alt="" />
          {localsText('dialog.signChoose.google')}
        </div> */}
        <div className={styles.signWithTwitter} onClick={signWithTwitter}>
          <img src={require('./assets/twitter.png')} alt="" />
          {localsText('dialog.signChoose.twitter')}
        </div>
        <div
          className={styles.signWithBlocto}
          onClick={loginWithMetaMask}
          style={{ display: 'none' }}
        >
          <img src={require('./assets/metamask.png')} alt="" />
          {localsText('dialog.signChoose.metaMask')}
        </div>
        <div className={styles.signWithBlocto} onClick={loginWithPLT}>
          <img src={require('./assets/walletconnect.png')} alt="" />
          {localsText('dialog.signChoose.plt')}
        </div>
        <div className={styles.signWithMetamask} onClick={loginWithBloCto}>
          <img src={require('./assets/blocto.png')} alt="" />
          {localsText('dialog.signChoose.blocto')}
        </div>
      </div>
    </>
  );
}
