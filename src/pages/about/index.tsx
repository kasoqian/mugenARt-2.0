import React, { FC } from 'react';
import Intro from './components/intro';
import RoadMap from './components/roadMap';

import './index.less';

interface Iprops {}

export default (props: Iprops) => {
  return (
    <div className="mugen-about">
      <Intro />
      <RoadMap />
    </div>
  );
};
