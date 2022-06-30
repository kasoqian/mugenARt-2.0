import { useState, useEffect } from 'react';
import { message } from 'antd';

let loadingClose: () => void = () => {};

export default function useLoading() {
  const [loadingText, setLoadingText] = useState<string>('');

  useEffect(() => {
    if (loadingText) {
      // 全局 loading 逻辑
      loadingClose = message.loading(loadingText, 0);
    } else {
      loadingClose && loadingClose();
    }
  }, [loadingText]);

  return {
    loadingText,
    setLoadingText,
  };
}
