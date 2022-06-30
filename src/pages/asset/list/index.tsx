import { useEffect, useRef, useState } from 'react';
import BScroll from '@better-scroll/core';
import Pullup from '@better-scroll/pull-up';
import MouseWheel from '@better-scroll/mouse-wheel';
import { Select } from 'antd';
import { queryAssetList, getAllIpIdAndEnName } from '@/api/asset';

// @ts-ignore
import styles from './index.less';
import { history } from '@@/core/history';
import Mask from '../components/mask';

BScroll.use(Pullup);
BScroll.use(MouseWheel);

const { Option } = Select;

interface IAssetList {
  id: string;
  ip_id: string;
  assert_token_id: string;
  assert_name: string;
  assert_description: string;
  ip_name: string;
  series_name: string;
  assert_image_url: string;
  circulation: string;
  mint_status: number;
}

export default function AssetListPage() {
  const [lists, setLists] = useState<IAssetList[] | null>(null);
  const [isPullUpLoad, setIsPullUpLoad] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [ipId, setIpId] = useState<string>('');
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [dropDownList, setDropDownList] = useState<
    { ip_id: string; ip_name: string }[]
  >([]);
  const bscroll = useRef<BScroll>();
  const listRef = useRef<HTMLDivElement>(null);
  const pageNo = useRef<number>(1);
  const [hide, setHide] = useState<boolean | null>(null);

  const initScroll = () => {
    const scroll = new BScroll(listRef.current!, {
      //  鼠标滚轮设置
      mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 300,
      },
      //  上拉加载更多
      pullUpLoad: {
        threshold: 20,
      },
      //  过度动画, 在下载更多的时候滚动条会有个过度动画
      useTransition: true,
    });
    bscroll.current = scroll;
  };

  useEffect(() => {
    getAllIpIdAndEnName().then(
      (result: { ip_id: string; ip_name: string }[]) => {
        if (result && result.length) {
          const ipInfo = result[0];
          setIpId(() => ipInfo.ip_id);
          setDropDownList(result);
          queryAssetList({
            pageNo: pageNo.current,
            ipId: ipInfo.ip_id,
          }).then((result) => {
            if (result.total > 10) {
              initScroll();
            }
            pageNo.current += 1;
            setLists(() => (lists || []).concat(result.data));
            setTotal(() => result.total);
          });
        }
      },
    );
  }, []);

  useEffect(() => {
    if (bscroll.current) {
      bscroll.current.on('pullingUp', async () => {
        if (isPullUpLoad) {
          return;
        }
        if (total <= (lists || []).length) {
          setIsEnd(() => true);
          return;
        }
        try {
          setIsPullUpLoad(() => true);
          const listResult = await queryAssetList({
            ipId: ipId,
            pageNo: pageNo.current,
          });
          const newLists = (lists || []).concat(listResult.data);
          setLists(() => newLists);
          pageNo.current += 1;
        } catch (err) {
          console.log(err);
        } finally {
          bscroll.current?.finishPullUp?.();
          bscroll.current?.refresh?.();
          setIsPullUpLoad(() => false);
        }
      });
    }
    return () => {
      if (bscroll.current) {
        setIsPullUpLoad(() => false);
        bscroll.current.off('pullingUp');
      }
    };
  }, [bscroll.current, total, lists, isPullUpLoad]);

  const handleChange = (value: string) => {
    setIpId(() => value);
    pageNo.current = 1;
    setLists(() => null);
    setHide(() => true);
    setIsEnd(() => false);
  };

  useEffect(() => {
    if (hide === false) {
      queryAssetList({
        pageNo: pageNo.current,
        ipId,
      }).then((result) => {
        if (result.total > 10) {
          initScroll();
        }
        pageNo.current += 1;
        setLists(() => result.data);
        setTotal(() => result.total);
      });
    } else if (hide === true) {
      bscroll.current?.destroy?.();
      bscroll.current = undefined;
      setHide(() => false);
    }
  }, [hide]);

  const jumpToDetail = (assetId: string) => {
    history.push(`/asset/detail/${assetId}`);
  };

  return (
    <div className={styles.assetList}>
      <div className={styles.head}>
        <div className={styles.title} />
        {dropDownList && dropDownList.length ? (
          <Select
            className={styles.assetSeries}
            defaultValue={dropDownList?.[0]?.ip_id}
            onChange={handleChange}
          >
            {dropDownList.map(({ ip_id, ip_name }) => (
              <Option value={ip_id} key={ip_id}>
                {ip_name}
              </Option>
            ))}
          </Select>
        ) : null}
      </div>
      {!hide ? (
        <div className={styles.container} ref={listRef}>
          <div className={styles.list}>
            {lists && lists.length
              ? lists.map((item, index) => {
                  return (
                    <div className={styles.item} key={item.id}>
                      {item.mint_status === 0 && <Mask></Mask>}
                      <div
                        className={styles.bg}
                        style={{
                          backgroundImage: `url(${item.assert_image_url})`,
                        }}
                      />
                      <div className={styles.descUp}>
                        <div className={styles.instr}>
                          <div className={styles.instr_up}>
                            {item.assert_name} #{item.assert_token_id}
                          </div>
                          <div className={styles.instr_down}>
                            {item.ip_name}
                          </div>
                        </div>
                        <div
                          className={styles.btn}
                          onClick={() => jumpToDetail(item.id)}
                        />
                      </div>
                      <div className={styles.descDown}>
                        <div className={styles.upInfo}>
                          <div>Series</div>
                          <div>Copies</div>
                        </div>
                        <div className={styles.downInfo}>
                          <div className={styles.series}>
                            {item.series_name}
                          </div>
                          <div>{item.circulation}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
            {lists && !lists.length ? <div className={styles.empty} /> : null}
            {isPullUpLoad ? (
              <div className={styles.remind}>
                <div className={styles['pullup-txt']}>Loading...</div>
              </div>
            ) : null}
            {isEnd ? (
              <div className={styles.remind}>
                <div className={styles['pullup-txt']}>End</div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
