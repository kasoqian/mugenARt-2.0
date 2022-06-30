import CloseButton from '@/components/Close';
import useLocals from '@/hooks/useLocals';
import styles from './index.less';

interface ShowAwardProps {
  imgSrc: string;
}

export default ({ imgSrc }: ShowAwardProps) => {
  const localText = useLocals(true);

  return (
    <>
      <CloseButton position={{ y: 80, x: -8 }}></CloseButton>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.title}>
            {localText('events.activities.congratulation')}
          </div>
          <div className={styles.rewardImg}>
            <img src={imgSrc} />
          </div>
        </div>
      </div>
    </>
  );
};
