import React, { useEffect, useState } from 'react';
// @ts-ignore
import styles from './index.less';
import classNames from 'classnames';

interface IInput {
  type?: string;
  placeholder: string;
  className?: string;
  containerClassName?: string;
  value?: string;
  onChange: (val: string) => void;
  validate?: {
    rule?: RegExp;
    text: string;
    validator?: boolean;
  };
  disable?: boolean;
}

export default function Input({
  type,
  placeholder,
  className,
  containerClassName,
  onChange,
  value,
  validate,
  disable,
}: IInput) {
  const [warning, setWarning] = useState<string>('');
  const onChangeVal = (event: any) => {
    onChange(event.target.value);

    if (warning && validate) {
      const { rule, validator } = validate;
      if (rule && rule.test(event.target.value)) {
        setWarning(() => '');
      }
      if (typeof validator !== 'undefined' && !validator) {
        setWarning(() => '');
      }
    }
  };

  const toValidate = (event: any) => {
    if (validate) {
      const { rule, text, validator } = validate;
      if (rule && !rule.test(event.target.value)) {
        setWarning(() => text);
      } else if (typeof validator !== 'undefined' && !validator) {
        setWarning(() => text);
      } else {
        setWarning(() => '');
      }
    }
  };

  return (
    <div className={classNames([containerClassName, styles.input_container])}>
      <input
        type={type || 'text'}
        placeholder={placeholder}
        value={value}
        className={classNames([className, styles.input])}
        onChange={onChangeVal}
        onBlur={toValidate}
        disabled={disable}
        autoComplete="off"
      />
      {warning ? <div className={styles.warning}>{warning}</div> : null}
    </div>
  );
}
