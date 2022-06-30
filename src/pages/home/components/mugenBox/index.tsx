import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { useModel, Link } from 'umi';
import useLocals from '@/hooks/useLocals';
import useCountDown from '@/hooks/useCountDown';

import BoxComingSoonImg from '../../assets/boxComingSoon.png';

import { EBlindBoxStatus, EBoxType } from '../../../mugenBoxes/types';

import './index.less';

interface IProps {}

export default (props: IProps) => {
  const { sellingBoxData, getSellingBoxData } = useModel('useMugenBox');
  const { language, localText } = useLocals();
  const { beginCountDown, clearCountDown, day, hour, minute, second } =
    useCountDown();
  const mugenBoxRef = useRef<HTMLDivElement>();

  const isSellOut =
    sellingBoxData?.blind_box_shelling_status === EBlindBoxStatus.SoldOut;

  const buyActionDisable = useMemo(() => {
    if (!sellingBoxData || Object.keys(sellingBoxData).length === 0)
      return true;
    if (sellingBoxData.box_type === EBoxType.Normal) {
      return (
        sellingBoxData.blind_box_shelling_status !== EBlindBoxStatus.Selling
      );
    }
    return false;
  }, [sellingBoxData]);

  const buyBtnRender = useMemo(() => {
    const text =
      localText[`home.boxIntro.${isSellOut ? 'solidOut' : 'buyNow'}`];
    return !buyActionDisable ? (
      <Link to={`/mugenBoxes?boxId=${sellingBoxData?.id}`}>
        <div className="buy">{text}</div>
      </Link>
    ) : (
      <div className="buy disable">{text}</div>
    );
  }, [isSellOut, sellingBoxData, buyActionDisable, localText]);

  const handleCheckNow = useCallback(() => {
    if (mugenBoxRef.current) {
      mugenBoxRef.current.scrollIntoView?.();
    }
  }, [mugenBoxRef]);

  useEffect(() => {
    if (sellingBoxData?.remain_time) {
      clearCountDown();
      beginCountDown(sellingBoxData?.remain_time);
    }
  }, [sellingBoxData]);

  useEffect(() => {
    getSellingBoxData();
    return () => {
      clearCountDown();
    };
  }, []);

  return (
    <div className="mugen-box">
      <div className="mugen-box-container">
        <div className="count-down-warpper">
          <div className="left text">
            <p>{localText['home.countdown.left1']}</p>
            <p>{localText['home.countdown.left2']}</p>
            {localText['home.countdown.left3'] !== '' && (
              <p>{localText['home.countdown.left3']}</p>
            )}
          </div>

          <div className="count-down-time" onClick={handleCheckNow}>
            Check Now
          </div>
          <div className="right text">
            <p>{localText['home.countdown.right1']}</p>
            <p>{localText['home.countdown.right2']}</p>
            {localText['home.countdown.right3'] !== '' && (
              <p>{localText['home.countdown.right3']}</p>
            )}
          </div>
        </div>
        {!sellingBoxData ? (
          // @ts-ignore
          <div className="coming-soon" ref={mugenBoxRef}>
            <img src={BoxComingSoonImg} alt="" />
          </div>
        ) : (
          // @ts-ignore
          <div className="mugen-boxes-desc" ref={mugenBoxRef}>
            <div className="module-title">Mugen Boxes</div>
            <div className="box-detail">
              <div
                className="common-img"
                style={{
                  backgroundImage: `Url(${sellingBoxData?.box_style_image_url})`,
                }}
              >
                <div className="box-count-down">
                  <div className="time day">{day}</div>
                  <div className="time hour">{hour}</div>
                  <div className="time minute">{minute}</div>
                  <div className="time second">{second}</div>
                </div>
              </div>
              <div className="intro-and-action">
                <div className="title">
                  {!!sellingBoxData
                    ? sellingBoxData[`box_name_${language}`]
                    : null}
                </div>
                <div className="desc">
                  {!!sellingBoxData
                    ? sellingBoxData[`box_introduce_${language}`]
                    : null}
                </div>
                <div className="action">
                  <div className="remain">
                    <div className="num">500</div>
                    <div className="val-desc">
                      {localText['home.boxIntro.limited']}
                    </div>
                  </div>
                  <div className="remain">
                    <div className="num">
                      <span className="uint">
                        {sellingBoxData?.digital_sell_unit_name}
                      </span>
                      <span className="sell-price">
                        {' ' + sellingBoxData?.digital_sell_price}
                      </span>
                    </div>
                    <div className="val-desc">Blind box price</div>
                  </div>
                  <div className="price">{buyBtnRender}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
