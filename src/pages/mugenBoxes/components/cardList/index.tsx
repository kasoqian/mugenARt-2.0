import React, { FC, useState, useEffect, useCallback } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { useModel } from 'umi';
import Card from '../card';

import './index.less';

const dataCache: any = [];
let timeSeed: NodeJS.Timeout;

interface IProps {}

export default (props: IProps) => {
  const [dataList, setDataList] = useState<any>([]);
  const [isTranslateX, setIsTranslateX] = useState<boolean>(false);
  const { openBoxesResultList } = useModel('useMugenBox');
  const { socketInstance } = useModel('useSocket');

  const handleDataCache = useCallback(() => {
    if (dataCache.length > 0) {
      const data = dataCache.shift();
      setDataList((dataList: any) => [data, ...dataList].slice(0, 7));
      timeSeed = setTimeout(() => {
        handleDataCache();
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (openBoxesResultList.length > 0) {
      setDataList(openBoxesResultList);
    }
  }, [openBoxesResultList]);

  useEffect(() => {
    return () => {
      timeSeed && clearTimeout(timeSeed);
    };
  }, []);

  useEffect(() => {
    let subscribeRes: { id: string; unsubscribe: () => void };
    if (socketInstance) {
      subscribeRes = socketInstance.subscribe(
        '/mugenArtTopic/realSellingInfo',
        function (response: any) {
          setIsTranslateX(true);
          setTimeout(() => {
            setIsTranslateX(false);
            try {
              const data = JSON.parse(response.body).data;
              if (!data) return;
              const newList = Array.isArray(data) ? data : [data];
              const preLength = dataCache.length;
              dataCache.push(...newList);
              if (preLength === 0) {
                handleDataCache();
              }
            } catch (error) {}
          }, 1000);
        },
      );
    }
    return () => {
      subscribeRes?.unsubscribe?.();
    };
  }, [socketInstance]);

  return (
    <div>
      <TransitionGroup
        className={classNames('card-list', { 'translate-x': isTranslateX })}
      >
        {dataList.map((item: any) => {
          return (
            <CSSTransition key={item?.msg_id} classNames="card" timeout={1000}>
              <Card
                level={item?.rarity_name}
                bg={item?.product_rarity_background}
                img={item?.product_image_url}
                title={item?.product_name}
                subTitle={item?.series_name}
                edition={item?.number}
                address={item?.user_name}
              />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </div>
  );
};
