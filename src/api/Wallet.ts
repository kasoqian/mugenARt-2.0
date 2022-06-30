import Web3 from 'web3';
import { provider, TransactionConfig } from 'web3-core';
import WalletConnectProvider from '@walletconnect/web3-provider';

class Wallet {
  /**
   * @description Web3 外置库
   */
  web3: Web3;

  /**
   * @description ethereum钱包注入
   */
  ethereum = window.ethereum;

  /**
   * 钱包地址
   */
  walletAddress: string = '';

  constructor(givenProvider?: provider) {
    if (givenProvider) {
      console.log('givenProvider----', givenProvider);
      this.web3 = new Web3(givenProvider);
    } else {
      this.web3 = new Web3(Web3.givenProvider);
    }
  }

  /**
   * @description 判断MetaMask是否安装
   * @private
   */
  public isMetaMaskInstalled(): boolean {
    return typeof this.ethereum !== 'undefined';
  }

  /**
   * @description 获取当前钱包地址
   * @private
   */
  public getWalletAddress() {
    return this.walletAddress;
  }

  /**
   * @description 判断钱包是否登陆
   * @private
   */
  public async isLogin(): Promise<boolean> {
    const accounts = await this.web3.eth.getAccounts();
    this.walletAddress = accounts?.[0] || '';
    return !!(accounts && accounts.length);
  }

  /**
   * 获取chainId
   * @private
   */
  public async getChainId(): Promise<number> {
    return this.web3.eth.getChainId();
  }

  /**
   * 获取Network Id
   * @private
   */
  public async getNetworkId(): Promise<number> {
    return this.web3.eth.net.getId();
  }

  /**
   * @description 链接钱包
   * @private
   */
  public async connectWallet(): Promise<string> {
    const result = await this.ethereum.request({
      method: 'eth_requestAccounts',
    });
    this.walletAddress = result && result[0];
    return this.walletAddress;
  }

  /**
   * @description ETH签名
   * @private
   */
  public async ethSign({
    nonce,
    walletAddress,
  }: {
    nonce: string;
    walletAddress?: string;
  }): Promise<{
    walletAddress?: string;
    signature: string;
    signMessage: string;
    nonce: string;
  }> {
    walletAddress = walletAddress || this.walletAddress;

    return new Promise((resolve, reject) => {
      const signMessage = `I am signing my one-time nonce: ${nonce}`;
      this.web3.eth.personal.sign(
        this.web3.utils.fromUtf8(signMessage),
        walletAddress!,
        'password',
        (err, signature) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              walletAddress: walletAddress,
              signature,
              signMessage,
              nonce,
            });
          }
        },
      );
    });
  }

  /**
   * @description 钱包签名
   * @private
   */
  public async sign({ nonce }: { nonce: string | number }): Promise<{
    walletAddress: string;
    signature: string;
    signMessage: string;
    nonce: string | number;
  }> {
    return new Promise((resolve, reject) => {
      const signMessage = `I am signing my one-time nonce: ${nonce}`;
      this.web3.eth.personal.sign(
        this.web3.utils.fromUtf8(signMessage),
        this.walletAddress,
        'password',
        (err, signature) => {
          if (err) return reject(err);
          return resolve({
            walletAddress: this.walletAddress,
            signature,
            signMessage,
            nonce,
          });
        },
      );
    });
  }

  public async switchChain({
    chainId,
    chainName,
    rpcUrls,
    nativeCurrency,
  }: {
    chainId: string;
    chainName?: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpcUrls?: string[];
  }) {
    try {
      return await this.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          return await this.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId,
                chainName,
                rpcUrls,
                nativeCurrency,
              },
            ],
          });
        } catch (addError) {
          console.error('[addError] ', addError);
        }
      }
    }
  }

  private async signTransaction({
    from,
    gasPrice,
    gas,
    to,
    value,
    data,
    nonce,
    chainId,
    chain,
  }: TransactionConfig) {
    return this.web3.eth.signTransaction({
      from,
      gasPrice,
      gas,
      to,
      value,
      data,
      nonce,
      chainId,
      chain,
    });
  }

  public async sendTransaction({
    from,
    gasPrice,
    gas = '0',
    to = '0',
    value,
    data,
  }: {
    from: string;
    gasPrice: string;
    gas: string;
    to: string;
    value: string;
    nonce: string;
    data?: string;
  }): Promise<any> {
    await this.switchChain({
      chainId: '1718', // 十六进制
      chainName: 'hashPalette',
      rpcUrls: ['https://palette-rpc.com:22000'],
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
    });
    return this.web3.eth.sendTransaction({
      from,
      gasPrice,
      gas,
      to,
      value,
      data: data || '',
    });
  }
}

export function getPltProvider(): WalletConnectProvider {
  const createPltProvider = () => {
    return new WalletConnectProvider({
      rpc: {
        1718: 'https://palette-rpc.com:22000', //  1718 主链
        // 102: 'https://palette-rpc.com:22000', // 102 测试链
      },
      chainId: 1718, //需要连接的区块链id
      qrcode: true, //二维码是否开启
    });
  };
  if (!window.connectWallet) {
    window.connectWallet = createPltProvider();
  }
  const pltProvider = window.connectWallet;
  pltProvider.on('disconnect', (code: number, reason: string) => {
    console.log(code, reason);
  });
  pltProvider.wc?.on('modal_closed', () => {
    // TODO: 当用户主动关闭二维码弹窗后，再调用 enable() 不会展示弹窗，这里通过新生成实例绕过
    // https://github.com/WalletConnect/walletconnect-monorepo/issues/747
    window.connectWallet = createPltProvider();
  });

  return window.connectWallet;
}

export default (givenProvider?: provider) => {
  return new Wallet(givenProvider);
};
