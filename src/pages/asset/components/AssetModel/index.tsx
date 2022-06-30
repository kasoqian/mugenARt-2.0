import React, { useCallback, useEffect, useRef, useState } from 'react';
import '@google/model-viewer';
import type { ModelViewerElement } from '@google/model-viewer/lib/model-viewer';

// @ts-ignore
import styles from './index.less';
import classNames from 'classnames';
import type { IAssetDetail } from '@/pages/asset/detail';
import DownloadApp from '@/components/DownloadApp';
import { Popover } from 'antd';

type TModelViewer = ModelViewerElement & Element;

export default function AssetModel({
  assetDetail,
}: {
  assetDetail: IAssetDetail | null;
}) {
  const [progress, setProgress] = useState<string>('0%');
  const [controlHide, setControlHide] = useState<boolean>(false);

  const modelViewer = useRef<TModelViewer>(null);

  const onProgress = (event: any) => {
    setProgress(() => `${event.detail.totalProgress * 100}%`);
  };

  const stopAnimate = useCallback(() => {
    if (modelViewer.current) {
      modelViewer.current.setAttribute('auto-rotate-delay', '99999999999');
    }
  }, [modelViewer]);

  const startAnimate = useCallback(() => {
    if (modelViewer.current) {
      modelViewer.current.resetTurntableRotation();
      modelViewer.current.cameraOrbit = '20deg 80deg 100%';
      modelViewer.current.setAttribute('auto-rotate-delay', '1000');
    }
  }, [modelViewer]);

  const init = useCallback(() => {
    if (modelViewer.current) {
      modelViewer.current.resetTurntableRotation();
      modelViewer.current.cameraOrbit = '20deg 80deg 100%';
      stopAnimate();
    }
  }, [modelViewer]);

  useEffect(() => {
    init();
  }, [assetDetail]);

  useEffect(() => {
    if (modelViewer.current) {
      modelViewer.current.addEventListener('touchstart', stopAnimate);
      modelViewer.current.addEventListener('mousedown', stopAnimate);
      modelViewer.current.addEventListener('progress', onProgress);
    }
    return () => {
      if (modelViewer.current) {
        modelViewer.current.removeEventListener('touchstart', stopAnimate);
        modelViewer.current.removeEventListener('mousedown', stopAnimate);
        modelViewer.current.removeEventListener('progress', onProgress);
      }
    };
  }, [modelViewer]);

  const showAndHide = () => {
    setControlHide(() => !controlHide);
  };

  return (
    <div className={styles.asset}>
      {/*// @ts-ignore */}
      <model-viewer
        class={styles.model}
        ref={modelViewer}
        src={assetDetail?.assert_model_url}
        // src={'/animation_url.glb'}
        camera-controls
        auto-rotate
        rotation-per-second="30deg"
        camera-orbit="0deg 0deg 100%"
        interaction-prompt-style="basic"
        onProgress={onProgress}
      >
        <div className={styles.poster} slot="poster">
          <img
            className={styles['pre-prompt']}
            src={assetDetail?.assert_image_url}
          />
        </div>
        {progress !== '100%' ? (
          <div className={styles['progress-bar']} slot="progress-bar">
            <div className={styles['update-bar']} style={{ width: progress }} />
          </div>
        ) : null}
        <button slot="ar-button" className={styles['ar-button']}>
          View in your space
        </button>
        {/*// @ts-ignore */}
      </model-viewer>
      <div
        className={classNames([styles.control, { [styles.hide]: controlHide }])}
      >
        <div
          className={classNames([styles.arrow, { [styles.hide]: controlHide }])}
          onClick={showAndHide}
        />
        <div className={styles.rotate} onClick={startAnimate} />
        <Popover
          content={DownloadApp}
          trigger="click"
          placement="bottom"
          color="#e6f0f7"
        >
          <div className={styles.download} id="detail_download" />
        </Popover>
      </div>
    </div>
  );
}
