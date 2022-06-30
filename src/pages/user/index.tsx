// @ts-ignore
import styles from './index.less';
import { IRouteComponentProps, Link } from 'umi';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import useLocals from '@/hooks/useLocals';

const navs = [
  {
    title: 'Personal Center',
    path: '/user/info',
  },
  {
    title: 'Setting',
    path: '/user/settings',
  },
  {
    title: 'Share',
    path: '/user/share',
  },
];

export default function User({ children, location }: IRouteComponentProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const { localText } = useLocals();

  const tabToActive = (index: number) => {
    setCurrentIndex(() => index);
  };

  const navLocals = (navTitle: string) => {
    if (navTitle === 'Personal Center') {
      return localText['user.bar.center'];
    }
    if (navTitle === 'Setting') {
      return localText['user.bar.setting'];
    }
    if (navTitle === 'Share') {
      return localText['user.bar.referrals'];
    }
    return navTitle;
  };

  useEffect(() => {
    const index = navs.findIndex((nav) => nav.path === location.pathname);
    if (index >= 0) {
      setCurrentIndex(() => index);
    } else {
      setCurrentIndex(() => 0);
    }
  }, []);

  return (
    <>
      <div className={styles.nav}>
        {navs.map((nav, index) => (
          <Link to={nav.path} key={index}>
            <div
              className={classNames([
                styles.label,
                {
                  [styles.active]: currentIndex === index,
                  [styles['add-border']]: index === 0,
                },
              ])}
              onClick={() => tabToActive(index)}
            >
              {navLocals(nav.title)}
            </div>
          </Link>
        ))}
      </div>
      <div className={styles.content}>{children}</div>
    </>
  );
}
