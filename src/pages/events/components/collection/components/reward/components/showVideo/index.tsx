import { useEffect, useRef } from 'react';
import styles from './index.less';

interface showVideoProps {
  setSteps: React.Dispatch<React.SetStateAction<number>>;
  videoSrc: string;
}

export default ({ setSteps, videoSrc }: showVideoProps) => {
  const video = useRef<HTMLVideoElement | any>();

  useEffect(() => {
    if (!videoSrc) goSteps();
    video.current?.addEventListener('ended', goSteps);
    return () => {
      video.current?.removeEventListener('ended', goSteps);
    };
  }, []);

  const goSteps = () => {
    setSteps((step: number) => step + 1);
  };

  return (
    <div className={styles.award}>
      <div className={styles.video}>
        <video ref={video} src={videoSrc} autoPlay></video>
      </div>
    </div>
  );
};
