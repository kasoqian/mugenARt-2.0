import styles from './index.less';
import { useState, useRef, useEffect } from 'react';
import '@google/model-viewer';
import type { ModelViewerElement } from '@google/model-viewer/lib/model-viewer';
type TModelViewer = ModelViewerElement & Element;
import { Progress } from 'antd';
import { getUserActivityProcessInfo } from '@/api/event';

function DisplayModel({ className, refreshRemain }: any) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState<number>(0);
  const [dataSource, setDataSource] = useState([]);

  const modelViewer = useRef<TModelViewer>(null);

  useEffect(() => {
    return () => {
      setActiveIndex(0);
      setProgress(0);
      setDataSource([]);
    };
  }, []);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const onProgress = (event: any) => {
    setProgress(() =>
      parseFloat((event.detail.totalProgress * 100).toFixed(1)),
    );
  };
  useEffect(() => {
    fetchUserState();
  }, [refreshRemain]);

  useEffect(() => {
    if (modelViewer.current) {
      modelViewer.current.addEventListener('progress', onProgress);
      return () => {
        modelViewer.current?.removeEventListener('progress', onProgress);
      };
    }
  }, []);

  const fetchUserState = async () => {
    const res = await getUserActivityProcessInfo();
    setDataSource(res.activity_products_with_user_own_info);
  };

  return (
    <div className={className}>
      <div className={styles.model}>
        {/* @ts-ignore */}
        <model-viewer
          style={{
            width: '100%',
            height: '100%',
          }}
          ref={modelViewer}
          src={
            dataSource.length > 0
              ? dataSource[activeIndex]['product_model_url']
              : null
          }
          // camera-controls
          auto-rotate
          with-credentials
          rotation-per-second="20deg"
          camera-orbit="0deg 80deg 100%"
          interaction-prompt-style="basic"
        >
          {progress < 100 && (
            <div className={styles.progress_bar} slot="progress-bar">
              <Progress
                strokeLinecap="square"
                type="circle"
                trailColor="rgba(255,255,255,0.4)"
                percent={progress}
                strokeColor="rgba(255,255,255,0.7)"
              />
            </div>
          )}
          {/* @ts-ignore */}
        </model-viewer>
      </div>
      <div className={styles.footer}>
        {dataSource.length > 0
          ? dataSource.map((nftItem: any, index: number) => {
              return (
                <div
                  key={index}
                  className={`${styles.cards} ${
                    activeIndex === index ? styles.card_active : null
                  }`}
                >
                  <div className={styles.title}>{nftItem.product_name}</div>
                  <img
                    src={nftItem.product_image_url}
                    onClick={() => handleClick(index)}
                    alt=""
                  />
                  {/*          <div className={styles.content}>
                    <span className={styles.remain}>
                      {nftItem.product_remain}
                    </span>
                    <span className={styles.total}>/{nftItem.circulation}</span>
                  </div> */}
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}

export default DisplayModel;
