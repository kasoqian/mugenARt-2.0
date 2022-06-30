import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { Popover } from 'antd';
import { Link } from 'umi';
import DownloadApp from '@/components/DownloadApp';

import useLocals from '@/hooks/useLocals';

import { EIntroBtnType } from '../../types';

import NtfImgBtn from '../../assets/3DNtfBtnImg.png';
import NtfImgBtn1 from '../../assets/3DNtfBtnImg1.png';
import ARFunctionBtnImg from '../../assets/ARFunctionBtnImg.png';
import ARFunctionBtnImg1 from '../../assets/ARFunctionBtnImg1.png';
import MugenBoxBtnImg from '../../assets/MugenBoxBtnImg.png';
import MugenBoxBtnImg1 from '../../assets/MugenBoxBtnImg1.png';
import MugenSpaceBtnImg from '../../assets/MugenSpaceBtnImg.png';
import MugenSpaceBtnImg1 from '../../assets/MugenSpaceBtnImg1.png';

import './index.less';

interface IProps {}

export default (props: IProps) => {
  const [key, setKey] = useState<EIntroBtnType>(EIntroBtnType.NFT);
  const { localText, language } = useLocals();

  const isNftActive = key === EIntroBtnType.NFT;
  const isARFunctionActive = key === EIntroBtnType.ARFUNCTION;
  const isMugenBoxActive = key === EIntroBtnType.MUGENBOX;
  const isMugenSpaceActive = key === EIntroBtnType.MUGENSPACE;

  return (
    <div className="intro-warpper">
      <div className="intro">
        <div className="img-list">
          {isNftActive && (
            <div className="common ntf">
              <img src={localText['home.about.intro.NtfImg']} alt="" />
            </div>
          )}
          {isARFunctionActive && (
            <div className="common ar-function" id="ar-function">
              <img src={localText['home.about.intro.ARFunctionImg']} alt="" />
              <Popover
                content={DownloadApp as any}
                trigger="click"
                getPopupContainer={() =>
                  document.querySelector('#ar-function') as HTMLElement
                }
                color="#e6f0f7"
              >
                <div className="download-app-btn">
                  {localText['home.partners.downloadAPP']}
                </div>
              </Popover>
            </div>
          )}
          {isMugenBoxActive && (
            <div className="common mugen-box">
              <img src={localText['home.about.intro.MugenBoxImg']} alt="" />
              <Link to="/mugenBoxes">
                <div className="buy">{localText['box.buy.buyNow']}</div>
              </Link>
            </div>
          )}
          {isMugenSpaceActive && (
            <div className="common mugen-space">
              <img src={localText['home.about.intro.MugenSpaceImg']} alt="" />
            </div>
          )}
        </div>
        <div className="btn-list">
          <div
            className={classNames('ntf-btn', 'common', { active: isNftActive })}
            style={{
              backgroundImage: `url(${isNftActive ? NtfImgBtn : NtfImgBtn1})`,
            }}
            onClick={() => setKey(EIntroBtnType.NFT)}
          ></div>
          <div
            className={classNames('ar-function-btn', 'common', {
              active: isARFunctionActive,
            })}
            style={{
              backgroundImage: `url(${
                isARFunctionActive ? ARFunctionBtnImg : ARFunctionBtnImg1
              })`,
            }}
            onClick={() => setKey(EIntroBtnType.ARFUNCTION)}
          ></div>
          <div
            className={classNames('mugen-box-btn', 'common', {
              active: isMugenBoxActive,
            })}
            style={{
              backgroundImage: `url(${
                isMugenBoxActive ? MugenBoxBtnImg : MugenBoxBtnImg1
              })`,
            }}
            onClick={() => setKey(EIntroBtnType.MUGENBOX)}
          ></div>
          <div
            className={classNames('mugen-space-btn', 'common', {
              active: isMugenSpaceActive,
            })}
            style={{
              backgroundImage: `url(${
                isMugenSpaceActive ? MugenSpaceBtnImg : MugenSpaceBtnImg1
              })`,
            }}
            onClick={() => setKey(EIntroBtnType.MUGENSPACE)}
          ></div>
        </div>
      </div>
    </div>
  );
};
