import { useParams } from 'umi';
import { useEffect, useState } from 'react';
import { checkOrderStatus } from '@/api/payment';
import failPng from './assets/fail.png';
import successPng from './assets/success.png';

import './index.less';

enum EOrderStatus {
  success = 'success',
  failed = 'failed',
  pending = 'pending',
}

export default function IndexPage() {
  const [orderStatus, setOrderStatus] = useState<keyof typeof EOrderStatus>(
    EOrderStatus.pending,
  );
  const params = useParams<{ orderId: string }>();
  const orderId = params?.orderId;

  useEffect(() => {
    if (orderId) {
      checkOrderStatus({ orderId })
        .then((res) => {
          if (+res?.data?.orderStatus === 1) {
            setOrderStatus(() => EOrderStatus.success);
          } else {
            setOrderStatus(() => EOrderStatus.failed);
          }
        })
        .catch((e) => {
          setOrderStatus(() => EOrderStatus.failed);
        });
    }
  }, [orderId]);

  return (
    <div className="page__result">
      {orderStatus === EOrderStatus.success ? (
        <div className="order-success">
          <img src={successPng} alt="" />
          <div className="inst">Payment successful</div>
        </div>
      ) : null}
      {orderStatus === EOrderStatus.failed ? (
        <div className="order-fail">
          <img src={failPng} alt="" />
          <div className="inst">Payment failed</div>
        </div>
      ) : null}
      <div className="buttom-confirm" onClick={() => window.close()}>
        Confirm
      </div>
    </div>
  );
}
