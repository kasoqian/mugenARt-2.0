import request from './request';

interface IHomePageStaticInfo {
  [key: string]: any;
  imageJoinUrl: string;
  bannerHomeUrl: string[];
}

export async function getHomePageStaticInfo(): Promise<IHomePageStaticInfo> {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/homepage/getHomePageStaticInfo',
    );
    return res?.data || {};
  } catch (error) {
    console.error(error);
    return {} as IHomePageStaticInfo;
  }
}
