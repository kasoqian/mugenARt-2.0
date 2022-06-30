import { useEffect, useState } from 'react';

import styles from './index.less';

import TabContentRule from './components/earn';
import TabContentReward from './components/collection';
import TabContentPay from './components/pay';
import useLocals from '@/hooks/useLocals';

export default function IndexPage() {
  const [currentTab, setCurrentTab] = useState('reward');
  const { localText } = useLocals();

  useEffect(() => {
    return () => {
      setCurrentTab('reward');
    };
  }, []);

  const CheckoutTabs = () => (
    <div className={styles.tabs}>
      <div
        className={`${styles.tab_first} ${
          currentTab === 'reward' ? styles.tab_first_active : null
        }`}
        onClick={() => setCurrentTab('reward')}
      >
        {localText['events.tabs.title1']}
      </div>
      <div
        className={`${styles.tab_second} ${
          currentTab === 'rule' ? styles.tab_second_active : null
        }`}
        onClick={() => setCurrentTab('rule')}
      >
        {localText['events.tabs.title2']}
      </div>
      <div
        className={`${styles.tab_three} ${
          currentTab === 'nftFi' ? styles.tab_three_active : null
        }`}
        onClick={() => setCurrentTab('nftFi')}
      >
        {localText['events.tabs.title3']}
      </div>
    </div>
  );

  return (
    <div className={styles.main}>
      <CheckoutTabs></CheckoutTabs>
      {currentTab === 'reward' && <TabContentReward />}
      {currentTab === 'rule' && <TabContentRule />}
      {currentTab === 'nftFi' && <TabContentPay />}
    </div>
  );
}
