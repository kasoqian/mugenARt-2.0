import { getReferralLink } from '@/api/user';
import useLocals from '@/hooks/useLocals';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import styles from './index.less';

export default function () {
  const [shareLink, setShareLink] = useState<string>('');
  const { userInfo, loginIn } = useModel('login', (model) => ({
    userInfo: model.userInfo,
    loginIn: model.loginIn,
  }));
  const { localText } = useLocals();

  useEffect(() => {
    return () => {
      setShareLink('');
    };
  }, []);

  const fetchShare = async () => {
    const res = await getReferralLink();
    if (res && +res.code === 0) {
      setShareLink(res.data.referralLink as string);
    }
  };

  const copyShareUrl = async () => {
    const content = shareLink;
    if (!!content) {
      await navigator.clipboard.writeText(content);
      message.success(`${localText['events.earn.copied']}: ` + content);
      return;
    }
    if (!userInfo) {
      loginIn();
      return;
    }
    message.error(localText['events.earn.error']);
  };

  useEffect(() => {
    fetchShare();
  }, [userInfo]);

  return (
    <div
      className={styles.container_second}
      style={{
        backgroundImage: `url(${localText['events.earn.bg']})`,
      }}
    >
      <div className={styles.button} onClick={copyShareUrl}>
        {localText['events.earn.button']}
      </div>
      <div className={styles.link}>
        {localText['events.earn.content']}
        <a href="https://hashpalette.com"> https://hashpalette.com</a>
      </div>
    </div>
  );
}
