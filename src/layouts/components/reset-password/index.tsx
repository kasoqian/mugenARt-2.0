// @ts-ignore
import styles from './index.less';
import Input from '@/components/Input';
import VerifyInput from '@/components/VerifyInput';
import { useEffect, useState } from 'react';
import { sendRegisterCode, resetPasswd } from '@/api/login';
import { message } from 'antd';
import { dialog } from '@/components/Modal';
import SignIn from '@/layouts/components/sign-in';
import useKeyUp from '@/hooks/useKeyUp';
import useLocals from '@/hooks/useLocals';
import { IUserInfo } from '@/api/user';
import CloseButton from '@/components/Close';

export default function ResetPassword({
  signInCallback,
  close,
}: {
  close: () => void;
  signInCallback: (userInfo: IUserInfo) => Promise<void>;
}) {
  const [emailAddr, setEmailAddr] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');
  const [verifyCode, setVerifyCode] = useState<string>('');

  const localText = useLocals(true);

  const stopPropagation = (e: any) => {
    e.stopPropagation();
  };

  const onEmilAddressChange = (val: string) => {
    setEmailAddr(() => val);
  };

  const onVerifyCodeChange = (val: string) => {
    setVerifyCode(() => val);
  };

  const onPasswordChange = (val: string) => {
    setPassword(() => val);
  };

  const onConfirmPasswordChange = (val: string) => {
    setConfirmPass(() => val);
  };

  const sendVerifyCode = async () => {
    await sendRegisterCode(emailAddr);
  };

  const toConfirm = async () => {
    try {
      const result = await resetPasswd({
        emailAddr,
        registerCode: verifyCode,
        passwd: password,
        confirmPasswd: confirmPass,
      });
      if (result && +result.code === 0) {
        message.success(localText('dialog.resetPassword.success'));
        close();
        dialog({
          component: SignIn,
          props: {
            signInCallback,
          },
        });
      } else {
        message.error(
          result?.message || localText("'dialog.resetPassword.systemError'"),
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setEmailAddr(() => '');
    setVerifyCode(() => '');
    setPassword(() => '');
    setConfirmPass(() => '');
  }, []);

  useKeyUp('enter', toConfirm);

  return (
    <>
      <CloseButton></CloseButton>
      <div className={styles.sign_up} onClick={stopPropagation}>
        <Input
          className={styles.email_address}
          placeholder={localText('dialog.resetPassword.enterEmail')}
          onChange={onEmilAddressChange}
          value={emailAddr}
          validate={{
            rule: /^([a-zA-Z]|[0-9])(.*)@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
            text: localText('dialog.resetPassword.correctEmail'),
          }}
        />
        <VerifyInput
          label={localText('dialog.verifyInput.placeholder')}
          onChange={onVerifyCodeChange}
          onVerify={sendVerifyCode}
          value={verifyCode}
        />
        <Input
          type="password"
          className={styles.password}
          placeholder={localText('dialog.resetPassword.enterPassword')}
          onChange={onPasswordChange}
          value={password}
          validate={{
            rule: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/,
            text: localText('dialog.resetPassword.tips'),
          }}
        />
        <Input
          type="password"
          className={styles.confirm_passward}
          placeholder={localText('dialog.resetPassword.confirmPassword')}
          onChange={onConfirmPasswordChange}
          value={confirmPass}
        />
        <div className={styles.sign_up_button} onClick={toConfirm}>
          {localText('dialog.resetPassword.confirm')}
        </div>
      </div>
    </>
  );
}
