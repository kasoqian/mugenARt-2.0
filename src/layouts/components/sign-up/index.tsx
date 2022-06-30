// @ts-ignore
import styles from './index.less';
import Input from '@/components/Input';
import VerifyInput from '@/components/VerifyInput';
import { useEffect, useState } from 'react';
import { sendRegisterCode, signUp } from '@/api/login';
import { message } from 'antd';
import useKeyUp from '@/hooks/useKeyUp';
import getQuery from '@/utils/getQuery';
import useLocals from '@/hooks/useLocals';
import { getUserInfo, IUserInfo } from '@/api/user';
import CloseButton from '@/components/Close';

interface ISignUp {
  close: () => void;
  signInCallback: (userInfo: IUserInfo) => Promise<void>;
}

export default function SignUp({ signInCallback, close }: ISignUp) {
  const [emailAddr, setEmailAddr] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');
  const [verifyCode, setVerifyCode] = useState<string>('');
  const [referralCode, setReferralCode] = useState<string>('');
  const [isInputDisable, setIsInputDisable] = useState(false);
  const [isValidate, setIsValidate] = useState(true);

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

  const onReferralCodeChange = (val: string) => {
    setReferralCode(() => val);
  };

  const sendVerifyCode = async () => {
    await sendRegisterCode(emailAddr);
  };

  const compareValidate = async (validate: string) => {
    console.log(validate);
    setIsValidate(() => !validate);
  };

  const toSignUp = async () => {
    const result = await signUp({
      emailAddr,
      registerCode: verifyCode,
      passwd: password,
      confirmPasswd: confirmPass,
      referralCode,
    });
    if (result && +result?.code === 0) {
      message.success(localText('dialog.signUp.signUpSuccess'));
      const useInfo = await getUserInfo();
      signInCallback(useInfo.data);
      close();
    } else {
      message.error(result?.message || localText('dialog.signUp.systemError'));
    }
  };

  const getReferralCode = () => {
    return getQuery('referralCode');
  };

  const initReferralCode = () => {
    const referralCode = getReferralCode();

    if (referralCode) {
      setIsInputDisable(true);
      return referralCode;
    }
    return '';
  };

  useEffect(() => {
    setEmailAddr(() => '');
    setVerifyCode(() => '');
    setPassword(() => '');
    setConfirmPass(() => '');
    setReferralCode(() => initReferralCode());
  }, []);

  useKeyUp('enter', toSignUp);

  return (
    <>
      <CloseButton position={{ x: 25 }}></CloseButton>
      <div className={styles.sign_up} onClick={stopPropagation}>
        <Input
          className={styles.email_address}
          containerClassName={styles.input_container}
          placeholder={localText('dialog.signUp.enterEmail')}
          onChange={onEmilAddressChange}
          value={emailAddr}
          validate={{
            rule: /^([a-zA-Z]|[0-9])(.*)@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
            text: localText('dialog.signUp.correctEmail'),
          }}
        />
        <VerifyInput
          label={localText('dialog.verifyInput.placeholder')}
          onChange={onVerifyCodeChange}
          onVerify={sendVerifyCode}
          value={verifyCode}
          className={styles.input_container}
        />
        <Input
          type="password"
          className={styles.password}
          containerClassName={styles.input_container}
          placeholder={localText('dialog.signUp.enterPassword')}
          onChange={onPasswordChange}
          value={password}
          validate={{
            rule: /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}$/,
            text: localText('dialog.signUp.tips'),
          }}
        />
        <Input
          type="password"
          className={styles.confirm_passward}
          containerClassName={styles.input_container}
          placeholder={localText('dialog.signUp.confirm')}
          onChange={onConfirmPasswordChange}
          value={confirmPass}
          validate={{
            validator: password === confirmPass,
            text: localText('dialog.signUp.diffTips'),
          }}
        />
        <Input
          type="text"
          className={styles.confirm_passward}
          containerClassName={styles.input_container}
          placeholder={localText('dialog.signUp.referralCode')}
          onChange={onReferralCodeChange}
          value={referralCode}
          disable={isInputDisable}
          validate={{
            rule: /^\d{0,5}$/,
            text: localText('dialog.signUp.referralError'),
          }}
        />
        <div className={styles.sign_up_button} onClick={toSignUp}>
          {localText('dialog.signUp.title')}
        </div>
      </div>
    </>
  );
}
