import React, { FC } from 'react';

import DownloadAppQRcode from '@/assets/images/downloadAppQRcode.png';

import './index.less';

interface IProps {}

export default (props: IProps) => {
  return (
    <div className="download-app-panel">
      <div className="left">
        <img src={DownloadAppQRcode} alt="" />
      </div>
      <div className="right">Scan QR code to download the app for iOS</div>
    </div>
  );
};
