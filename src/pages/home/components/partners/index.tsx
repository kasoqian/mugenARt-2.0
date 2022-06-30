import React, { FC } from 'react';
import { Popover } from 'antd';
import DownloadApp from '@/components/DownloadApp';

import { useIntl } from 'umi';
import useLocals from '@/hooks/useLocals';

import PartnersImg from '../../assets/partners.png';

import './index.less';

interface IProps {}

export default (props: IProps) => {
  const { localText } = useLocals();

  return (
    <div className="partners-warpper">
      <div className="partners-container">
        <div className="partners">
          <img src={PartnersImg} alt="partners" />
        </div>
        <div className="nfts-desc" id="partners-nfts-desc">
          <img src={localText['home.partners.descImg']} alt="nfts desc" />
          {/*           <Popover
            content={DownloadApp}
            trigger="click"
            getPopupContainer={() =>
              document.querySelector('#partners-nfts-desc') as HTMLElement
            }
            color="#e6f0f7"
          >
            <div className="downlord-app-btn">
              {localText['home.partners.downloadAPP']}
            </div>
          </Popover> */}
        </div>
      </div>
    </div>
  );
};
