import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import styles from './index.less';
import classNames from 'classnames';
import CInput from '@/components/Input';

interface IVerifyInput {
  buttonLabel?: string;
  label?: string;
  className?: string;
  onChange: (val: string) => void;
  onVerify: () => Promise<void>;
  value?: string;
}

export default function VerifyInput({
  label,
  buttonLabel,
  className,
  onChange,
  onVerify,
  value,
}: IVerifyInput) {
  const [canSetCode, setCanSetCode] = useState<boolean>(true);
  const [count, setCount] = useState<number>(60);

  const timer = useRef<any>(null);

  const onVerifyCodeChange = (value: string) => {
    onChange(value);
  };

  const sendCode = () => {
    if (!canSetCode) {
      return;
    }
    setCanSetCode(() => false);
    onVerify();
  };

  useEffect(() => {
    if (!canSetCode) {
      timer.current = setInterval(() => {
        setCount((oldCount) => oldCount - 1);
      }, 1000);
    }
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
  }, [canSetCode]);

  const canSentButtonLabel = () => {
    if (canSetCode) {
      if (buttonLabel) {
        return buttonLabel;
      }
      return 'Send';
    }
    return `${count}s`;
  };

  useEffect(() => {
    if (count < 0 && timer.current) {
      clearInterval(timer.current);
      timer.current = null;
      setCanSetCode(() => true);
      setCount(() => 60);
    }
  }, [count]);

  return (
    <div className={classNames([className, styles.verify_code])}>
      <CInput
        className={styles.verify_code_input}
        placeholder={!!label ? label : 'Please enter the verification code'}
        onChange={onVerifyCodeChange}
        value={value}
      />
      <button
        className={classNames({
          [styles.cannot_set_code]: !canSetCode,
        })}
        onClick={sendCode}
      >
        {canSentButtonLabel()}
      </button>
    </div>
  );
}
