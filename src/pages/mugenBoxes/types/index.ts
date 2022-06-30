export enum ECardNumber {
  ONE = '1',
  FIVE = '5',
}

export enum EBoxLevel {
  N = 'N',
  R = 'R',
  UR = 'UR',
  SR = 'SR',
  SSR = 'SSR',
}

export enum EPaymentMethod {
  CreditCard = 'Credit card', // 法币支付
  White = 'White', // 白名单支付
  Cryptocurrency = 'Cryptocurrency', // 20支付
}

export enum EBoxIntroTabItems {
  Items = 'Items',
  Information = 'Information',
  Authorizor = 'Authorizor',
}

export enum EBoxType {
  Reward = 'REWARD', // 兑换型盲盒
  Normal = 'NORMAL', // 购买型盲盒
}

export enum EBlindBoxStatus {
  WaitingSell = 0, // 未开始售卖
  Selling = 1, // 售卖中
  StopSell = 2, // 停止售卖
  Abnormal = 3, // 异常
  SoldOut = 4, // 已卖完
}
