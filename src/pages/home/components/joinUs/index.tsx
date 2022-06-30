import React, { FC } from 'react';
import { useModel, useIntl } from 'umi';
import ITextConfig from '@/locales/types';

import JoinUsBtnImg from '../../assets/joinUsBtnImg.png';

import './index.less';
import useLocals from '@/hooks/useLocals';

interface IProps {}

export default (props: IProps) => {
  const { joinUsImg } = useModel('useStaticInfo');
  const { localText } = useLocals();

  return (
    <div
      className="join-us-warpper"
      style={{ backgroundImage: `url(${joinUsImg})` }}
    >
      <div className="title-warpper">
        <div className="title">{localText['home.join_us.title']}</div>
        <div className="subtitle">{localText['home.join_us.subtitle']}</div>
      </div>
      <div
        className="join-us-btn"
        onClick={() => window.open('https://discord.gg/68MjAjdF')}
      >
        <img src={JoinUsBtnImg} alt="" />
      </div>
    </div>
  );
};
