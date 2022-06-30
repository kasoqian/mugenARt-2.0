import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { ERoadMapTime } from '../../types';

import './index.less';
import useLocals from '@/hooks/useLocals';

interface IProps {}

export default (props: IProps) => {
  const [key, setKey] = useState<String>('');
  const { localText } = useLocals();

  const isNOV2021 = key === ERoadMapTime.NOV2021;
  const isDEC2021 = key === ERoadMapTime.DEC2021;
  const isQ12022 = key === ERoadMapTime.Q12022;
  const isQ22022 = key === ERoadMapTime.Q22022;
  const isQ32022 = key === ERoadMapTime.Q32022;
  const isQ42022 = key === ERoadMapTime.Q42022;

  return (
    <div className="road-map-warpper">
      <div className="road-map">
        <div className={classNames('list')}>
          <div
            className={classNames('item', { mask: key })}
            onMouseEnter={() => setKey(ERoadMapTime.NOV2021)}
            onMouseLeave={() => setKey('')}
          >
            <div className="NOV-2021">
              <img src={require(`../../assets/2021-11.png`)} alt="" />
              <div className="title">
                {localText['home.about.roadmap.nov2021']}
              </div>
              <div
                className={classNames('pop', { anim: isNOV2021 })}
                style={{ visibility: isNOV2021 ? 'visible' : 'hidden' }}
              >
                <div className="character">
                  <img
                    src={require('../../assets/2021-11-pop-character.png')}
                    alt=""
                  />
                </div>
                <div className="intro">
                  <div className="time">
                    {localText['home.about.roadmap.nov2021']}
                  </div>
                  <ul className="text">
                    <li>{localText['home.about.roadmap.nov_2021.1']}</li>
                    <li>{localText['home.about.roadmap.nov_2021.2']}</li>
                    <li>{localText['home.about.roadmap.nov_2021.3']}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div
            className={classNames('item', { mask: key })}
            onMouseEnter={() => setKey(ERoadMapTime.DEC2021)}
            onMouseLeave={() => setKey('')}
          >
            <div className="DEC-2021">
              <img src={require(`../../assets/2021-12.png`)} alt="" />
              <div className="title">
                {localText['home.about.roadmap.dec2021']}
              </div>
              <div
                className={classNames('pop', { anim: isDEC2021 })}
                style={{ visibility: isDEC2021 ? 'visible' : 'hidden' }}
              >
                <div className="character">
                  <img
                    src={require('../../assets/2021-12-pop-character.png')}
                    alt=""
                  />
                </div>
                <div className="intro">
                  <div className="time">
                    {localText['home.about.roadmap.dec2021']}
                  </div>
                  <ul className="text">
                    <li>{localText['home.about.roadmap.dec_2021.1']}</li>
                    <li>{localText['home.about.roadmap.dec_2021.2']}</li>
                    <li>{localText['home.about.roadmap.dec_2021.3']}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div
            className={classNames('item', { mask: key })}
            onMouseEnter={() => setKey(ERoadMapTime.Q12022)}
            onMouseLeave={() => setKey('')}
          >
            <div className="Q1-2022">
              <img src={require(`../../assets/2022-Q1.png`)} alt="" />
              <div className="title">
                {localText['home.about.roadmap.q1-2022']}
              </div>
              <div
                className={classNames('pop', { anim: isQ12022 })}
                style={{ visibility: isQ12022 ? 'visible' : 'hidden' }}
              >
                <div className="character">
                  <img
                    src={require('../../assets/2022-Q1-pop-character.png')}
                    alt=""
                  />
                </div>
                <div className="intro">
                  <div className="time">
                    {localText['home.about.roadmap.q1-2022']}
                  </div>
                  <ul className="text">
                    <li>{localText['home.about.roadmap.q1_2022.1']}</li>
                    <li>{localText['home.about.roadmap.q1_2022.2']}</li>
                    <li>{localText['home.about.roadmap.q1_2022.3']}</li>
                    <li>{localText['home.about.roadmap.q1_2022.4']}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div
            className={classNames('item', { mask: key })}
            onMouseEnter={() => setKey(ERoadMapTime.Q22022)}
            onMouseLeave={() => setKey('')}
          >
            <div className="Q2-2022">
              <img src={require(`../../assets/2022-Q2.png`)} alt="" />
              <div className="title">
                {localText['home.about.roadmap.q2-2022']}
              </div>
              <div
                className={classNames('pop', { anim: isQ22022 })}
                style={{ visibility: isQ22022 ? 'visible' : 'hidden' }}
              >
                <div className="intro">
                  <div className="time">
                    {localText['home.about.roadmap.q2-2022']}
                  </div>
                  <ul className="text">
                    <li>{localText['home.about.roadmap.q2_2022.1']}</li>
                    <li>{localText['home.about.roadmap.q2_2022.2']}</li>
                    <li>{localText['home.about.roadmap.q2_2022.3']}</li>
                  </ul>
                </div>
                <div className="character">
                  <img
                    src={require('../../assets/2022-Q2-pop-character.png')}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className={classNames('item', { mask: key })}
            onMouseEnter={() => setKey(ERoadMapTime.Q32022)}
            onMouseLeave={() => setKey('')}
          >
            <div className="Q3-2022">
              <img src={require(`../../assets/2022-Q3.png`)} alt="" />
              <div className="title">
                {localText['home.about.roadmap.q3-2022']}
              </div>
              <div
                className={classNames('pop', { anim: isQ32022 })}
                style={{ visibility: isQ32022 ? 'visible' : 'hidden' }}
              >
                <div className="intro">
                  <div className="time">
                    {localText['home.about.roadmap.q3-2022']}
                  </div>
                  <ul className="text">
                    <li>{localText['home.about.roadmap.q3_2022.1']}</li>
                    <li>{localText['home.about.roadmap.q3_2022.2']}</li>
                    <li>{localText['home.about.roadmap.q3_2022.3']}</li>
                  </ul>
                </div>
                <div className="character">
                  <img
                    src={require('../../assets/2022-Q3-pop-character.png')}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className={classNames('item', { mask: key })}
            onMouseEnter={() => setKey(ERoadMapTime.Q42022)}
            onMouseLeave={() => setKey('')}
          >
            <div className="Q4-2022">
              <img src={require(`../../assets/2022-Q4.png`)} alt="" />
              <div className="title">
                {localText['home.about.roadmap.q4-2022']}
              </div>
              <div
                className={classNames('pop', { anim: isQ42022 })}
                style={{ visibility: isQ42022 ? 'visible' : 'hidden' }}
              >
                <div className="intro">
                  <div className="time">
                    {localText['home.about.roadmap.q4-2022']}
                  </div>
                  <ul className="text">
                    <li>{localText['home.about.roadmap.q4_2022.1']}</li>
                    <li>{localText['home.about.roadmap.q4_2022.2']}</li>
                    <li>{localText['home.about.roadmap.q4_2022.3']}</li>
                  </ul>
                </div>
                <div className="character">
                  <img
                    src={require('../../assets/2022-Q4-pop-character.png')}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
