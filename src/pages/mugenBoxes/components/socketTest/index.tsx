import { Button } from 'antd';
import { changeSellingInfo, noticeOrderMintResult } from '@/api/socket';

import './index.less';

interface IProps {}

export default (props: IProps) => {
  return (
    <div className="test-socket">
      <div className="socket-btn">
        <Button
          onClick={() => {
            changeSellingInfo();
          }}
        >
          测试盲盒数量变更 socket
        </Button>
      </div>
      <div className="socket-btn">
        <Button
          onClick={() => {
            // @ts-ignore
            noticeOrderMintResult(window.__order_id__);
          }}
        >
          20 支付成功后，测试 mint
        </Button>
      </div>
    </div>
  );
};
