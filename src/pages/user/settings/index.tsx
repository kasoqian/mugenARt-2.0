// @ts-ignore
import styles from './index.less';
import InputItem from '../components/inputItem/index';
import { dialog } from '@/components/Modal';
import ReplaceEmail from './components/replace-email';
import { useEffect, useState } from 'react';
import {
  associateWithFlow,
  getUserInfo,
  modifyNickName,
  getBindHashPaletteNonce,
  associateWithHashPalette,
  associateWithWalletConnect,
  generateHashPaletteAddr,
  unBindFlowAddr,
  unBindHashPaletteAddr,
  unBindGoogleId,
  unBindTwitterId,
  modifyUserPicture,
} from '@/api/user';
import { useModel } from 'umi';
import { message, Upload } from 'antd';
import WalletConnect from './components/wallect-connect';
import RemoveBinding from './components/remove-binding';

// @ts-ignore
import * as fcl from '@onflow/fcl';

import Wallet, { getPltProvider } from '@/api/Wallet';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import useLocals from '@/hooks/useLocals';
import { urlPrefix } from '@/api/request';

export default function IndexPage() {
  const { userInfo, setUserInfo } = useModel('login', (model) => ({
    userInfo: model.userInfo,
    setUserInfo: model.setUserInfo,
  }));
  const { autoShowBindWalletModal, setAutoShowBindWalletModal } = useModel(
    'useSetting',
  );

  const [buttonChange, setButtonChange] = useState('user.setting.edit');
  const [nickName, setNickName] = useState<string | undefined>('');

  useEffect(() => {
    setNickName(userInfo?.nickName); // 初始化nickName
  }, [userInfo]);

  const { localText } = useLocals();

  const fetchUser = async () => {
    try {
      const res = await getUserInfo();
      if (res && +res.code === 0) {
        setUserInfo(() => res.data);
      } else {
        console.error(res);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      fetchUser();
    }
  }, [userInfo]);

  const changeEmail = () => {
    dialog({
      component: ReplaceEmail,
      props: {
        emailAddr: userInfo!.emailAddr,
        setUserInfo,
      },
    });
  };

  const changeUserPicture = async (pictureUrl: string) => {
    if (pictureUrl) {
      const data = await modifyUserPicture(pictureUrl);
      if (+data.code === 0) {
        console.log(localText['message.changed.success']);
        message.success(localText['message.changed.success']);
      } else {
        message.error(localText['message.changed.error']);
      }
    }
  };

  const changeUserName = async () => {
    if (nickName && userInfo) {
      const data = await modifyNickName(nickName);
      if (+data.code === 0) {
        message.success(localText['message.changed.success']);
        setUserInfo(() => ({ ...userInfo, nickName: nickName } as any));
        if (buttonChange === 'user.setting.save') {
          setButtonChange(() => 'user.setting.edit');
        }
      } else {
        message.error(localText['message.changed.error']);
      }
    }
  };

  const changeUserInput = (val: string) => {
    const value = userInfo?.nickName;
    if (value !== val) {
      setButtonChange(() => 'user.setting.save');
    }
    setNickName(val);
    // setUserInfo(() => ({ ...userInfo, nickName: val } as any));
  };

  const onFlowWalletConnect = async () => {
    const { addr } = await fcl.authenticate();
    const result = await associateWithFlow({ walletAddress: addr });
    if (result && +result.code === 0) {
      message.success(localText['message.bind.success']);
      await fetchUser();
      close();
    }
  };

  const onFlowWalletGenerate = async (
    setIsLoading: Function,
    close: () => void,
  ) => {
    try {
      setIsLoading(() => true);
      const { addr } = await fcl.authenticate();
      const result = await associateWithFlow({ walletAddress: addr });
      if (result && +result.code === 0) {
        message.success(localText['message.bind.success']);
        await fetchUser();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(() => false);
      close();
    }
  };

  const associateBlocto = () => {
    onFlowWalletConnect();
  };

  const onHashpaletteWalletConnect = async (close: () => void) => {
    const wallet = Wallet();
    if (!(await wallet.isMetaMaskInstalled())) {
      message.warn(localText['message.metamaskInstall.error']);
      return;
    }
    const walletAddress = await wallet.connectWallet();
    const nonce = await getBindHashPaletteNonce(walletAddress);
    const { signature, signMessage } = await wallet.sign({ nonce });

    try {
      const result = await associateWithHashPalette({
        walletAddress,
        bindSignature: signature,
        bindMessage: signMessage,
        bindNonce: nonce,
      });
      if (result && +result.code === 0) {
        message.success(localText['message.bind.success']);
        await fetchUser();
        close();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onPltWalletConnect = async (close: () => void) => {
    const provider = getPltProvider();
    const walletAddress = (await provider.enable())?.[0];
    const nonce = await getBindHashPaletteNonce(walletAddress);

    const wallet = Wallet(provider as any);
    message.info(localText['message.bind.signature']);
    const { signature, signMessage } = await wallet.ethSign({
      nonce,
      walletAddress,
    });
    try {
      const result = await associateWithWalletConnect({
        walletAddress,
        bindSignature: signature,
        bindMessage: signMessage,
        bindNonce: nonce,
      });
      if (result && +result.code === 0) {
        message.success(localText['message.bind.success']);
        await fetchUser();
        close();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onHashpaletteWalletGenerate = async (
    setIsLoading: Function,
    close: () => void,
  ) => {
    try {
      setIsLoading(() => true);
      const result = await generateHashPaletteAddr();
      if (result && +result.code === 0) {
        message.success(localText['message.bindWallet.success']);
        await fetchUser();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(() => false);
      close();
    }
  };

  const associateHashpalette = () => {
    dialog({
      component: WalletConnect,
      props: {
        title: localText['user.setting.HashpaletteTitle'],
        onWalletConnect: onHashpaletteWalletConnect,
        onWalletGenerate: onHashpaletteWalletGenerate,
      },
    });
  };

  const associateWalletConnect = () => {
    dialog({
      component: WalletConnect,
      props: {
        title: localText['user.setting.plt'],
        onWalletConnect: onPltWalletConnect,
        onWalletGenerate: onHashpaletteWalletGenerate,
      },
    });
  };

  useEffect(() => {
    if (autoShowBindWalletModal) {
      associateWalletConnect();
      setAutoShowBindWalletModal(false);
    }
  }, [autoShowBindWalletModal]);

  const unBindFlow = async (code: string) => {
    const result = await unBindFlowAddr(code);
    fcl.unauthenticate();
    if (result && +result.code === 0) {
      message.success(localText['message.bind.success']);
      fetchUser();
    }
  };

  const unBindHashPalette = async (code: string) => {
    const result = await unBindHashPaletteAddr(code);
    if (result && +result.code === 0) {
      message.success(localText['message.bind.success']);
      fetchUser();
    }
  };

  const unBindGoogle = async (code: string) => {
    const result = await unBindGoogleId(code);
    if (result && +result.code === 0) {
      message.success(localText['message.bind.success']);
      fetchUser();
    }
  };

  const unBindTwitter = async (code: string) => {
    const result = await unBindTwitterId(code);
    if (result && +result.code === 0) {
      message.success(localText['message.bind.success']);
      fetchUser();
    }
  };

  const removeFlowBind = async () => {
    dialog({
      component: RemoveBinding,
      props: {
        toUnbind: unBindFlow,
        emailAddr: userInfo?.emailAddr,
      },
    });
  };

  const removeHashPaletteBind = async () => {
    dialog({
      component: RemoveBinding,
      props: {
        toUnbind: unBindHashPalette,
        emailAddr: userInfo?.emailAddr,
      },
    });
  };

  const removeTwitterBind = async () => {
    dialog({
      component: RemoveBinding,
      props: {
        toUnbind: unBindTwitter,
        emailAddr: userInfo?.emailAddr,
      },
    });
  };

  const removeGoogleBind = async () => {
    dialog({
      component: RemoveBinding,
      props: {
        toUnbind: unBindGoogle,
        emailAddr: userInfo?.emailAddr,
      },
    });
  };

  const beforeUpload = (file: File) => {
    const isImage =
      file.type === 'image/png' ||
      file.type === 'image/jpg' ||
      file.type === 'image/jpeg';

    if (!isImage) {
      message.error(`${file.name} ${localText['message.uploadImage.error']}`);
    }

    return isImage || Upload.LIST_IGNORE;
  };

  const uploadOnChange = async (info: UploadChangeParam<UploadFile<any>>) => {
    const file = info.fileList[0];
    const { status } = file;
    if (status === 'done') {
      const responseUrl = file.response.data;
      await changeUserPicture(responseUrl);
      await fetchUser();
    }
  };

  const uploadProps = {
    action: `${urlPrefix}/mugen-manager-backend/api/mugen/managerBackend/uploadFileToAwsS3`,
    maxCount: 1,
    beforeUpload,
    onChange: uploadOnChange,
  };

  return (
    <div className={styles.container}>
      <div className={styles.avator}>
        <Upload {...uploadProps}>
          <img
            src={
              userInfo?.userPicture
                ? userInfo.userPicture
                : require('./assets/user_default.png')
            }
            alt="avator"
            className={styles.user_icon}
          />
          <img
            src={require('./assets/pancel.png')}
            className={styles.img_icon}
            alt=""
          />
        </Upload>
      </div>
      <div className={styles.form}>
        <InputItem
          label={localText['user.setting.nickName']}
          buttonLabel={localText[buttonChange]}
          className={styles.nick_name}
          value={nickName}
          onClick={changeUserName}
          onChange={changeUserInput}
        />
        <InputItem
          label={localText['user.setting.email']}
          buttonLabel={localText['user.setting.replace']}
          className={styles.email}
          onClick={changeEmail}
          value={userInfo?.emailAddr}
          disabled={true}
        />
        {userInfo?.flowWalletAddr ? (
          <InputItem
            label="Flow"
            buttonLabel={localText['user.setting.remove']}
            className={styles.flow}
            value={userInfo.flowWalletAddr}
            disabled={true}
            onClick={removeFlowBind}
          />
        ) : (
          <div className={styles.without_hashPalette}>
            <div className={styles.title}>Flow</div>
            <button
              className={styles.hashPalette_button}
              onClick={associateBlocto}
            >
              {localText['user.setting.FlowWallet']}
            </button>
          </div>
        )}
        {userInfo?.evmWalletAddr ? (
          <InputItem
            label="WalletConnect"
            buttonLabel={localText['user.setting.remove']}
            className={styles.hashPalette}
            value={userInfo.evmWalletAddr}
            disabled={true}
            onClick={removeHashPaletteBind}
          />
        ) : (
          <div className={styles.without_hashPalette}>
            <div className={styles.title}>WalletConnect</div>
            <button
              className={styles.hashPalette_button}
              onClick={associateWalletConnect}
            >
              {localText['user.setting.plt']}
            </button>
          </div>
        )}
        {userInfo?.twitterUserId ? (
          <InputItem
            label="Twitter"
            buttonLabel={localText['user.setting.remove']}
            className={styles.twitter}
            onClick={removeTwitterBind}
            value={userInfo.twitterUserId}
            disabled={true}
          />
        ) : (
          <div className={styles.without_twitter}>
            <div className={styles.title}>Twitter</div>
            <button>Twitter</button>
          </div>
        )}
        {userInfo?.googleUserId ? (
          <InputItem
            label="Google"
            buttonLabel={localText['user.setting.remove']}
            className={styles.google}
            value={userInfo.googleUserId}
            onClick={removeGoogleBind}
            disabled={true}
          />
        ) : (
          <div className={styles.without_google}>
            <div className={styles.title}>Google</div>
            <button>Google</button>
          </div>
        )}
      </div>
    </div>
  );
}
