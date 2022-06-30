import { useState, useCallback, useEffect } from 'react';
import { getHomePageStaticInfo } from '@/api/staticInfo';

export default function useStaticInfo() {
  const [homeBannerImgList, setHomeBannerImgList] = useState<string[]>([]);
  const [joinUsImg, setJoinUsImg] = useState<string>('');

  const getData = useCallback(async () => {
    const res = await getHomePageStaticInfo();
    setHomeBannerImgList(res?.banner_home_url || []);
    setJoinUsImg(res?.image_join_url);
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return {
    homeBannerImgList,
    joinUsImg,
  };
}
