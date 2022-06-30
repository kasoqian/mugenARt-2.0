import styles from './index.less';
import './animation.less';

import RarityMenu from '@/components/RarityMenu/index';

import { Empty } from 'antd';
import IpList from '../ipList';
import { useEffect, useState } from 'react';
import { getUserAlasByIpIdRarityName } from '@/api/altas';
import { sorceDataType } from './types';
import { getLoginData } from '@/api/login';

interface AtlasPropsInterface {
  close?: any;
}
export default function Atlas({ close }: AtlasPropsInterface) {
  const [activeIpId, setActiveIpId] = useState<string>('');
  const [activeRarityName, setActiveRarityName] = useState<string>('ssr');
  const [sourceData, setSourceData] = useState<[]>([]);

  useEffect(() => {
    if (activeIpId !== '') {
      load(activeIpId, activeRarityName);
    }
  }, [activeIpId, activeRarityName]);

  const load = async (ipId: string, rarityName: string) => {
    const userInfo = await getLoginData();
    let userId = '';
    if (userInfo) {
      userId = userInfo.data?.userId;
    }

    const result = await getUserAlasByIpIdRarityName(
      userId,
      ipId,
      rarityName.toUpperCase(),
    );

    setSourceData([]);
    setSourceData(result);
  };

  const modelClose = () => {
    // props.setIsModelShow(false);
    close();
  };

  const stopPropagation = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.container} onClick={stopPropagation}>
      <IpList setActiveIpId={setActiveIpId} activeIpId={activeIpId}></IpList>
      <div className={styles.close} onClick={modelClose}></div>
      <div className={styles.firwork}></div>
      <div className={styles.content}>
        <div className={styles.left_menu_bar}>
          <RarityMenu
            activeRarityName={activeRarityName}
            setActiveRarityName={setActiveRarityName}
          />
        </div>
        <div className={styles.card_list}>
          {sourceData?.length === 0 && <Empty className={styles.nodata} />}
          {sourceData?.length > 0
            ? sourceData.map((item: sorceDataType, i: number) => {
                return (
                  <div
                    key={item.id}
                    className={`${styles.card_box} ${
                      item.is_user_own === 1 ? null : styles.notHave
                    } ${item.need_light === 1 ? 'light' : null}`}
                  >
                    <img src={item.product_image_url} alt="" />
                    <p>
                      {item.product_name.length > 16
                        ? `${item.product_name.slice(0, 10)}...`
                        : item.product_name}
                    </p>
                  </div>
                );
              })
            : null}
        </div>
      </div>
      <div className={styles.mask}></div>
    </div>
  );
}
