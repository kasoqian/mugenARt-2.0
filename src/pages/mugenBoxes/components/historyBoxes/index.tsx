import React, { FC, useState, useEffect } from 'react';
import classNames from 'classnames';
import { useModel } from 'umi';
import getParams from '@/utils/getQuery';

import './index.less';
import useLocals from '@/hooks/useLocals';

interface IProps {}

export default (props: IProps) => {
  const { language } = useLocals();

  const { allBoxesList, activeBoxId, setActiveBoxId, resetBoxData } =
    useModel('useMugenBox');

  useEffect(() => {
    if (activeBoxId) return;
    const boxId = getParams('boxId');
    if (allBoxesList?.find((item: any) => item.id === boxId)) {
      setActiveBoxId(boxId);
    } else {
      setActiveBoxId(allBoxesList[0]?.id);
    }
  }, [allBoxesList, activeBoxId]);

  if (!allBoxesList?.length) return null;

  return (
    <div className="history-boxes">
      {allBoxesList.map((item: any) => {
        return (
          <div
            className={classNames('box-item', {
              active: activeBoxId === item?.id,
              'exchange-box-red':
                item.box_type === 'REWARD' &&
                item.user_remain_exchange_times > 0,
            })}
            key={item?.id}
            onClick={() => {
              if (item.id === activeBoxId) return;
              resetBoxData();
              setActiveBoxId(item?.id);
            }}
          >
            {item[`box_name_${language}`]}
          </div>
        );
      })}
    </div>
  );
};
