import { Fragment, useImperativeHandle, forwardRef, useEffect } from 'react';
// @ts-ignore
import { Unity, useUnityContext } from 'react-unity-webgl';

import './index.less';

interface IProps {
  onPlayRemoteVideoListAfter?: () => void;
}

const OpenBoxesAnimation = (props: IProps, ref: any) => {
  const {
    unityProvider,
    isLoaded,
    loadingProgression,
    addEventListener,
    removeEventListener,
    sendMessage,
  } = useUnityContext({
    productName: 'mugen',
    companyName: 'mugen',
    loaderUrl: 'unityBuild/openBoxes/Export.loader.js',
    dataUrl: 'unityBuild/openBoxes/Export.data',
    frameworkUrl: 'unityBuild/openBoxes/Export.framework.js',
    codeUrl: 'unityBuild/openBoxes/Export.wasm',
    streamingAssetsUrl: 'unityBuild/openBoxes/StreamingAssets',
    webglContextAttributes: {
      preserveDrawingBuffer: true,
    },
  });

  const playRemoteVideoLoop = (videoUrl: string) => {
    sendMessage('Canvas/Video', 'PlayLoop', videoUrl);
  };

  const handlePlayRemoteVideoList = (videoUrlList: string[]) => {
    sendMessage('Canvas/Video', 'WarmupAndPlayList', videoUrlList.join(';'));
  };

  useImperativeHandle(ref, () => ({
    playRemoteVideoLoop,
    handlePlayRemoteVideoList,
    isLoaded,
    addEventListener,
    removeEventListener,
    sendMessage,
  }));

  useEffect(() => {
    if (isLoaded) {
      sendMessage('Canvas/Video', 'InitUnity');
    }
  }, [isLoaded]);

  return (
    <Fragment>
      <div className="wrapper">
        {isLoaded === false && (
          <div className="loading-overlay">
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: loadingProgression * 100 + '%' }}
              />
            </div>
          </div>
        )}
        <div className="unity-container">
          <Unity className="unity-canvas" unityProvider={unityProvider} />
        </div>
      </div>
    </Fragment>
  );
};

export default forwardRef(OpenBoxesAnimation);
