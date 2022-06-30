// @ts-ignore
import styles from './index.less';
import Input from '@/components/Input';
import VerifyInput from '@/components/VerifyInput';
import { useState } from 'react';
import { sendRegisterCode } from '@/api/login';
import { replaceEmail } from '@/api/user';
import { message } from 'antd';
import useLocals from '@/hooks/useLocals';
import CloseButton from '@/components/Close';

export default function ReplaceEmail({
  emailAddr,
  close,
}: {
  emailAddr: string;
  close: () => void;
}) {
  const [oldVerifyCode, setOldVerifyCode] = useState<string>('');
  const [newEmailAddr, setNewEmailAddr] = useState<string>('');
  const [newVerifyCode, setNewVerifyCode] = useState<string>('');

  const localText = useLocals(true);

  const stopPropagation = (e: any) => {
    e.stopPropagation();
  };

  const onVerifyOldCodeChange = (val: string) => {
    setOldVerifyCode(() => val);
  };

  const onEmailAddressChange = (val: string) => {
    setNewEmailAddr(() => val);
  };

  const onVerifyNewCodeChange = (val: string) => {
    setNewVerifyCode(() => val);
  };

  const sendVerifyCode = async () => {
    await sendRegisterCode(emailAddr);
  };

  const sendNewVerifyCode = async () => {
    await sendRegisterCode(newEmailAddr);
  };

  const toReplaceEmail = async () => {
    try {
      const result = await replaceEmail({
        oldRegisterCode: oldVerifyCode,
        emailAddr: newEmailAddr,
        registerCode: newVerifyCode,
      });
      if (result && +result?.code === 0) {
        message.success(localText('message.bind.success'));
        close();
      } else {
        message.error(result?.message || localText('message.bind.success'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <CloseButton></CloseButton>
      <div className={styles.replace_email} onClick={stopPropagation}>
        <VerifyInput
          label={localText('dialog.bindEmail.verificationInfo')}
          buttonLabel={localText('dialog.bindEmail.verificationSendButton')}
          onChange={onVerifyOldCodeChange}
          value={oldVerifyCode}
          onVerify={sendVerifyCode}
        />
        <Input
          className={styles.password}
          placeholder={localText('dialog.bindEmail.newEmil')}
          onChange={onEmailAddressChange}
          value={newEmailAddr}
          validate={{
            rule: /^([a-zA-Z]|[0-9])(.*)@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
            text: localText('dialog.bindEmail.verificationInfo'),
          }}
        />
        <VerifyInput
          label={localText('dialog.bindEmail.verificationInfo')}
          buttonLabel={localText('dialog.bindEmail.verificationSendButton')}
          onChange={onVerifyNewCodeChange}
          value={newVerifyCode}
          onVerify={sendNewVerifyCode}
        />
        <div className={styles.sign_up_button} onClick={toReplaceEmail}>
          {localText('dialog.bindEmail.confirm')}
        </div>
      </div>
    </>
  );
}
