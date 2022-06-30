import { useState, useEffect, useCallback, useMemo } from 'react';

let countDownSeed: NodeJS.Timeout;

const handleZero = (num: number | null) => {
  if (num == null) {
    return num;
  }
  if (num?.toString().length === 1) {
    return `0${num}`;
  }
  return num;
};

export default function useCountDown() {
  const [remainTime, setRemainTime] = useState<any>(null);

  const countDown = useCallback(() => {
    setRemainTime((cur: number) => {
      if (cur >= 1000) {
        countDownSeed = setTimeout(countDown, 1000);
      }
      return cur - 1000;
    });
  }, []);

  /** time 为毫秒时间戳 */
  const beginCountDown = useCallback((time: number) => {
    setRemainTime(time);
    countDown();
  }, []);

  const clearCountDown = useCallback(() => {
    setRemainTime(0);
    clearTimeout(countDownSeed);
    // @ts-ignore
    countDownSeed = null;
  }, []);

  const [day, hour, minute, second] = useMemo(() => {
    let day = null,
      hour = null,
      minute = null,
      second = null;
    if (remainTime) {
      let time = remainTime / 1000;
      day = Math.floor(time / (3600 * 24));
      time = time % (3600 * 24);
      hour = Math.floor(time / 3600);
      time = time % 3600;
      minute = Math.floor(time / 60);
      second = time % 60;
    }
    return [day, hour, minute, second];
  }, [remainTime]);

  useEffect(() => {
    return () => {
      clearTimeout(countDownSeed);
      // @ts-ignore
      countDownSeed = null;
    };
  }, []);

  return {
    remainTime,
    beginCountDown,
    clearCountDown,
    day: handleZero(day),
    hour: handleZero(hour),
    minute: handleZero(minute),
    second: handleZero(second),
  };
}
