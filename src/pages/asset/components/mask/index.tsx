import styles from './index.less';

function Mask() {
  return (
    <div className={styles.mask}>
      <img
        className={styles.loading_img}
        src={require('./assets/loading.png')}
        alt="loading"
      />
      <div className={styles.title}>Blockchain Processing...</div>
    </div>
  );
}

export default Mask;
