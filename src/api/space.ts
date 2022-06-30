import request from './request';

export async function getSyncSpaceAsset(): Promise<any> {
  try {
    const res = await request.post(
      '/mugen-nft-service/api/gocyber/syncSpaceAsset',
    );
    return res?.data || {};
  } catch (error) {
    console.error(error);
    return {};
  }
}

// 需要轮询获取数据
export async function getAuthPlayerIframe(): Promise<any> {
  try {
    const res = await request.post(
      '/mugen-nft-service/api/gocyber/getAuthPlayerIframe',
    );
    return res?.data || {};
  } catch (error) {
    console.error(error);
    return {};
  }
}
