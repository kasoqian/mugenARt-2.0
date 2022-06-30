import request from './request';

/**
 * 测试 socket
 *
 * @export
 * @return {*}
 */
export async function changeSellingInfo() {
  try {
    const res = await Promise.all([
      request.post('/mugen-art-backed/api/mugenArt/blindBox/changeSellingInfo'),
      request.post(
        '/mugen-art-backed/api/mugenArt/blindBox/changeProductRemain',
      ),
      request.post(
        '/mugen-art-backed/api/mugenArt/blindBox/changeOpenBoxStage',
        {
          data: {
            userId: '435939289776259072',
          },
        },
      ),
    ]);
    return res;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * 测试 socket
 *
 * @export
 * @return {*}
 */
export async function noticeOrderMintResult(orderId: string) {
  try {
    const res = await Promise.all([
      request.post('/mugen-art-backed/api/mugenArt/order/sendMintResultTest', {
        data: {
          orderId,
        },
      }),
    ]);
    return res;
  } catch (error) {
    console.error(error);
    return [];
  }
}
