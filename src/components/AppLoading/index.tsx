import { useEffect, useState } from 'react';

import styles from './index.less';

interface AppLoadingProps {
  isLoadedState: boolean;
}

function AppLoading({ isLoadedState }: AppLoadingProps) {
  const [loadingPoint, setLoadingPoint] = useState('');
  const [percent, setPercent] = useState(0);

  /* 省略号 */
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingPoint((text) =>
        text.length > 5 ? (text = '') : (text += '.'),
      );
    }, 400);
    return () => clearInterval(timer);
  }, []);

  /* 百分比 */
  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((percent) =>
        percent > 90 ? percent : (percent += Math.random() * 5),
      );
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`${styles.container} ${
        isLoadedState ? styles.container_active : null
      }`}
    >
      <div
        className={`${styles.top} ${isLoadedState ? styles.top_active : null}`}
      ></div>
      <div className={styles.loading}>
        <span className={styles.loading_text}>Loading {loadingPoint}</span>
        <div className={styles.progress}>
          <div
            className={styles.percent}
            style={{
              width: `${isLoadedState ? 100 : percent}%`,
            }}
          ></div>
        </div>
      </div>
      <div
        className={`${styles.footer} ${
          isLoadedState ? styles.footer_active : null
        }`}
      ></div>
    </div>
  );
}

export default AppLoading;
