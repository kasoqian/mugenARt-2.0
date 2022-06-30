import {
  Friend,
  getReferralLink,
  getUserFriends,
  ShareContent,
} from '@/api/user';
import useLocals from '@/hooks/useLocals';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';

type CopyType = 'url' | 'code';

type cardDataSourceType = {
  amount_open_box_by_friend: number;
  awards: number;
  friend_invited: number;
};

function Share() {
  const [isCopyUrlClick, setIsCopyUrlClick] = useState<boolean>(false);
  const [isCopyCodeClick, setIsCopyCodeClick] = useState<boolean>(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [shareContent, setShareContent] = useState<ShareContent>();

  const [cardDataSource, setCardDataSource] = useState<cardDataSourceType>({});

  const { localText } = useLocals();

  useEffect(() => {
    getFriends();
    getShare();
  }, []);

  const getFriends = async () => {
    const res = await getUserFriends();
    console.log('🛠️  ~ file: index.tsx ~ line 29 ~ getFriends ~ res', res);
    if (res && +res.code === 0) {
      const resData = res.data;
      const {
        amount_open_box_by_friend,
        awards,
        friend_invited,
        invited_user_buy_infos,
      } = resData;
      setFriends(invited_user_buy_infos);
      setCardDataSource({ amount_open_box_by_friend, awards, friend_invited });
    }
  };

  const getShare = async () => {
    const res = await getReferralLink();
    if (res && +res.code === 0) {
      setShareContent(res.data);
    }
  };

  const getCopyContent = (type: CopyType) =>
    type === 'url' ? shareContent?.referralLink : shareContent?.referralCode;

  const changeCopyState = (type: CopyType) => {
    setIsCopyUrlClick(false);
    setIsCopyCodeClick(false);
    type === 'url' ? setIsCopyUrlClick(true) : setIsCopyCodeClick(true);
  };

  const copyShareUrl = async (type: CopyType) => {
    const content = getCopyContent(type);
    if (!!content) {
      await navigator.clipboard.writeText(content);
      message.success(`${localText['user.share.copied']} ` + content);
      changeCopyState(type);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{localText['user.share.title']}</div>
      <div className={styles.content}>{localText['user.share.content']}</div>
      <div className={styles.button_list}>
        <input type="text" defaultValue={shareContent?.referralLink} />
        <div onClick={() => copyShareUrl('url')}>
          {isCopyUrlClick
            ? localText['user.share.copied']
            : localText['user.share.copyLink']}
        </div>
      </div>
      <div className={styles.button_list}>
        <input type="text" defaultValue={shareContent?.referralCode} />
        <div onClick={() => copyShareUrl('code')}>
          {isCopyCodeClick
            ? localText['user.share.copied']
            : localText['user.share.copyCode']}
        </div>
      </div>
      <div className={styles.card_list}>
        <div className={styles.card}>
          <div>{cardDataSource.friend_invited}</div>
          <div>{localText['user.share.invited']}</div>
        </div>
        <div className={styles.card}>
          <div>{cardDataSource.amount_open_box_by_friend}</div>
          <div>{localText['user.share.amount']}</div>
        </div>
        <div className={styles.card}>
          <div>{cardDataSource.awards}</div>
          <div>{localText['user.share.obtained']}</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>{localText['user.share.userId']}</th>
            <th>{localText['user.share.date']}</th>
            <th>{localText['user.share.reward']}</th>
          </tr>
        </thead>
        <tbody>
          {friends?.length > 0
            ? friends?.map((friend) => (
                <tr key={friend.user_id}>
                  <td>{friend.user_id}</td>
                  <td>{friend.create_time}</td>
                  <td>{friend.user_open_box_amount}</td>
                </tr>
              ))
            : null}

          {friends?.length === 0 ? (
            <tr>
              <td>{localText['user.share.noData']}</td>
              <td>{localText['user.share.noData']}</td>
              <td>{localText['user.share.noData']}</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

export default Share;
