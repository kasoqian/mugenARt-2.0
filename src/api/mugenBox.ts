import request from './request';
import Wallet, { getPltProvider } from './Wallet';

/**
 * 获取待售或者销售中的盲盒信息
 * @export
 * @return {*}
 */
export async function getInOrWaitSellingBox() {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/blindBox/getInOrWaitSellingBox',
    );
    return res?.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
/**
 * 根据ip的id，获取ip下面的所有盲盒，分页查询
 * @export
 * @param {*} {
 *   ipId = null,
 *   pageNo = 1,
 *   pageSize = 10,
 * }
 * @return {*}
 */
export async function getBlindBoxByIpId({
  ipId = null,
  pageNo = 1,
  pageSize = 10,
}) {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/blindBox/getBlindBoxByIpId',
      {
        data: {
          ipId,
          pageNo,
          pageSize,
        },
      },
    );
    return res?.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
/**
 * 根据ip，查询special thanks
 * @export
 * @param {*} {
 *   ipId = null,
 *   pageNo = 1,
 *   pageSize = 10,
 * }
 * @return {*}
 */
export async function getSpecialTksByIpId({
  ipId = null,
  pageNo = 1,
  pageSize = 10,
}) {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/ip/getSpecialTksByIpId',
      {
        data: {
          ipId,
          pageNo,
          pageSize,
        },
      },
    );
    return res?.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * 获取当前最新的7个开盒结果
 * @export
 * @return {*}
 */
export async function getBoxSellingInfoFirstTime() {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/blindBox/getBoxSellingInfoFirstTime',
    );
    return res?.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * 获取所有盲盒列表
 * 根据售卖截止时间进行逆序排序，第一位的是正在售卖或者即将售卖的盲盒  post
 * @export
 * @return {*}
 */
export async function getAllBlindBoxList() {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/blindBox/getAllBlindBoxListWithDetail',
    );
    if (res.code !== 0) {
      throw res;
    }
    return res?.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * 获取盲盒详情
 * @export
 * @return {*}
 */
export async function getBlindBoxInfoByBoxId(boxId: string) {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/blindBox/getBlindBoxInfoByBoxId',
      {
        data: {
          boxId,
        },
      },
    );
    return res?.data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

/**
 * 获取盲盒 copyright
 * @export
 * @return {*}
 */
export async function getBlindBoxCopyRightByBoxId(boxId: string) {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/blindBox/getBlindBoxCopyRight',
      {
        data: {
          boxId,
          pageNo: 1,
          pageSize: 500,
        },
      },
    );
    return res?.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * 根据盲盒获取ip信息
 * @export
 * @return {*}
 */
export async function getBlindBoxIpInfoByBoxId(boxId: string) {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/blindBox/getBlindBoxIpInfoByBoxId',
      {
        data: {
          boxId,
        },
      },
    );
    return res?.data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

/**
 * 根据盲盒ip获取宣传栏
 * @export
 * @return [*]
 */
export async function getBlindBoxMintInfoAndProductRemain(boxId: string) {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/blindBox/getBlindBoxMintInfoAndProductRemain',
      {
        data: {
          boxId,
        },
      },
    );
    return res?.data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

/**
 * 获取盲盒items (盲盒中的商品)
 * @export
 * @return {*}
 */
export async function getBoxProductsByBoxId(boxId: string) {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/blindBox/getBoxProductsByBoxId',
      {
        data: {
          boxId,
          pageNo: 1,
          pageSize: 500,
        },
      },
    );
    return res?.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * 获取汇率、手续费等信息
 * @export
 * @return {*}
 */
export async function getRateFeeBlockInfo() {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/order/getRateFeeBlockInfo',
    );
    return res?.data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

/**
 * 获取用户特权开盒次数(购买型盲盒)
 * @export
 * @return {*}
 */
export async function getUserWhiteListPoint(blind_box_id: string) {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/order/getUserWhiteListPoint',
      {
        data: {
          blind_box_id,
        },
      },
    );
    return res?.data;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

/**
 * 获取用户可兑换次数
 * @export
 * @return {*}
 */
export async function getUserExchangeBoxTimes(boxId: string) {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/blindBox/getUserExchangeBoxTimes',
      {
        data: {
          boxId,
        },
      },
    );
    return res?.data;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

/**
 * 创建订单
 * @export
 * @param {*} {
 *   user_pay_wallet_addr, 用户支付钱包地址
 *   blind_box_id, 盲盒 id
 *   pay_type,  支付类型
 *   amount, 购买数量
 * }
 * @return {*}
 */
export async function createOrder({
  user_pay_wallet_addr,
  blind_box_id,
  pay_type,
  amount,
}: any) {
  try {
    if (!blind_box_id) {
      throw new Error('system error!');
    }
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/order/createOrder',
      {
        data: {
          user_pay_wallet_addr,
          blind_box_id,
          pay_type,
          amount,
        },
      },
    );
    if (res.code !== 0) {
      return Promise.reject(res);
    }
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * 更新20支付 hash
 * @export
 * @param {*} {
 *   orderId, 订单 id
 *   third_order_id, 20支付的 hash
 * }
 * @return {*}
 */
export async function updateOrderThirdOrderId({
  orderId,
  third_order_id,
}: any) {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/order/updateOrderThirdOrderId',
      {
        data: {
          orderId,
          third_order_id,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * 创建兑换型盲盒订单
 * @export
 * @param {*} {
 *   blind_box_id, 盲盒 id
 *   amount, 购买数量
 * }
 * @return {*}
 */
export async function createExchangeOrder({ blind_box_id, amount }: any) {
  try {
    if (!blind_box_id) {
      throw new Error('system error!');
    }
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/order/createExchangeOrder',
      {
        data: {
          blind_box_id,
          pay_type: 3, // 只能为3，否则后台会报错，创建订单失败
          amount,
        },
      },
    );
    if (res.code !== 0) {
      return Promise.reject(res);
    }
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
