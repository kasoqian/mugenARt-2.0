import { useState, useEffect } from 'react';

export default function useSetting() {
  const [autoShowBindWalletModal, setAutoShowBindWalletModal] =
    useState<boolean>(false);

  return {
    autoShowBindWalletModal,
    setAutoShowBindWalletModal,
  };
}
