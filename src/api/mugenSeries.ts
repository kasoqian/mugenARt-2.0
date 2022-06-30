import request from './request';

export async function getAllIpAndIpCharacter() {
  try {
    const res = await request.post(
      '/mugen-art-backed/api/mugenArt/ip/getAllIpAndIpCharacter',
    );
    return res?.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
