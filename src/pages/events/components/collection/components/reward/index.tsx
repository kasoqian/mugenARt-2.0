import RewardDetails from './components/details';
import RewardModel from './components/model';
import styles from './index.less';

import { useState } from 'react';

function DisplayContent() {
  const [refreshRemain, setRefreshRemain] = useState<boolean>(false);

  return (
    <div className={styles.container}>
      <RewardModel
        className={styles.container_model}
        refreshRemain={refreshRemain}
      ></RewardModel>
      <RewardDetails
        className={styles.container_detail}
        setRefreshRemain={setRefreshRemain}
      ></RewardDetails>
    </div>
  );
}

export default DisplayContent;
