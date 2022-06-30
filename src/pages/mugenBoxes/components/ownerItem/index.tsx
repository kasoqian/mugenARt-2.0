import React, { FC } from 'react';
import { Tooltip } from 'antd';

import './index.less';

interface IProps {
  photo: string;
  name: string;
}

export default (props: IProps) => {
  return (
    <div className="owner-item">
      <Tooltip placement="top" title={props.name}>
        <img src={props.photo} alt="" />
      </Tooltip>
    </div>
  );
};
