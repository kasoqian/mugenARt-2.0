import { useEffect, useState } from 'react';
import AssetModel from '../components/AssetModel';
import { queryAssetDetail } from '@/api/asset';
import classNames from 'classnames';
import { useParams } from 'umi';
// @ts-ignore
import styles from './index.less';
import useLocals from '@/hooks/useLocals';

export interface IAssetDetail {
  id: string;
  ip_id: string;
  assert_token_id: string;
  assert_name: string;
  assert_description: string;
  ip_name: string;
  series_name: string;
  assert_image_url: string;
  assert_model_url: string;
  circulation: string;
}

export default function AssetDetailPage() {
  const [show, setShow] = useState<boolean>(true);
  const [assetDetail, setAssetDetail] = useState<IAssetDetail | null>(null);
  const localText = useLocals(true);

  const params = useParams<{ id: string }>();
  const assetId = params?.id;

  const showAndHide = () => {
    setShow(() => !show);
  };

  useEffect(() => {
    queryAssetDetail({ assertId: assetId }).then((result) => {
      setAssetDetail(() => result);
    });
  }, []);

  return (
    <div className={styles.layout}>
      <div className={styles.dot_1} />
      <img className={styles.bg} src={require('./assets/bg.png')} alt="" />
      <div
        className={classNames([styles['arrow-hide'], { [styles.hide]: show }])}
      />
      <div className={classNames([styles.desc, { [styles.hide]: !show }])}>
        <div className={styles['detail-title']}>{assetDetail?.assert_name}</div>
        <div className={styles.description}>
          <div className={styles.number}>
            <div>{localText('asset.detail.number')}:</div>
            <div className={styles.text}>{assetDetail?.assert_token_id}</div>
          </div>
          <div className={styles.ip}>
            <div>{localText('asset.detail.ip')}:</div>
            <div className={styles.text}>{assetDetail?.ip_name}</div>
          </div>
          <div className={styles.series}>
            <div>{localText('asset.detail.series')}:</div>
            <div className={styles.text}>{assetDetail?.series_name}</div>
          </div>
        </div>
        <div className={styles.para}>
          {assetDetail?.assert_description?.split('\\n')?.map?.((item) => (
            <div>{item}</div>
          ))}
        </div>
        <div className={styles.arrow} onClick={showAndHide} />
      </div>
      <div className={styles.asset}>
        <AssetModel assetDetail={assetDetail} />
      </div>
      <div className={styles.dot_2} />
    </div>
  );
}
