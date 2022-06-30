import { useState, useCallback } from 'react';
import { dialog } from '@/components/Modal';
import Login from '@/layouts/components/login';
import { IUserInfo } from '@/api/user';

export default function useLogin() {
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);

  const loginIn: () => Promise<IUserInfo> = useCallback(async () => {
    return new Promise((resolve, reject) => {
      if (userInfo) return resolve(userInfo);
      dialog({
        component: Login,
        props: {
          signInCallback: (uInfo: IUserInfo) => {
            setUserInfo(uInfo);
            resolve(uInfo);
          },
        },
      });
    });
  }, [userInfo]);

  return {
    userInfo,
    setUserInfo,
    loginIn,
  };
}
