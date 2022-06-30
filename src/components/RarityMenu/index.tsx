import styles from './index.less';

interface Props {
  activeRarityName: string;
  setActiveRarityName: any;
}

export default ({ activeRarityName = 'ssr', setActiveRarityName }: Props) => {
  const activeNode = (e: any) => {
    const type = e.target.className?.split(' ')[1]?.split('_')[0];
    setActiveRarityName(type);
  };

  return (
    <div className={styles.container} onClick={activeNode}>
      {/*       <div
        className={`${styles.icon} ${styles.ur} ${
          activeRarityName === 'ur' ? styles.ur_active : styles.ur_default
        }`}
      ></div> */}
      <div
        className={`${styles.icon} ${styles.ssr} ${
          activeRarityName === 'ssr' ? styles.ssr_active : styles.ssr_default
        }`}
      ></div>
      <div
        className={`${styles.icon} ${styles.sr} ${
          activeRarityName === 'sr' ? styles.sr_active : styles.sr_default
        }`}
      ></div>
      <div
        className={`${styles.icon} ${styles.r} ${
          activeRarityName === 'r' ? styles.r_active : styles.r_default
        }`}
      ></div>
      <div
        className={`${styles.icon} ${styles.n} ${
          activeRarityName === 'n' ? styles.n_active : styles.n_default
        }`}
      ></div>
    </div>
  );
};
