import request from './request';

export async function getUserAlasByIpIdRarityName(
  userId?: string,
  ipId?: string,
  rarityName?: string,
) {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/ip/getUserOwnProductDistribution',
      {
        data: { userId, ipId, rarityName },
      },
    );
    return res?.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
