import Web3 from 'web3';

declare global {
  interface Window {
    CUSTOM_WALLET: any;
    ACCESS_TOKEN: string;
    Web3: Web3;
    ethereum: any;
    google: any;
    SockJS: any;
    Stomp: any;
    myMethod: any;
    connectWallet: any;
    Gleam: any;
  }
}
