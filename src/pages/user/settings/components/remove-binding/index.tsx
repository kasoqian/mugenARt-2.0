// @ts-ignore
import styles from './index.less';
import VerifyInput from '@/components/VerifyInput';
import { useState } from 'react';
import { sendRegisterCode } from '@/api/login';
import { message } from 'antd';
import useLocals from '@/hooks/useLocals';
import CloseButton from '@/components/Close';

export default ({
  emailAddr,
  toUnbind,
  close,
}: {
  emailAddr: string;
  toUnbind: (code: string) => Promise<void>;
  close: () => void;
}) => {
  const [verifyCode, setVerifyCode] = useState<string>('');

  const localText = useLocals(true);

  const stopPropagation = (e: any) => {
    e.stopPropagation();
  };

  const onVerifyCodeChange = (val: string) => {
    setVerifyCode(() => val);
  };

  const sendCode = async () => {
    await sendRegisterCode(emailAddr);
  };

  const toRemove = async () => {
    try {
      await toUnbind(verifyCode);
      close();
    } catch (e) {
      message.error(localText('message.remove.error'));
    }
  };

  return (
    <>
      <CloseButton></CloseButton>
      <div className={styles.container} onClick={stopPropagation}>
        <div className={styles.title}>
          {localText('dialog.hashPalette.removeTitle')}
        </div>
        <div className={styles.divider} />
        <VerifyInput
          label={localText('dialog.hashPalette.verificationInfo')}
          onChange={onVerifyCodeChange}
          onVerify={sendCode}
          value={verifyCode}
          className={styles.verify}
        />
        <div className={styles.btn} onClick={toRemove}>
          {localText('dialog.hashPalette.confirm')}
        </div>
      </div>
    </>
  );
};
