import React, { FC, useEffect } from 'react';
import Swiper, { Pagination, Autoplay } from 'swiper';
import { useModel } from 'umi';

// swiper core styles
import 'swiper/swiper-bundle.css';
import './index.less';

Swiper.use([Pagination, Autoplay]);

let swiperInstance: Swiper;

interface IProps {}

export default (props: IProps) => {
  const { homeBannerImgList } = useModel('useStaticInfo');

  useEffect(() => {
    swiperInstance = new Swiper('#mugen-banner-swiper-container', {
      slidesPerView: 1, // swiper-slide show number
      spaceBetween: 30, // swiper-slide between position
      autoplay: {
        delay: 2000,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true, // allow click
      },
      loop: true, // loop enable
    });
  }, []);

  useEffect(() => {
    if (!swiperInstance) return;
    if (homeBannerImgList?.length <= 1) {
      swiperInstance.disable();
    }
  }, [homeBannerImgList]);

  return (
    <div className="mugen-banner">
      <div id="mugen-banner-swiper-container" className="swiper-container">
        <div className="swiper-wrapper">
          {homeBannerImgList.map((img, index) => {
            return (
              <div className="swiper-slide" key={index}>
                <img src={img} alt="" />
              </div>
            );
          })}
        </div>
        <div className="swiper-pagination"></div>
      </div>
    </div>
  );
};
