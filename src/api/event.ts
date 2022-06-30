import request from './request';

/* 所有活动商品 */
export async function getAllActivityProducts() {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/activity/getAllActivityProducts',
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/* 用户参与活动情况 */
export async function getUserActivityProcessInfo() {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/activity/getUserActivityProcessInfo',
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/* 领取奖励 */
export async function createActivityOrder({
  product_id,
  pay_type,
  activity_product_number,
}: any) {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/order/createActivityOrder',
      {
        data: {
          product_id,
          pay_type,
          activity_product_number,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/* 用户可领取奖励次数 */
export async function getUserRecommendInfo() {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/activity/getUserRecommendInfo',
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/* 用户领取一次奖励 */
export async function userGetRewardTimes() {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/activity/userGetRewardTimes',
    );
    return res;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/* 获取衰减周期等数据 */
export async function getUserGrantInterestDateInfo() {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/activity/getUserGrantInterestDateInfo',
    );
    return res;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/* 获取用户待领取奖励利息 */
export async function getUserInterestInfo() {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/activity/getUserInterestInfo',
    );
    return res;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/* 获取用户领取奖励利息记录 */
export async function getUserGrantInterestInfo() {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/activity/getUserGrantInterestInfo',
    );
    return res;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/* 获取池子总量 */
export async function getIncome() {
  try {
    const res = await request.post('/mugen-nft-service/api/balance/income');
    return res;
  } catch (error) {
    console.error(error);
    return [];
  }
}

/* 是否有plt领取资格 */
export async function getUserApplyGetRewardInfo() {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/activity/getUserApplyGetRewardInfo',
    );
    return res;
  } catch (error) {
    console.error(error);
    return {};
  }
}

/* 领取plt */
export async function addUserApplyGetRewardInfo(userAddr: string) {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/activity/addUserApplyGetRewardInfo',
      { data: { userAddr } },
    );
    return res;
  } catch (error) {
    console.error(error);
    return {};
  }
}
