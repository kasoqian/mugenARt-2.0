import request from '@/api/request';
import { APIResult } from '@/api/login';

export async function checkOrderStatus({
  orderId,
}: {
  orderId: string;
}): Promise<
  APIResult<{
    orderStatus: string;
    orderNotice: string;
  }>
> {
  try {
    const result = await request.post(
      '/mugen-nft-service/api/order/checkOrderStatus',
      {
        data: {
          orderId,
        },
      },
    );
    return result;
  } catch (e) {
    throw e;
  }
}
