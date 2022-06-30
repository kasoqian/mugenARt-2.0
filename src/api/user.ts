import request from '@/api/request';

export interface APIResult<T> {
  code: string;
  message: string;
  data: T;
}

export interface IUserInfo {
  userId: string;
  nickName: string;
  emailAddr: string;
  googleUserId: string;
  twitterUserId: string;
  facebookUserId: string;
  flowWalletAddr: string;
  evmWalletAddr: string;
  userPicture: string;
}

export type Friend = {
  friendId: number;
  registerDate: number;
};

export type ShareContent = {
  referralCode?: string;
  referralLink?: string;
};

/**
 * 获取用户信息
 */
export async function getUserInfo(): Promise<APIResult<IUserInfo>> {
  try {
    const data: APIResult<IUserInfo> = await request.get(
      '/mugen-auth-service/api/oauth/getUserInfo',
    );
    return data;
  } catch (e) {
    throw e;
  }
}

/**
 * 修改昵称
 * @param nickName
 */
export async function modifyNickName(
  nickName: string,
): Promise<APIResult<unknown>> {
  try {
    const data = await request.post(
      '/mugen-auth-service/api/oauth/modifyNickName',
      {
        data: {
          nickName,
        },
      },
    );
    return data;
  } catch (e) {
    throw e;
  }
}

/**
 * 更换邮箱
 * @param oldRegisterCode
 * @param emailAddr
 * @param registerCode
 */
export async function replaceEmail({
  oldRegisterCode,
  emailAddr,
  registerCode,
}: {
  oldRegisterCode: string;
  emailAddr: string;
  registerCode: string;
}): Promise<APIResult<unknown>> {
  try {
    const result = await request.post(
      '/mugen-auth-service/api/oauth/reBindEmailAddr',
      {
        data: {
          oldRegisterCode,
          emailAddr,
          registerCode,
        },
      },
    );
    const res = result && +result?.code === 0;
    if (res) {
      localStorage.setItem('ACCESS_TOKEN', result.data.jwtToken);
    }
    return result;
  } catch (e) {
    throw e;
  }
}

/**
 * 关联Flow钱包
 * @param walletAddress
 */
export async function associateWithFlow({
  walletAddress,
}: {
  walletAddress: string;
}): Promise<
  APIResult<
    | string
    | {
        emailAddr: string;
        jwtToken: string;
      }
  >
> {
  return request.post('/mugen-auth-service/api/oauth/bindFlowAddr', {
    data: {
      flowWalletAddr: walletAddress,
    },
  });
}

/**
 * 生成Flow钱包地址
 */
export async function generateFlowAddr(): Promise<APIResult<string>> {
  try {
    const result: APIResult<string> = await request.post(
      '/mugen-auth-service/api/oauth/generateFlowAddr',
    );
    return result;
  } catch (e) {
    throw e;
  }
}

/**
 * 手动解绑Flow钱包
 */
export async function unBindFlowAddr(
  emailCode: string,
): Promise<APIResult<string>> {
  try {
    const result: APIResult<string> = await request.post(
      '/mugen-auth-service/api/oauth/unBindFlowAddr',
      {
        data: {
          emailCode,
        },
      },
    );
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

/**
 * 获取关联HashPalette的nonce
 * @param walletAddress
 */
export async function getBindHashPaletteNonce(walletAddress: string) {
  try {
    const result: APIResult<string> = await request.get(
      '/mugen-auth-service/api/oauth/getBindHashPaletteNonce',
      {
        params: {
          userWalletAddr: walletAddress,
        },
      },
    );
    return result.data || '';
  } catch (e) {
    throw e;
  }
}

/**
 * 关联metamask
 * @param walletAddress
 * @param loginSignature
 */
export async function associateWithHashPalette({
  walletAddress,
  bindSignature,
  bindMessage,
  bindNonce,
}: {
  walletAddress: string;
  bindSignature: string;
  bindMessage: string;
  bindNonce: string;
}): Promise<
  APIResult<
    | string
    | {
        emailAddr: string;
        jwtToken: string;
      }
  >
> {
  return request.post('/mugen-auth-service/api/oauth/bindEvmAddrByMetamask', {
    data: {
      userWalletAddr: walletAddress,
      bindSignature,
      bindMessage,
      bindNonce,
    },
  });
}

/**
 * 关联WalletConnect
 * @param walletAddress
 * @param loginSignature
 */
export async function associateWithWalletConnect({
  walletAddress,
  bindSignature,
  bindMessage,
  bindNonce,
}: {
  walletAddress: string;
  bindSignature: string;
  bindMessage: string;
  bindNonce: string;
}): Promise<
  APIResult<
    | string
    | {
        emailAddr: string;
        jwtToken: string;
      }
  >
> {
  return request.post(
    '/mugen-auth-service/api/oauth/bindEvmAddrByWalletConnect',
    {
      data: {
        userWalletAddr: walletAddress,
        bindSignature,
        bindMessage,
        bindNonce,
      },
    },
  );
}

/**
 * 生成HashPalette钱包
 */
export async function generateHashPaletteAddr(): Promise<APIResult<string>> {
  try {
    const result: APIResult<string> = await request.post(
      '/mugen-auth-service/api/oauth/generateHashPaletteAddr',
    );
    return result;
  } catch (e) {
    throw e;
  }
}

/**
 * 手动解绑HashPalette钱包
 */
export async function unBindHashPaletteAddr(
  emailCode: string,
): Promise<APIResult<string>> {
  try {
    const result: APIResult<string> = await request.post(
      '/mugen-auth-service/api/oauth/unBindHashPaletteAddr',
      {
        data: {
          emailCode,
        },
      },
    );
    return result;
  } catch (e) {
    throw e;
  }
}

/**
 * 手动解绑Google
 */
export async function unBindGoogleId(
  emailCode: string,
): Promise<APIResult<string>> {
  try {
    const result: APIResult<string> = await request.post(
      '/mugen-auth-service/api/oauth/unBindGoogleId',
      {
        data: {
          emailCode,
        },
      },
    );
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

/**
 * 手动解绑Twitter
 */
export async function unBindTwitterId(
  emailCode: string,
): Promise<APIResult<string>> {
  try {
    const result: APIResult<string> = await request.post(
      '/mugen-auth-service/api/oauth/unBindTwitterId',
      {
        data: {
          emailCode,
        },
      },
    );
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

/**
 * 修改头像
 * @param userPicture
 */
export async function modifyUserPicture(
  userPicture: string,
): Promise<APIResult<unknown>> {
  try {
    const data = await request.post(
      '/mugen-auth-service/api/oauth/modifyUserPicture',
      {
        data: {
          userPicture,
        },
      },
    );
    return data;
  } catch (e) {
    throw e;
  }
}

/**
 * 获取用户好友数
 */
export async function getUserFriends(): Promise<APIResult<Friend[]>> {
  try {
    const data = await request.post(
      '/mugen-art-backed/api/mugenArt/activity/getUserInvitationInfo',
    );
    return data;
  } catch (e) {
    throw e;
  }
}

/**
 * 获取用户分享链接, 分享码
 */
export async function getReferralLink(): Promise<APIResult<ShareContent>> {
  try {
    const data = await request.post(
      '/mugen-auth-service/api/oauth/getReferralLink',
    );
    return data;
  } catch (e) {
    throw e;
  }
}
