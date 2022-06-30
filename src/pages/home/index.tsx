import React, { FC } from 'react';
import Banner from './components/banner';
import MugenBox from './components/mugenBox';
import MugenSeries from './components/mugenSeries';
import Partners from './components/partners';
import JoinUs from './components/joinUs';

import './index.less';

interface Iprops {}

export default (props: Iprops) => {
  return (
    <div className="mugen-home">
      <Banner />
      <MugenBox />
      <MugenSeries />
      <Partners />
      <JoinUs />
    </div>
  );
};
