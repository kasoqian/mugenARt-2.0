// @ts-ignore
import styles from './index.less';
import Input from '@/components/Input';
import ResetPassword from '../reset-password';
import { dialog } from '@/components/Modal';
import { useEffect, useState } from 'react';
import Login from '@/layouts/components/login';
import { signIn } from '@/api/login';
import { message } from 'antd';
import useKeyUp from '@/hooks/useKeyUp';

import useLocals from '@/hooks/useLocals';
import { getUserInfo, IUserInfo } from '@/api/user';
import CloseButton from '@/components/Close';

interface ISignIn {
  close: () => void;
  signInCallback: (userInfo: IUserInfo) => Promise<void>;
}

export default function SignIn({ signInCallback, close }: ISignIn) {
  const [emailAddr, setEmailAddr] = useState<string>('');
  const [passwd, setPasswd] = useState<string>('');

  const localText = useLocals(true);

  const stopPropagation = (e: any) => {
    e.stopPropagation();
  };

  const onEmilAddressChange = (val: string) => {
    setEmailAddr(() => val);
  };

  const onPasswordChange = (val: string) => {
    setPasswd(() => val);
  };

  const toResetPassword = () => {
    close();
    dialog({
      component: ResetPassword,
      props: {
        signInCallback,
      },
    });
  };

  const backToLogin = () => {
    close();
    dialog({
      component: Login,
      props: {
        signInCallback,
      },
    });
  };

  useEffect(() => {
    setEmailAddr(() => '');
    setPasswd(() => '');
  }, []);

  /*   useEffect(() => {
    setInterval(() => {
      console.log(emailAddr);
    }, 3000);
  }, []);
 */
  const toSignIn = async () => {
    const res = await signIn({ emailAddr, passwd });
    console.log('通按键触发', emailAddr, passwd);
    if (res && +res.code === 0) {
      message.success(localText('dialog.signIn.success'));
      const useInfo = await getUserInfo();
      const { data } = useInfo || {};
      signInCallback(data);
      close();
    } else {
      message.error(res?.message || localText('dialog.signIn.systemError'));
    }
  };

  useKeyUp('Enter', toSignIn);

  return (
    <>
      <CloseButton position={{ x: 13 }}></CloseButton>
      <div className={styles.sign_in} onClick={stopPropagation}>
        <Input
          className={styles.email_address}
          placeholder={localText('dialog.signIn.enterEmail')}
          onChange={onEmilAddressChange}
          value={emailAddr}
        />
        <div className={styles.password}>
          <Input
            className={styles.password_input}
            placeholder={localText('dialog.signIn.enterPassword')}
            onChange={onPasswordChange}
            type="password"
            value={passwd}
          />
          <button onClick={toResetPassword}>
            {localText('dialog.signIn.forgetPassword')}
          </button>
        </div>
        <div className={styles.sign_in_button} onClick={toSignIn}>
          {localText('dialog.signIn.signIn')}
        </div>
        <div className={styles.sign_in_back} onClick={backToLogin}>
          {localText('dialog.signIn.withWallet')}
        </div>
      </div>
    </>
  );
}
