/**
 * 监听按钮事件，触发回调函数
 * @string key 按键名
 * @function callback 按下发生的动作
 */

import { useEffect } from 'react';

function useKeyUp(key: string, callback: Function) {
  /*   useEffect(() => {
    document.addEventListener('keyup', keyUpCallback);
    return () => {
      document.removeEventListener('keyup', keyUpCallback);
    };
  }, []); */

  const keyUpCallback = (event: KeyboardEvent) => {
    if (event.key?.toUpperCase() === key.toUpperCase()) {
      callback();
    }
  };

  return;
}

export default useKeyUp;
