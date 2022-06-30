import { useEffect, useState } from 'react';

import RarityMenu from '../RarityMenu';

import styles from './index.less';
import { useModel } from 'umi';
import { getUserAlasByIpIdRarityName } from '@/api/altas';
import { getAllIpAndIpCharacter } from '@/api/mugenSeries';

interface AtlasPropsInterface {
  setBackModelVisible: any;
  setVisible: any;
}

export default ({ setBackModelVisible, setVisible }: AtlasPropsInterface) => {
  const [activeRarityName, setActiveRarityName] = useState('ssr');
  const [nftDataSource, setNftDataSource] = useState([]);
  const { userInfo } = useModel('login');

  useEffect(() => {
    load();
  }, [activeRarityName]);

  const load = async () => {
    if (!userInfo) return;

    const ipData = await getAllIpAndIpCharacter();
    const result = await getUserAlasByIpIdRarityName(
      userInfo.userId,
      ipData[0]['id'],
      activeRarityName.toUpperCase(),
    );
    setNftDataSource([]);
    setNftDataSource(result);
  };

  const stopPropagation = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  const takeBackModal = () => {
    setBackModelVisible(true);
    setVisible(false);
  };

  return (
    <div className={styles.container} onClick={stopPropagation}>
      <div className={styles.content}>
        <div className={styles.title}>The Ancient Magus' Bride</div>
        <div className={styles.close} onClick={() => setVisible(false)}></div>
        <div className={styles.display}>
          <div className={styles.menu}>
            <RarityMenu
              activeRarityName={activeRarityName}
              setActiveRarityName={setActiveRarityName}
            />
          </div>
          <div className={styles.nfts}>
            {nftDataSource &&
              nftDataSource.map((nft: any) => {
                return (
                  <div key={nft.id} className={styles.nft_card}>
                    <img
                      className={`${
                        nft.is_user_own === 0 ? styles.grey : null
                      } ${nft.need_light === 1 ? styles.light : null}`}
                      src={nft.product_image_url}
                      alt=""
                    />
                    <div className={styles.name}>
                      {nft.product_name.length > 16
                        ? `${nft.product_name.slice(0, 10)}...`
                        : nft.product_name}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className={styles.footer} onClick={takeBackModal}></div>
      </div>
    </div>
  );
};
