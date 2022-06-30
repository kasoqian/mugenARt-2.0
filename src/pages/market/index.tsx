// @ts-ignore
import styles from './index.less';
import { useEffect } from 'react';

export default function IndexPage() {
  const clickMeToTwitter = () => {};

  const clickMeToGoogle = () => {};
  return (
    <div>
      <h1 className={styles.title}>Market Page</h1>
      <button onClick={clickMeToTwitter}>twitter oauth</button>
      <button onClick={clickMeToGoogle}>google oauth</button>
    </div>
  );
}
