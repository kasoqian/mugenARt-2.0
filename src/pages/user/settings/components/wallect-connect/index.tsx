import CloseButton from '@/components/Close';
import useLocals from '@/hooks/useLocals';
import { useState } from 'react';
// @ts-ignore
import styles from './index.less';

export default ({
  title,
  onWalletConnect,
  onWalletGenerate,
  close,
}: {
  title: string;
  onWalletConnect: (close: () => void) => void;
  onWalletGenerate: (setIsLoading: Function, close: () => void) => void;
  close: () => void;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const localText = useLocals(true);

  const stopPropagation = (e: any) => {
    e.stopPropagation();
  };

  return (
    <>
      <CloseButton></CloseButton>
      <div className={styles.contaienr} onClick={stopPropagation}>
        <div className={styles.title}>{title}</div>
        <div className={styles.divider} />
        {!isLoading ? (
          <div>
            <div
              className={styles.btn_first}
              onClick={() => onWalletConnect(close)}
            >
              {localText('dialog.hashPalette.connect')}
            </div>
            <div
              className={styles.btn_last}
              onClick={() => onWalletGenerate(setIsLoading, close)}
            >
              {localText('dialog.hashPalette.generate')}
            </div>
          </div>
        ) : (
          <div className={styles.loading}>
            <div className={styles.loading_icon} />
            <div className={styles.text}>
              <div className={styles.text_up}>
                {localText('dialog.hashPalette.wait')}
              </div>
              {/* <div className={styles.text_down}>please wait</div> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
