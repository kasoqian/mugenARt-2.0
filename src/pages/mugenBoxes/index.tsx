import { useEffect, lazy, Suspense } from 'react';
import { useModel } from 'umi';
import HistoryBoxes from './components/historyBoxes';
import CardList from './components/cardList';
// import BuyBoxes from './components/buyBoxes';
import BoxIntro from './components/boxIntro';
const BuyBoxes = lazy(() => import('./components/buyBoxes'));
import { getPltProvider } from '@/api/Wallet';

import './index.less';

export default function MugenBoxes() {
  const { resetBoxData } = useModel('useMugenBox');

  useEffect(() => {
    return () => {
      resetBoxData();
      const walletConnect = getPltProvider();
      if (walletConnect.connected) {
        walletConnect.disconnect();
      }
    };
  }, []);

  return (
    <div className="mugen-boxes">
      <HistoryBoxes />
      <CardList />
      <Suspense fallback={<div>Loading...</div>}>
        <BuyBoxes />
      </Suspense>
      <BoxIntro />
    </div>
  );
}
