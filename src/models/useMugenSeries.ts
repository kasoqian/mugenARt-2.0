import { useState, useCallback, useEffect } from 'react';
import { getAllIpAndIpCharacter } from '@/api/mugenSeries';

export default function useMugenSeries() {
  const [serieList, setSerieList] = useState<any[]>([]);

  const getData = useCallback(async () => {
    const res = await getAllIpAndIpCharacter();
    setSerieList(res);
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return {
    serieList,
  };
}
