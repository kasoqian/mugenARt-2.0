import { FC } from 'react';

import './index.less';
import classNames from 'classnames';
import Level1Bg from './assets/level-1.png';
import { EBoxLevel } from '../../types';

interface ICard {
  level: string;
  bg: number;
  title: string;
  subTitle: string;
  img: string;
  edition: string;
  address: string;
}

const Card: FC<ICard> = ({
  level = 1,
  bg = Level1Bg,
  title,
  subTitle,
  img,
  edition,
  address,
}) => {
  return (
    <div
      className={classNames(['result-card'])}
      style={{ backgroundImage: `url(${bg})` }}
    >
      <img src={img} alt="" />
      <div className="card-right">
        <div
          className={classNames([
            'title',
            {
              'level-1': level === EBoxLevel.N,
              'level-2': level === EBoxLevel.R,
              'level-3': level === EBoxLevel.UR,
              'level-4': level === EBoxLevel.SR,
              'level-5': level === EBoxLevel.SSR,
            },
          ])}
        >
          {title}
        </div>
        <div className="sub-title">{subTitle}</div>
        <div className="content-bottom">
          <div className="edition">Edition: {edition}</div>
          <div className="address">{address}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
