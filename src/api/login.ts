import request from './request';

export interface APIResult<T> {
  code: string;
  message: string;
  data: T;
}

/**
 * @description 获取登录nonce，验证多地登陆用
 * @param walletAddress 钱包地址
 */
export async function getLoginNonce(walletAddress: string) {
  try {
    const result: APIResult<string> = await request.get(
      '/mugen-auth-service/api/oauth/getLoginHashPaletteNonce',
      {
        params: {
          userWalletAddr: walletAddress,
        },
      },
    );
    return result.data || '';
  } catch (e) {
    console.error(e);
    return '';
  }
}

/**
 * @description 用户注销登陆
 */
export async function logOut(): Promise<boolean> {
  try {
    const data = await request.post('/mugen-auth-service/api/oauth/logout');
    return data && +data.code === 0;
  } catch (e) {
    console.error(e);
    return false;
  }
}

interface ILoginData {
  emailAddr: string;
  userId: string;
}

export async function getLoginData(): Promise<APIResult<ILoginData> | null> {
  try {
    const data: APIResult<ILoginData> = await request.post(
      '/mugen-auth-service/api/oauth/verifyJwtToken',
    );
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function sendRegisterCode(emailAddr: string): Promise<boolean> {
  try {
    const data = await request.post(
      '/mugen-auth-service/api/oauth/sendRegisterCode',
      {
        data: {
          emailAddr,
        },
      },
    );
    return data && +data.code === 0;
  } catch (e) {
    console.error(e);
    return false;
  }
}

/**
 * 注册
 * @param emailAddr
 * @param registerCode
 * @param passwd
 * @param confirmPasswd
 * @param referralCode
 */
export async function signUp({
  emailAddr,
  registerCode,
  passwd,
  confirmPasswd,
  referralCode,
}: {
  emailAddr: string;
  registerCode: string;
  passwd: string;
  confirmPasswd: string;
  referralCode?: string;
}): Promise<APIResult<unknown>> {
  try {
    const result = await request.post(
      '/mugen-auth-service/api/oauth/register',
      {
        data: {
          emailAddr,
          registerCode,
          passwd,
          confirmPasswd,
          referralCode,
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
 * 绑定邮箱
 * @param emailAddr
 * @param registerCode
 * @param passwd
 * @param confirmPasswd
 */
export async function bindEmail({
  emailAddr,
  registerCode,
  passwd,
  confirmPasswd,
}: {
  emailAddr: string;
  registerCode: string;
  passwd: string;
  confirmPasswd: string;
}): Promise<APIResult<unknown>> {
  try {
    const result = await request.post(
      '/mugen-auth-service/api/oauth/bindEmailAddr',
      {
        data: {
          emailAddr,
          registerCode,
          passwd,
          confirmPasswd,
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

export async function signIn({
  emailAddr,
  passwd,
}: {
  emailAddr: string;
  passwd: string;
}): Promise<APIResult<any> | null> {
  try {
    const result = await request.post(
      '/mugen-auth-service/api/oauth/mugenLogin',
      {
        data: {
          emailAddr,
          passwd,
        },
      },
    );
    const res = result && +result?.code === 0;
    if (res) {
      localStorage.setItem('ACCESS_TOKEN', result.data.jwtToken);
    }
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * 用户Blocto钱包登陆
 * @param walletAddress 钱包地址
 */
export async function loginWithBlocto({
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
  return request.post('/mugen-auth-service/api/oauth/bloctoLogin', {
    headers: {
      flowWalletAddr: walletAddress,
    },
  });
}

/**
 * 用户MetaMask登陆
 * @param walletAddress 钱包地址
 * @param signature 签名
 * @param signMessage 签名消息
 * @param nonce 用户nonce
 */
export async function loginWithMetamask({
  walletAddress,
  signature,
  signMessage,
  nonce,
}: {
  walletAddress: string;
  signature: string;
  signMessage: string;
  nonce: string;
}): Promise<
  APIResult<
    | string
    | {
        emailAddr: string;
        jwtToken: string;
      }
  >
> {
  return request.post('/mugen-auth-service/api/oauth/metaMaskLogin', {
    data: {
      userWalletAddr: walletAddress,
      loginSignature: signature,
      loginMessage: signMessage,
      loginNonce: nonce,
    },
  });
}

export async function resetPasswd({
  passwd,
  confirmPasswd,
  registerCode,
  emailAddr,
}: {
  passwd: string;
  confirmPasswd: string;
  registerCode: string;
  emailAddr: string;
}): Promise<APIResult<any>> {
  try {
    const data = await request.post(
      '/mugen-auth-service/api/oauth/resetPasswd',
      {
        data: {
          passwd,
          confirmPasswd,
          registerCode,
          emailAddr,
        },
      },
    );
    return data;
  } catch (e) {
    throw e;
  }
}

/**
 * 用户wallet-connect登陆
 * @param walletAddress 钱包地址
 * @param signature 签名
 * @param signMessage 签名消息
 * @param nonce 用户nonce
 */
export async function loginWithWalletConnect({
  walletAddress,
  signature,
  signMessage,
  nonce,
}: {
  walletAddress: string;
  signature: string;
  signMessage: string;
  nonce: string;
}): Promise<
  APIResult<
    | string
    | {
        emailAddr: string;
        jwtToken: string;
      }
  >
> {
  return request.post('/mugen-auth-service/api/oauth/walletConnectLogin', {
    data: {
      userWalletAddr: walletAddress,
      loginSignature: signature,
      loginMessage: signMessage,
      loginNonce: nonce,
    },
  });
}
