// @ts-ignore
import styles from './index.less';
import Input from '@/components/Input';
import VerifyInput from '@/components/VerifyInput';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { sendRegisterCode, bindEmail } from '@/api/login';
import { message } from 'antd';
import useKeyUp from '@/hooks/useKeyUp';
import useLocals from '@/hooks/useLocals';
import { getUserInfo, IUserInfo } from '@/api/user';
import CloseButton from '@/components/Close';

interface IBindEmail {
  close: () => void;
  signInCallback: (userInfo: IUserInfo) => Promise<void>;
}

export default function BindEmail({ signInCallback, close }: IBindEmail) {
  const [selected, setSelected] = useState<boolean>(false);

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

  const determineEmail = async () => {
    if (!selected) {
      message.warn(localText('dialog.bindEmail.errorPrivacy'));
      return;
    }
    const result = await bindEmail({
      emailAddr,
      registerCode: verifyCode,
      passwd: password,
      confirmPasswd: confirmPass,
    });
    if (result && +result?.code === 0) {
      message.success(localText('dialog.bindEmail.bindSuccess'));
      const useInfo = await getUserInfo();
      signInCallback(useInfo.data);
      close();
    } else {
      message.error(
        result?.message || localText('dialog.bindEmail.errorSystem'),
      );
    }
  };

  useEffect(() => {
    setEmailAddr(() => '');
    setVerifyCode(() => '');
    setPassword(() => '');
    setConfirmPass(() => '');
  }, []);

  useKeyUp('enter', determineEmail);

  return (
    <>
      <CloseButton position={{ x: 10 }}></CloseButton>
      <div className={styles.bind_email} onClick={stopPropagation}>
        <Input
          className={styles.email_address}
          placeholder={localText('dialog.bindEmail.enterEmail')}
          onChange={onEmilAddressChange}
          value={emailAddr}
          validate={{
            rule: /^([a-zA-Z]|[0-9])(.*)@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
            text: localText('dialog.bindEmail.correctEmail'),
          }}
        />
        <VerifyInput
          label={localText('dialog.verifyInput.placeholder')}
          onChange={onVerifyCodeChange}
          onVerify={sendVerifyCode}
          value={verifyCode}
          className={styles.verify}
        />
        <Input
          type="password"
          className={styles.password}
          placeholder={localText('dialog.bindEmail.enterPassword')}
          onChange={onPasswordChange}
          value={password}
          validate={{
            rule: /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}$/,
            text: localText('dialog.bindEmail.tips'),
          }}
        />
        <Input
          type="password"
          className={styles.confirm_passward}
          placeholder={localText('dialog.bindEmail.confirmPassword')}
          onChange={onConfirmPasswordChange}
          value={confirmPass}
          validate={{
            validator: password === confirmPass,
            text: localText('dialog.bindEmail.diffTips'),
          }}
        />
        <div className={styles.agreement}>
          <div
            className={classNames([
              styles.select,
              {
                [styles.selected]: selected,
              },
            ])}
            onClick={() => setSelected(() => !selected)}
          />
          <a
            className={styles.privacy}
            href="https://www.mugenart.io/privacy"
            target="_blank"
          >
            {localText('dialog.bindEmail.privacy')}
          </a>
          <a
            className={styles.user}
            href="http://mugenart.io/userAgreen"
            target="_blank"
          >
            {localText('dialog.bindEmail.agreement')}
          </a>
        </div>
        <div
          className={classNames([
            styles.bind_email_button,
            { [styles.bind_email_button_disabled]: !selected },
          ])}
          onClick={determineEmail}
        >
          {localText('dialog.bindEmail.determine')}
        </div>
      </div>
    </>
  );
}
