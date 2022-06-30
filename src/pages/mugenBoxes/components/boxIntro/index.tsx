import { useState, useRef, useEffect } from 'react';
import { Progress } from 'antd';
import { useIntl, useModel } from 'umi';
import classNames from 'classnames';
import { EBoxIntroTabItems } from '../../types';
import '@google/model-viewer';
import type { ModelViewerElement } from '@google/model-viewer/lib/model-viewer';

import './index.less';
import useLocals from '@/hooks/useLocals';

type TModelViewer = ModelViewerElement & Element;

export default () => {
  const [tabActive, setTabActives] = useState<EBoxIntroTabItems>(
    EBoxIntroTabItems.Items,
  );
  const [progress, setProgress] = useState<number>(0);
  const [boxNtfItemActive, setBoxNtfItemActive] = useState<any>(null);
  const modelViewer = useRef<TModelViewer>(null);
  const { boxIpInfo, boxNftList } = useModel('useMugenBox');

  const { localText, language } = useLocals();

  const onProgress = (event: any) => {
    setProgress(() =>
      parseFloat((event.detail.totalProgress * 100).toFixed(1)),
    );
  };

  useEffect(() => {
    if (modelViewer.current) {
      modelViewer.current.resetTurntableRotation();
      modelViewer.current.addEventListener('progress', onProgress);
      return () => {
        modelViewer.current?.removeEventListener('progress', onProgress);
      };
    }
  }, [boxNtfItemActive]);

  useEffect(() => {
    if (boxNftList?.length) {
      setBoxNtfItemActive(boxNftList[0]);
    }
  }, [boxNftList]);

  return (
    <div className="box-intro-container">
      <div
        className="main-content"
        style={
          tabActive === EBoxIntroTabItems.Authorizor
            ? {
                width: '100%',
              }
            : {}
        }
      >
        <div className="tab-list">
          <div
            className={classNames('tab-item', {
              active: tabActive === EBoxIntroTabItems.Items,
            })}
            onClick={() => setTabActives(EBoxIntroTabItems.Items)}
          >
            {localText['box.intro.item']}
          </div>
          <div
            className={classNames('tab-item', {
              active: tabActive === EBoxIntroTabItems.Authorizor,
            })}
            onClick={() => setTabActives(EBoxIntroTabItems.Authorizor)}
          >
            {localText['box.intro.authorizor']}
          </div>
          <div
            className={classNames('tab-item', {
              active: tabActive === EBoxIntroTabItems.Information,
            })}
            onClick={() => setTabActives(EBoxIntroTabItems.Information)}
          >
            {localText['box.intro.info']}
          </div>
        </div>
        <div className="tab-content-container">
          {/* nft model preview */}
          <div
            className="box-items-warpper"
            style={{
              display: tabActive === EBoxIntroTabItems.Items ? 'block' : 'none',
            }}
          >
            <div className="box-items-container">
              {boxNftList.length && boxNtfItemActive?.product_model_url && (
                <div className="model-preview">
                  {/* @ts-ignore */}
                  <model-viewer
                    class="model"
                    ref={modelViewer}
                    src={boxNtfItemActive?.product_model_url}
                    // src={'/animation_url.glb'}
                    // camera-controls
                    auto-rotate
                    with-credentials
                    rotation-per-second="30deg"
                    camera-orbit="0deg 90deg 100%"
                    interaction-prompt-style="basic"
                  >
                    {progress < 100 && (
                      <div className="progress-bar" slot="progress-bar">
                        <Progress
                          strokeLinecap="square"
                          type="circle"
                          percent={progress}
                          strokeColor="#15131b"
                        />
                      </div>
                    )}
                    {/* @ts-ignore */}
                  </model-viewer>
                </div>
              )}
              <div className="box-item-list">
                {boxNftList.map((item: any, i: number) => {
                  return (
                    <div
                      className={classNames('box-item', {
                        active:
                          item?.product_id === boxNtfItemActive?.product_id,
                      })}
                      key={item?.product_id}
                      onClick={() => {
                        setBoxNtfItemActive(item);
                      }}
                    >
                      <div className="model-img">
                        <img className="" src={item?.product_image_url} />
                      </div>
                      <div>
                        <div className="series-info">
                          <div className="name">{item?.product_name}</div>
                          <div className="series">
                            {item?.product_ip_series_name}
                          </div>
                        </div>
                        <div className="other-info">
                          <div className="auther">
                            <img
                              className="photo"
                              src={item?.product_creater_image_url}
                            />
                            <div className="name">{item?.product_creater}</div>
                          </div>
                          <div className="num">
                            {localText['box.intro.copies']} {item?.circulation}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ntf metadata */}
          {tabActive === EBoxIntroTabItems.Information && (
            <div className="nft-metadata">
              <div className="th-container">
                <div className="th">
                  <div className="nft-name">
                    {localText['box.intro.nftName']}
                  </div>
                  <div className="series">{localText['box.intro.series']}</div>
                  <div className="rarity">{localText['box.intro.rarity']}</div>
                  <div className="amount">{localText['box.intro.amount']}</div>
                </div>
              </div>
              <div className="tr-container">
                {boxNftList.map((item: any, i: number) => {
                  return (
                    <div className="tr" key={i}>
                      <div className="nft-name">{item?.product_name}</div>
                      <div className="series">
                        {item?.product_ip_series_name}
                      </div>
                      <div className="rarity">{item?.product_rarity}</div>
                      <div className="amount">
                        {item?.product_config_number}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* box information */}
          {tabActive === EBoxIntroTabItems.Authorizor && (
            <div className="box-information">
              <img
                src={boxIpInfo?.[`ip_description_image_${language}_url`]}
                alt=""
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
