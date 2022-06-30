import { useState, useEffect, useRef } from 'react';

export default function useUnity() {
  const unityRef = useRef<any>(null);
  const [openAnimationVisible, setOpenAnimationVisible] =
    useState<boolean>(false); // 开盒动画是否展示

  return {
    openAnimationVisible,
    setOpenAnimationVisible,
    unityRef,
  };
}
