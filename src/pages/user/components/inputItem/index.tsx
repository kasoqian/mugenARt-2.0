import './index.less';
import classNames from 'classnames';

interface InputItemInterface {
  label?: string;
  buttonLabel?: string;
  onClick?: () => void;
  placeholder?: string;
  value?: string;
  className?: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
}

export default ({
  label,
  placeholder,
  value,
  onClick,
  buttonLabel,
  className,
  onChange,
  disabled,
}: InputItemInterface) => {
  const valChange = (e: any) => {
    onChange?.(e.target.value);
  };
  return (
    <div className={classNames([className, 'input_item'])}>
      <div className="label">{label} </div>
      <div className="item_input">
        <input
          type="text"
          placeholder={placeholder}
          value={value || ''}
          onChange={valChange}
          disabled={disabled}
        />
        <button onClick={onClick}>{buttonLabel}</button>
      </div>
    </div>
  );
};
