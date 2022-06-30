import request from '@/api/request';

export async function queryAssetDetail({ assertId = '' }) {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/assert/getUserAssertById',
      {
        data: {
          assertId,
        },
      },
    );
    return res?.data || {};
  } catch (error) {
    console.error(error);
    return {};
  }
}

export async function queryAssetList({ ipId = '', pageNo = 1, pageSize = 10 }) {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/assert/getUserAssert',
      {
        data: {
          ipId,
          pageNo,
          pageSize,
        },
      },
    );
    return res;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getAllIpIdAndEnName() {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/assert/getAllUserAssertIp',
    );
    (res.data || []).unshift({
      ip_id: '',
      ip_name: 'All',
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
